import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { faAlignJustify, faAlignLeft } from '@fortawesome/free-solid-svg-icons';

import { LayerModel, MapModel } from '@app/user/models';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  @Input()
  layers: LayerModel[];
  @Input()
  selectedMap: MapModel;
  @Output()
  toggleLayer = new EventEmitter<string>();
  @Output()
  updateMap = new EventEmitter<Partial<MapModel>>();

  iconToggleSidebar = faAlignLeft;
  iconToggleNavigation = faAlignJustify;

  showLayers() {
    return this.selectedMap && Array.isArray(this.selectedMap.visibleLayerIds);
  }

  visibleLayer(layer: LayerModel) {
    return this.selectedMap.visibleLayerIds.includes(layer._id);
  }

  onSidebarToggle() {
    const sidebar: HTMLElement = document.getElementById('sidebar');
    const content: HTMLElement = document.getElementById('content');
    sidebar.classList.toggle('active');
    content.classList.toggle('active');
  }

  onToggleLayer(layer: LayerModel) {
    const visibleLayerIds = toggle(this.selectedMap.visibleLayerIds, layer._id);
    this.updateMap.emit({ ...this.selectedMap, visibleLayerIds });
  }
}

const toggle = (arr, value) => {
  const toggled = [...arr];
  const index = toggled.indexOf(value);

  if (index === -1) {
    toggled.push(value);
  } else {
    toggled.splice(index, 1);
  }
  return toggled;
};
