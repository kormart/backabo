import dotenv from "dotenv";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import bodyParser from "body-parser";

import path from "path";
import * as routes from "./routes";

dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    cookie: { maxAge: 60000 },
    // store: sessionStorage,
    saveUninitialized: true,
    resave: true,
    secret: 'secret'
}));
app.use(flash());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// Configure routes
routes.register(app);

// start the express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
