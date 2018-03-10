'use strict';

const Watcher = require('./lib/Watcher');


const getIP = require('util').promisify(require('external-ip')({
    timeout: 2000
}));

const watcher = new Watcher(getIP, 2000);

watcher.start();
