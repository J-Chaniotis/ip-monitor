'use strict';
var ipMon = require('../index');

var watcher = ipMon.createWatcher({/*config*/});

watcher.on('ipChanged', function (prevIP, newIP) {
    console.log('Prev IP: %s, New IP: %s', prevIP, newIP);
});

// Handle errors better.
watcher.on('error', function (error) {
    //throw new Error(error);
    console.log('Error: ' + error);

});

watcher.on('start', function (IP) {
    console.log('Starting... IP: %s', IP);
    setTimeout(function () {
        //watcher.stop();
    }, 10000);
});

watcher.on('stop', function () {
    console.log('Stopping...');
});

// will trigger internal check too.
watcher.getIP(function (IP) {
    console.log('Le IP iz: %s', IP);
});


watcher.start();
