import { Action } from '@ngrx/store';
import { TokenModel } from '@app/auth/models';

export namespace PouchActions {
  export const UNAUTHORIZED = '[Pouch] Unathorized';

  export const SETUP = '[Pouch] Setup';
  export const SETUP_SUCCESS = '[Pouch] Setup Success';
  export const CANCEL_SYNC = '[Pouch] Cancel Sync';
  export const OPERATION_SUCCESS = '[Pouch] Operation Success';
  export const OPERATION_FAILURE = '[Pouch] Operation Failure';

  export const CHANGE = '[Pouch] Change';
  export const PAUSED = '[Pouch] Paused';
  export const ACTIVE = '[Pouch] Active';
  export const DENIED = '[Pouch] Denied';
  export const COMPLETE = '[Pouch] Complete';
  export const ERROR = '[Pouch] Error';

  export const DOCS = '[Pouch] Docs';
  export const UPDATE_ONE = '[Pouch] Update One';

  export class Unathorized implements Action {
    readonly type = UNAUTHORIZED;
    constructor(public readonly reason?: string) {}
  }

  export class Setup implements Action {
    readonly type = SETUP;
    constructor(public readonly token: TokenModel) {}
  }
  export class SetupSuccess implements Action {
    readonly type = SETUP_SUCCESS;
    constructor(public readonly response: any) {}
  }
  export class CancelSync implements Action {
    readonly type = CANCEL_SYNC;
  }
  export class OperationSuccess implements Action {
    readonly type = OPERATION_SUCCESS;
    constructor(public response: any) {}
  }
  export class OperationFailure implements Action {
    readonly type = OPERATION_FAILURE;
    constructor(public readonly error: any) {}
  }

  export class Change implements Action {
    readonly type = CHANGE;
    constructor(
      public readonly syncResult: PouchDB.Replication.SyncResult<{}>
    ) {}
  }
  export class Paused implements Action {
    readonly type = PAUSED;
    constructor(public readonly payload: any) {}
  }
  export class Active implements Action {
    readonly type = ACTIVE;
  }
  export class Denied implements Action {
    readonly type = DENIED;
    constructor(public readonly payload: any) {}
  }
  export class Complete implements Action {
    readonly type = COMPLETE;
    constructor(
      public readonly syncResult: PouchDB.Replication.SyncResultComplete<{}>
    ) {}
  }
  export class Error implements Action {
    readonly type = ERROR;
    constructor(public readonly error: any) {}
  }

  export class Docs implements Action {
    readonly type = DOCS;
    constructor(public readonly docs: any[]) {}
  }
  export class UpdateOne implements Action {
    readonly type = UPDATE_ONE;
    constructor(public readonly update: any) {}
  }

  export type Types =
    | Unathorized
    | Setup
    | SetupSuccess
    | CancelSync
    | OperationSuccess
    | OperationFailure
    | Change
    | Paused
    | Active
    | Denied
    | Complete
    | Error
    | Docs
    | UpdateOne;
}
