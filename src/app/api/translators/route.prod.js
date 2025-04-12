const { getSession } = require('../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../neo4j_driver/utils.prod.js';

async function getTranslatorData(name) {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (p:People {name: $name}) RETURN p.Bio as bio, p.FullName as fullName',
        { name }
      )
    );
    
    const bio = result.records[0]?.get('bio') || null;
    const fullName = result.records[0]?.get('fullName') || null;
    
    return { bio, fullName };
  } catch(error) {
    console.error('Failed to fetch translator info:', error);
    throw new Error('Failed to fetch translator info');
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
    
    const { bio, fullName } = await getTranslatorData(name);
    
    if (!bio) {
      return new Response(JSON.stringify({ message: "Translator not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ bio: bio, fullName: fullName }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}