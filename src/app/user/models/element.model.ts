import { DocumentModel } from '@app/shared/models';

export interface ElementModel extends DocumentModel {
  type: 'element';
  name: string;
  description: string;
  selector: string;
}