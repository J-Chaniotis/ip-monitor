# ip-monitor
[![Build Status](https://travis-ci.org/J-Chaniotis/ip-monitor.svg?branch=master)](https://travis-ci.org/J-Chaniotis/ip-monitor)
[![dependencies Status](https://david-dm.org/j-Chaniotis/ip-monitor/status.svg)](https://david-dm.org/j-Chaniotis/ip-monitor)
[![npm version](https://badge.fury.io/js/ip-monitor.svg)](https://badge.fury.io/js/ip-monitor)


A node.js library to monitor your external ip for changes

## Installation

`npm install ip-monitor`

## Usage
basic
```javascript
const IpMonitor = require('ip-monitor');
const ipMonitor = new IpMonitor();

ipMonitor.on('change', (prevIp, newIp) => {
    console.log(`IP changed from ${prevIp} to ${newIp}`);
});

ipMonitor.on('error', (error) => {
    console.error(error);
});

ipMonitor.start();


```

with custom configuration
```javascript
const IpMonitor = require('ip-monitor');
const ipMonitor = new IpMonitor({
    pollingInterval: 36000,
    verbose: true,
    externalIp: {
        timeout: 1000,
        getIP: 'parallel',
        services: ['http://ifconfig.co/x-real-ip', 'http://icanhazip.com/'],
        replace: true,
        verbose: true
    }
});

ipMonitor.on('change', (prevIp, newIp) => {
    console.log(`IP changed from ${prevIp} to ${newIp}`);
});

ipMonitor.on('error', (error) => {
    console.error(error);
});

ipMonitor.start();
```


## Configuration
`new IpMonitor([config])` accepts a configuration object with the following optional properties:
* <b>`pollingInterval: <Integer>`:</b> how often to poll for ip changes, default 1 day
* <b>`externalIp: <Object>`:</b> configuration passed directly to [`external-ip`](https://github.com/J-Chaniotis/external-ip/blob/master/README.md)

## Methods
* <b>`.start()`:</b> start watching
* <b>`.stop()`:</b> stop watching
* <b>`.poll()`:</b> poll for ip manually

## Events
* <b>`change`:</b> fired when the external ip has changed. it will also fire the first time `.start()` or `.poll()` are invoked.
* <b>`error`:</b> typical error handling here

## Test
Change your working directory to the project's root, `npm install` to get the development dependencies and then `npm test`