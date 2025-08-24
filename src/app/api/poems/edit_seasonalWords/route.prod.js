import { getSession } from '../../neo4j_driver/route.prod.js';

// GET all seasonal words for dropdown
export async function GET(request) {
  const session = await getSession();
  
  try {
    const query = `
      MATCH (sw:Seasonal_Word)
      RETURN sw.english as english, sw.japanese as japanese
      ORDER BY sw.english ASC
    `;
    
    const result = await session.run(query);
    
    const seasonalWords = result.records.map(record => ({
      english: record.get('english'),
      japanese: record.get('japanese')
    }));
    
    return new Response(JSON.stringify(seasonalWords), { status: 200 });
  } catch (error) {
    console.error("GET seasonal words error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await session.close();
  }
}
