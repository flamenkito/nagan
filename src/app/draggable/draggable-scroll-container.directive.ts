import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDraggableScrollContainer]'
})
export class DraggableScrollContainerDirective {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
