import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromAuth from '@app/auth/store';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-maps-page',
  templateUrl: './maps-page.component.html',
  styleUrls: ['./maps-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsPageComponent {
  maps$: Observable<any[]>;

  constructor(private readonly store: Store<fromAuth.State>) {
    this.maps$ = store.pipe(select(fromAuth.selectDocs('map')));
  }
}
