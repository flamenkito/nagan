import { Component, ChangeDetectionStrategy } from '@angular/core';
import { faAlignJustify, faAlignLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  iconToggleSidebar = faAlignLeft;
  iconToggleNavigation = faAlignJustify;

  onSidebarToggle() {
    const sidebar: HTMLElement = document.getElementById('sidebar');
    const content: HTMLElement = document.getElementById('content');
    sidebar.classList.toggle('active');
    content.classList.toggle('active');
  }
}
