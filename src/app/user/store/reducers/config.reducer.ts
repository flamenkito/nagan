import { ConfigActions } from '../actions';

import { ConfigModel } from '@app/user/models';

export interface State {
  config: ConfigModel | null;
  loaded: boolean;
  loading: boolean;
  error: any | null;
}

export const INITIAL_STATE: State = {
  config: null,
  loaded: false,
  loading: false,
  error: null
};

export function reducer(
  state = INITIAL_STATE,
  action: ConfigActions.Types
): State {
  switch (action.type) {
    case ConfigActions.LOAD_CONFIG: {
      const request = { loading: true, loaded: false, error: null };
      return { ...state, ...request };
    }
    case ConfigActions.LOAD_CONFIG_SUCCESS: {
      const success = { loading: false, loaded: true, config: action.config };
      return { ...state, ...success };
    }
    case ConfigActions.LOAD_CONFIG_FAILURE: {
      const failure = { loading: false, loaded: false, error: action.error };
      return { ...state, ...failure };
    }
    default: {
      return state;
    }
  }
}

export const getConfig = (state: State) => state.config;
export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
