import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';

import { switchMap, map } from 'rxjs/operators';

import { ConfigActions, ElementActions } from '../actions';

import * as fromAuth from '@app/auth/store';
import {
  ConfigModel,
  LoadedScriptModel,
  LoadableScriptModel
} from '@app/user/models';
import { IMap } from '@app/shared/models';

@Injectable()
export class ConfigEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<fromAuth.State>
  ) {}

  @Effect()
  loadConfig$ = this.actions$.pipe(
    ofType<ConfigActions.LoadConfig>(ConfigActions.LOAD_CONFIG),
    switchMap(() => {
      return this.store.pipe(select(fromAuth.selectFirst('config')));
    }),
    // TODO: add validation (schema)
    map(
      config => new ConfigActions.LoadConfigSuccess(<ConfigModel>(<any>config))
    )
  );
}
