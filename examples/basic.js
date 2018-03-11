'use strict';
const IpMonitor = require('../index');

const ipMonitor = new IpMonitor();

ipMonitor.on('change', (prevIp, newIp) => {
    console.log(`IP changed from ${prevIp} to ${newIp}`);
});


ipMonitor.on('error', (error) => {
    console.error(error);
});

ipMonitor.start();
