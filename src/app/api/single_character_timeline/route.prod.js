const { getSession } = require('../neo4j_driver/route.prod.js');
const { singleCharacterTimeline} = require('../neo4j_driver/utils.prod.js');
export async function GET(req) {
	var resGraph;
	try {  
		const { searchParams } = new URL(req.url);
		const name = searchParams.get('name');
		const session = await getSession();

		resGraph = await session.readTransaction(tx => tx.run(
			`
			MATCH (a:Character)-[:EVENT]->(b:Event)-[:AT_GENJI_AGE_OF]->(d:Genji_Age), (b)-[:CHAPTER]->(c:Chapter)
			WHERE a.name = "${name}"
			return 
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
			b.winter
			`
		))

		resGraph = resGraph.records.map(e => e._fields) 
		
		//console.log(resGraph)
	} catch (error) {
		console.log("fail to get Data")
	}

	
	return new Response(JSON.stringify(singleCharacterTimeline(resGraph)), {status: 200})
} 