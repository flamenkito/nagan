import { Action } from '@ngrx/store';
import { LoadableScriptModel, RequestModel } from '@app/user/models';
import { IMap } from '@app/shared/models';

export namespace ElementActions {
  export const INIT = '[Element] Init';
  export const LOAD_ELEMENT_REQUEST = '[Element] Load Element Request';
  export const LOADING_ELEMENT = '[Element] Loading Element';
  export const LOAD_ELEMENT_SUCCESS = '[Element] Load Element Success';
  export const LOAD_ELEMENT_FAILURE = '[Element] Load Element Failure';

  export class Init implements Action {
    readonly type = INIT;
    constructor(public readonly elements: IMap<LoadableScriptModel>) {}
  }
  export class LoadElementRequest implements Action {
    readonly type = LOAD_ELEMENT_REQUEST;
    constructor(public readonly selector: string) {}
  }
  export class LoadingElement implements Action {
    readonly type = LOADING_ELEMENT;
    constructor(public readonly selector: string) {}
  }
  export class LoadElementSuccess implements Action {
    readonly type = LOAD_ELEMENT_SUCCESS;
    constructor(public readonly selector: string) {}
  }
  export class LoadElementFailure implements Action {
    readonly type = LOAD_ELEMENT_FAILURE;
    constructor(public readonly payload: { selector: string; error: any }) {}
  }

  export type Types =
    | Init
    | LoadElementRequest
    | LoadingElement
    | LoadElementSuccess
    | LoadElementFailure;
}
