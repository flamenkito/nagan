import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import * as fromAuth from '@app/auth/store';
import { Store, select } from '@ngrx/store';
import { PouchActions } from '@app/auth/store';

@Component({
  selector: 'app-docs-page',
  templateUrl: './docs-page.component.html',
  styleUrls: ['./docs-page.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsPageComponent {
  docs$: Observable<any[]>;

  constructor(private readonly store: Store<fromAuth.State>) {
    this.docs$ = store.pipe(select(fromAuth.selectDocs('doc')));
  }

  onSelectDoc(doc: any) {
    const name = prompt('Update document name', doc.name);
    if (name !== null) {
      this.store.dispatch(
        new PouchActions.UpdateOne({
          ...doc,
          name
        })
      );
    }
  }
}
