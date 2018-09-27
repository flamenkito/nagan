import {
  Component,
  Input,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  Renderer2,
  Output,
  EventEmitter
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
  @Input()
  options: any;
  @Output()
  message = new EventEmitter();

  constructor(
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit() {
    const element = this.renderer.createElement(this.selector);
    element.addEventListener('message', message => this.message.emit(message));
    this.renderer.appendChild(this.elementRef.nativeElement, element);
    window.customElements.whenDefined(this.selector).then(() => {
      this.renderer.setAttribute(element, 'options', JSON.stringify(this.options));
      this.renderer.setAttribute(element, 'state', JSON.stringify(this.state));
    });
  }
}
