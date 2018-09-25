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
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import * as L from 'leaflet';
import { MapModel, WidgetModel } from '@app/user/models';
import { DocumentModel, IMap } from '@app/shared/models';

import { Widget } from './plugins';

import { Logger } from '@app/shared/logger';
import { getScale } from '@app/shared/style';
const Log = Logger('LeafletComponent');

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
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
  scalers = [];
  renderers = [];

  leafletMap(onTileLoad) {
    const config = this.map.background.leaflet;
    const map = L.map(this.leaflet.nativeElement, { ...config.options });

    const tile = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution
      }
    );

    const handler = () => {
      onTileLoad();
      tile.off('load', handler);
    };

    tile.addTo(map).on('load', handler);

    return { map, config };
  }

  leafletImage(onTileLoad) {
    const config = this.map.background.viewer;
    const map = L.map(this.leaflet.nativeElement, config.options);

    const height = 1500;
    const width = 2000;
    const southWest = map.unproject([0, height], map.getMaxZoom() - 1);
    const northEast = map.unproject([width, 0], map.getMaxZoom() - 1);
    const bounds = new L.LatLngBounds(southWest, northEast);

    const tile = L.imageOverlay(config.url, bounds);

    const handler = () => {
      onTileLoad();
      tile.off('load', handler);
    };

    tile.addTo(map).on('load', handler);

    map.setMaxBounds(bounds);

    return { map, config };
  }

  getMap(onTileLoad) {
    if (this.map.background.viewer) {
      return this.leafletImage(onTileLoad);
    }
    if (this.map.background.leaflet) {
      return this.leafletMap(onTileLoad);
    }
  }

  getDenomitator(map, scale) {
    // Get the y,x dimensions of the map
    const y = map.getSize().y,
      x = map.getSize().x;
    // calculate the distance the one side of the map to the other using the haversine formula
    const maxMeters = map
      .containerPointToLatLng([0, y])
      .distanceTo(map.containerPointToLatLng([x, y]));
    // calculate how many meters each pixel represents
    const MeterPerPixel = maxMeters / x;
    // This is the scale denominator
    return MeterPerPixel * scale.options.maxWidth;
  }

  hideWidgets() {
    Array.from(document.querySelectorAll('.leaflet-widget-icon')).forEach(
      (el: HTMLElement) => {
        el.style.transition = '';
        el.style.opacity = '0.00';
      }
    );
  }

  ngOnInit() {
    const scaleControl = L.control.scale();

    const { map, config } = this.getMap(() => {
      const denominator = this.getDenomitator(map, scaleControl);
      this.renderers.forEach(f => f());
      this.updaters.forEach(f => f());
      this.scalers.forEach(f => f(denominator));
    });

    if (!map) {
      return;
    }

    // scaleControl.addTo(map);

    this.map.widgets.forEach((widget, elementIndex) => {
      customElements.whenDefined(widget.selector).then(() => {
        const element = document.createElement(widget.selector);
        // hidden until scale
        element.style.transition = '';
        element.style.opacity = '0.00';
        // state updaters
        this.updaters.push(() => {
          if (!this.map.visibleLayerIds.includes(widget.layerId)) {
            return;
          }
          const state = WidgetModel.getSubscriptionsFrom(
            widget,
            this.subscriptions
          );
          element.setAttribute('state', JSON.stringify(state));
        });
        // render
        this.renderers.push(() => {
          if (!this.map.visibleLayerIds.includes(widget.layerId)) {
            element.style.visibility = 'hidden';
            return;
          } else {
            element.style.visibility = 'visible';
          }
        });
        // scale on zoom
        this.scalers.push((denominator: number) => {
          if (!this.map.visibleLayerIds.includes(widget.layerId)) {
            return;
          }
          const { transform } = element.style;
          const scale = getScale(transform);
          const factor = 300 / denominator;
          if (scale) {
            element.style.transform = transform.replace(
              scale.pattern,
              `scale(${factor})`
            );
          } else {
            element.style.transform = `${transform} scale(${factor})`;
          }
          // show widget
          element.style.transition = 'opacity 0.3s';
          element.style.opacity = '1.00';
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

      map
        .on('zoomend', e => {
          const denominator = this.getDenomitator(map, scaleControl);
          this.scalers.forEach(scaler => scaler(denominator));
        })
        .on('zoomstart', () => {
          this.hideWidgets();
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

    this.ngOnDestroy = () => {
      map.remove();
      map.off();
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.subscriptions.currentValue) {
      this.updaters.forEach(f => f());
    }
    if (changes.map.currentValue) {
      this.renderers.forEach(f => f());
    }
  }

  ngOnDestroy() {}
}

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
