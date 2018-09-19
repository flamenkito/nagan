import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromUser from '@app/user/store';
import { Store, select } from '@ngrx/store';
import { LayerModel } from '@app/user/models';

@Component({
  selector: 'app-layers-page',
  templateUrl: './layers-page.component.html',
  styleUrls: ['./layers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayersPageComponent {
  layerArray$: Observable<LayerModel[]>;

  constructor(private readonly store: Store<fromUser.State>) {
    this.layerArray$ = store.pipe(select(fromUser.selectLayers));
  }
}
