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
import { ElementModel, ScriptModel } from '@app/user/models';
import { Logger } from '@app/shared/logger';

import { DropEvent } from '@app/draggable/droppable.directive';

interface LayerModel {
  name: string;
  description: string;
  elements: [
    {
      element: string;
      style: { [key: string]: string };
      services: string[];
    }
  ];
  _id: string;
  _rev: string;
}

const Log = Logger('MapComponent');

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  layers: LayerModel[];
  @Input()
  available: { [key: string]: ScriptModel };
  @Input()
  elements: { [key: string]: ElementModel };
  @Input()
  services: any[];

  @Output()
  load = new EventEmitter<ScriptModel[]>();
  @Output()
  subscriptions = new EventEmitter<string[]>();
  @Output()
  move = new EventEmitter<any>();

  adjustStyle(element, event) {
    let style = { ...element.style };
    if (element.style.left) {
      const prevX = +element.style.left.replace('px', '');
      const left = `${prevX + event.x}px`;
      style = { ...style, left };
    }
    if (element.style.right) {
      const prevX = +element.style.right.replace('px', '');
      const right = `${prevX - event.x}px`;
      style = { ...style, right };
    }
    if (element.style.top) {
      const prevY = +element.style.top.replace('px', '');
      const top = `${prevY + event.y}px`;
      style = { ...style, top };
    }
    return style;
  }
  onDragEnd(layer: LayerModel, elementIndex, event, el) {
    const element = layer.elements[elementIndex];
    const style = this.adjustStyle(element, event);
    const elements = layer.elements.map((item, index) => {
      return index === elementIndex ? { ...element, style } : item;
    });

    el.style.display = 'none';
    this.move.emit({ ...layer, elements });
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // load elements and subscribe to services
    if (changes.layers) {
      this.preload();
    }
  }

  ngOnDestroy() {
    // Log.danger('OnDestroy');
  }

  preload() {
    if (!this.layers || !this.available || !this.elements) {
      return;
    }

    Log.warning('preload');

    // subscribe to services
    const elementNames = new Set();
    const serviceIds = new Set();
    this.layers.forEach(layer =>
      layer.elements.map(item => {
        elementNames.add(item.element);
        layer.elements.forEach(element => {
          element.services.forEach(serviceId => serviceIds.add(serviceId));
        });
      })
    );

    if (serviceIds.size > 0) {
      this.subscriptions.emit(Array.from(serviceIds));
    }

    // preload elements
    const elements = [];
    Array.from(elementNames).forEach(name => {
      const script = this.available[name];
      const element = this.elements[name];
      const loaded = element && element.loaded;
      if (!loaded) {
        elements.push(script);
      }
    });

    if (elements.length > 0) {
      this.load.emit(elements);
    }
  }

  getElementState(element) {
    return element.services.map(serviceId => {
      return this.services.find(service => service._id === serviceId);
    });
  }
}
