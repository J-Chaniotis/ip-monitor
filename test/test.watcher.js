'use strict';
/* globals it, describe, beforeEach */

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
            if (this.invocations === maxCount) {
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


    it('should emit "IP:change" and "IP:success" when watcher.poll() is called for the first time', function (done) {

        var countTwo = counter(2, done);
        extIP.set(null, '10.10.10.10');

        watcher.on('IP:change', function (prevIP, IP) {
            expect(IP).to.equal('10.10.10.10');
            expect(prevIP).to.equal(null);
            countTwo.increment();
        });

        watcher.on('IP:success', function (IP) {
            expect(IP).to.equal('10.10.10.10');
            countTwo.increment();
        });

        watcher.poll();

    });

    it('should start and stop watching after n changes', function (done) {

        var n = 5;
        var count = counter(n, function () {
            watcher.stop();
            expect(watcher.isWatching()).to.equal(false);
            done();
        });
        // Use invocations as ip value, set initial value
        extIP.set(null, count.invocations);

        watcher.on('IP:change', function (prevIP, newIP) {
            expect(newIP).to.equal(count.invocations);
            count.increment();
            // update the fake ip
            extIP.set(null, count.invocations);
        });

        watcher.start();

    });

   
    it('should emit "IP:error" when extIP yields an error', function (done) {
        extIP.set('Booom', null);

        watcher.on('IP:error', function (err) {
            expect(err).to.equal('Booom');
            watcher.stop();
            done();
        });

        watcher.on('IP:success', function () {
            throw new Error('IP:success should not fire!');
        });
        watcher.on('IP:change', function () {
            throw new Error('IP:change should not fire!');
        });

        watcher.start();

    });


    it('should emit error if .stop is called and the watcher has not started', function (done) {
        watcher.on('error', function (error) {
            expect(error).to.equal('Not started');
            done();
        });
        watcher.stop();
    });

    it('should emit error if .start is called and the watcher has been already started', function (done) {
        extIP.set(null, '10.10.10.10');

        watcher.on('error', function (error) {
            expect(error).to.equal('Already started');
            watcher.stop();
            done();
        });
        watcher.start().start();
    });


});