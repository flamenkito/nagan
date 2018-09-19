import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromUser from '@app/user/store';
import { Store, select } from '@ngrx/store';
import { MapModel } from '@app/user/models';

@Component({
  selector: 'app-maps-page',
  templateUrl: './maps-page.component.html',
  styleUrls: ['./maps-page.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsPageComponent {
  mapArray$: Observable<MapModel[]>;

  constructor(private readonly store: Store<fromUser.State>) {
    this.mapArray$ = store.pipe(select(fromUser.selectMaps));
  }
}
