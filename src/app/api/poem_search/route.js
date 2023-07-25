const { getSession, getChpList } = require('../neo4j_driver/route.js');

import { toNativeTypes } from '../neo4j_driver/utils.js';

async function getData (){
    const session = await getSession()

    let query = 'match exchange=(s:Character)-[:SPEAKER_OF]-(g:Genji_Poem)-[:ADDRESSEE_OF]-(a:Character) return exchange'
    
    try {
        let res = await session.readTransaction(tx => tx.run(query))
    
        let exchange = res.records.map(row => { return toNativeTypes(row.get('exchange')) })
        return(exchange)
    } catch (error) {
        console.error('Failed to execute queries in poem_search:', error)
    } finally {
        await session.close()
    }
}

export const GET = async (request) =>{
	try { 
		const data = await getData()

		return new Response(JSON.stringify(data), {status: 200})
	}catch (error){
		return new Response(error, {status: 500})
	}
} 