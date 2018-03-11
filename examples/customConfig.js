'use strict';
const IpMonitor = require('../index');

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