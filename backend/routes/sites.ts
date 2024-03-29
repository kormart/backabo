import {
    Workspace,
    LocalWorkspace,
    ConcurrentUpdateError,
    StackAlreadyExistsError,
    StackNotFoundError
} from "@pulumi/pulumi/automation";
import * as express from "express";
import { createPulumiProgram, createCustomProgram } from "./factory";
import { env } from 'process';
import { readFile } from 'fs/promises';
import { projectName } from './constants';

// TODO, get this from a global variable inside app-object;
// const projectName = "backabo";
// type Smorgasbord = {
//     dataset: any,
//     tool: any,
//     infra: any
// };

// serve the smorgasbord
export const smorgasbordHandler: express.RequestHandler = async (req, res) => {
    console.log("***log: get smorgasbord ");
    const data = await readFile('./routes/smorgasbord.json', 'utf8');
    const smorgasbord = JSON.parse(data);
    res.json({smorgasbord: smorgasbord});
};

// creates new sites
export const createHandler: express.RequestHandler = async (req, res) => {
    const projectName2 = req.app.locals.projectName;
    const stackName = req.body.envId;
    const envLifeTime = req.body.envLifeTime;
    let selectedIndices = req.body.selected;
    console.log("***log: create " + projectName2 + ", "+ stackName + ", " + envLifeTime + ", " + JSON.stringify(selectedIndices));
    const ws = await LocalWorkspace.create({workDir: env.PWD, projectSettings: { name: projectName, runtime: "nodejs" }});
    console.log("***log: workspace settings (cH) ", await ws.projectSettings());

    // get parameters for selection from smorgasbord
    const data = await readFile('./routes/smorgasbord.json', 'utf8');
    const smorgasbord = JSON.parse(data);
    // console.log("***log: smorgasbord: ", smorgasbord);
    Object.keys(selectedIndices).forEach(comp => {
        selectedIndices[comp] = parseInt(selectedIndices[comp])
    });
    const selected = {
        dataset: smorgasbord.dataset[selectedIndices.dataset], 
        tool: smorgasbord.tool[selectedIndices.tool], 
        infra: smorgasbord.infra[selectedIndices.infra], 
    };
    try {
        const startTime = new Date();
        // create a new stack
        const stack = await LocalWorkspace.createStack({
            stackName,
            projectName,
            // generate our pulumi program on the fly from the POST body (currying!)
            program: createPulumiProgram(selected, stackName),
        });
        // await stack.setConfig("azure-native:region", { value: "westeurope" });
        // deploy the stack, tailing the logs to console
        const upRes = await stack.up({ onOutput: console.info });
        // how to support native resources that are not included in pulumi providers
        // but still use pulumi as a backend for config state
        // we can create a stack with an empty pulumi program and execute code from the factory
        // what should be the delete action, just delete the stack
        const custom = createCustomProgram(selected, stackName);
        custom();
        const startupTime = ((Date.now() - startTime.getTime())/60000).toString(); // minutes
        // an env object collecting all params
        const envObjParams = {user: 'rise-ai-user-1', group: 'rise-ai-group-1', selection: JSON.stringify(selected), startTime: startTime.toISOString(), envLifeTime, startupTime};
        const envObjParamsString = JSON.stringify(envObjParams);
        // await ws.setConfig(stackName, "ns:startTime", {value: startTime.toISOString()});
        // await ws.setConfig(stackName, "ns:startupTime", {value: startupTime});
        await ws.setConfig(stackName, "ns:environment", {value: envObjParamsString});
        console.log("***log env params in config: ", envObjParamsString);
        res.json({ envId: stackName, startupTime });
        // res.json({ envId: stackName, envUrl: upRes.outputs.envUrl.value, startupTime });
    } catch (e) {
        if (e instanceof StackAlreadyExistsError) {
            res.status(409).send(`stack "${stackName}" already exists`);
        } else {
            res.status(500).send(e);
        }
    }
};
// lists all sites
export const listHandler: express.RequestHandler = async (req, res) => {
    var stacks: any[];
    var ws: any;
    try {
        // set up a workspace with only enough information for the list stack operations
        ws = await LocalWorkspace.create({workDir: env.PWD, projectSettings: {name: projectName, runtime: "nodejs" }});
        console.log("***log: workspace settings (lH) ", await ws.projectSettings());
    } catch(e) {
        console.log("***log: error LocalWorkspace create: ", e);
    }
    try {
        stacks = await ws.listStacks();
        // next line used to trigger error for testing purposes
        // const config = await ws.getAllConfig('dummy');
        console.log("*** log: listHandler, listStacks: (inside try) ", stacks);
    } catch(e) {
        console.log("***log: error listStacks: ", e);
        if (e instanceof StackNotFoundError) {
            res.status(404).send(`stack not found`);
            return;
        } else {
            res.status(500).send(e);
        }
    }
    try {
        const envs = await Promise.all(stacks.map(async s => {
            return {
                name: s.name, 
                stack: s,
                export: await ws.exportStack(s.name),
                outputs: await ws.stackOutputs(s.name), 
                configs: await ws.getAllConfig(s.name) 
            }; 
        }));
        // console.log("*** log: stack outputs: " + JSON.stringify(envs, null, '\t'));
        res.json({ envs: envs } );
    } catch (e) {
        res.status(500).send(e);
    }
};
// gets info about a specific site
export const getHandler: express.RequestHandler = async (req, res) => {
    const stackName = req.params.id;
    try {
        // select the existing stack
        const stack = await LocalWorkspace.selectStack({
            stackName,
            projectName,
            // don't need a program just to get outputs
            program: async () => { },
        });
        const outs = await stack.outputs();
        res.json({ id: stackName, url: outs.websiteUrl.value });
    } catch (e) {
        if (e instanceof StackNotFoundError) {
            res.status(404).send(`stack "${stackName}" does not exist`);
        } else {
            res.status(500).send(e);
        }
    }
};
// updates the content for an existing site
export const updateHandler: express.RequestHandler = async (req, res) => {
    const stackName = req.params.id;
    const content = req.body.content;
    try {
        // select the existing stack
        const stack = await LocalWorkspace.selectStack({
            stackName,
            projectName,
            // generate our pulumi program on the fly from the POST body
            program: createPulumiProgram(content.infra, stackName),
        });
        await stack.setConfig("aws:region", { value: "us-west-2" });
        // deploy the stack, tailing the logs to console
        const upRes = await stack.up({ onOutput: console.info });
        res.json({ id: stackName, url: upRes.outputs.websiteUrl.value });
    } catch (e) {
        if (e instanceof StackNotFoundError) {
            res.status(404).send(`stack "${stackName}" does not exist`);
        } else if (e instanceof ConcurrentUpdateError) {
            res.status(409).send(`stack "${stackName}" already has update in progress`)
        } else {
            res.status(500).send(e);
        }
    }
};
// deletes an environment
export const deleteHandler: express.RequestHandler = async (req, res) => {
    const stackName = req.body.envId;
    console.log('***log: delete ' + stackName);
    try {
        // select the existing stack
        const stack = await LocalWorkspace.selectStack({
            stackName,
            projectName,
            // don't need a program for destroy
            program: async () => { },
        });
        // deploy the stack, tailing the logs to console
        await stack.destroy({ onOutput: console.info });
        await stack.workspace.removeStack(stackName);
        res.json({ envId: stackName });
    } catch (e) {
        if (e instanceof StackNotFoundError) {
            res.status(404).send(`stack "${stackName}" does not exist`);
        } else if (e instanceof ConcurrentUpdateError) {
            res.status(409).send(`stack "${stackName}" already has update in progress`)
        } else {
            res.status(500).send(e);
        }
    }
};

// stop/start an environment
export const stopStartHandler: express.RequestHandler = async (req, res) => {
    const stackName = req.body.envId;
    const command = req.body.command;
    console.log('***log: stop start ' + stackName);


// design alt 1, use rest api
// POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/{containerGroupName}/stop?api-version=2021-10-01
}
