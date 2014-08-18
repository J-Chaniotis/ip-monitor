'use strict';

var extIP = require('external-ip');
var EventEmitter = require('events').EventEmitter;
var util = require('util');


var Watcher = function (config) {
    this.prevIP = null;
    this.IP = null;

};

util.inherits(Watcher, EventEmitter);

var W = Watcher.prototype;

W.start = function () {

};

W.stop = function () {

};

W.getIP = function () {

};

module.exports.Watcher = Watcher;