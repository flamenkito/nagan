import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCore from '@app/core/store';
import * as fromElement from './element.reducer';

export interface UserModuleState {
  element: fromElement.State;
}

export interface State extends fromCore.State {
  userModule: UserModuleState;
}

export const reducers: ActionReducerMap<UserModuleState> = {
  element: fromElement.reducer
};

// feature state
export const selectFeatureState = createFeatureSelector<UserModuleState>(
  'userModule'
);
