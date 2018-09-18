import { createSelector } from '@ngrx/store';

export * from './config.selectors';
export * from './element.selectors';
export * from './sidebar.selectors';

import * as fromConfig from './config.selectors';
import * as fromElement from './element.selectors';

export const selectUserModuleLoading = createSelector(
  fromConfig.selectConfigLoading,
  fromElement.selectLoading,
  (config, element) => config || element || false
);
