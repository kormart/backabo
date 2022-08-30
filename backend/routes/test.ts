import {
    Workspace,
    LocalWorkspace,
    ConcurrentUpdateError,
    StackAlreadyExistsError,
    StackNotFoundError
} from "@pulumi/pulumi/automation";
import * as express from "express";

// end-point to test things
export const testHandler: express.RequestHandler = async (req, res) => {
    const stackName = req.body.envId;
    const projectName = "backabo";
    console.log('***log: test ' + stackName);
    try {
        // select the existing stack
        const stack = await LocalWorkspace.selectStack({
            stackName,
            projectName,
            // don't need a program for destroy
            program: async () => { 
                // testing get
                // const getResults = await containerinstance.getContainerGroup({containerGroupName: "containerGrouprise-test-aci-88", resourceGroupName: "rise-ai-center-test5c40a7b2" });
                // determine if stack is Azure ACI or ICE, and choose how to get accessToken accordingly
                // this is the Azure variant
                // const getResults = await authorization.getClientToken();
                // const accessToken = getResults.token;
                // console.log("***log: test pulumi program: ", accessToken);
                // return {
                //     accessToken                    
                // }
            },
        });
        // get the accessToken from the pulumi computation
        // once this is done, we only have to redo it after expiryTime has passed
        const upRes = await stack.up({ onOutput: console.info });
        // all these parameters have to be retreived from pulumi stored output 
        // const accessToken = upRes.outputs.accessToken.value;
        // console.log("***log: test: accessToken", accessToken);
        const subscriptionId="d818cbed-274b-4240-9872-8761fe9e488c"
        const resourceGroupName="rise-ai-center-test5c40a7b2"
        const containerGroupName="containerGrouprise-test-aci-88"
        const containerName="rise-test-aci-88"
        // construct URL for getting logs from ACI
        const url = `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.ContainerInstance/containerGroups/${containerGroupName}/containers/${containerName}/logs?api-version=2021-09-01`;
        // const url = "http://localhost:1337/ping"
        console.log("***log: test: url: ", url);
        // get logs, including accessToken in the headers
        let resLogsParsed = '';
        // try {
        //     let resLogs = await fetch(url, {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': 'Bearer ' + accessToken
        //         },
        //         // body: JSON.stringify({
        //         //     envId: environment.name,
        //         // })
        //     });
        //     // console.log("***log: test: res: ", resLogs);
        //     const resLogsParsed = await resLogs.json();
        //     console.log("***log: test: res: ", resLogsParsed);
        // } catch(e) {
        //     console.error(e);
        // }
        res.json({ envId: stackName, resLogs: resLogsParsed });
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
