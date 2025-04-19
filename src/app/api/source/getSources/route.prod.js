const { getSession } = require('../../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../../neo4j_driver/utils.prod.js';

async function getSourcesData() {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (s:Source) WHERE s.author IS NOT NULL RETURN s.title as title, s.author as author',
      )
    );
    
    const sources = result.records.map(record => ({
      title: record.get('title'),
      author: record.get('author')
    }));
    
    return sources;
  } catch(error) {
    console.error('Failed to fetch sources:', error);
    throw new Error('Failed to fetch sources');
  } finally {
    await session.close();
  }
}

export const GET = async (request) => {
  try {
    const sources = await getSourcesData();
    return new Response(JSON.stringify(sources), { status: 200 });
  } catch(error) {
    console.error('Failed to fetch sources:', error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}