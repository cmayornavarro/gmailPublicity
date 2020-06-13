var constants = require("./constants.js");

const esClient = require("./client");
const searchData = async function (indexName, query) {
  console.log("searchData");
    return await esClient.search({
        index: indexName,
        body: query,
    });
};


const executeSearch = async function (req, res) {
   const body = {
        query: {
            match: {
                title: "test",
            },
        },
    };
    try {       
        const resp = await searchData(constants.INDEX_ELASTIC, body);       
        res.send(resp);
    } catch (e) {
        
        console.log(e);
    }    
};

module.exports = executeSearch;
