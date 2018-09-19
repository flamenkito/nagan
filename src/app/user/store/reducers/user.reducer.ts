import { UserActions } from '../actions';

export interface State {
  mapId: string | null;
  layerId: string | null;
}

export const INITIAL_STATE: State = {
  mapId: null,
  layerId: null
};

export function reducer(
  state = INITIAL_STATE,
  action: UserActions.Types
): State {
  switch (action.type) {
    case UserActions.SELECT_MAP: {
      return { ...state, mapId: action.mapId };
    }
    default: {
      return state;
    }
  }
}

export const getMapId = (state: State) => state.mapId;
