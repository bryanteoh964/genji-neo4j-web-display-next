const { getSession } = require('../../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../../neo4j_driver/utils.prod.js';

async function getSourcesData() {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (s:Source)<-[:AUTHOR_OF]-(a:People) WHERE s.on_source_page = "true" ORDER BY s.title RETURN s.title as title, a.name as author',
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

// need to avoid caching
export const GET = async (request) => {
  try {
    const sources = await getSourcesData();
    return new Response(JSON.stringify(sources), { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      }
    });
  } catch(error) {
    console.error('Failed to fetch sources:', error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      }
    });
  }
}