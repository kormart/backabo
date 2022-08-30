import { createServer } from 'http';
import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';

// type Request = {
//   body: string;
//   headers: { [key: string]: string };
//   method: string;
//   url: string;
//   ts: number;
// };

let counter = 0;

const server = createServer({
//   cert: readFileSync('/path/to/cert.pem'),
//   key: readFileSync('/path/to/key.pem')
});
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log('socket opened');
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  setInterval(() => {    
    console.log('new mess');
    counter += 1;
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0')+':'+now.getMinutes().toString().padStart(2, '0')+':'+now.getSeconds().toString().padStart(2, '0');
    const req = {body: 'event ' + counter.toString() + ' ' + timeString};
    ws.send(JSON.stringify(req));
  }, 1000);

  setTimeout(() => {
    console.log("socket closed");
    ws.close(1000, "Bye!");
    process.exit();
  }, 15000);
});

server.listen(8787);