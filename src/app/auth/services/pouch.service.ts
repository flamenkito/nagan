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
import { PayloadModel, TokenModel } from '@app/auth/models';
import { POUCHDB } from '@app/shared';

const LOCAL_DB = 'localDb';

@Injectable()
export class PouchService implements OnDestroy {
  private destroy$ = new Subject<void>();

  private localDb: PouchDB.Database;

  private getEvents(token: TokenModel): Observable<PouchActions.Types> {
    return Observable.create((observer: Observer<PouchActions.Types>) => {
      try {
        const { userCtx } = jwt.decode(token.accessToken) as PayloadModel;

        const remoteDb = new PouchDB(POUCHDB(userCtx.db), {
          headers: { Authorization: `Bearer ${token.accessToken}` }
        });

        const wrapper = action => (payload?) => {
          // console.log({ action, payload });
          observer.next(new action(payload));
        };

        const sync = this.localDb
          .sync(remoteDb, { live: true, retry: true })
          .on('change', wrapper(PouchActions.Change))
          .on('paused', wrapper(PouchActions.Paused))
          .on('active', wrapper(PouchActions.Active))
          .on('denied', wrapper(PouchActions.Denied))
          .on('complete', wrapper(PouchActions.Complete))
          .on('error', wrapper(PouchActions.Error))
          .on('denied', wrapper(PouchActions.Error));

        return () => {
          sync.cancel();
        };
      } catch (err) {
        observer.error(err);
        return () => {};
      }
    });
  }

  constructor() {
    this.localDb = new PouchDB(LOCAL_DB);
    this.localDb.createIndex({ index: { fields: ['type'] } });

    // this.localDb.testPlugin();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupRemote(token: TokenModel): Observable<PouchActions.Types> {
    return this.getEvents(token).pipe(
      catchError(err => of(new PouchActions.OperationFailure(err))),
      takeUntil(this.destroy$)
    );
  }

  getDocs(): Observable<PouchActions.Types> {
    return from(this.localDb.find({ selector: { type: 'doc' } })).pipe(
      map((res: PouchDB.Find.FindResponse<{}>) => {
        return new PouchActions.Docs(res.docs);
      }),
      catchError(err => of(new PouchActions.OperationFailure(err)))
      // share()
    );
  }

  updateOne(update: any): Observable<PouchActions.Types> {
    return from(this.localDb.put(update)).pipe(
      map((res: PouchDB.Core.Response) => {
        return new PouchActions.OperationSuccess(res);
      }),
      catchError(err => of(new PouchActions.OperationFailure(err)))
    );
  }
}
