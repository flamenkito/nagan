import { DocumentModel } from '@app/shared/models';

export interface LayerModel extends DocumentModel {
  type: 'layer';
  name: string;
  description: string;
  index: number;
}
