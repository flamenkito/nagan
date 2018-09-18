import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromConfig from '../reducers/config.reducer';

// config
export const selectConfigState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.UserModuleState) =>
    (state && state.config) || fromConfig.INITIAL_STATE
);

export const selectConfig = createSelector(
  selectConfigState,
  fromConfig.getConfig
);

export const selectConfigLoading = createSelector(
  selectConfigState,
  fromConfig.getLoading
);
export const selectConfigLoaded = createSelector(
  selectConfigState,
  fromConfig.getLoaded
);
export const selectConfigError = createSelector(
  selectConfigState,
  fromConfig.getError
);
