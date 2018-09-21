import {
  Directive,
  ElementRef,
  EventEmitter,
  Output,
  Input,
  OnDestroy
} from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';

console.log(ResizeObserver);

const entriesMap = new WeakMap();

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    if (entriesMap.has(entry.target)) {
      const comp = entriesMap.get(entry.target);
      comp._resizeCallback(entry);
    }
  }
});

@Directive({ selector: '[appResize]' })
export class ResizeDirective implements OnDestroy {
  @Output()
  resize = new EventEmitter();

  @Input()
  get debounce() {
    return this._debounce;
  }

  set debounce(val) {
    if (this._debounce !== val) {
      this._debounce = val;
      this._resizeCallback = debounce(
        entry => this.resize.emit(entry),
        this._debounce
      );
    }
  }

  _debounce = 0;

  constructor(private el: ElementRef) {
    const target = this.el.nativeElement;
    entriesMap.set(target, this);
    ro.observe(target);
  }

  _resizeCallback(entry) {
    this.resize.emit(entry);
  }

  ngOnDestroy() {
    const target = this.el.nativeElement;
    ro.unobserve(target);
    entriesMap.delete(target);
  }
}

function debounce(func, wait, immediate?) {
  let timeout;
  return function() {
    const context = this,
      args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}
