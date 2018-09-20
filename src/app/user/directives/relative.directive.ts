import {
  Directive,
  Input,
  HostListener,
  HostBinding,
  ElementRef,
  OnInit
} from '@angular/core';

import { Logger } from '@app/shared/logger';
import { IMap } from '@app/shared/models';
import { getPx, getScale } from '@app/shared/style';

@Directive({
  selector: '[appRelative]'
})
export class RelativeDirective implements OnInit {
  @Input('appRelative')
  appRelative: { container: HTMLElement; style: IMap };

  @HostBinding('style.transition')
  transition;

  private isAdaptive() {
    const img = this.appRelative.container.querySelector('img');
    return img && img.style['min-width'];
  }

  private adjust(animate: boolean) {
    if (!this.isAdaptive()) {
      return;
    }

    const baseStyle = window.getComputedStyle(this.appRelative.container, null);

    const img = this.appRelative.container.querySelector('img');
    const minWidth = getPx(img.style['min-width']);
    const actualWidth = img.getClientRects()[0].width;
    const zoomFactor = actualWidth / minWidth;

    const { style } = this.appRelative as any;
    const scale = getScale(style.transform);
    const transform = style.transform.replace(
      scale.pattern,
      `scale(${scale.value * zoomFactor})`
    );

    // console.log(animate, style.transform, transform, zoomFactor);
    this.elementRef.nativeElement.style.transform = transform;
    this.elementRef.nativeElement.style.transition = 'transform 0.4s';
  }

  ngOnInit() {
    this.adjust(false);
  }

  @HostListener('window:repaint-layer')
  onResizeEnd() {
    this.adjust(true);
  }

  constructor(private readonly elementRef: ElementRef) {}
}
