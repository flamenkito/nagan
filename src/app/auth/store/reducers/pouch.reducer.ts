import { PouchActions } from '../actions';

export interface State {
  docs: any[];
  loading: boolean;
  loaded: boolean;
  error: any | null;
}

export const INITIAL_STATE: State = {
  docs: [],
  loaded: false,
  loading: false,
  error: null
};

export function reducer(
  state = INITIAL_STATE,
  action: PouchActions.Types
): State {
  switch (action.type) {
    case PouchActions.SETUP:
    case PouchActions.ACTIVE: {
      return { ...state, loaded: false, loading: true };
    }
    case PouchActions.PAUSED:
    case PouchActions.SETUP_SUCCESS:
    case PouchActions.OPERATION_SUCCESS: {
      return { ...state, loaded: true, loading: false };
    }
    case PouchActions.OPERATION_FAILURE: {
      return { ...state, loaded: false, loading: false, error: action.error };
    }
    case PouchActions.DOCS: {
      return { ...state, docs: [...action.docs] };
    }
    default: {
      return state;
    }
  }
}

export const getDocs = (state: State) => state.docs;
export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
