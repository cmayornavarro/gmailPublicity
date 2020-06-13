var constants = require("./constants.js");

const esClient = require("./client");
const insertData = async function (indexName, data) {   
    return await esClient.index({
        index: indexName,
        //_id is needed for modify data
        body: data,
    });
};

var executeInsert = async function (req, res) {
    const data = {
        title: req.body.post,
        tags: ["ReactJS", "NodeJS"],
        body: req.body.post,
    };
    try {
        const resp = await insertData(constants.INDEX_ELASTIC, data);
    } catch (e) {
        console.log(e);
    }
};

module.exports =  executeInsert;