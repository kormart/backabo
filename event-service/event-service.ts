import {
    Workspace,
    LocalWorkspace,
    ConcurrentUpdateError,
    StackAlreadyExistsError,
    StackNotFoundError
} from "@pulumi/pulumi/automation";
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { WebSocketServer } from 'ws';
import { env } from 'process';

// type Request = {
//   body: string;
//   headers: { [key: string]: string };
//   method: string;
//   url: string;
//   ts: number;
// };

// I'm an event server using websocket to send out messages.
// Reading timing data from local pulumi state config data, 
// calculating countdown values to send out.
// And performing events, termination, stopping, alerting.

// TODO: I have to watch out for failure modes, where 2 copies of
// me are started and I schedule duplicate events for environments...

const projectName = "backabo";
let envs: any[];
let events: Event[];
const workDir = "/Users/martinko/Code/pulumi-typescript-dev/pulumiOverHttp-ts";

// this is the same initialization as in the backabo backend server
const initializeWorkspace = async () => {
    // set a working directory, where each stack has a yaml file holding config values
    // this ws value needs to be global (?)
    console.log("***log: using directory ", workDir);
    var workspace = await LocalWorkspace.create({workDir, projectSettings: { name: projectName, runtime: "nodejs" }});
    console.log("***log: workspace settings (initWorkspace) ", await workspace.projectSettings());
    // await ws.installPlugin("aws", "v4.0.0");
};

const readStackConfigs = async () => {
    const workspace = await LocalWorkspace.create({workDir, projectSettings: { name: projectName, runtime: "nodejs" }});
    console.log("***log: workspace settings (readStackConfig) ", await workspace.projectSettings());
    let stacks: any[] = [];
    try {
        stacks = await workspace.listStacks();
        // console.log("*** log: stack: (inside try) ", stacks);
    } catch(e) {
        console.log("***log: error: ", e);
    }
    // const envs = stacks.map(s => ({"name": s.name, "url": s.url, "expiryTime": "03:00"}) );
    // console.log("*** log: stack: (outside try) ", stacks);
    const stacksEmb = await Promise.all(stacks.map(async s => {
        return {
            name: s.name, 
            stack: s,
            export: await workspace.exportStack(s.name),
            outputs: await workspace.stackOutputs(s.name), 
            configs: await workspace.getAllConfig(s.name) 
        }; 
    }));
    return stacksEmb;
} 

type Event = {
    envName?: string,
    eventType?: string,
    eventTime?: Date
}

// I need to reconstruct all events, since I might come back from a restart
const calcEvents = (envs: any[]) => {
    return envs.map( env => {
        console.log("***log: env name ", env.name);
        // not all envs has config info
        if (!!env.configs['ns:environment']) {
            // console.log("***log env params in config: ", envObjParams);
            console.log("***log env params in config: ", env.configs['ns:environment'].value);
            const envObjParams = JSON.parse(env.configs['ns:environment'].value);
            const startTime = envObjParams.startTime;
            const envLifeTime = envObjParams.envLifeTime;
            // calculate timeout = startTime + envLifeTime
            // envLifetime is in minutes
            const eventTime = new Date(Date.parse(startTime) + envLifeTime*60000);      
            // or should we store stackLifeTime, it doesn't seem to matter
            console.log("***log: eventTime: ", eventTime.toISOString());
            return {envName: env.name, eventType: 'alert', eventTime};
        } else {
            return {};
        }
        }
    )
}

const scheduleEvents = (ws, events: Event[]) => {
    return events.map( (event: Event) => {
        if (!!event.eventType) {
            console.log("***log: schedule event ", event);
            // calculate time to event
            // mock-up 
            event.eventType = "delete";
            // const eventTime = "2022-08-29T13:31:00.495Z";
            const timeToEvent = event.eventTime.getTime() - Date.now(); // milliseconds
            const updateInterval = 1000; // one second
            console.log("***log: schedule event ", timeToEvent);
            // notify ui, ui either shows periodic updates (within the environment) 
            // and/or event notice ()
            const updater = setInterval(async () => {
                // STATE: 'running'
                const envTimerAllSeconds = (event.eventTime.getTime() - Date.now())/1000;
                const envTimerMinutes = Math.floor(envTimerAllSeconds/60);
                const envTimerSeconds = Math.floor(envTimerAllSeconds - envTimerMinutes * 60);
                const envTimer = envTimerMinutes.toString().padStart(2, '0') + ':' + envTimerSeconds.toString().padStart(2, '0');
                const req = {body: {envState: 'running', envName: event.envName, eventTime: envTimer}};
                // const req = {body: {envName: event.envName, envTimer}};
                ws.send(JSON.stringify(req));
            }, updateInterval);
            setTimeout(async () => {
                // NEW STATE: 'delete ongoing'
                // TODO: cancel the periodic update events
                // TODO: trigger refresh of UI
                console.log("***log: event ", event);
                // notify ui, ui either shows periodic updates (within the environment) 
                // and/or event notice ()
                clearInterval(updater);
                const req = {body: {envState: 'delete ongoing', envName: event.envName, eventTime: ''}};
                ws.send(JSON.stringify(req));
                // perform event, for example pulumi destroy
                if (event.eventType == 'delete') {
                    console.log('***log: delete ' + event.envName);
                    try {
                        // select the existing stack
                        const stack = await LocalWorkspace.selectStack({
                            stackName: event.envName,
                            projectName,
                            // don't need a program for destroy
                            program: async () => { }
                        });
                        // deploy the stack, tailing the logs to console
                        await stack.destroy({ onOutput: console.info });
                        await stack.workspace.removeStack(event.envName);
                        // NEW STATE: 'delete completed'
                        const req = {body: {envState: 'delete completed', envName: event.envName, eventTime: ''}};
                        ws.send(JSON.stringify(req));
                    } catch (e) {
                    }
                }
            }, timeToEvent);
        }
    })
}
// install necessary plugins once upon boot
// initializeWorkspace();
// console.log("***log: workspace settings (iW) ", globalThis.ws.projectSettings());

const server = createServer({
//   cert: readFileSync('/path/to/cert.pem'),
//   key: readFileSync('/path/to/key.pem')
});
const wss = new WebSocketServer({ server });

wss.on('connection', async (ws) => {
  console.log('socket opened');
  let envs = await readStackConfigs();
  let events = calcEvents(envs);
  scheduleEvents(ws, events);
//   console.log('readStackConfig', envs);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

// schedule test messages to first environment
//   const env = envs[0];
//   setInterval(() => {    
//     console.log('new mess');
//     const now = new Date();
//     const timeString = now.getHours().toString().padStart(2, '0')+':'+now.getMinutes().toString().padStart(2, '0')+':'+now.getSeconds().toString().padStart(2, '0');
//     const req = {body: {envName: env.name, eventTime: timeString}};
//     ws.send(JSON.stringify(req));
//   }, 1000);

//   setTimeout(() => {
//     console.log("socket closed");
//     ws.close(1000, "Bye!");
//     process.exit();
//   }, 45000);
});

server.listen(8787);

// state-machine and protocol specification
// msg always includes envName
// state: 'running' (msg (periodic) to ui: {envState: 'running', 'timeToEvent', 'eventType'})
// state: 'delete ongoing' (msg to ui: {envState: 'deletion ongoing'})
// state: 'delete completed' (msg to ui: {envState: 'deletion completed'})
// state: 'stop ongoing'
// state: 'stopped'