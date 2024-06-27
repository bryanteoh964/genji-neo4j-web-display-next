const { getSession } = require('../neo4j_driver/route.prod.js');
const { toNativeTypes,generateGeneology,concatObj } = require('../neo4j_driver/utils.prod.js');

export const GET = async () =>{
	//Mak: ignore generateGeneology function
	return new Response(JSON.stringify(generateGeneology([])), {status: 200})
} 