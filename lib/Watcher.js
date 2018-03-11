'use strict';

const EventEmitter = require('events');
const { promisify } = require('util');
const extIp = require('external-ip');

module.exports = class Watcher extends EventEmitter {
    constructor(config = {}) {
        super();
        
        config.pollingInterval = config.pollingInterval || 8.64e+7; //One day
        if (!this.isPositiveInteger(config.pollingInterval)) {
            throw new Error('Invalid polling pollingInterval');
        }
        this.pollingInterval = config.pollingInterval;
        
        this.getIP = promisify(extIp(config.externalIp));
        this.log = config.verbose ? console.log.bind(console, '[info]: ') : () => {};
        this.previousIp = null;
        this.started = false;
    }

    isPositiveInteger(value) {
        return Number.isInteger(value) && value > 0;
    }

    resolveAfterTime(time) {
        this.log(`Waiting for ${this.pollingInterval} ms`);
        return new Promise(resolve => {
            // .stop has been invoked already, bail out
            if (!this.started) {
                return resolve();
            }

            const timeoutId = setTimeout(() => {
                // .stop has never been invoked, clean up the listener.
                this.removeListener('_cancel', cancel);
                resolve();
            }, time);

            // .stop has been invoked and the timeout has not finished. resolve immediately
            const cancel = () => {
                clearTimeout(timeoutId);
                resolve();
            };

            this.once('_cancel', cancel);
        });
    }

    async poll() {
        try {
            const ip = await this.getIP();
            this.log('Got ip:', ip);
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
            await this.poll();
            await this.resolveAfterTime(this.pollingInterval);
        }
    }

    stop() {
        this.started = false;
        this.emit('_cancel');
    }

};
