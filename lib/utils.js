'use strict';

var revalidator = require('revalidator');

var validateConfig = function (config) {
    return revalidator.validate(config, {
        properties: {
            polling: {
                description: 'how often to check for an IP change',
                type: 'integer',
                allowEmpty: false
            },
            externalIP: {
                description: 'configuration passed to external-ip',
                type: 'object'
            }
        }
    });
};

var mergeConfig = function (externalConf, defaultConf) {
    return {
        polling: externalConf.polling || defaultConf.polling,
        externalIP: externalConf.externalIP || defaultConf.externalIP
    };
};

module.exports = {
    validateConfig: validateConfig,
    mergeConfig: mergeConfig
};