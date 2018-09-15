import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPouch from '../reducers/pouch.reducer';
import { DocumentModel } from '@app/auth/models';

// pouch
export const selectPouchState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.AuthModuleState) => state.pouch
);

export const selectEntities = createSelector(
  selectPouchState,
  fromPouch.getEntities
);

export const selectIds = createSelector(selectPouchState, fromPouch.getIds);

export const selectAllDocs = createSelector(
  selectEntities,
  selectIds,
  (entities: { [key: string]: DocumentModel }, ids: string[]) => {
    return ids.map(id => entities[id]);
  }
);

export const selectDocs = (docType: string) =>
  createSelector(selectAllDocs, (docs: DocumentModel[]) => {
    return docs.filter(doc => doc.type === docType);
  });

export const selectFirst = (docId: string) =>
  createSelector(selectAllDocs, (docs: DocumentModel[]) => {
    return docs.find(doc => doc._id === docId) || {};
  });

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
