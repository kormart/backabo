import {
    Workspace,
    LocalWorkspace,
    ConcurrentUpdateError,
    StackAlreadyExistsError,
    StackNotFoundError
} from "@pulumi/pulumi/automation";
import * as express from "express";
import * as cors from "cors";
import * as path from "path";
import * as https from 'https';
import { env } from 'process';
import * as test from "./routes/test";
import * as sites from "./routes/sites";

// TODO, put this in a global variable inside app-object;
const projectName = "backabo";

const initialRuntimeTests = async () => {
    // try to trigger as many setup failures as possible that should not reach the users
    // set a working directory, where each stack has a yaml file holding config values
    console.log("***log: using directory ", env.PWD);
    var ws = await LocalWorkspace.create({workDir: env.PWD, projectSettings: { name: projectName, runtime: "nodejs" }});
    console.log("***log: workspace settings (iW) ", await ws.projectSettings());
    // await ws.installPlugin("aws", "v4.0.0");
};

// install necessary plugins once upon boot
initialRuntimeTests();

// configure express
const app = express();
app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/smorgasbord", sites.smorgasbordHandler);

// setup our RESTful routes for our Site resource
app.post("/sites/create", sites.createHandler);
app.get("/sites", sites.listHandler);
app.get("/sites/:id", sites.getHandler);
app.put("/sites/:id", sites.updateHandler);
app.post("/sites/delete", sites.deleteHandler);
app.get("/test", test.testHandler);

// test of sharing data with route handlers
app.locals.projectName = projectName;

// serve the API with signed certificate on 1337 (SSL/HTTPS) port
// const httpsServer = https.createServer({
//     key: fs.readFileSync(`${env.HOME}/tls/private/backabo-backend.key`),
//     cert: fs.readFileSync(`${env.HOME}/tls/certs/backabo-backend.crt`),
//     ca: fs.readFileSync(`${env.HOME}/tls/certs/backabo-ca-root.crt`)
//   }, app);
  
// httpsServer.listen(1337, () => {
//       console.log('HTTPS Server running on port 1337');
//   });

// start our http server
app.listen(1337, () => console.info("server running on :1337"));