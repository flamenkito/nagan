import { IMap, DocumentModel } from '@app/shared/models';

import { SubscriptionsModel } from './subscriptions.model';

export interface WidgetModel extends DocumentModel {
  type: 'widget';
  layerId: string;
  elementId: string;
  style: IMap;
  subscriptions: SubscriptionsModel;
}
