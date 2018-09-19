import { PouchActions } from '../actions';
import { DocumentModel } from '@app/shared/models';

export interface State {
  mapId: string | null;
  layerId: string | null;
  entities: { [key: string]: DocumentModel };
  ids: string[];
  loading: boolean;
  loaded: boolean;
  error: any | null;
}

export const INITIAL_STATE: State = {
  mapId: null,
  layerId: null,
  entities: {},
  ids: [],
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
    case PouchActions.ALL_DOCS: {
      const ids = action.docs.map(doc => doc._id);
      const entities = action.docs.reduce((acc, cur) => {
        return {
          ...acc,
          [cur._id]: cur
        };
      }, {});
      return { ...state, entities, ids };
    }
    default: {
      return state;
    }
  }
}

export const getMapId = (state: State) => state.mapId;

export const getEntities = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getError = (state: State) => state.error;
