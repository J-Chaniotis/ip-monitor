'use strict';

const EventEmitter = require('events');

module.exports = class Watcher extends EventEmitter {
    constructor(getIP, pollingInterval) {
        super();

        this.getIP = getIP;
        this.pollingInterval = pollingInterval;
        this.previousIp = null;
        this.started = false;
    }

    resolveAfterTime(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    async poll() {
        try {
            const ip = await this.getIP();
            console.log('The IP is: %s', ip);
            if (ip !== this.previousIp) {
                this.emit('change', this.previousIp, ip);
                this.previousIp = ip;
            }
        } catch (error) {
            this.emit('error', error);
        }
    }

    async start() {
        if (this.started) {
            return this.emit('error', 'Watcher already started');
        }

        this.started = true;
        while (this.started) {
            this.poll();
            await this.resolveAfterTime(this.pollingInterval);
        }
    }

    stop() {
        this.started = false;
    }

};