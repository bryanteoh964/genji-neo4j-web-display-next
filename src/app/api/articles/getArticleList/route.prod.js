const { getSession } = require('../../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../../neo4j_driver/utils.prod.js';

async function getArticleNames() {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (a:Article) RETURN a.title as title ORDER BY a.title'
      )
    );
    
    const titles = result.records.map(record => record.get('title'));
    
    return { titles };
  } catch(error) {
    console.error('Failed to fetch article names:', error);
    throw new Error('Failed to fetch article names');
  } finally {
    await session.close();
  }
}

export const GET = async (request) => {
  try {
    const { titles } = await getArticleNames();
    
    if (!titles || titles.length === 0) {
      return new Response(JSON.stringify({ message: "No articles found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ titles: titles }), { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}