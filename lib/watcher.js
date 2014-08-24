'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');


var Watcher = function (getIP, config) {

    this.config = config;
    this._getIP = getIP;

    this.timeout = null;
    this.prevIP = null;
    this.IP = null;

};

util.inherits(Watcher, EventEmitter);

var W = Watcher.prototype;

W._watch = function () {
    this.timeout = setTimeout(function () {
        this.getIP(this._watch.bind(this));
    }.bind(this), this.config.polling);
};

W.hasStarted = function () {
    return !!this.timeout;
};

W.start = function () {
    if (this.hasStarted()) {
        return this.emit('error', 'Already started');
    }

    this.getIP(function (IP) {
        this._watch();
        this.emit('start', IP);
    }.bind(this));
};

W.stop = function () {
    if (!this.hasStarted()) {
        return this.emit('error', 'Not started');
    }
    clearTimeout(this.timeout);
    this.timeout = null;
    this.emit('stop');

};

W.getIP = function (cb) {
    this._getIP(function (err, IP) {
        //failed to get an ip
        if (err) {
            return this.emit('IPError', err);
        }
        cb(IP);
        if (IP !== this.IP) {
            this.prevIP = this.IP;
            this.IP = IP;
            this.emit('ipChanged', this.prevIP, this.IP);
        }

    }.bind(this));
};

module.exports.Watcher = Watcher;