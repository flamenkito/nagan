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
    iconSize: [12, 12], // also can be set through CSS
    /*
		iconAnchor: (Point)
		popupAnchor: (Point)
		html: (String)
		bgPos: (Point)
		*/
    className: 'leaflet-div-icon',
    html: false
  },

  createIcon: function(oldIcon) {
    var div =
        oldIcon && oldIcon.tagName === 'DIV' ? oldIcon : this.options.element,
      options = this.options;

    if (options.html !== false) {
      div.innerHTML = options.html;
    } else {
      div.innerHTML = '';
    }

    if (options.bgPos) {
      div.style.backgroundPosition =
        -options.bgPos.x + 'px ' + -options.bgPos.y + 'px';
    }

    this._setIconStyles(div, 'icon');
    return div;
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

L.marker.widget = function(latlng, element) {
  return new L.Marker.Widget(latlng, {
    draggable: true,
    icon: new L.WidgetIcon({
      iconSize: [300, 300],
      element
    })
  });
};

export { L };
