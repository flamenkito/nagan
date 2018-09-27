import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';

import { WidgetModel, MapModel } from '@app/user/models';
import { getTranslate, getScale } from '@app/shared/style';
import { IMap, DocumentModel } from '@app/shared/models';

import { Logger } from '@app/shared/logger';
const Log = Logger('ImageComponent');

import * as JSONfn from 'json-fn';

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
  @Output()
  message = new EventEmitter();

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
    return WidgetModel.getSubscriptionsFrom(widget, this.subscriptions);
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

  onMessage(message) {
    this.message.emit(message);
  }
}
