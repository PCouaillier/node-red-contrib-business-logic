# BusinessLogic

## What is this node for ?

This node is a bridge beetween node-red and your business logic.

## How ?

This bridge provides a node which import a js.

The JS file must export a CommandBus (defined by this package).

With this CommandBus the node will be able send events and pass response inside the msg.

Exemple:
```
// bl.js
const { CommandBus } = require('node-red-contrib-business-logic');
const commandBus = new CommmandBus();
commandBus.addEventHandler('MyEvent', async (eventName, payload) => ...);
...
module.exports = commandBus;
```
