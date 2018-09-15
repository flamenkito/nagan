import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPouch from '../reducers/pouch.reducer';
import { DocumentModel } from '@app/auth/models';

// pouch
export const selectPouchState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.AuthModuleState) => state.pouch
);

export const selectAllDocs = createSelector(
  selectPouchState,
  fromPouch.getDocs
);

export const selectDocs = (docType: string) =>
  createSelector(selectAllDocs, (docs: DocumentModel[]) =>
    docs.filter(doc => doc.type === docType)
  );

export const selectPouchLoading = createSelector(
  selectPouchState,
  fromPouch.getLoading
);
export const selectPouchLoaded = createSelector(
  selectPouchState,
  fromPouch.getLoaded
);
export const selectPouchError = createSelector(
  selectPouchState,
  fromPouch.getError
);
