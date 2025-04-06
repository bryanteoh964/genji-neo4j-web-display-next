const { getSession } = require('../neo4j_driver/route.prod.js');
const { generateTimeline} = require('../neo4j_driver/utils.prod.js');
export const GET = async () =>{ 
	var resGraph;
	try {  
		const session = await getSession();

		// resGraph = await session.readTransaction(tx => tx.run(
		// 	`
		// 	MATCH (a:Character)-[event]->(b:Event)-[chapter]->(c:Chapter) 


		// 	return a.name,
		// 		a.color,
		// 		a.japanese_name,
		// 		c.chapter_name,
		// 		c.chapter_number,

		// 		b.age_of_genji,
		// 		b.birth ,
		// 		b.english ,
		// 		b.japanese,
		// 		b.month,
		// 		b.day,

		// 		b.spring,
		// 		b.summer,
		// 		b.fall,
		// 		b.winter
		// 	`
		// )) 

		resGraph = await session.readTransaction(tx => tx.run(
			`
			MATCH (a:Character)-[:EVENT]->(b:Event)-[:AT_GENJI_AGE_OF]->(d:Genji_Age), (b)-[:CHAPTER]->(c:Chapter)
			
			return a.name,
			a.color,
			a.japanese_name,
			c.chapter_name,
			c.chapter_number,

			d.age,
			b.birth ,
			b.english ,
			b.japanese,
			b.month,
			b.day,

			b.spring,
			b.summer,
			b.fall,
			b.winter,
			b.autumn
			`
		))

		resGraph = resGraph.records.map(e => e._fields) 
		
		//console.log(resGraph)
	} catch (error) {
		console.log("fail to get Data")
	}

	
	return new Response(JSON.stringify(generateTimeline(resGraph)), {status: 200})
} 