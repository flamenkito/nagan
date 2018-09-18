import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromPouch from '../reducers/pouch.reducer';
import { DocumentModel } from '@app/shared/models';
import { MapModel } from '@app/user/models';

// pouch
export const selectPouchState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.AuthModuleState) =>
    (state && state.pouch) || fromPouch.INITIAL_STATE
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

export const selectByType = (docType: string) =>
  createSelector(selectAllDocs, (docs: DocumentModel[]) => {
    return docs.filter(doc => doc.type === docType);
  });

export const selectByTypes = (docTypes: string[]) =>
  createSelector(selectAllDocs, (docs: DocumentModel[]) => {
    return docs.filter(doc => docTypes.includes(doc.type));
  });

export const selectFirst = (docType: string) =>
  createSelector(selectAllDocs, (docs: DocumentModel[]) => {
    return docs.find(doc => doc.type === docType);
  });

export const selectById = (docId: string) =>
  createSelector(
    selectAllDocs,
    (docs: DocumentModel[]): DocumentModel => {
      return docs.find(doc => doc._id === docId);
    }
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

export const selectedMapId = createSelector(
  selectPouchState,
  fromPouch.getMapId
);

export const selectedMap = createSelector(
  selectAllDocs,
  selectedMapId,
  (docs: DocumentModel[], mapId: string): MapModel => {
    if (mapId === null) {
      return docs.find(doc => doc.type === 'map') as MapModel;
    } else {
      return docs.find(doc => doc._id === mapId) as MapModel;
    }
  }
);
