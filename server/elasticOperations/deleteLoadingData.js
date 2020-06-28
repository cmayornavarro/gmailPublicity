var constants = require("./constants.js");

const esClient = require("./client");
const deleteAllData = async function (indexName) {
	return await esClient.deleteByQuery({
		index: indexName,
		body: {
           query: {
              "match_all" : {} // for deleting all documents
           }
        }		
	});
};

const deleteAData = async function (indexName,email) {
	console.log("deleteAData");
	return await esClient.deleteByQuery({
		index: indexName,
		body: {
           query: {
              "match" : {"emailAddress.keyword":email} // for deleting all documents
           } 
        }		
	});
};

var executeDeleteLoadingData = async function (email) {
	try {
		
		let resp;
		if(email){			
			resp = await deleteAData(constants.INDEX_ELASTIC_LOADING,email);
		}else{
		
			resp = await deleteAllData(constants.INDEX_ELASTIC_LOADING);		
		}
		console.log("executeDeleteLoadingData: " + JSON.stringify(resp));
		//console.log(JSON.parse(JSON.stringify(resp)).json());
	} catch (e) {
		
		console.log("executeDeleteLoadingData error" + e); //it has the error json 		
	}
};

module.exports =  executeDeleteLoadingData;