import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCore from '@app/core/store';
import * as fromAuth from '@app/auth/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  footerMessage$: Observable<string>;
  loading$: Observable<boolean>;

  constructor(private readonly store: Store<fromCore.State>) {
    this.footerMessage$ = store.pipe(select(fromCore.selectFooterMessage));
    this.loading$ = store.pipe(select(fromAuth.selectLoading));
  }
}
