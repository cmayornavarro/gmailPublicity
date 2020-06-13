const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

var client = require("./elasticOperations/client.js");
var constants = require("./elasticOperations/constants.js");
var executeCreateIndex = require("./elasticOperations/createIndex.js");
var executeAddMapping = require("./elasticOperations/addMapping.js");
var executeInsert = require("./elasticOperations/insertData.js");
var executeSearch = require("./elasticOperations/searchData.js");
var executeGmailData = require("./executeGmailData.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/api/createIndex").post(executeCreateIndex);
app.route("/api/addMapping").post(executeAddMapping);
app.route("/api/insertData").post(executeInsert);
app.route("/api/searchData").get(executeSearch);
app.route("/api/fetchGmailData").post(executeGmailData);



app.listen(port, () => console.log(`Listening on port ${port}`));