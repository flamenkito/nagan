import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { ElementActions } from '../actions';
import { FooterActions } from '@app/core/store';
import { ElementService } from '@app/user/services';

import { getError } from '@app/shared/get-error';

import { Store, select } from '@ngrx/store';
import { selectElementMap } from '@app/user/store/selectors';

@Injectable()
export class ElementEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly elementService: ElementService,
    private readonly store: Store<any>
  ) {}

  @Effect()
  loadElement$ = this.actions$.pipe(
    ofType<ElementActions.LoadElementRequest>(
      ElementActions.LOAD_ELEMENT_REQUEST
    ),
    withLatestFrom(this.store.pipe(select(selectElementMap))),
    switchMap(([action, elements]) => {
      if (this.elementService.isLoaded(action.selector)) {
        return of(new ElementActions.LoadElementSuccess(action.selector));
      }
      const script = elements[action.selector];
      return this.elementService.tryLoad(script).pipe(
        map(() => new ElementActions.LoadElementSuccess(action.selector)),
        catchError(err => of(new ElementActions.LoadElementFailure(err)))
      );
    })
  );

  @Effect()
  loadElementFailure$ = this.actions$.pipe(
    ofType<ElementActions.LoadElementFailure>(
      ElementActions.LOAD_ELEMENT_FAILURE
    ),
    map(({ payload }) => {
      const { error } = payload;
      const message = getError(error);
      return new FooterActions.Popup(message);
    })
  );
}
