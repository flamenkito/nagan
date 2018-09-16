import { Action } from '@ngrx/store';
import { ScriptModel } from '@app/user/models';

export namespace ElementActions {
  export const LOAD_ELEMENT = '[Element] Load Element';
  export const LOAD_ELEMENT_SUCCESS = '[Element] Load Element Success';
  export const LOAD_ELEMENT_FAILURE = '[Element] Load Element Failure';

  export class LoadElement implements Action {
    readonly type = LOAD_ELEMENT;
    constructor(public readonly script: ScriptModel) {}
  }
  export class LoadElementSuccess implements Action {
    readonly type = LOAD_ELEMENT_SUCCESS;
    constructor(public readonly element: string) {}
  }
  export class LoadElementFailure implements Action {
    readonly type = LOAD_ELEMENT_FAILURE;
    constructor(public readonly payload: { element: string; error: any }) {}
  }

  export type Types = LoadElement | LoadElementSuccess | LoadElementFailure;
}
