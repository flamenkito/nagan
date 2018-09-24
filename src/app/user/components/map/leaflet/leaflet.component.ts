import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import * as L from 'leaflet';
import { MapModel, WidgetModel } from '@app/user/models';
import { DocumentModel, IMap } from '@app/shared/models';

import { Widget } from './plugins';

import { Logger } from '@app/shared/logger';
const Log = Logger('LeafletComponent');

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeafletComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('leaflet')
  leaflet: ElementRef;
  @Input()
  map: MapModel;
  @Input()
  subscriptions: DocumentModel[];
  @Output()
  move = new EventEmitter<any>();

  updaters = [];

  leafletMap() {
    const config = this.map.background.leaflet;
    const map = L.map(this.leaflet.nativeElement, { ...config.options });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution
    }).addTo(map);

    return { map, config };
  }

  leafletImage() {
    const config = this.map.background.viewer;
    const map = L.map(this.leaflet.nativeElement, config.options);

    const height = 1500;
    const width = 2000;
    const southWest = map.unproject([0, height], map.getMaxZoom() - 1);
    const northEast = map.unproject([width, 0], map.getMaxZoom() - 1);
    const bounds = new L.LatLngBounds(southWest, northEast);

    L.imageOverlay(config.url, bounds).addTo(map);
    map.setMaxBounds(bounds);

    return { map, config };
  }

  getMap() {
    if (this.map.background.viewer) {
      return this.leafletImage();
    }
    if (this.map.background.leaflet) {
      return this.leafletMap();
    }
  }

  ngOnInit() {
    const { map, config } = this.getMap();
    if (!map) {
      return;
    }

    this.map.widgets.forEach((widget, elementIndex) => {
      customElements.whenDefined(widget.selector).then(() => {
        const element = document.createElement(widget.selector);
        element.style.visibility = 'hidden';
        // save the reference
        this.updaters.push(subscriptions => {
          const state = WidgetModel.getSubscriptionsFrom(
            widget,
            this.subscriptions
          );
          element.style.visibility = 'visible';
          element.setAttribute('state', JSON.stringify(state));
        });
        // add to map
        const widgetMarker = Widget.marker
          .widget([widget.center.lat, widget.center.lng], element, [300, 400])
          .addTo(map)
          .on('dragend', () => {
            const { lat, lng } = widgetMarker['_latlng'];
            this.move.emit({ elementIndex, center: { lat, lng } });
          });
      });
    });

    config.objects.forEach(object => {
      switch (object.type) {
        case 'marker': {
          const icon = L.icon({
            iconUrl: '/assets/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          L.marker([object.center.lat, object.center.lng], {
            ...object.options,
            icon
          }).addTo(map);
        }
      }
    });

    setTimeout(() => {
      this.render();
    }, 300);

    this.ngOnDestroy = () => {
      map.remove();
      map.off();
    };
  }

  render() {
    this.updaters.forEach(updater => updater());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.subscriptions.currentValue) {
      this.render();
    }
  }

  ngOnDestroy() {}
}

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
