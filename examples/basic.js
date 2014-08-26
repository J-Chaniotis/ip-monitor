'use strict';
var ipMon = require('../index');

var watcher = ipMon.createWatcher();

watcher.on('IP:change', function (prevIP, newIP) {
    console.log('Prev IP: %s, New IP: %s', prevIP, newIP);
});

/*
Generic error event
*/
watcher.on('error', function (error) {
    throw error;
});

/*
Seperate event for ip error handling.
It will fire when the connection has been lost, e.g your router is restarting,
thats why you may want to handle it differently than other errors.
*/
watcher.on('IP:error', function (error) {
    console.log('Cant get external IP: ' + error);
});

watcher.on('IP:success', function (IP) {
    console.log('Got IP: %s', IP);
});


watcher.start();