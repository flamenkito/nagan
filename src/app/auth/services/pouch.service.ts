import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Observer, of, from } from 'rxjs';

import * as jwt from 'jsonwebtoken';

import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

import JWT from './pouchdb-jwt/index';
PouchDB.plugin(JWT);

import { takeUntil, catchError, map } from 'rxjs/operators';
import { PouchActions } from '@app/auth/store/actions';
import { PayloadModel, TokenModel, DocumentModel } from '@app/auth/models';
import { POUCHDB } from '@app/shared';
import { Logger } from '@app/shared/logger';

const Log = new Logger('PouchService');

@Injectable()
export class PouchService implements OnDestroy {
  private destroy$ = new Subject<void>();

  private localDb: PouchDB.Database;

  private getEvents(token: TokenModel): Observable<PouchActions.Types> {
    return Observable.create((observer: Observer<PouchActions.Types>) => {
      const wrapper = action => (payload?) =>
        observer.next(new action(payload));

      const errorWrapper = (payload?) => {
        if (payload && payload.error === 'unauthorized') {
          observer.next(new PouchActions.Unathorized(payload.reason));
        } else {
          observer.next(new PouchActions.Error(payload));
        }
      };

      try {
        const { userCtx } = jwt.decode(token.accessToken) as PayloadModel;

        // local
        this.localDb = new PouchDB(userCtx.db, {
          revs_limit: 1,
          auto_compaction: true
        });
        this.localDb.createIndex({ index: { fields: ['type'] } });

        this.localDb.on('error', errorWrapper);

        // remote
        const remoteDb = new PouchDB(POUCHDB(userCtx.db), {
          headers: { Authorization: `Bearer ${token.accessToken}` },
          revs_limit: 1,
          auto_compaction: true
        });

        remoteDb.on('error', errorWrapper);

        // sync
        const sync = this.localDb
          .sync(remoteDb, { live: true, retry: true })
          .on('change', wrapper(PouchActions.Change))
          .on('paused', wrapper(PouchActions.Paused))
          .on('active', wrapper(PouchActions.Active))
          .on('denied', wrapper(PouchActions.Denied))
          .on('complete', wrapper(PouchActions.Complete))
          .on('error', errorWrapper);

        Log.success('setup success');

        return () => {
          Log.warning('sync cancel');
          sync.cancel();
        };
      } catch (err) {
        observer.error(err);
        return () => {};
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancelSync() {
    this.destroy$.next();
  }

  setupRemote(token: TokenModel): Observable<PouchActions.Types> {
    return this.getEvents(token).pipe(
      catchError(err => of(new PouchActions.OperationFailure(err))),
      takeUntil(this.destroy$)
    );
  }

  getDocs(): Observable<DocumentModel[]> {
    return from(
      this.localDb.allDocs({
        include_docs: true,
        attachments: true,
        startkey: '_design\uffff'
      })
    ).pipe(
      map((res: PouchDB.Core.AllDocsResponse<{}>) => {
        return res.rows.map(row => row.doc);
      })
    );
    /*
    return from(this.localDb.find({ selector: { type: 'doc' } })).pipe(
      map((res: PouchDB.Find.FindResponse<{}>) => {
        return new PouchActions.Docs(res.docs);
      }),
      catchError(err => of(new PouchActions.OperationFailure(err)))
      // share()
    );
    */
  }

  updateOne(update: any): Observable<PouchDB.Core.Response> {
    return from(this.localDb.put(update));
  }
}
