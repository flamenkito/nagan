import { DocumentModel, IMap } from '@app/shared/models';

import { WidgetModel } from './widget.model';

export interface MapModel extends DocumentModel {
  type: 'map';
  name: string;
  description: string;
  background: {
    name: string;
    description: string;
    url: string;
    style: IMap;
  };
  visibleLayerIds: string[];
  widgets: WidgetModel[];
}
