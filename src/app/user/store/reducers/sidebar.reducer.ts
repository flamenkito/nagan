import { SidebarActions } from '../actions';

export interface State {
  open: boolean;
}

export const INITIAL_STATE: State = {
  open: true
};

export function reducer(
  state = INITIAL_STATE,
  action: SidebarActions.Types
): State {
  switch (action.type) {
    case SidebarActions.SIDEBAR_OPEN: {
      return { ...state, open: true };
    }
    case SidebarActions.SIDEBAR_CLOSE: {
      return { ...state, open: false };
    }
    default: {
      return state;
    }
  }
}

export const getOpen = (state: State) => state.open;
