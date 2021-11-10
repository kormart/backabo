import {
    LocalWorkspace,
    ConcurrentUpdateError,
    StackAlreadyExistsError,
    StackNotFoundError
} from "@pulumi/pulumi/automation";
import * as express from "express";
// import flash from "express-flash";
// import session from "express-session";
// import * as resources from "@pulumi/azure-native/resources";
// import * as pulumi from "@pulumi/pulumi";
import {resources, containerinstance} from "@pulumi/azure-native";

export const register = (app: express.Application) => {

    // interface Site {
    //     name: string;
    //     url: string;
    // }
    // Pulumi info
    const projectName = "backabo";
    const stackNameTest = 'backabo-test-stack';

    // Azure account details
    // sub="d818cbed-274b-4240-9872-8761fe9e488c"
    // storageAccountName="riseaicenter9576892428"
    // resourceGroupNameStorage="rise-ai-center"

    // Site info
    const subject = 'Backabo';
    const serviceName = 'AI/ML Self-Service Platform';
    const sites = [
        {name: 'Hopsworks on ICE (Dummy-line 1)', url: 'hops_ice.html'},
        {name: 'Kubeflow on Azure (Dummy-line 2)', url: 'kube_azure.html'}
        ];
    const imageName2 = "kormart/tf-jupyterlab:latest"

    // this function defines a pulumi program for
    // a Azure ACI container
    const createPulumiProgram = (name: string, imageName: string) => async () => {

        const resourceGroupNameBase="rise-ai-center-test";
        const resourceGroupLocation="westeurope";

        const resourceGroup = new resources.ResourceGroup(resourceGroupNameBase, {
            location: resourceGroupLocation,
            // resourceGroupName: resourceGroupNameBase,
        });
        const containerGroup = new containerinstance.ContainerGroup("containerGroup", {
            containerGroupName: "containerGroup"+name,
            containers: [{
                command: [],
                environmentVariables: [],
                image: imageName,
                name,
                ports: [{
                    port: 8888,
                }],
                resources: {
                    requests: {
                        cpu: 2.0,
                        // gpu: {
                        //     count: 1,
                        //     sku: "K80",
                        // },
                        memoryInGB: 3,
                    },
                },
                volumeMounts: [
                    {
                        mountPath: "/tf/file-share",
                        name: "volume1",
                        readOnly: false,
                    },
                ],
            }],
            // diagnostics: {
            //     logAnalytics: {
            //         logType: "ContainerInsights",
            //         metadata: {
            //             "test-key": "test-metadata-value",
            //         },
            //         workspaceId: "workspaceid",
            //         workspaceKey: "workspaceKey",
            //     },
            // },
            // dnsConfig: {
            //     nameServers: ["1.1.1.1"],
            //     options: "ndots:2",
            //     searchDomains: "cluster.local svc.cluster.local",
            // },
            // identity: {
            //     type: "SystemAssigned, UserAssigned",
            //     userAssignedIdentities: {
            //         "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity-name": {},
            //     },
            // },
            imageRegistryCredentials: [],
            ipAddress: {
                dnsNameLabel: "dnsnamelabel1",
                ports: [{
                    port: 8888,
                    protocol: "TCP",
                }],
                type: "Public",
            },
            location: "westeurope",
            // networkProfile: {
            //     id: "test-network-profile-id",
            // },
            osType: "Linux",
            resourceGroupName: resourceGroup.name,
            volumes: [
                {
                    azureFile: {
                        shareName: "azureml-filestore-a3577153-b708-4da7-ba96-d3d8997a0cac",
                        storageAccountKey: "MriEjRBX2ZUlZicz9cUzBhjEip9+W0urUYpLbza9JlnWO6NRRohqlymquhcjYIav7VvvjxhQgrfjipP5INjhIw==",
                        storageAccountName: "riseaicenter9576892428",
                    },
                    name: "volume1",
                },
            ],
        });

        return {
            result: containerGroup.ipAddress.ip,
        };
    };

    // creates new sites
    const createHandler: express.RequestHandler = async (req, res) => {
        if (req.method === 'POST') {
            // console.log('log: ' + req.body['site-id'])
            const stackName = req.body['site-id'];
            const content = req.body['site-content'] as string;
            try {
                // create a new stack
                // console.log('log: '+stackName)
                const stack = await LocalWorkspace.createStack({
                    stackName,
                    projectName,
                    // generate our pulumi program on the fly from the POST body
                    program: createPulumiProgram(stackName, imageName2),
                });
                await stack.setConfig("azure-native:region", { value: "westeurope" });
                // deploy the stack, tailing the logs to console
                const upRes = await stack.up({ onOutput: console.info });
                // res.json({ id: stackName, url: upRes.outputs.websiteUrl.value });
                req.flash('vError',`Successfully created site "${stackName}", with ip address ${upRes.outputs.result.value}!`);
            } catch (e) {
                if (e instanceof StackAlreadyExistsError) {
                    req.flash('vError',`Error: Site with name "${stackName}" already exists`);
                    return res.redirect(301, '/sites');
                } else {
                    req.flash('vError',`Error: "${e}" `);
                    return res.redirect(301, '/sites');
                }
            }
            return res.redirect(301,'/sites');
        } else {
            res.render('sites/create', {
                serviceName, subject,
                expressFlash: req.flash('vError', 'Error: Other error')
            });
        };
    };

    const listHandler: express.RequestHandler = async (req: any, res) => {
        let stacks: any[];
        try {
            // set up a workspace with only enough information for the list stack operations
            const ws = await LocalWorkspace.create({ projectSettings: { name: projectName, runtime: "nodejs" } });
            stacks = await ws.listStacks();
        } catch (e) {
            let errorMessage: string='';
            // if (e instanceof StackAlreadyExistsError) {
                errorMessage=e;
                // errorMessage=`stack "${stackName}" already exists`;
            // } else {
            //     errorMessage=e;
            // }
        }
        res.render("sites", {
            serviceName, subject,
            sites: stacks,
            expressFlash: req.flash('vError')
        });
    };

    // update a site
    const updateHandler: express.RequestHandler = async (req, res) => {
        console.log('log: ' + req.params.id)
        const stackName = req.params.id;
        return res.redirect(301,'/sites');
    };

    // deletes a site
    const deleteHandler: express.RequestHandler = async (req, res) => {
        console.log('log: ' + req.body['name']);
        const stackName = req.body['name'];
        try {
            // select the existing stack
            const stack = await LocalWorkspace.selectStack({
                stackName,
                projectName,
                // don't need a program for destroy
                program: async () => { return; },
            });
            // deploy the stack, tailing the logs to console
            await stack.destroy({ onOutput: console.info });
            await stack.workspace.removeStack(stackName);
            req.flash('vError',`Successfully deleted site "${stackName}"`);
            } catch (e) {
                if (e instanceof StackNotFoundError) {
                    req.flash('vError',`Error: Site with name "${stackName}" does not exist`);
                    return res.redirect(301, '/sites');
                } else {
                    req.flash('vError',`Error: "${e}" `);
                    return res.redirect(301, '/sites');
                }
            }
        return res.redirect(301,'/sites');
    };

    const ensurePlugins = async () => {
        const ws = await LocalWorkspace.create({});
        await ws.installPlugin("azure-native", "v1.45.0");
    };
    // install necessary plugins once upon boot
    ensurePlugins();

    // setup the routes
    app.get("/", (req: any, res) => {
        res.render("index", {
            subject, serviceName, link: 'https://ri.se'});
    });
    app.post("/sites/create", createHandler);
    app.get("/sites/create", createHandler);
    app.get("/sites", listHandler);
    app.get("/sites/update", updateHandler);
    app.post("/sites/delete", deleteHandler);
};

    // // Create a bucket and expose a website index document
    // const siteBucket = new s3.Bucket("s3-website-bucket", {
    //     website: {
    //         indexDocument: "index.html",
    //     },
    // });

    // // here our HTML is defined based on what the caller curries in.
    // const indexContent = content;

    // // write our index.html into the site bucket
    // let object = new s3.BucketObject("index", {
    //     bucket: siteBucket,
    //     content: indexContent,
    //     contentType: "text/html; charset=utf-8",
    //     key: "index.html"
    // });

    // // Create an S3 Bucket Policy to allow public read of all objects in bucket
    // function publicReadPolicyForBucket(bucketName): PolicyDocument {
    //     return {
    //         Version: "2012-10-17",
    //         Statement: [{
    //             Effect: "Allow",
    //             Principal: "*",
    //             Action: [
    //                 "s3:GetObject"
    //             ],
    //             Resource: [
    //                 `arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
    //             ]
    //         }]
    //     };
    // }

    // // Set the access policy for the bucket so all objects are readable
    // let bucketPolicy = new s3.BucketPolicy("bucketPolicy", {
    //     bucket: siteBucket.bucket, // refer to the bucket created earlier
    //     policy: siteBucket.bucket.apply(publicReadPolicyForBucket) // use output property `siteBucket.bucket`
    // });

    // return {
    //     websiteUrl: siteBucket.websiteEndpoint,
    // };
