import { IMap, DocumentModel } from '@app/shared/models';

import { SubscriptionsModel } from './subscriptions.model';

export interface WidgetModel extends DocumentModel {
  type: 'widget';
  layerId: string;
  elementId: string;
  selector: string;
  style: IMap;
  center?: {
    lat: number;
    lng: number;
  };
  subscriptions: SubscriptionsModel;
}

export namespace WidgetModel {
  export function onSubscriptions(
    widget: WidgetModel,
    callback: (type: string, ids: string[]) => void
  ) {
    const { nagvis } = widget.subscriptions;
    if (nagvis) {
      SubscriptionsModel.NAGVIS.forEach(type => {
        const ids = nagvis[type];
        if (Array.isArray(ids)) {
          callback(type, ids);
        }
      });
    }
  }

  export function getSubscriptionsFrom(
    widget: WidgetModel,
    sources: DocumentModel[],
  ): string[] {
    const subscriptions = [];
    onSubscriptions(widget, (type, ids) => {
      subscriptions.push(
        ids.map(id => {
          return sources.find(doc => doc.type === type && doc._id === id);
        })
      );
    });
    return subscriptions;
  }
}
