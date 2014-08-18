'use strict';

var Watcher = require('./lib/Watcher');
var utils = require('./lib/utils');


module.exports.createWatcher = function (extConfig) {
    var isValid = utils.validateConfig(extConfig);
    if(isValid.errors.length) {
        throw new Error(isValid.errors);
    }

    var defaultConfig = {
        
    };

    return new Watcher(utils.mergeConfig(extConfig, defaultConfig));
};