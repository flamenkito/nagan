import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromAuth from '@app/auth/store';
import { Store } from '@ngrx/store';
import { AuthActions, PouchActions } from '@app/auth/store';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPageComponent {
  constructor(private readonly store: Store<fromAuth.State>) {}

  onLogout() {
    this.store.dispatch(new AuthActions.LogoutUserRequest());
  }
}
