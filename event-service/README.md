# Backabo event service

This is a websocket server that reads Pulumi stack data and sends messages. 

At the end of event-service.ts, there is a brief specification of the state machine and protocol for this.

// state-machine and protocol specification
// msg always includes envName
// state: 'running' (msg (periodic) to ui: {envState: 'running', 'timeToEvent', 'eventType'})
// state: 'delete ongoing' (msg to ui: {envState: 'deletion ongoing'})
// state: 'delete completed' (msg to ui: {envState: 'deletion completed'})
// state: 'stop ongoing'
// state: 'stopped'