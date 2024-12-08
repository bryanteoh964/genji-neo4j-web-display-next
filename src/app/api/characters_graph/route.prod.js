import { getSession } from '../neo4j_driver/route.prod.js';
import { toNativeTypes,generateGeneology,concatObj } from '../neo4j_driver/utils.prod.js';

export const GET = async () =>{
	var resGraph;
	var resGraph2;
	var resGraph3; 
	try {  
		const session = await getSession();

		resGraph = await session.readTransaction(tx => tx.run(
			`
			MATCH (a:Character) return a.name as startName
			`
		)) 

		resGraph = resGraph.records.map(e => concatObj(toNativeTypes(e.get('startName'))))

		resGraph2 = await session.readTransaction(tx => tx.run(
			`
			MATCH (a:Character)-[r]->(b:Character) return a.name as startName, TYPE(r) as rel, b.name as endName
			`
		)) 

		resGraph2 = resGraph2.records.map(e => [concatObj(toNativeTypes(e.get('startName'))), concatObj(toNativeTypes(e.get('rel'))), concatObj(toNativeTypes(e.get('endName')))])

		var resGraph3 = await session.readTransaction(tx => tx.run(
			`
			MATCH (a:Character) return a.name, a.japanese_name, a.color, a.gender 
			`
		))

		resGraph3 = resGraph3.records.map(e => e._fields) 

		//console.dir(resGraph2, {'maxArrayLength': null}) 
	} catch (error) {
		console.log("fail to get Data")
	}

	
	return new Response(JSON.stringify(generateGeneology(resGraph, resGraph2, resGraph3)), {status: 200})
} 