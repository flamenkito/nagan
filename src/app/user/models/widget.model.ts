import { IMap, DocumentModel } from '@app/shared/models';

import { SubscriptionsModel } from './subscriptions.model';
import { Logger } from '@app/shared/logger';

const Log = Logger('WidgetModel');

type Mapper = (subscriptions: DocumentModel[]) => any;

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
  mapper: string;
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
    sources: DocumentModel[]
  ): any {
    const subscriptions = [];
    onSubscriptions(widget, (type, ids) => {
      subscriptions.push(
        ...ids.map(id => {
          return sources.find(doc => doc.type === type && doc._id === id);
        })
      );
    });

    // mapper
    try {
      if (widget.mapper) {
        /* tslint:disable:no-eval */
        const mapper = eval(widget.mapper) as Mapper;
        return mapper(subscriptions);
        /* tslint:enable:no-eval */
      }
    } catch (err) {
      Log.danger('getSubscriptionsFrom', err);
    }

    // defaults
    return subscriptions;
  }
}
