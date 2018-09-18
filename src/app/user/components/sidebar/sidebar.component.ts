import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { MapModel } from '@app/user/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnChanges {
  @Input()
  maps: MapModel[];

  @Output()
  navigate = new EventEmitter<string[]>();

  menuItems: MenuItem[] = [
    {
      name: 'Maps',
      path: ['/user', 'maps'],
      expanded: false,
      active: false,
      items: [
        {
          name: 'Map #1',
          path: []
        },
        {
          name: 'Map #2',
          path: []
        },
        {
          name: 'Map #3',
          path: []
        }
      ]
    },
    {
      name: 'Layers',
      path: ['/user', 'layers'],
      expanded: false,
      active: false,
      items: [
        {
          name: 'Layer #1',
          path: []
        },
        {
          name: 'Layer #2',
          path: []
        },
        {
          name: 'Layer #3',
          path: []
        }
      ]
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
    if (changes.maps.currentValue) {
      const maps = this.maps || [];
      const mapItems = maps.map(map => {
        return { name: map.name, path: ['/user', 'maps', map._id] };
      });
      const index = this.menuItems.findIndex(item => item.name === 'Maps');
      this.menuItems[index].items = mapItems;
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
}

interface MenuItem {
  name: string;
  path: string[];
  items?: MenuItem[];
  active?: boolean;
  expanded?: boolean;
}
