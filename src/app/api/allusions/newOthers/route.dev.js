const { getSession } = require('../../neo4j_driver/route.dev.js');

export const POST = async (request)=> {
	try{
		// const session = await getSession();
		// const { searchParams } = new URL(request.url)
		// const key = searchParams.get('key')
		// const selectedTranslation = searchParams.get('selectedTranslation')
		// const translation = searchParams.get('translation')
		// const honka = searchParams.get('honka')
		// const romaji = searchParams.get('romaji')
		// const notes = searchParams.get('notes')
		// let write = await session.writeTransaction(tx => tx.run('MATCH (h:Honka {id: $key})<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(p:People {name:$selectedTranslation}) SET h.Honka = $honka, h.Romaji = $romaji, h.notes = $notes, t.translation = $translation return "OK"', {key: key, selectedTranslation: selectedTranslation, honka: honka, romaji: romaji, notes: notes, translation: translation}))

		const write = undefined;
		
		return new Response(JSON.stringify(write), {status: 200})
	} catch(error){
		return new Response(error,{status:500})
	}
}