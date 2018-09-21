import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  Renderer2
} from '@angular/core';

import {
  LayerModel,
  ElementModel,
  LoadableScriptModel,
  RequestModel
} from '@app/user/models';
import { MapModel } from '@app/user/models/map.model';
import { IMap, DocumentModel } from '@app/shared/models';

import { Logger } from '@app/shared/logger';
const Log = Logger('MapComponent');

const findBy = Symbol('findBy');
Array.prototype[findBy] = (props: IMap) => {
  return Object.keys(props).every(
    prop => String(this[prop]) === String(props[prop])
  );
};

const by = (props: IMap) => (item: any) => {
  return Object.keys(props).every(
    prop => String(item[prop]) === String(props[prop])
  );
};

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  elementMap: IMap<LoadableScriptModel>;
  @Input()
  requestMap: IMap<RequestModel>;

  @Input()
  map: MapModel;
  @Input()
  layers: LayerModel[];
  @Input()
  elements: ElementModel[];
  @Input()
  subscriptions: DocumentModel[];

  @Output()
  load = new EventEmitter<string[]>();
  @Output()
  subscribe = new EventEmitter<string[]>();
  @Output()
  move = new EventEmitter<any>();

  onWidgetMove({ elementIndex, style }) {
    const element = this.map.widgets[elementIndex];
    const widgets = this.map.widgets.map((item, index) => {
      return index === elementIndex ? { ...element, style } : item;
    });
    this.move.emit({ ...this.map, widgets });
  }
  // options = {
  //   minZoom: 1,
  //   maxZoom: 4,
  //   center: [0, 0],
  //   zoom: 2,
  //   crs: CRS.Simple
  // };

  onMapReady(map: L.Map) {
    /*
    const height = 1500;
    const width = 2000;
    const southWest = map.unproject([0, height], map.getMaxZoom() - 1);
    const northEast = map.unproject([width, 0], map.getMaxZoom() - 1);
    const bounds = new LatLngBounds(southWest, northEast);

    imageOverlay(this.map.background.url, bounds).addTo(map);
    map.setMaxBounds(bounds);

    const element = document.createElement('client-counter');

    const applyZoom = toZoom => {
      const zoom = (1 / (map.getMaxZoom() + 1)) * toZoom;
      element.style.transformOrigin = 'center';
      if (!element.style.transform.includes('scale')) {
        console.log(element.style.transform);
        // element.style.transform += ` scale(${zoom})`;
      }
    };

    const m = Widget.marker
      .widget([-85.5, 107], element)
      .addTo(map)
      .bindPopup('Custom element')
      .on('drag', e => {
        applyZoom(map.getZoom());
      })
      .on('dragend', e => {
        const { lat, lng } = m['_latlng'];
        console.log('dragend', { lat, lng });
      });

    console.log(m);
    element.setAttribute('state', JSON.stringify({ test: 'test' }));

    map.on('viewreset', e => {
      applyZoom(map.getZoom());
    });

    map.on('zoomstart', e => {
      applyZoom(map.getZoom());
      // element.style.visibility = 'hidden';
    });

    map.on('zoomend', e => {
      applyZoom(map.getZoom());
      // element.style.visibility = 'visible';
    });
*/
  }

  constructor(private readonly renderer: Renderer2) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // load elements and subscribe to services
    if (changes.map) {
      this.preload();
    }
    this.preload();
  }

  ngOnDestroy() {
    // Log.danger('OnDestroy');
  }

  private pendingScripts() {
    const selectors = new Set();
    for (const widget of this.map.widgets) {
      const element = this.elements.find(by({ _id: widget.elementId }));
      if (element) {
        selectors.add(element.selector);
      }
    }

    const scripts = Array.from(selectors).reduce((acc, selector) => {
      const script = this.elementMap[selector];
      const request = this.requestMap[selector];
      if (!script) {
        return acc;
      }
      const skip = request && (request.loaded || request.loading);
      return skip ? acc : [...acc, script.element];
    }, []);

    return scripts;
  }

  preload() {
    const exists = IMap.existsOn(this);
    if (!exists('map', 'layers', 'elementMap', 'requestMap', 'elements')) {
      return;
    }

    const serviceIds = new Set();

    // get list of Nagvis services
    this.map.widgets.forEach(widget => {
      if (widget.subscriptions.nagvis) {
        widget.subscriptions.nagvis.services.forEach(serviceId => {
          serviceIds.add(serviceId);
        });
      }
    });

    // subscribe to Nagvis services
    if (serviceIds.size > 0) {
      this.subscribe.emit(Array.from(serviceIds));
    }

    // preload scripts
    const scripts = this.pendingScripts();
    if (scripts.length > 0) {
      this.load.emit(scripts);
    }
  }

  // async broadcast(state: any) {
  //   await Promise.all(
  //     Object.keys(this.scripts)
  //       .map(key => this.scripts[key])
  //       .filter(script => script.loaded)
  //       .map(async ({ name }) => {
  //         const element = document.querySelector(name);
  //         element.setAttribute('state', JSON.stringify(state));
  //       })
  //   );
  // }

  // handleMessage(msg): void {
  //   console.log('shell received message: ', msg.detail);
  // }
}
