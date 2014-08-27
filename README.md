#ip-monitor [![Build Status](https://travis-ci.org/J-Chaniotis/ip-monitor.svg)](https://travis-ci.org/J-Chaniotis/ip-monitor) [![Dependency Status](https://david-dm.org/j-Chaniotis/ip-monitor.svg)](https://david-dm.org/j-Chaniotis/ip-monitor)


A node.js library to monitor your external ip for changes

## Installation
`npm install ip-monitor`

## Usage
basic
```javascript
'use strict';
var ipMon = require('ip-monitor');

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
thats why you may want to handle it differently than regular errors.
*/
watcher.on('IP:error', function (error) {
    console.log('Cant get external IP: ' + error);
});

watcher.on('IP:success', function (IP) {
    console.log('Got IP: %s', IP);
});


watcher.start();

```

with custom configuration
```javascript
var watcher = ipMon.createWatcher({
    polling: 10000,
    externalIP: {
        timeout: 1000,
        getIP: 'parallel',
        services: ['http://ifconfig.co/x-real-ip', 'http://icanhazip.com/'],
        replace: true
    }
});
```

##API

### Configuration
`ipmon.createWatcher([config])` accepts a configuration object with the following optional properties:
* ** `polling: <Integer>`: ** how often to poll for ip changes, default 20000ms
* ** `externalIP: <Object>`: ** configuration passed directly to [`external-ip`](https://github.com/J-Chaniotis/external-ip/blob/master/README.md)


### Events
//todo
* <b>`IP:success`: </b>
* **`IP:change`: **
* **`IP:error`: **


### Methods
* **`.start()`: ** start watching
* **`.stop()`: ** stop watching
* **`.poll()`: ** poll for ip manually
* **`.isWatching()`: ** check if ip-monitor has started