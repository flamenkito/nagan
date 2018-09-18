import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: '[appCollapse]' })
export class CollapseDirective {
  // style
  @HostBinding('style.height')
  private height: string;
  // shown
  @HostBinding('class.show')
  @HostBinding('attr.aria-expanded')
  private isExpanded = true;
  // hidden
  @HostBinding('attr.aria-hidden')
  private isCollapsed = false;
  // stale state
  @HostBinding('class.collapse')
  private isCollapse = true;
  // animation state
  @HostBinding('class.collapsing')
  private isCollapsing = false;

  @Input()
  private set appCollapse(value: boolean) {
    this.isExpanded = value;
    this.toggle();
  }

  private get appCollapse() {
    return this.isExpanded;
  }

  constructor() {}

  toggle() {
    if (this.isExpanded) {
      this.hide();
    } else {
      this.show();
    }
  }

  hide() {
    this.isCollapse = false;
    this.isCollapsing = true;

    this.isExpanded = false;
    this.isCollapsed = true;
    setTimeout(() => {
      alert('hide');
      this.height = '0';
      this.isCollapse = true;
      this.isCollapsing = false;
    }, 400);
  }

  show() {
    alert('animation');
    this.isCollapse = false;
    this.isCollapsing = true;

    this.isExpanded = true;
    this.isCollapsed = false;
    setTimeout(() => {
      alert('show');
      this.height = 'auto';

      this.isCollapse = true;
      this.isCollapsing = false;
    }, 400);
  }
}
