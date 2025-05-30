const { getSession } = require('../../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../../neo4j_driver/utils.prod.js';

async function getBlogNames() {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (b:Blog) RETURN b.title as title ORDER BY b.title'
      )
    );
    
    const titles = result.records.map(record => record.get('title'));
    
    return { titles };
  } catch(error) {
    console.error('Failed to fetch blog names:', error);
    throw new Error('Failed to fetch blog names');
  } finally {
    await session.close();
  }
}

// need to avoid caching
export const dynamic = 'force-dynamic';

export const GET = async (request) => {
  try {
    const { titles } = await getBlogNames();
    
    if (!titles || titles.length === 0) {
      return new Response(JSON.stringify({ message: "No blogs found" }), { 
        status: 404,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'Content-Type': 'application/json',
        }
      });
    }
    
    return new Response(JSON.stringify({ titles: titles }), { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      }
    });
  }
}