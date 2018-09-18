import { DocumentModel, IMap } from '@app/shared/models';

import { LoadableScriptModel } from './loadable-script.model';
import { SubscriptionsModel } from './subscriptions.model';

export interface ConfigModel extends DocumentModel {
  type: 'config';
  issued_tokens: string[];
  elements: IMap<LoadableScriptModel>;
  subscriptions: SubscriptionsModel;
}
