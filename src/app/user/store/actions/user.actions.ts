import { Action } from '@ngrx/store';

export namespace UserActions {
  export const SELECT_MAP = '[User] Select map';
  export class SelectMap implements Action {
    readonly type = SELECT_MAP;
    constructor(public readonly mapId: string) {}
  }
  export const TOGGLE_MAP_LAYER = '[User] Toggle map layer';
  export class ToggleMapLayer implements Action {
    readonly type = TOGGLE_MAP_LAYER;
    constructor(public readonly mapId: string) {}
  }

  export type Types = ToggleMapLayer | SelectMap;
}
