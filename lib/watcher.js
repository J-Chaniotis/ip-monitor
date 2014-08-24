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

W._checkNewIP = function (IP) {
    //console.log('Checking: %s', IP);
    if (IP && IP !== this.IP) {
        this.prevIP = this.IP;
        this.IP = IP;
        this.emit('ipChanged', this.prevIP, this.IP);
    }
};
// When half of a function is 'this.' Kill it with fire!
W._watch = function () {
    this.timeout = setTimeout(function () {
        this.getIP(this._watch.bind(this));
    }.bind(this), this.config.polling);
};

W.start = function () {
    if (this.timeout) {
        this.emit('error', 'Already started');
    }

    this.getIP(function (IP) {
        this._watch();
        this.emit('start', IP);
    }.bind(this));
};

W.stop = function () {
    if (!this.timeout) {
        this.emit('error', 'Not started');
    } else {
        clearTimeout(this.timeout);
        this.timeout = null;
        this.emit('stop');

    }
};

W.getIP = function (cb) {
    this._getIP(function (err, IP) {
        //failed to get an ip
        if (err) {
            this.emit('error', err);
        }
        this._checkNewIP(IP);
        cb(IP);

    }.bind(this));
};

module.exports.Watcher = Watcher;