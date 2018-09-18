import { Action } from '@ngrx/store';

import { ConfigModel } from '@app/user/models';

export namespace ConfigActions {
  export const LOAD_CONFIG = '[Config] Load Config';
  export const LOAD_CONFIG_SUCCESS = '[Config] Load Config Success';
  export const LOAD_CONFIG_FAILURE = '[Config] Load Config Failure';

  export class LoadConfig implements Action {
    readonly type = LOAD_CONFIG;
  }
  export class LoadConfigSuccess implements Action {
    readonly type = LOAD_CONFIG_SUCCESS;
    constructor(public readonly config: ConfigModel) {}
  }
  export class LoadConfigFailure implements Action {
    readonly type = LOAD_CONFIG_FAILURE;
    constructor(public readonly error: any) {}
  }

  export type Types = LoadConfig | LoadConfigSuccess | LoadConfigFailure;
}
