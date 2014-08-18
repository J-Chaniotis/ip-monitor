'use strict';

var Watcher = require('./lib/Watcher');


module.exports.createWatcher = function () {
    // Validate config here
    return new Watcher()
};