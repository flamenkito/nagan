import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';

import { FooterActions } from '@app/core/store/actions';
import { PouchService } from '@app/auth/services';
import { PouchActions } from '@app/auth/store/actions';

import { getError } from '@app/shared/get-error';
import { of } from 'rxjs';

@Injectable()
export class PouchEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly pouchService: PouchService
  ) {}

  @Effect()
  setup$ = this.actions$.pipe(
    ofType<PouchActions.Setup>(PouchActions.SETUP),
    map(action => action.token),
    switchMap(token => {
      return this.pouchService.setupRemote(token);
    }),
    catchError(err => of(new PouchActions.OperationFailure(err)))
  );

  @Effect()
  cancelSync$ = this.actions$.pipe(
    ofType<PouchActions.CancelSync>(PouchActions.CANCEL_SYNC),
    switchMap(() => {
      const response = this.pouchService.cancelSync();
      return of(new PouchActions.OperationSuccess(response));
    }),
    catchError(err => of(new PouchActions.OperationFailure(err)))
  );

  @Effect()
  docs$ = this.actions$.pipe(
    ofType<PouchActions.Paused>(PouchActions.PAUSED),
    switchMap(() => {
      return this.pouchService.getDocs();
    }),
    catchError(err => of(new PouchActions.OperationFailure(err)))
  );

  @Effect()
  updateOne$ = this.actions$.pipe(
    ofType<PouchActions.UpdateOne>(PouchActions.UPDATE_ONE),
    switchMap(({ update }) => {
      return this.pouchService.updateOne(update);
    }),
    catchError(err => of(new PouchActions.OperationFailure(err)))
  );

  @Effect()
  operationFailure$ = this.actions$.pipe(
    ofType<PouchActions.OperationFailure>(PouchActions.OPERATION_FAILURE),
    map(action => {
      const message = getError(action.error);
      return new FooterActions.Popup(message);
    })
  );
}
