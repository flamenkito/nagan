import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  LayerModel,
  WidgetModel,
  ElementModel,
  LoadableScriptModel,
  RequestModel
} from '@app/user/models';
import { MapModel } from '@app/user/models/map.model';
import { IMap, DocumentModel } from '@app/shared/models';

import { Logger } from '@app/shared/logger';
import { getTranslate, getScale } from '@app/shared/style';
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

  adjustStyle(element, event: { x: number; y: number }): IMap {
    const { style } = element;

    const { x, y, pattern } = getTranslate(style['transform']);
    const { value } = getScale(style['transform']);

    const add = (delta, pos) => Math.round((+delta / +value + pos) * 100) / 100;

    switch (style['transform-origin']) {
      case 'top left': {
        const transform = style.transform.replace(
          pattern,
          `translate(${add(event.x, +x)}px, ${add(event.y, +y)}px)`
        );
        return { ...style, transform };
      }
      case 'top right': {
        const transform = style.transform.replace(
          pattern,
          `translate(${add(event.x, +x)}px, ${add(event.y, +y)}px)`
        );
        return { ...style, transform };
      }
    }
    return style;
  }

  onDragEnd(map: MapModel, elementIndex, event, el) {
    try {
      const element = map.widgets[elementIndex];
      const style = this.adjustStyle(element, event);
      const widgets = map.widgets.map((item, index) => {
        return index === elementIndex ? { ...element, style } : item;
      });
      el.style.display = 'none';
      this.move.emit({ ...map, widgets });
      Log.info('widgets', widgets);
    } catch (err) {
      Log.danger('ERROR', err);
    }
  }

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

  widgetVisible(widget: WidgetModel) {
    if (!this.map || !Array.isArray(this.map.visibleLayerIds)) {
      return false;
    }
    return this.map.visibleLayerIds.includes(widget.layerId);
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

  widgetClass(widget: WidgetModel) {
    switch (widget.style['transform-origin']) {
      case 'top left':
        return 'element-top-left';
      case 'top right':
        return 'element-top-right';
    }
  }

  getWidgetSubscriptions(widget: WidgetModel) {
    if (widget.subscriptions.nagvis) {
      const { services } = widget.subscriptions.nagvis;
      if (services) {
        return services.map(serviceId => {
          return this.subscriptions.find(
            service => service.type === 'service' && service._id === serviceId
          );
        });
      }
    }
    return [];
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
