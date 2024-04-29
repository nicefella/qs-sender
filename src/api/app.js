/* eslint-disable quotes */
// const corsMiddleware = require('restify-cors-middleware');
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const notify = require("./v2/notify");
const notifyweekly = require("./v2/notifyweekly");
const reload = require("./v2/reload");
const bank = require("./v2/bank");
const contentlib = require("./v2/contentlib");
const generate = require("./v2/generate");
const setsave = require("./v2/setsave");
const cashflow = require("./v2/cashflow");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

app.options("*", cors());

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "2mb" }));
app.get("/v2/bank", bank.get);
app.post("/v2/notify", notify.post);
app.get("/v2/notify", notify.get);
app.get("/v2/notifyweekly", notifyweekly.get);
app.get("/v2/reload", reload.get);
app.get("/v2/start", reload.start);
app.get("/v2/list", reload.list);
app.get("/v2/taskStatus", reload.taskStatus);
app.post("/v2/upload", contentlib.upload);
app.get("/v2/generate", generate.generate);
app.get("/v2/setsave", setsave.get);
app.post("/v2/cashflow/append", cashflow.append);
app.post("/v2/cashflow/delete", cashflow.delete);

module.exports = app;
