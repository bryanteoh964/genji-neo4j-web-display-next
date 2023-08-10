const { getSession } = require('../neo4j_driver/route.dev.js');
const { toNativeTypes,generateGeneology,concatObj } = require('../neo4j_driver/utils.dev.js');

export const GET = async () =>{
	try {   
		
		const session = await getSession();

		let resGraph = await session.readTransaction(tx => tx.run('MATCH (a:Character)-[r]-(b:Character) return a.name as startName, TYPE(r) as rel, b.name as endName')) 

		resGraph = resGraph.records.map(e => [concatObj(toNativeTypes(e.get('startName'))), concatObj(toNativeTypes(e.get('rel'))), concatObj(toNativeTypes(e.get('endName')))])

		return new Response(JSON.stringify(generateGeneology(resGraph)), {status: 200})
	} catch (error){
  		return new Response(error, {status: 500})
	}
} 