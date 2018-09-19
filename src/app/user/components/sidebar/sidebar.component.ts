import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MapModel, LayerModel } from '@app/user/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnChanges {
  @Input()
  maps: MapModel[];
  @Input()
  layers: LayerModel[];

  @Output()
  navigate = new EventEmitter<string[]>();
  @Output()
  logout = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      name: 'Maps',
      path: ['/user', 'maps'],
      expanded: false,
      active: false,
      items: []
    },
    {
      name: 'Layers',
      path: ['/user', 'layers'],
      expanded: false,
      active: false,
      items: []
    },
    {
      name: 'Documents',
      path: ['/user', 'docs']
    },
    {
      name: 'Config',
      path: ['/user', 'config']
    }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.maps && changes.maps.currentValue) {
      const maps = this.maps || [];
      const mapItems = maps.map(map => {
        return { name: map.name, path: ['/user', 'map', map._id] };
      });
      const index = this.menuItems.findIndex(item => item.name === 'Maps');
      this.menuItems[index].items = mapItems;
    }
    if (changes.layers && changes.layers.currentValue) {
      const layers = this.layers || [];
      const layerItems = layers.map(layer => {
        return { name: layer.name, path: ['/user', 'layer', layer._id] };
      });
      const index = this.menuItems.findIndex(item => item.name === 'Layers');
      this.menuItems[index].items = layerItems;
    }
  }

  onSelect(menuItem: MenuItem) {
    const inactive = (items: MenuItem[]) =>
      items &&
      items.forEach(item => {
        item.active = false;
        inactive(item.items);
      });

    // inactive(this.menuItems);
    // menuItem.expanded = !menuItem.expanded;
    // menuItem.active = true;

    if (menuItem.path) {
      this.navigate.emit(menuItem.path);
    }
  }

  onLogout() {
    this.logout.emit();
  }
}

interface MenuItem {
  name: string;
  path: string[];
  items?: MenuItem[];
  active?: boolean;
  expanded?: boolean;
}
