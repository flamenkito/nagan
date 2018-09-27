import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromAuth from '@app/auth/store';
import * as fromUser from '@app/user/store';
import { Store, select } from '@ngrx/store';
import { ElementActions, UserActions } from '@app/user/store';
import { PouchActions } from '@app/auth/store';

import { LoadableScriptModel, RequestModel, MapModel } from '@app/user/models';
import { DocumentModel, IMap } from '@app/shared/models';
import { ActivatedRoute } from '@angular/router';

import { Logger } from '@app/shared/logger';
import { RouterActions } from '@app/core/store';
const Log = Logger('MapPageComponent');

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPageComponent {
  elementMap$: Observable<IMap<LoadableScriptModel>>;
  requestMap$: Observable<IMap<RequestModel>>;

  map$: Observable<MapModel>;
  layers$: Observable<DocumentModel[]>;
  subscriptions$: Observable<DocumentModel[]>;

  constructor(
    private readonly store: Store<fromUser.State>,
    private readonly route: ActivatedRoute
  ) {
    this.route.params.subscribe(({ mapId }) =>
      this.store.dispatch(new UserActions.SelectMap(mapId))
    );

    this.elementMap$ = store.pipe(select(fromUser.selectElementMap));
    this.requestMap$ = store.pipe(select(fromUser.selectRequestMap));

    this.map$ = store.pipe(select(fromUser.selectedMap));
    this.layers$ = store.pipe(select(fromAuth.selectByType('layer')));
    this.subscriptions$ = store.pipe(
      select(fromAuth.selectByTypes(['service', 'host']))
    );
  }

  onLoad(selectors: string[]) {
    selectors.forEach(selector =>
      this.store.dispatch(new ElementActions.LoadElementRequest(selector))
    );
  }

  onSubscribe(services: string[]) {
    Log.warning('onSubscribe', { services });
  }

  onMove(update) {
    this.store.dispatch(new PouchActions.UpdateOne(update));
  }

  onMessage({ detail: { type, payload, meta } }) {
    switch (type) {
      case 'NAVIGATE': {
        const { mapId } = payload;
        if (mapId) {
          this.store.dispatch(
            new RouterActions.Navigate(['/user', 'map', mapId])
          );
        }
      }
    }
  }
}
