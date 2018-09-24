import {
  Directive,
  Input,
  HostListener,
  HostBinding,
  ElementRef,
  OnInit
} from '@angular/core';

import { IMap } from '@app/shared/models';
import { getPx, getScale } from '@app/shared/style';

@Directive({
  selector: '[appRelative]'
})
export class RelativeDirective implements OnInit {
  @Input('appRelative')
  appRelative: { base: HTMLElement; style: IMap };

  @HostBinding('style.transition')
  transition;

  @HostListener('window:repaint-layer')
  onResizeEnd() {
    this.adjust();
  }

  private getWidth() {
    const { base } = this.appRelative;
    if (base && base.style['min-width']) {
      const min = getPx(base.style['min-width']);
      const cur = base.getClientRects()[0].width;
      return { min, cur };
    }
  }

  private adjust() {
    const width = this.getWidth();
    if (!width) {
      return;
    }

    // const baseStyle = window.getComputedStyle(this.appRelative.base, null);
    const zoomFactor = width.cur / width.min;

    const { style } = this.appRelative as any;
    const scale = getScale(style.transform);
    const transform = style.transform.replace(
      scale.pattern,
      `scale(${scale.value * zoomFactor})`
    );

    const el = this.elementRef.nativeElement as HTMLElement;
    el.style.transform = transform;
  }

  constructor(private readonly elementRef: ElementRef) {}

  ngOnInit() {
    this.adjust();
  }
}
