import { getSession } from '../neo4j_driver/route.prod.js';

export const GET = async () =>{
	var resGraph;
	try {  
		const session = await getSession();

		resGraph = await session.readTransaction(tx => tx.run(
			`
			MATCH (a:Character) return a.name
			`
		))
		resGraph = resGraph.records.map(e => e._fields[0])
		//console.log(JSON.stringify(resGraph))
	} catch (error) {
		console.log("fail to get Data")
	}

	
	return new Response(JSON.stringify(resGraph), {status: 200})
} 