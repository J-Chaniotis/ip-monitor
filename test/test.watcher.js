'use strict';
/*globals it, describe, beforeEach*/

var expect = require('chai').expect;
var Watcher = require('../lib/watcher').Watcher;

var config = {
    polling: 1000
};

// Hackish stub
var extIPStub = function () {
    var fn;
    return {
        getIP: function (cb) {
            fn = cb;
        },
        yield: function () {
            if (!fn) {
                throw new Error('cant yield');
            }
            fn.apply(fn, arguments);
            fn = null;
        }
    };
};

// Hackish invocation counter
var counter = function (maxCount, done) {
    var invocations = 0;
    return {
        increment: function (times) {
            invocations += times || 1;
            if(invocations === maxCount) {
                done();
            }
        }
    };
};

var extIP = extIPStub();
var watcher;


describe('watcher.js test', function () {

    beforeEach(function () {
        watcher = new Watcher(extIP.getIP, config);
    });


    it('sould emit "start" when watcher.start() is called for the first time', function (done) {
        watcher.on('start', function (ip) {
            expect(ip).to.equal('10.10.10.10');
            done();
        });

        watcher.start();
        extIP.yield(null, '10.10.10.10');
    });


    it('sould emit "error" when extIP yields an error', function (done) {
        watcher.on('error', function (err) {
            expect(err).to.equal('Booom');
            done();
        });

        watcher.start();
        extIP.yield('Booom', null);
    });

    it('sould emit "ipChanged" when watcher.getIP() is called for the first time', function (done) {

        var countTwo = counter(2, done);

        watcher.on('ipChanged', function (prevIP, IP) {
            expect(IP).to.equal('10.10.10.10');
            expect(prevIP).to.equal(null);
            countTwo.increment();
        });

        watcher.getIP(function (IP) {
            expect(IP).to.equal('10.10.10.10');
            countTwo.increment();
        });

        extIP.yield(null, '10.10.10.10');
    });

    it('sould emit "stop" when watcher.stop() is called', function (done) {
        watcher.on('stop', function () {
            done();
        });
        watcher.on('start', function () {
            watcher.stop();
        });
        watcher.start();
        extIP.yield(null, '10.10.10.10');
    });


});