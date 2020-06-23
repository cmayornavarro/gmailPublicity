var constants = require("./constants.js");

const esClient = require("./client");
const createIndex = async function (indexName) {
	return await esClient.indices.create({
		index: indexName,
	});
};



var executeCreateIndex = async function (req, res) {
	try {
		const resp = await createIndex(constants.INDEX_ELASTIC);
		console.log(resp);
		 res.status(200).json(resp);
	} catch (e) {
		var error = JSON.parse(JSON.stringify(e));

		//console.log(error); //it has the error json 
		 res.status(501).json({errorMessage: "Error while creating the index, please contact the administrator"});
	}
};

module.exports =  executeCreateIndex;