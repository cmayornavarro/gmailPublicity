var elasticsearch = require("elasticsearch");
var client = new elasticsearch.Client({
	hosts: ["http://localhost:9200"],
});
exports.client = client; 

client.ping(
	{
		requestTimeout: 30000,
	},
	function (error) {
		if (error) {
			console.error("Cannot connect to Elasticsearch.");
		} else {
			console.log("Connected to Elasticsearch was successful!");
		}
	}
);


const addmappingToIndex = async function(indexName, mappingType, mapping){
    console.log(mapping);
    return await client.indices.putMapping({
        index: indexName,
        type: mappingType,
        body: mapping
    });
};

exports.addmappingToIndex = addmappingToIndex;


 
