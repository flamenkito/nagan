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
} from '@angular/core';

import {
  LayerModel,
  LoadableScriptModel,
  RequestModel,
  WidgetModel
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
  subscriptions: DocumentModel[];

  @Output()
  load = new EventEmitter<string[]>();
  @Output()
  subscribe = new EventEmitter<string[]>();
  @Output()
  move = new EventEmitter<any>();

  onWidgetMove({ elementIndex, style, center }) {
    const element = this.map.widgets[elementIndex];
    const widgets = this.map.widgets.map((item, index) => {
      return index === elementIndex ? { ...element, style, center } : item;
    });
    this.move.emit({ ...this.map, widgets });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // load elements and subscribe to services
    if (changes.map) {
      this.preload();
    }
    this.preload();
  }

  ngOnDestroy() {}

  private pendingScripts() {
    const selectors = new Set();
    for (const widget of this.map.widgets) {
      selectors.add(widget.selector);
    }

    const scripts = Array.from(selectors).reduce((acc, selector) => {
      const script = this.elementMap[selector];
      const request = this.requestMap[selector];
      if (!script) {
        return acc;
      }
      const skip = request && (request.loaded || request.loading);
      return skip ? acc : [...acc, script.selector];
    }, []);

    return scripts;
  }

  preload() {
    const exists = IMap.existsOn(this);
    if (!exists('map', 'layers', 'elementMap', 'requestMap')) {
      return;
    }

    const uniqueIds = new Set();

    // get list of Nagvis services
    this.map.widgets.forEach(widget => {
      WidgetModel.onSubscriptions(widget, (type, ids) => {
        ids.forEach(id => uniqueIds.add(id));
      });
    });

    // subscribe to Nagvis services
    if (uniqueIds.size > 0) {
      this.subscribe.emit(Array.from(uniqueIds));
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
