import { createSelector } from '@ngrx/store';

export * from './config.selectors';
export * from './element.selectors';
export * from './sidebar.selectors';
export * from './user.selectors';

import * as fromConfig from './config.selectors';
import * as fromElement from './element.selectors';
import * as fromUser from './user.selectors';

import { selectAllDocs } from '@app/auth/store/selectors';
import { MapModel, LayerModel } from '@app/user/models';
import { DocumentModel } from '@app/shared/models';

export const selectUserModuleLoading = createSelector(
  fromConfig.selectConfigLoading,
  fromElement.selectLoading,
  (config, element) => config || element || false
);

// combine reducers
export const selectedMap = createSelector(
  selectAllDocs,
  fromUser.selectedMapId,
  (docs: DocumentModel[], mapId: string): MapModel => {
    return docs.find(doc => doc._id === mapId) as MapModel;
  }
);

export const selectLayers = createSelector(
  selectAllDocs,
  (docs: DocumentModel[]): LayerModel[] => {
    return docs.filter(doc => doc.type === 'layer') as LayerModel[];
  }
);

export const selectMaps = createSelector(
  selectAllDocs,
  (docs: DocumentModel[]): MapModel[] => {
    return docs.filter(doc => doc.type === 'map') as MapModel[];
  }
);

export const selectedMapLayers = createSelector(
  selectedMap,
  selectLayers,
  (map, layers): LayerModel[] => {
    if (!map || !map.visibleLayerIds) {
      return [];
    }
    return layers.filter(layer => map.visibleLayerIds.includes(layer._id));
  }
);
