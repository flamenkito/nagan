import { Action } from '@ngrx/store';

export namespace SidebarActions {
  export const SIDEBAR_OPEN = '[Sidebar] Sidebar Open';
  export const SIDEBAR_CLOSE = '[Sidebar] Sidebar Close';

  export class SidebarOpen implements Action {
    readonly type = SIDEBAR_OPEN;
  }
  export class SidebarClose implements Action {
    readonly type = SIDEBAR_CLOSE;
  }
  export type Types = SidebarOpen | SidebarClose;
}
