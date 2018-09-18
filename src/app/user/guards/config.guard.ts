import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs';
import { map, take, tap, filter } from 'rxjs/operators';

import * as fromUser from '@app/user/store';

import { ConfigModel } from '@app/user/models';
import { ConfigActions, ElementActions } from '@app/user/store';

@Injectable()
export class ConfigGuard implements CanActivate {
  constructor(private store: Store<fromUser.State>) {}

  waitPreload(): Observable<boolean> {
    return this.store.pipe(
      select(fromUser.selectConfig),
      tap(config => {
        if (!config) {
          this.store.dispatch(new ConfigActions.LoadConfig());
        } else {
          this.store.dispatch(new ElementActions.Init(config.elements));
        }
      }),
      map(config => !!config),
      filter(config => config),
      take(1)
    );
  }

  canActivate(): Observable<boolean> {
    return this.waitPreload();
  }
}
