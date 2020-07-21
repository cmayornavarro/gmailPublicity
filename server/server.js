const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

// elastic operations
var client = require("./elasticOperations/client.js");
var constants = require("./elasticOperations/constants.js");
var executeCreateIndex = require("./elasticOperations/createIndex.js");
var executeAddMapping = require("./elasticOperations/addMapping.js");
var executeInsert = require("./elasticOperations/insertData.js");
var executeSearch = require("./elasticOperations/searchData.js");
var executeDeleteLoadingData = require("./elasticOperations/deleteLoadingData.js");

// controllers
var executeAnalyseGmailData = require("./controllers/executeAnalyseGmailData.js");
var executeGetMyGmailData = require("./controllers/executeGetMyGmailData.js");
var executeGetLoadingData = require("./controllers/executeGetLoadingData.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    return next();
});

// api for elasticsearch
app.route("/api/searchData").get(executeSearch);
app.route("/api/createIndex").post(executeCreateIndex);
app.route("/api/addMapping").post(executeAddMapping);
app.route("/api/insertData").post(executeInsert);
// api
app.route("/api/analyseGmailData").post(executeAnalyseGmailData);
app.route("/api/getMyGmailData").get(executeGetMyGmailData);
app.route("/api/getLoadingData").get(executeGetLoadingData);
 // empty the loading index
executeDeleteLoadingData();
 
app.listen(port, () => console.log(`Listening on port ${port}`));