var ipMon = require('../index');

var watcher = ipMon.createWatcher({/*config*/});

watcher.on('ipChanged', function (prevIP, newIP) {

});

watcher.on('error', function (error) {

});

watcher.on('start', function (ip) {

});

watcher.on('stop', function () {

});

watcher.getIP(function (error, ip) {

});


watcher.start();

watcher.stop();