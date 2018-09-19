import { DocumentModel } from '@app/shared/models';

import { WidgetModel } from './widget.model';

export interface MapModel extends DocumentModel {
  type: 'map';
  name: string;
  description: string;
  visibleLayerIds: string[];
  widgets: WidgetModel[];
}
