'use strict';

/*globals it, describe*/

const IpMonitor = require('../index');
const expect = require('chai').expect;
const net = require('net');
const isIP = (str) => net.isIP(str) !== 0;

describe('index.js test', function () {


    it('Should emit a change event after the first start() invocation', function (done) {

        this.timeout(5000);

        const ipMonitor = new IpMonitor({verbose: true});

        ipMonitor.on('change', (previousIp, newIp) => {
            expect(previousIp).to.equal(null);
            expect(isIP(newIp)).to.equal(true);
            ipMonitor.stop();
            done();
        });

        ipMonitor.on('error', (error) => {
            ipMonitor.stop();
            done(error);
        });

        ipMonitor.start();
    });

    it('Should throw an error if configuration is invalid', (function (done) {
        try {
            new IpMonitor({
                pollingInterval: 'BATMAN'
            });
        } catch (error) {
            expect(error).to.be.instanceof(Error);
            done();
        }


    }));

    it('Should throw an error if external-ip configuration is invalid', (function (done) {
        try {
            new IpMonitor({
                externalIp: {
                    replace: 'BATMAN'
                }
            });
        } catch (error) {
            expect(error).to.be.instanceof(Error);
            done();
        }
    }));


});