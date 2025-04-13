import { getSession } from '../neo4j_driver/route.prod.js';
import { toNativeTypes } from '../neo4j_driver/utils.prod.js';

async function getChapterData(name) {
  console.log(`Searching for chapter: "${name}"`);
  
  try {
    const session = await getSession();

    // First, check if chapter exists
    const checkQuery = `
      MATCH (ch:Chapter)
      WHERE toLower(ch.chapter_name) = toLower($name)
      RETURN ch.chapter_name as name
    `;

    const checkResult = await session.readTransaction(tx => tx.run(checkQuery, { name }));
    if (checkResult.records.length === 0) {
      console.log(`Chapter "${name}" not found`);
      await session.close();
      return null;
    }

    const query = `
      MATCH (ch:Chapter)
      WHERE toLower(ch.chapter_name) = toLower($name)

      CALL {
        WITH ch
        MATCH (poem:Genji_Poem)-[:INCLUDED_IN]->(ch)
        OPTIONAL MATCH (poem)<-[:SPEAKER_OF]-(speaker:Character)
        OPTIONAL MATCH (poem)<-[:ADDRESSEE_OF]-(addressee:Character)
        RETURN poem, speaker, addressee
        ORDER BY toInteger(apoc.text.regexGroups(poem.pnum, '\\d+$')[0][0])
      }

      RETURN 
        ch {
          .chapter_name,
          .chapter_number,
          .kanji
        } AS chapter,
        collect(DISTINCT {
          pnum: poem.pnum,
          Japanese: poem.Japanese,
          Romaji: poem.Romaji,
          speaker_name: COALESCE(speaker.name, ""),
          speaker_gender: COALESCE(speaker.gender, ""),
          addressee_name: COALESCE(addressee.name, ""),
          addressee_gender: COALESCE(addressee.gender, "")
        }) AS poems

    `;

    const res = await session.readTransaction(tx => tx.run(query, { name }));
    await session.close();

    if (res.records.length > 0) {
      const record = res.records[0];
      const chapter = toNativeTypes(record.get('chapter'));
      const poems = toNativeTypes(record.get('poems'));

      // console.log(`Chapter found: ${chapter.chapter_name} with ${poems.length} poems`);

      return { chapter, poems };
    } else {
      console.log(`No data found for chapter: ${name}`);
      return null;
    }

  } catch (error) {
    console.error(`Error in getChapterData: ${error}`);
    return { error: "Error in getChapterData()", message: error.toString() };
  }
}

// API route
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');

  // console.log("API /chapter_profile called with name:", name); // 👈 add this

  if (!name) {
    return new Response(JSON.stringify({ message: 'Chapter name is required' }), { status: 400 });
  }

  try {
    const data = await getChapterData(name);
    // console.log("Data received:", data); // 👈 and this

    if (data) {
      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: 'Chapter not found' }), { status: 404 });
    }

  } catch (error) {
    console.error(`API error: ${error}`);
    return new Response(JSON.stringify({ error: "Error in API", message: error.toString() }), { status: 500 });
  }
}
