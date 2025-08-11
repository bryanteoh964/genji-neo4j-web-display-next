import { getSession } from '../../neo4j_driver/route.prod.js';

// GET all places for dropdown
export async function GET(request) {
  const session = await getSession();
  
  try {
    const query = `
      MATCH (p:Place)
      RETURN p.name as name
      ORDER BY p.name ASC
    `;
    
    const result = await session.run(query);
    
    const places = result.records.map(record => record.get('name'));
    
    return new Response(JSON.stringify(places), { status: 200 });
  } catch (error) {
    console.error("GET places error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await session.close();
  }
}
