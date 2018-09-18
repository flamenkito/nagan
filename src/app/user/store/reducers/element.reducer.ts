import { ElementActions } from '../actions';
import { LoadableScriptModel, RequestModel } from '@app/user/models';
import { IMap } from '@app/shared/models';

export interface State {
  elements: IMap<LoadableScriptModel>;
  requests: IMap<RequestModel>;
}

export const INITIAL_STATE: State = {
  elements: {},
  requests: {}
};

export function reducer(
  state = INITIAL_STATE,
  action: ElementActions.Types
): State {
  switch (action.type) {
    case ElementActions.INIT: {
      const { elements } = action;
      return { ...state, elements };
    }
    case ElementActions.LOAD_ELEMENT_REQUEST: {
      const { selector } = action;
      const request = { loading: true, loaded: false, error: null };
      const requests = { ...state.requests, [selector]: request };
      return { ...state, requests };
    }
    case ElementActions.LOAD_ELEMENT_SUCCESS: {
      const { selector } = action;
      const success = { loading: false, loaded: true, error: null };
      const requests = { ...state.requests, [selector]: success };
      return { ...state, requests };
    }
    case ElementActions.LOAD_ELEMENT_FAILURE: {
      const { selector, error } = action.payload;
      const failure = { loading: false, loaded: false, error };
      const requests = { ...state.requests, [selector]: failure };
      return { ...state, requests };
    }
    default: {
      return state;
    }
  }
}

export const getElements = (state: State) => state.elements;
export const getRequests = (state: State) => state.requests;
