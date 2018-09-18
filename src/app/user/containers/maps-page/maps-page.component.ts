import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromAuth from '@app/auth/store';
import * as fromUser from '@app/user/store';
import { Store, select } from '@ngrx/store';
import { Logger } from '@app/shared/logger';
import { ElementActions } from '@app/user/store';
import { PouchActions } from '@app/auth/store';

import { LoadableScriptModel, RequestModel, MapModel } from '@app/user/models';
import { DocumentModel, IMap } from '@app/shared/models';

const Log = Logger('MapsPageComponent');

@Component({
  selector: 'app-maps-page',
  templateUrl: './maps-page.component.html',
  styleUrls: ['./maps-page.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsPageComponent {
  elementMap$: Observable<IMap<LoadableScriptModel>>;
  requestMap$: Observable<IMap<RequestModel>>;

  map$: Observable<MapModel>;
  layers$: Observable<DocumentModel[]>;
  elements$: Observable<DocumentModel[]>;
  subscriptions$: Observable<DocumentModel[]>;

  constructor(private readonly store: Store<fromUser.State>) {
    this.elementMap$ = store.pipe(select(fromUser.selectElementMap));
    this.requestMap$ = store.pipe(select(fromUser.selectRequestMap));

    this.map$ = store.pipe(select(fromAuth.selectedMap));
    this.layers$ = store.pipe(select(fromAuth.selectByType('layer')));
    this.elements$ = store.pipe(select(fromAuth.selectByType('element')));
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
    // Log.warning('onSubscribe', { services });
  }

  onMove(update) {
    this.store.dispatch(new PouchActions.UpdateOne(update));
  }

  onSelectMap(mapId: string) {
    console.log(mapId);
    this.store.dispatch(new PouchActions.SelectMap(mapId));
  }
}
