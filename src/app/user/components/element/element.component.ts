import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  Renderer2
} from '@angular/core';

@Component({
  selector: 'app-element',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent implements OnInit {
  @Input()
  selector: string;
  @Input()
  state: any;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit() {
    const element = this.renderer.createElement(this.selector);
    this.renderer.appendChild(this.elementRef.nativeElement, element);
    window.customElements.whenDefined(this.selector).then(() => {
      this.renderer.setAttribute(element, 'state', JSON.stringify(this.state));
    });
  }
}
