import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromUser from '@app/user/store';
import { Store, select } from '@ngrx/store';
import { AuthActions, PouchActions } from '@app/auth/store';
import { RouterActions } from '@app/core/store';
import { MapModel, LayerModel } from '@app/user/models';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPageComponent {
  sidebarOpen$: Observable<boolean>;
  mapArray$: Observable<MapModel[]>;
  layerArray$: Observable<LayerModel[]>;

  selectedMap$: Observable<MapModel>;

  constructor(private readonly store: Store<fromUser.State>) {
    this.sidebarOpen$ = store.pipe(select(fromUser.selectSidebarOpen));
    this.mapArray$ = store.pipe(select(fromUser.selectMaps));
    this.layerArray$ = store.pipe(select(fromUser.selectLayers));

    this.selectedMap$ = store.pipe(select(fromUser.selectedMap));
  }

  onNavigate(path: string[]) {
    this.store.dispatch(new RouterActions.Navigate(path));
  }

  onUpdateMap(update: Partial<MapModel>) {
    this.store.dispatch(new PouchActions.UpdateOne(update));
  }

  onLogout() {
    this.store.dispatch(new AuthActions.LogoutUserRequest());
  }
}
