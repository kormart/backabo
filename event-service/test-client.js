import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8787');

ws.on('open', function open() {
  ws.send('message from client');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

ws.on('close', function message(data) {
    console.log('closed from other end');
  });