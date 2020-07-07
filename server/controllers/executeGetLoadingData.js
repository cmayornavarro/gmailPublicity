var constants = require("./../elasticOperations/constants.js");
const esClient = require("./../elasticOperations/client");

const searchData = async function (indexName, query) {	
	return await esClient.search({
		index: indexName,
		body: query,
	});
};

const getLoadingData = async function (req, res) {

	
	const query = {
		query: {
			bool: {
				must: [{ match: { "emailAddress.keyword": req.query.mygmailAdress } }],
			}
		}
	};
	try {
		const resp = await searchData(constants.INDEX_ELASTIC_LOADING, query);
		let isLoading = false;	
		if(resp.hits.total!=0){
			isLoading = true;
		}
		
		res.send({isLoading:isLoading});
	} catch (e) {
		console.log(e);
	}
};

module.exports = getLoadingData;