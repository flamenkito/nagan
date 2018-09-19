import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromUser from '../reducers/user.reducer';

// user
export const selectUserState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.UserModuleState) =>
    (state && state.user) || fromUser.INITIAL_STATE
);

export const selectedMapId = createSelector(
  selectUserState,
  fromUser.getMapId
);
