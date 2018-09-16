export * from './footer.selectors';

import * as fromAuth from '@app/auth/store/selectors';
import * as fromUser from '@app/user/store/selectors';
import { createSelector } from '@ngrx/store';

export const selectLoading = createSelector(
  fromAuth.selectAuthLoading,
  fromUser.selectUserModuleLoading,
  (auth, user) => auth || user || false
);
