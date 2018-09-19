import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MapModel } from '@app/user/models';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsComponent {
  @Input()
  maps: MapModel[];
}
