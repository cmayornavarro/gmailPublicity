var constants = require("./constants.js");

const esClient = require("./client");
const addmappingToIndex = async function (indexName, mapping) {
    console.log(mapping);
    return await esClient.indices.putMapping({
        index: indexName,
        type: "_doc",
        body: mapping,
    });
};

var executeAddMapping = async function (req, res) {
    const mapping = {
        properties: {
            title: {
                type: "text",
            },
            tags: {
                type: "text",
            },
            body: {
                type: "text",
            },
            timestamp: {
                type: "date",
                format: "epoch_millis",
            },
        },
    };
    try {
        const resp = await addmappingToIndex(constants.INDEX_ELASTIC, mapping);
        console.log(resp);
    } catch (e) {
        console.log(e);
    }
};


module.exports =  executeAddMapping;