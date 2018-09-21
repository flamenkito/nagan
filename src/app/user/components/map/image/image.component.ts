import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';

import { WidgetModel, MapModel } from '@app/user/models';
import { getTranslate, getScale } from '@app/shared/style';
import { IMap, DocumentModel } from '@app/shared/models';

import { Logger } from '@app/shared/logger';
const Log = Logger('ImageComponent');

import ResizeObserver from 'resize-observer-polyfill';

const entriesMap = new WeakMap();
const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entriesMap.has(entry.target)) {
      const comp = entriesMap.get(entry.target);
      comp._resizeCallback(entry);
    }
  }
});

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent implements OnInit {
  @Input()
  map: MapModel;
  @Input()
  subscriptions: DocumentModel[];

  @Output()
  move = new EventEmitter<any>();

  ngOnInit() {}

  onResize() {
    window.dispatchEvent(new Event('repaint-layer'));
  }

  widgetClass(widget: WidgetModel) {
    switch (widget.style['transform-origin']) {
      case 'top left':
        return 'element-top-left';
      case 'top right':
        return 'element-top-right';
    }
  }

  widgetVisible(widget: WidgetModel) {
    return this.map.visibleLayerIds.includes(widget.layerId);
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

  onDragEnd(widget: WidgetModel, elementIndex: number, event, el: HTMLElement) {
    try {
      const style = this.adjustStyle(widget, event);
      el.style.display = 'none';
      this.move.emit({ elementIndex, style });
    } catch (err) {
      Log.danger('ERROR', err);
    }
  }
}
