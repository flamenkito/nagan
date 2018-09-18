import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromSidebar from '../reducers/sidebar.reducer';

// sidebar
export const selectSidebarState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.UserModuleState) =>
    (state && state.sidebar) || fromSidebar.INITIAL_STATE
);

export const selectSidebarOpen = createSelector(
  selectSidebarState,
  fromSidebar.getOpen
);
