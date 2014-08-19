ip-monitor
==========

A node.js library to monitor your external ip for changes
check examples/basic.js for an alpha implementation
This is a work in progress.

Probably its going to look like this
```javascript
var ipMon = require('ip-monitor');

var watcher = ipMon.createWatcher({
    interval: 60*1000,
    externalIP: {/*Config passed to external-ip*/}
});

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

```