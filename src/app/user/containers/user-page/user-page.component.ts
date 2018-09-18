import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromAuth from '@app/auth/store';
import * as fromUser from '@app/user/store';
import { Store, select } from '@ngrx/store';
import { AuthActions, PouchActions } from '@app/auth/store';
import { RouterActions } from '@app/core/store';
import { DocumentModel } from '@app/shared/models';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPageComponent {
  sidebarOpen$: Observable<boolean>;
  mapArray$: Observable<DocumentModel[]>;

  constructor(private readonly store: Store<fromUser.State>) {
    this.sidebarOpen$ = store.pipe(select(fromUser.selectSidebarOpen));
    this.mapArray$ = store.pipe(select(fromAuth.selectByType('map')));
  }

  onSelectMap(mapId: string) {
    //
  }

  onNavigate(path: string[]) {
    this.store.dispatch(new RouterActions.Navigate(path));
  }

  onLogout() {
    this.store.dispatch(new AuthActions.LogoutUserRequest());
  }
}
