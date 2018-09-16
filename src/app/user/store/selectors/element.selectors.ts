import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromElement from '../reducers/element.reducer';

// element
export const selectElementState = createSelector(
  fromFeature.selectFeatureState,
  (state: fromFeature.UserModuleState) =>
    (state && state.element) || fromElement.INITIAL_STATE
);

export const selectElementEntities = createSelector(
  selectElementState,
  fromElement.getEntities
);

export const selectElementIds = createSelector(
  selectElementState,
  fromElement.getIds
);

export const selectElements = createSelector(
  selectElementEntities,
  selectElementIds,
  (entities, ids) => ids.map(id => entities[id])
);

export const selectElementById = (name: string) =>
  createSelector(selectElementEntities, entities => entities[name]);

export const selectElementLoading = createSelector(selectElements, elements =>
  elements.some(element => element.loading)
);
