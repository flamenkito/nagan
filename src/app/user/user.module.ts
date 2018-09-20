import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserRoutingModule } from './user-routing.module';

import { containers } from './containers';
import { components } from './components';
import { guards } from './guards';
import { services } from './services';
import { directives } from './directives';

// store and effects
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragAndDropModule } from '@app/draggable/drag-and-drop.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    DragAndDropModule
  ],
  declarations: [...containers, ...components, ...directives],
  exports: [...containers, ...components]
})
export class UserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootUserModule,
      providers: [...guards, ...services]
    };
  }
}

@NgModule({
  imports: [
    UserModule,
    UserRoutingModule,
    StoreModule.forFeature('userModule', reducers),
    EffectsModule.forFeature(effects)
  ]
})
export class RootUserModule {}
