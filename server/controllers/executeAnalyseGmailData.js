var constants = require("./../elasticOperations/constants.js");
const esClient = require("./../elasticOperations/client");
var executeDeleteLoadingData = require("./../elasticOperations/deleteLoadingData.js");

var Q = require("q");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/*This function gets the e-mail adress of the current user*/
function getEmailAddress(gmail, auth) {
	var deferred = Q.defer();
	gmail.users.getProfile(
		{
			auth: auth,
			userId: "me",
		},
		function (err, res) {
			if (err) {
				console.log(err);
			} else {
				emailAddress = res.data.emailAddress;
			}
			deferred.resolve(emailAddress);
		}
	);
	return deferred.promise;
}

function getEmailsByPage(gmail, auth, emailAddress, nextPage) {
	var deferred = Q.defer();
	var arrayOfPromise = [];
	gmail.users.messages.list(
		{
			userId: "me",
			labelIds: "CATEGORY_PROMOTIONS",
			pageToken: nextPage,
		},
		(err, res) => {
			if (err) return console.log("The API returned an error: " + err);
			const messages = res.data.messages;
			if (messages.length) {
				var arrayOfPromises = [];

				let promise = messages.map(function (message) {
					getEmailInformation(auth, message.id, emailAddress);
					return message;
				});
				Promise.all(promise)
					.then(function () {})
					.catch(function (err) {
						console.log("err " + err);
					});
				// if there is a next page then get new e-mails
				if (res.data.nextPageToken) {
					try {
						analyseEmails(auth, res.data.nextPageToken);
					} catch (e) {
						console.log(e);
					}
				} else {
					// delete loading data
					executeDeleteLoadingData(emailAddress);
				}
				deferred.resolve("getEmailsByPage ");
			} else {
				console.log("No labels found.");
			}
		}
	);
	return deferred.promise;
}

function analyseEmails(auth, nextPage) {
	const gmail = google.gmail({ version: "v1", auth });
	var emailAddress = "";
	var deferred = Q.defer();

	getEmailAddress(gmail, auth)
		.then(function (emailAddress) {
			return getEmailsByPage(gmail, auth, emailAddress, nextPage);
		})
		.then(function (a) {
			deferred.resolve();
		})
		.catch(function (error) {
			console.log("error " + error);
		});

	return deferred.promise;
}

async function getEmailInformation(auth, id, emailAddress) {
	var deferred2 = Q.defer();
	var arrayOfPromise = [];
	const gmail = google.gmail({ version: "v1", auth });
	await gmail.users.messages.get(
		{
			userId: "me",
			id: id,
		},
		(err, res) => {
			if (err) return console.log("The API returned an error: " + err);
			const headers = res.data.payload.headers;

			if (headers.length) {
				headers.forEach(async (header) => {
					if (header.name == "From") {
						const data = {
							title: "Gmail Pub",
							tags: ["ReactJS", "NodeJS"],
							body: header.value,
							emailAddress: emailAddress,
						};
						try {
							const resp = await insertData(
								constants.INDEX_ELASTIC,
								data,
								res.data.id
							);
						} catch (e) {
							console.log(e);
						}
					}
				});
			} else {
				console.log("No labels found.");
			}
		}
	);
}

const insertData = async function (indexName, data, id) {
	if (id != undefined) {
		console.log("id: " + id);
	}
	return await esClient.index({
		index: indexName,
		id: id, // is needed for modify data
		body: data,
	});
};

var executeGmailData = async function (req, res) {
	if (!(req.body.code === undefined)) {
		const oauth2Client = new google.auth.OAuth2(
			"843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com",
			"Em3XxMJSzBRv0mWg8tBl8vIq",
			"http://localhost:3000/oauth2callback"
		);
		let emailUser = "";
		try {
			emailUser = req.body.email;
			const data = { emailAddress: emailUser };
			// save the loading data in order to know if there is an analysis on going for the current user
			await insertData(constants.INDEX_ELASTIC_LOADING, data);
			// get user's token
			var newToken = JSON.parse(JSON.stringify(req.body.code));
			oauth2Client.setCredentials(newToken);
			// send a reponse to the client
			res.send("analyzing data");
			// execute the anlysis
			analyseEmails(oauth2Client)
				.then(function () {})
				.catch(function (err) {
					console.log("error: " + err);
				});
		} catch (e) {
			console.log(e);
		}
	} else {
		res.send("token missing");
	}
};

module.exports = executeGmailData;