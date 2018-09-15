'use strict';

var pouchdbUtils = require('pouchdb-utils');

var plugin = {};

plugin.testPlugin = pouchdbUtils.toPromise(function() {
  var db = this;
  console.log(db);
});

if (typeof window !== 'undefined' && window.PouchDB) {
  window.PouchDB.plugin(plugin);
}

module.exports = plugin;
