import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromCore from '@app/core/store';
import * as fromConfig from './config.reducer';
import * as fromElement from './element.reducer';
import * as fromSidebar from './sidebar.reducer';

export interface UserModuleState {
  config: fromConfig.State;
  element: fromElement.State;
  sidebar: fromSidebar.State;
}

export interface State extends fromCore.State {
  userModule: UserModuleState;
}

export const reducers: ActionReducerMap<UserModuleState> = {
  config: fromConfig.reducer,
  element: fromElement.reducer,
  sidebar: fromSidebar.reducer
};

// feature state
export const selectFeatureState = createFeatureSelector<UserModuleState>(
  'userModule'
);
