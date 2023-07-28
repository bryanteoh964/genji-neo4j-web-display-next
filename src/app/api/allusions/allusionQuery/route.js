const { getSession } = require('../../neo4j_driver/route.js');
const { toNativeTypes, valueToNativeType, getChpList,concatObj } = require('../../neo4j_driver/utils.js');


async function getData (){
	const session = await getSession();

	//all the get method and return the db data
	const queries = {
		getHonka:  'match (a:Honka) return (a) as honka',
		getPnum: 'match (g:Genji_Poem) return g.pnum as pnum',
		getPoemHonka: 'MATCH (n:Honka)-[r:ALLUDES_TO]-(p:Genji_Poem) RETURN n.id as id, p.pnum as pnum, r.notes as notes',
		getPoet: 'match (p:People) return p.name as poet',
		getHonkaPoet: 'match (h:Honka)<-[:AUTHOR_OF]-(p:People) return h.id as id, p.name as name',
		getSource: 'match (s:Source) return s.title as source',
		getHonkaSource: 'match (h:Honka)-[r:ANTHOLOGIZED_IN]-(s:Source) return h.id as id, r.order as order, s.title as title',
		getTrans: 'match (h:Honka)<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(p:People) return h.id as id, t.translation as trans, p.name as name'
	};



	const result = {};
	try {
		for (let key in queries) {
			const queryResult = await session.readTransaction(tx => 
				tx.run(queries[key])
			); 
			result[key] = queryResult;
		} 

		let exchange = new Set()           
		result['res'].records.map(e => JSON.stringify(toNativeTypes(e.get('exchange')))).forEach(e => exchange.add(e))
		exchange = Array.from(exchange).map(e => JSON.parse(e))
		
		//for transtemp
		let transTemp = result['res'].records.map(e => toNativeTypes(e.get('trans'))).map(e => [e.end.properties.name, e.segments[0].end.properties.translation, e.segments[1].start.properties.WaleyPageNum])
		
		let sources = result['resHonkaInfo'].records.map(e => [Object.values(toNativeTypes(e.get('honka'))).join(''), Object.values(toNativeTypes(e.get('title'))).join(''), Object.values(toNativeTypes(e.get('romaji'))).join(''), Object.values(toNativeTypes(e.get('poet'))).join(''), Object.values(toNativeTypes(e.get('order'))).join(''), Object.values(toNativeTypes(e.get('translator'))).join(''), Object.values(toNativeTypes(e.get('translation'))).join(''), e.get('notes') !== null ? Object.values(toNativeTypes(e.get('notes'))).join('') : 'N/A'])
		
		//related
		let related = new Set()
		result['resRel'].records.map(e => toNativeTypes(e.get('rel'))).forEach(e => related.add([Object.values(e).join('')]))
		related = Array.from(related).flat()
		related = related.map(e => [e, true])
		//res tag
		let tags = new Set()
		result['resTag'].records.map(e => toNativeTypes(e.get('type'))).forEach(e => tags.add([Object.values(e).join('')]))
		tags = Array.from(tags).flat()
		tags = tags.map(e => [e, true])
		//types
		let types = result['resType'].records.map(e => e.get('type'))
		//ls
		let ls = []
		types.forEach(e => ls.push({value: e, label: e})) 
		//pls
		let temp = result['resPnum'].records.map(e => e.get('pnum'))
		let pls = []
		temp.forEach(e => {
			pls.push({value:e, label:e})
		})
		const data = [exchange, transTemp, sources, related, tags, ls, pls];
		return (data);
	} catch(error) {
		console.error('Failed to execute queries in poems:', error);
		result.status(500).json({ error: 'Failed to execute queries' });
	} finally{
		await session.close();
	}
}

export const GET = async (request) =>{
	try {   
		const data = await getData(chapter, number)
		return new Response(JSON.stringify(data), {status: 200})
	}catch (error){
		return new Response(error, {status: 500})
	}
} 