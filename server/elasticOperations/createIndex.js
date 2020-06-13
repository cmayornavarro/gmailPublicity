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
	} catch (e) {
		console.log(e);
	}
};

module.exports =  executeCreateIndex;