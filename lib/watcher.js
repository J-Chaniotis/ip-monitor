'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');


var Watcher = function (getIP, config) {

    this.config = config;
    this.timeout = null;
    this.prevIP = null;
    this.IP = null;


    this.poll = function () {
        getIP(function (err, IP) {
            if (this.isWatching()) {
                this.timeout = setTimeout(function () {
                    this.poll();
                }.bind(this), this.config.polling);
            }

            return this.emit.apply(this, err ? ['IP:error', err] : ['IP:success', IP]);
        }.bind(this));
    };

    this.on('IP:success', function (IP) {
        if (IP !== this.IP) {
            this.prevIP = this.IP;
            this.IP = IP;
            this.emit('IP:change', this.prevIP, this.IP);
        }
      
    }.bind(this));

};

util.inherits(Watcher, EventEmitter);

var W = Watcher.prototype;


W.isWatching = function () {
    return !!this.timeout;
};


W.start = function () {
    if (this.isWatching()) {
        return this.emit('error', 'Already started');
    }
    this.timeout = true;
    this.poll();
    return this;
};

W.stop = function () {
    if (!this.isWatching()) {
        return this.emit('error', 'Not started');
    }
    clearTimeout(this.timeout);
    this.timeout = null;
    return this;
};


module.exports.Watcher = Watcher;