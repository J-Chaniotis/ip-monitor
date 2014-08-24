'use strict';
/*globals it, describe, beforeEach*/

var expect = require('chai').expect;
var Watcher = require('../lib/watcher').Watcher;

var config = {
    polling: 100
};

// Hackish stub
var extIPStub = function () {
    var args;
    return {
        getIP: function (cb) {
            cb.apply(cb, args);
        },
        set: function () {
            args = arguments;
        }
    };
};

// Hackish invocation counter
var counter = function (maxCount, done) {
    return {
        invocations: 0,
        increment: function (times) {
            this.invocations += times || 1;
/* JavaScript */if (this.invocations === maxCount) {
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
        extIP.set(null, '10.10.10.10');

        watcher.on('start', function (ip) {
            expect(ip).to.equal('10.10.10.10');
            done();
        });

        watcher.start();

    });


    it('sould emit "error" when extIP yields an error', function (done) {
        extIP.set('Booom', null);

        watcher.on('error', function (err) {
            expect(err).to.equal('Booom');
            done();
        });

        watcher.start();

    });

    it('sould emit "ipChanged" when watcher.getIP() is called for the first time', function (done) {

        var countTwo = counter(2, done);
        extIP.set(null, '10.10.10.10');

        watcher.on('ipChanged', function (prevIP, IP) {
            expect(IP).to.equal('10.10.10.10');
            expect(prevIP).to.equal(null);
            countTwo.increment();
        });

        watcher.getIP(function (IP) {
            expect(IP).to.equal('10.10.10.10');
            countTwo.increment();
        });


    });

    it('sould emit "stop" when watcher.stop() is called', function (done) {

        extIP.set(null, '10.10.10.10');

        watcher.on('stop', function () {
            done();
        });
        watcher.on('start', function () {
            watcher.stop();
        });
        watcher.start();
        
    });

    it('should emit "ipChanged" n times', function (done) {
        var n = 5;
        var countFive = counter(n, watcher.stop.bind(watcher));
        extIP.set(null, countFive.invocations);

        watcher.on('ipChanged', function (prevIP, newIP) {
            expect(newIP).to.equal(countFive.invocations);
            countFive.increment();
            extIP.set(null, countFive.invocations);
        });

        watcher.on('stop', function () {
            done();
        });

        watcher.start();

    });
    // test errors, use error.name


});