'use strict';

const EventEmitter = require('events');
const extIp = require('external-ip');

module.exports = class Watcher extends EventEmitter {

    static isPositiveInteger(value) {
        return Number.isInteger(value) && value > 0;
    }

    constructor(userConfig = {}) {
        super();
        const defaultConfig = {
            pollingInterval: 8.64e+7, //One day
            verbose: false,
            externalIp: {}
        };

        // Merge user provided config with defaults
        const config = Object.assign(defaultConfig, userConfig);

        // Check if interval time is valid
        if (!Watcher.isPositiveInteger(config.pollingInterval)) {
            throw new Error('pollingInterval must be a possitive integer');
        }

        this.pollingInterval = config.pollingInterval;
        this.getIP = extIp(config.externalIp);
        this.log = config.verbose ? console.log.bind(console, '[ip-monitor]: ') : () => {};
        this.previousIp = null;
        this.started = false;
        this.timeoutId = null;
    }

    poll() {
        this.getIP((error, ip) => {
            // .stop has been invoked after poll() but before this callback, bail out
            if (!this.started) {
                return;
            }

            // Prepare to poll again, this must be done before emitting any events
            // otherwise the timeout will not be cleared if .stop is called inside the event handler
            this.timeoutId = setTimeout(this.poll.bind(this), this.pollingInterval);

            // If an error has been encountered, emit it but do not stop polling
            if (error) {
                this.emit('error', error);
            }

            // Got an IP, awesome, emit the change event if required
            this.log('Got ip:', ip);
            if (ip !== this.previousIp) {
                this.emit('change', this.previousIp, ip);
                this.previousIp = ip;
            }

        });
    }

    start() {
        if (this.started) {
            return this.emit('error', 'Watcher already started');
        }

        this.started = true;
        this.poll();
    }

    stop() {
        this.log('stopping');
        this.started = false;
        clearTimeout(this.timeoutId);
    }

};
