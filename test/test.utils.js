'use strict';

var utils = require('../lib/utils');
var expect = require('chai').expect;

/* globals it, describe */

describe('utils.js test', function () {
    it('should validate config', function () {
        var config = {
            valid1: {
                polling: 10000,
                externalIP: {
                    /* this object is passed directly to external-ip, no validation here*/
                }
            },
            valid2: {},
            invalid: {
                polling: 'batman',
                externalIP: 'robin'
            }
        };

        expect(utils.validateConfig(config.valid1).valid).to.equal(true);
        expect(utils.validateConfig(config.valid2).valid).to.equal(true);
        expect(utils.validateConfig(config.invalid).errors.length).equal(2);
    });

    it('sould merge config', function () {

        var config = {
            a: {
                polling: 10000,
                externalIP: {
                    timeout: 1000
                }
            },
            default: {}
        };
        var merged = utils.mergeConfig(config.a, config.default);
        expect(merged).to.have.property('polling', 10000);
        expect(merged).to.have.property('externalIP', config.externalIP);
    });
});