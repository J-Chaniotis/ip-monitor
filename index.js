'use strict';

var Watcher = require('./lib/Watcher').Watcher;
var utils = require('./lib/utils');
var extIP = require('external-ip');


module.exports.createWatcher = function (extConfig) {
    var isValid = utils.validateConfig(extConfig);
    if(isValid.errors.length) {
        throw new Error(isValid.errors);
    }

    var defaultConfig = {
        polling: 20000,
        externalIP: {}
    };

    var config = utils.mergeConfig(extConfig, defaultConfig);
    var getIP = extIP(config.externalIP);

    return new Watcher(getIP, config);
};