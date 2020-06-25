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
	return await esClient.deleteByQuery({
		index: indexName,
		body: {
           query: {
              "match" : {emailAddress:email} // for deleting all documents
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
		console.log(resp);
	} catch (e) {
		var error = JSON.parse(JSON.stringify(e));
		console.log(error); //it has the error json 		
	}
};

module.exports =  executeDeleteLoadingData;