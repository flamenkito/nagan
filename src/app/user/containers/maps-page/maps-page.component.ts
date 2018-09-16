import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromAuth from '@app/auth/store';
import * as fromUser from '@app/user/store';
import { Store, select } from '@ngrx/store';
import { Logger } from '@app/shared/logger';
import { ScriptModel, ElementModel } from '@app/user/models';
import { ElementActions } from '@app/user/store';
import { PouchActions } from '@app/auth/store';

const Log = Logger('MapsPageComponent');

@Component({
  selector: 'app-maps-page',
  templateUrl: './maps-page.component.html',
  styleUrls: ['./maps-page.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsPageComponent {
  layers$: Observable<any[]>;
  available$: Observable<{ [key: string]: ScriptModel }>;
  elements$: Observable<{ [key: string]: ElementModel }>;
  services$: Observable<any[]>;

  constructor(private readonly store: Store<fromUser.State>) {
    this.layers$ = store.pipe(select(fromAuth.selectDocs('layer')));
    this.available$ = store.pipe(select(fromAuth.selectAvailable));
    this.elements$ = store.pipe(select(fromUser.selectElementEntities));
    this.services$ = store.pipe(select(fromAuth.selectDocs('service')));
  }

  onLoad(elements: ScriptModel[]) {
    // Log.warning('onLoad', { elements });
    elements.forEach(element =>
      this.store.dispatch(new ElementActions.LoadElement(element))
    );
  }

  onSubscribe(services: string[]) {
    // Log.warning('onSubscribe', { services });
  }

  onMove(update) {
    this.store.dispatch(new PouchActions.UpdateOne(update));
  }
}
