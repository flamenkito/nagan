import * as L from 'leaflet';

export const getScale = value => {
  const match = value.match(/scale\((.*?)\)/);
  if (match) {
    const [pattern, scale] = match;
    return { value: +scale, pattern };
  }
};

L.WidgetIcon = L.DivIcon.extend({
  options: {
    element: document.createElement('div'),
    className: 'leaflet-div-icon',
    html: false
  },

  createIcon: function(oldIcon) {
    if (oldIcon) {
      throw new Error('Unexpected behavior');
    }

    const { element, bgPos } = this.options;

    if (bgPos) {
      element.style.backgroundPosition = -bgPos.x + 'px ' + -bgPos.y + 'px';
    }

    this._setIconStyles(element, 'icon');

    element.style['min-width'] = '300px';
    return element;
  },

  createShadow: function() {
    return null;
  }
});

L.Marker.Widget = L.Marker.extend({
  _setPos: function(pos) {
    L.DomUtil.setPosition(this._icon, pos);

    if (this._shadow) {
      L.DomUtil.setPosition(this._shadow, pos);
    }

    this._zIndex = pos.y + this.options.zIndexOffset;

    this._resetZIndex();
  },
  _animateZoom: function(opt) {
    var pos = this._map
      ._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center)
      .round();

    const scale = getScale(this._icon.style.transform);

    this._setPos(pos);

    if (scale) {
      this._icon.style.transform += ` scale(${scale.value})`;
    }
  },
  setIcon: function(icon) {
    this.options.icon = icon;

    if (this._map) {
      this._initIcon();
      this.update();
    }

    if (this._popup) {
      this.bindPopup(this._popup);
    }

    return this;
  }
});

L.marker.widget = function(latlng, element, iconSize) {
  return new L.Marker.Widget(latlng, {
    draggable: true,
    icon: new L.WidgetIcon({
      // iconSize,
      element
    })
  });
};

export { L };
