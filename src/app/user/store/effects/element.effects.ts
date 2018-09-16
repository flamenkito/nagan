import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { of, from } from 'rxjs';
import { switchMap, map, catchError, tap, mergeMap } from 'rxjs/operators';

import { ElementActions } from '../actions';
import { FooterActions } from '@app/core/store';
import { ElementService } from '@app/user/services';

import { getError } from '@app/shared/get-error';

@Injectable()
export class ElementEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly elementService: ElementService
  ) {}

  @Effect()
  loadElement$ = this.actions$.pipe(
    ofType<ElementActions.LoadElement>(ElementActions.LOAD_ELEMENT),
    switchMap(action => {
      const { element } = action.script;
      return from(this.elementService.load(action.script)).pipe(
        map(() => new ElementActions.LoadElementSuccess(element)),
        catchError(error => {
          return of(new ElementActions.LoadElementFailure({ element, error }));
        })
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
