import * as L from 'leaflet';

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
        oldIcon && oldIcon.tagName === 'DIV'
          ? oldIcon
          : this.options.element,
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

L.widgetIcon = function(options) {
  return new L.WidgetIcon(options);
};

export { L };
