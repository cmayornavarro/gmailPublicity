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

function test(gmail,auth){
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
	)
	return deferred.promise;
}



 function test2(gmail,auth,emailAddress,nextPage){
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
				console.log("before ");
				/*messages.forEach( (message) => {
				  getEmailFrom(auth, message.id, emailAddress);
				});*/
				let promise = messages.map(function(message){
					getEmailFrom(auth, message.id, emailAddress);
					return message;
				});
				Promise.all(promise).then(function(){console.log("yes");}).catch(function(err){console.log("err "+ err);}); 
				console.log("labels found.");
				//return Q.all(arrayOfPromise);
				
				if (res.data.nextPageToken) {
					try {
						console.log("nextPageToken: " + res.data.nextPageToken);
						getIdEmails(auth, res.data.nextPageToken);
					} catch (e) {
						console.log(e);
					}
				}else{
					 executeDeleteLoadingData(emailAddress);
				}
					deferred.resolve("test2 ");
				
			} else { 
				console.log("No labels found.");
				
			}
		}
	);
		return deferred.promise;
}


 function getIdEmails(auth, nextPage) {
	const gmail = google.gmail({ version: "v1", auth });
	var emailAddress = "";
	var deferred = Q.defer();
	
	test(gmail,auth).then(  function(emailAddress){
		console.log("callback " + emailAddress);
		return  test2(gmail,auth,emailAddress,nextPage);
	}).then(function(a){
			console.log("callback 2 a:"+a ); 
			deferred.resolve();
		}).catch(function(error) {
            console.log("error "+ error);
        });

	console.log("deferred.promise");
	return deferred.promise;
	  
}

async function getEmailFrom(auth, id, emailAddress) {
	console.log("init");
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
						
						console.log(header.value);
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

				}
				
			else {
				console.log("No labels found.");
			}
		}
	);

	console.log("final ");
}

const insertData = async function (indexName, data,id) {
	console.log(id);
	return await esClient.index({
		index: indexName,
		id:id,// is needed for modify data
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
			await insertData(constants.INDEX_ELASTIC_LOADING,data);

			var newToken = JSON.parse(JSON.stringify(req.body.code));
			console.log("newToken");
			console.log(newToken);
			//var {tokens }= await oauth2Client.getToken(req.body.code);

			//var newToken = JSON.stringify(req.body.code);
			oauth2Client.setCredentials(newToken);
			res.send("analyzing data");
			//oauth2Client.setCredentials(tokens);
			getIdEmails(oauth2Client).then(function(a){
				console.log("executeDeleteLoadingData 2 "+a);
				// executeDeleteLoadingData(emailUser);
			}).catch(function(err) {
				console.log("executeDeleteLoadingData ERROR");
			console.log("err "+err);
			});
;
			
		} catch (e) {
			console.log(e);

		}/*finally{
			console.log("emailUser "+emailUser  );
			
		}*/
	} else {
		// Load client secrets from a local file.
		fs.readFile("credentials.json", (err, content) => {
			if (err)
				return console.log("Error loading client secret file:", err);
			// Authorize a client with credentials, then call the Gmail API.
			authorize(JSON.parse(content), getIdEmails);
		});
	}
};

/*var executeGmailData = async function (req, res) {
	const oauth2Client = new google.auth.OAuth2(
		"843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com",
		"1G-7woSgeEuS33bL7dIGqrL9",
		"http://localhost:3000/oauth2callback"
	);


	const {tokens} = await oauth2Client.getToken(req.query.code)
	oauth2Client.setCredentials(tokens);
	getIdEmails(oauth2Client);
};*/

module.exports = executeGmailData;