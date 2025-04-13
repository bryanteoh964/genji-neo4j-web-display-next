// /app/api/chapter_names/route.js
import { getSession } from '../neo4j_driver/route.prod.js';

export const GET = async () => {
  try {
    const session = await getSession();
    const resGraph = await session.readTransaction(tx => tx.run(
      `
      MATCH (c:Chapter)
      RETURN c.chapter_name AS name, c.chapter_number AS number, c.kanji AS kanji
      ORDER BY toInteger(c.chapter_number)
      `
    ));
    
    const chapterList = resGraph.records.map(record => ({
      name: record.get('name'),
      number: record.get('number'),
      kanji: record.get('kanji')
    }));
    
    return new Response(JSON.stringify(chapterList), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch chapter data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch chapter data" }), { status: 500 });
  }
};