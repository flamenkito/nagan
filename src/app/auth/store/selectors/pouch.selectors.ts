import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPouch from '../reducers/pouch.reducer';

// pouch
export const selectPouchState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.AuthModuleState) => state.pouch
);

export const selectDocs = createSelector(selectPouchState, fromPouch.getDocs);

export const selectPouchLoading = createSelector(
  selectPouchState,
  fromPouch.getLoading
);
export const selectPouchLoaded = createSelector(
  selectPouchState,
  fromPouch.getLoaded
);
export const selectPouchError = createSelector(selectPouchState, fromPouch.getError);
