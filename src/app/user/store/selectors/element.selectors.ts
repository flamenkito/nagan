import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromElement from '../reducers/element.reducer';

// element
export const selectElementState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.UserModuleState) =>
    (state && state.element) || fromElement.INITIAL_STATE
);

export const selectElementMap = createSelector(
  selectElementState,
  fromElement.getElements
);

export const selectRequestMap = createSelector(
  selectElementState,
  fromElement.getRequests
);

export const selectLoading = createSelector(selectRequestMap, requests => {
  return Object.keys(requests).some(selector => requests[selector].loading);
});
