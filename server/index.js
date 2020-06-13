const express = require("express");
const bodyParser = require("body-parser");

var client = require("./elasticOperations/client.js");
var constants = require("./elasticOperations/constants.js");
var executeCreateIndex = require("./elasticOperations/createIndex.js");
var executeAddMapping = require("./elasticOperations/addMapping.js");
var executeInsert = require("./elasticOperations/insertData.js");
var executeSearch = require("./elasticOperations/searchData.js");
var executeGmailData = require("./elasticOperations/executeGmailData.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/api/createIndex").post(executeCreateIndex);
app.route("/api/addMapping").post(executeAddMapping);
app.route("/api/fetchGmailData").post(executeGmailData);
app.route("/api/insertData").post(executeInsert);
app.route("/api/searchData").get(executeSearch);



const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
var Q = require("q");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), getIdEmails);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.labels.list(
    {
      userId: "me",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const labels = res.data.labels;
      if (labels.length) {
        console.log("Labels:");
        labels.forEach((label) => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log("No labels found.");
      }
    }
  );
}

function getIdEmails2(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages
    .list({
      userId: "me",
      labelIds: "CATEGORY_PROMOTIONS",
    })
    .then(function (res) {
      const messages = res.data.messages;
      if (messages.length) {
        console.log("messages:");
        messages.forEach((message) => {
          console.log(`- ${message.id}`);
        });
      } else {
        console.log("No labels found.");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getIdEmails(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages.list(
    {
      userId: "me",
      labelIds: "CATEGORY_PROMOTIONS",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const messages = res.data.messages;
      if (messages.length) {
       
        var arrayOfPromises = [];
        messages.forEach((message) => {
         
           arrayOfPromises.push(getEmailFrom(auth, message.id));
        });
        Q.all(arrayOfPromises);
      } else {
        console.log("No labels found.");
      }
    }
  );
}

function getEmailFrom(auth, id) {
 
  const gmail = google.gmail({ version: "v1", auth });
  gmail.users.messages.get(
    {
      userId: "me",
      id: id,
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const headers = res.data.payload.headers;
     
      if (headers.length) {
        headers.forEach((header) => {
          if (header.name == "From") {
            console.log(header.value);
          }
        });
      } else {
        console.log("No labels found.");
      }
    }
  );
}