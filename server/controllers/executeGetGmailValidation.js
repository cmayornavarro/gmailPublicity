const { google } = require("googleapis");

const executeGetGmailValidation = async function (req, res,next) {
	const oauth2Client = new google.auth.OAuth2(
		"843739110142-765u6gbtq5ip1borpgfkkmvivc3vd3cn.apps.googleusercontent.com",
		"fK8b3hSgIZOG8oQNra5YhsIY",
		"http://localhost:3000/oauth2callback"
	);

	
	const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];
	const url = oauth2Client.generateAuthUrl({
		// 'online' (default) or 'offline' (gets refresh_token)
		access_type: "offline",
		// If you only need one scope you can pass it as a string
		scope: scopes,
	});
	console.log(url);


   

	res.send({"urlToken":url});
};

module.exports = executeGetGmailValidation;