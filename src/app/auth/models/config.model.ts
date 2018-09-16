import { ScriptModel } from '@app/user/models';

export interface ConfigModel {
  issued_tokens: string[];
  elements: {
    [key: string]: ScriptModel;
  };
  subscriptions: {
    services: string[];
  };
}
