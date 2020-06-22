var constants = require("./elasticOperations/constants.js");

const esClient = require("./elasticOperations/client");
const searchData = async function (indexName, query) {
	console.log("search data getMyGmailData");
	return await esClient.search({
		index: indexName,
		body: query,
	});
};

const getMyGmailData = async function (req, res) {

	var emailAddress="cmayor.navarro@gmail.com"
	const query = {
		query: {
			bool: {
				must: [{ match: { "emailAddress.keyword": req.query.mygmailAdress } }],
			}
		},
		aggs: {
			group_by_body: {
				terms: {
					field: "body.keyword",
				}
			}
		}
	};
	try {
		const resp = await searchData(constants.INDEX_ELASTIC, query);
		res.send(resp);
	} catch (e) {
		console.log(e);
	}
};

module.exports = getMyGmailData;