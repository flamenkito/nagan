import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeafletComponent implements OnInit, OnDestroy {
  @ViewChild('leaflet')
  leaflet: ElementRef;

  ngOnInit() {
    const map = L.map(this.leaflet.nativeElement).setView(
      [37.4169995, -6.0780654],
      15
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const icon = L.icon({
      iconUrl: '/assets/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    L.marker([37.4169995, -6.0780654], { icon })
      .addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

    this.ngOnDestroy = () => {
      map.remove();
      map.off();
    };
  }

  ngOnDestroy() {}
}
