const { resolve } = require('path');
const { CommandBus } = require('../dist/CommandBus');

const cwd = process.cwd();

module.exports = function(RED) {
    function BusinessLogic(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const logicPath = config['logicPath'];
        if (!logicPath) {
            this.status({ fill: 'red', shape: 'ring', text: 'invalid path' });
            return;
        }
        const absoluteLogicPath = logicPath
            ? resolve(cwd, logicPath)
            : '';
        if (!absoluteLogicPath) {
            this.status({ fill: 'red', shape: 'ring', text: 'invalid path' });
            return;
        }
        let bl;
        try {
            bl = require(absoluteLogicPath);
        } catch (error) {
            this.status({ fill: 'red', shape: 'ring', text: 'Error while loading the file' });
            return;
        }
        if (!(bl instanceof CommandBus)) {
            this.status({ fill: 'red', shape: 'ring', text: typeof(bl) + ' is not a CommandBus instance.' });
            return;
        }
        this.status({ fill: 'green', shape: 'dot', text: 'connected' });

        node.on('input', (msg, send, done) => {
            const onSuccess = businessResponse => {
                (send ? send : node.send)({
                    ...msg,
                    payload: businessResponse
                });
                if (done) {
                    done();
                };
            };
            const onError = error => {
                if (done) {
                    done(error);
                } else {
                    node.error(error, msg);
                }
            };
            bl.handleEvent(
                config['eventName'] ? config['eventName'] : msg.eventName,
                msg.payload
            ).then(onSuccess, onError);
        })
    }
    RED.nodes.registerType("business-logic", BusinessLogic);
};
