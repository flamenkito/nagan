import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable, Subject, fromEvent, merge } from 'rxjs';
import { debounceTime, takeUntil, filter } from 'rxjs/operators';

import * as fromCore from '@app/core/store';
import * as fromAuth from '@app/auth/store';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  footerMessage$: Observable<string>;
  loading$: Observable<boolean>;

  constructor(
    private readonly store: Store<fromCore.State>,
    private readonly router: Router
  ) {
    this.footerMessage$ = store.pipe(select(fromCore.selectFooterMessage));
    this.loading$ = store.pipe(select(fromAuth.selectAuthLoading));
  }

  ngOnInit() {
    const resize$ = fromEvent(window, 'resize');

    const navigate$ = this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    );

    const repaint$ = merge(navigate$, resize$).pipe(
      debounceTime(500),
      takeUntil(this.destroy$)
    );

    repaint$.subscribe(() => {
      const event = new Event('repaint-layer');
      window.dispatchEvent(event);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
