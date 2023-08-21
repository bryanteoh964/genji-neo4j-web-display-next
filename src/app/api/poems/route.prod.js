const { getSession } = require('../neo4j_driver/route.prod.js');

import { toNativeTypes } from '../neo4j_driver/utils.prod.js';

async function getData (chapter, number){
	const session = await getSession();

	//all the get method and return the db data
	const queries = {
		res: 'match poem=(g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), exchange=(s:Character)-[:SPEAKER_OF]->(g)<-[:ADDRESSEE_OF]-(a:Character), trans=(g)-[:TRANSLATION_OF]-(:Translation)-[:TRANSLATOR_OF]-(:People) where g.pnum ends with "' + number + '" return poem, exchange, trans',
		resHonkaInfo:  'match (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (g)-[n:ALLUDES_TO]->(h:Honka)-[r:ANTHOLOGIZED_IN]-(s:Source), (h)<-[:AUTHOR_OF]-(a:People), (h)<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(p:People) where g.pnum ends with "' + number + '" return h.Honka as honka, h.Romaji as romaji, s.title as title, a.name as poet, r.order as order, p.name as translator, t.translation as translation, n.notes as notes',
		resRel : 'match (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (g)-[:INTERNAL_ALLUSION_TO]->(s:Genji_Poem) where g.pnum ends with "' + number + '" return s.pnum as rel',
		resPnum : 'match (g:Genji_Poem) return g.pnum as pnum',
		resTag : 'match (g:Genji_Poem)-[:INCLUDED_IN]->(:Chapter {chapter_number: "' + chapter + '"}), (g)-[:TAGGED_AS]->(t:Tag) where g.pnum ends with "' + number + '" return t.Type as type',
		resType : 'match (t:Tag) return t.Type as type'
	};

	const result = {};
	try {
		for (let key in queries) {
			const queryResult = await session.readTransaction(tx => 
				tx.run(queries[key], { chapter, number})
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
		result.status(500).json({ error: 'Failed to execute queries' });
	} finally{
		await session.close();
	}
}

export const GET = async (request) => {
	try {   
		const {searchParams} = new URL(request.url);
		const chapter = searchParams.get('chapter')
		const number = searchParams.get('number')
		const data = await getData(chapter, number)
		return new Response(JSON.stringify(data), {status: 200})
	}catch (error){
		return new Response(error, {status: 500})
	}
} 