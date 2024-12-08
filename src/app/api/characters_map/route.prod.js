const { getSession } = require('../neo4j_driver/route.prod.js');
const { generateLocations} = require('../neo4j_driver/utils.prod.js');
export const GET = async () =>{
	var resGraph;
	try {  
		const session = await getSession();

		resGraph = await session.readTransaction(tx => tx.run(
			`
			MATCH (c:Character)-[:SPEAKER_OF]->(a:Genji_Poem)-[:PLACE_OF_COMPOSITION]->(b:Place)


			return a.pnum,
				a.Japanese,
				a.notes,
				a.Romaji,
				b.name,
				c.name
			`
		)) 

		resGraph = resGraph.records.map(e => e._fields) 
		
		//console.log(resGraph)
	} catch (error) {
		console.log("fail to get Data")
	}

	
	return new Response(JSON.stringify(generateLocations(resGraph)), {status: 200})
} 