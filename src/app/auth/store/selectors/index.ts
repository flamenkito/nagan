export * from './auth.selectors';
export * from './pouch.selectors';

import * as fromAuth from './auth.selectors';
import * as fromPouch from './pouch.selectors';
import { createSelector } from '@ngrx/store';

export const selectAuthModuleLoading = createSelector(
  fromAuth.selectAuthLoading,
  fromPouch.selectPouchLoading,
  (auth, pouch) => auth || pouch || false
);

export const selectAuthModuleLoaded = createSelector(
  fromAuth.selectAuthLoaded,
  fromPouch.selectPouchLoaded,
  (auth, pouch) => auth || pouch || false
);

export const selectAuthModuleError = createSelector(
  fromAuth.selectAuthError,
  fromPouch.selectPouchError,
  (auth, pouch) => auth || pouch || null
);
