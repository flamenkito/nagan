import {
  Component,
  Input,
  ViewChild,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  Renderer2
} from '@angular/core';
import { fromEvent } from 'rxjs';
import {
  takeUntil,
  skipUntil,
  mergeMap,
  share,
  take,
  takeLast,
  map
} from 'rxjs/operators';

@Component({
  selector: 'app-element',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent implements OnInit {
  @Input()
  element: any;
  @Input()
  state: any;
  @ViewChild('container')
  container: ElementRef;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit() {
    const element = this.renderer.createElement(this.element.element);
    this.renderer.appendChild(this.elementRef.nativeElement, element);
    this.renderer.setAttribute(element, 'state', JSON.stringify(this.state));

    const up$ = fromEvent(document, 'mouseup');
    const move$ = fromEvent(document, 'mousemove');
    const down$ = fromEvent(element, 'mousedown');

    const drag$ = down$.pipe(
      mergeMap((mouseDown: MouseEvent) => {
        const startX = mouseDown.offsetX;
        const startY = mouseDown.offsetY;
        return move$.pipe(
          map((e: MouseEvent) => {
            return {
              left: e.clientX - startX,
              top: e.clientY - startY
            };
          }),
          takeUntil(up$)
        );
      })
      // share()
    );

    // start$.subscribe(e => console.log('start'));
    // end$.subscribe(e => console.log('end'));

    drag$.subscribe(
      ({ left, top }) => {
        const parent = element.parentNode;
        this.renderer.setStyle(element, 'transform', `translate(${left}px)`);
      },
      err => console.error(err),
      () => console.log('complete')
    );
  }
}
