import { DocumentModel, IMap } from '@app/shared/models';

import { WidgetModel } from './widget.model';

interface Pos {
  lat: number;
  lng: number;
}

export interface MapModel extends DocumentModel {
  type: 'map';
  name: string;
  description: string;
  background?: {
    name: string;
    description: string;
    leaflet?: {
      dpi: number;
      options: IMap;
      objects: { type: string; center: Pos; options: IMap }[];
    };
    viewer?: {
      url: string;
      width: number;
      height: number;
      dpi: number;
      options: IMap;
      objects: {
        type: string;
        center: Pos;
        options: IMap;
      }[];
    };
    image?: {
      url: string;
      style: IMap;
    };
  };
  visibleLayerIds: string[];
  widgets: WidgetModel[];
}
