import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromAuth from '../reducers/auth.reducer';

// auth
export const selectAuthModuleState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.AuthModuleState) =>
    (state && state.auth) || fromAuth.INITIAL_STATE
);

export const selectToken = createSelector(
  selectAuthModuleState,
  fromAuth.getToken
);
export const selectPayload = createSelector(
  selectAuthModuleState,
  fromAuth.getPayload
);

export const selectAuthLoading = createSelector(
  selectAuthModuleState,
  fromAuth.getLoading
);
export const selectAuthLoaded = createSelector(
  selectAuthModuleState,
  fromAuth.getLoaded
);
export const selectAuthError = createSelector(
  selectAuthModuleState,
  fromAuth.getError
);
