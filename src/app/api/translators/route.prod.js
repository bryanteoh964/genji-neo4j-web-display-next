const { getSession } = require('../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../neo4j_driver/utils.prod.js';

async function getTranslatorData(name) {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (p:People {name: $name}) RETURN p.Bio as bio',
        { name }
      )
    );
    
    const bio = result.records[0]?.get('bio') || null;
    
    return bio;
  } catch(error) {
    console.error('Failed to fetch translator bio:', error);
    throw new Error('Failed to fetch translator bio');
  } finally {
    await session.close();
  }
}

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (!name) {
      return new Response(JSON.stringify({ message: "Translator name is required" }), { status: 400 });
    }
    
    const bio = await getTranslatorData(name);
    
    if (!bio) {
      return new Response(JSON.stringify({ message: "Translator not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ bio }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}