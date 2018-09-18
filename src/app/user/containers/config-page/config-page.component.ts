import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromAuth from '@app/auth/store';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigPageComponent {
  config$: Observable<any>;

  constructor(private readonly store: Store<fromAuth.State>) {
    this.config$ = store.pipe(select(fromAuth.selectById('config')));
  }
}
