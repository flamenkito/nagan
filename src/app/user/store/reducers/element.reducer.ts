import { ElementActions } from '../actions';
import { ElementModel } from '@app/user/models';

export interface State {
  entities: {
    [key: string]: ElementModel;
  };
  ids: string[];
}

export const INITIAL_STATE: State = {
  entities: {},
  ids: []
};

export function reducer(
  state = INITIAL_STATE,
  action: ElementActions.Types
): State {
  switch (action.type) {
    case ElementActions.LOAD_ELEMENT: {
      const { name, description, element, url } = action.script;
      const request = { loading: true, loaded: false, error: null };
      const entities = {
        ...state.entities,
        [element]: { name, description, element, url, ...request }
      };
      return { ...state, entities };
    }
    case ElementActions.LOAD_ELEMENT_SUCCESS: {
      const success = { loading: false, loaded: true };
      const element = { ...state.entities[action.element], ...success };
      const entities = { ...state.entities, [action.element]: element };
      return { ...state, entities };
    }
    case ElementActions.LOAD_ELEMENT_FAILURE: {
      const { element, error } = action.payload;
      const failure = { loading: false, loaded: false, error };
      const entities = {
        ...state.entities,
        [element]: { ...state.entities[element], ...failure }
      };
      return { ...state, entities };
    }
    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
