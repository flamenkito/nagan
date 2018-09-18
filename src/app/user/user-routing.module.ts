import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as fromContainers from './containers';

import { AuthGuard } from '@app/auth/guards';
import { ConfigGuard } from '@app/user/guards';

const routes: Routes = [
  {
    path: 'user',
    canActivate: [AuthGuard, ConfigGuard],
    component: fromContainers.UserPageComponent,
    children: [
      {
        path: 'config',
        component: fromContainers.ConfigPageComponent
      },
      {
        path: 'docs',
        component: fromContainers.DocsPageComponent
      },
      {
        path: 'maps/:mapId',
        component: fromContainers.MapsPageComponent
      },
      {
        path: 'maps',
        component: fromContainers.MapsPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
