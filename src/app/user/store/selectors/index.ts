import { createSelector } from '@ngrx/store';

export * from './element.selectors';

import * as fromElement from './element.selectors';

export const selectUserModuleLoading = createSelector(
  fromElement.selectElementLoading,
  element => element || false
);
