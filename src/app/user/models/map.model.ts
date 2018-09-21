import { DocumentModel, IMap } from '@app/shared/models';

import { WidgetModel } from './widget.model';

export interface MapModel extends DocumentModel {
  type: 'map';
  name: string;
  description: string;
  background?: {
    name: string;
    description: string;
    leaflet?: {
      zoom: number;
      center: {
        lat: number;
        lon: number;
      };
    };
    image?: {
      url: string;
      style: IMap;
    };
  };
  geo?: {
    zoom: number;
    center: { lat: number; lon: number };
  };
  visibleLayerIds: string[];
  widgets: WidgetModel[];
}
