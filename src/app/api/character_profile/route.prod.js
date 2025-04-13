import { getSession } from '../neo4j_driver/route.prod.js';
import { toNativeTypes } from '../neo4j_driver/utils.prod.js';

// Query for getting character information along with all character names
// Used in character page
async function getCharacterData(name) {
  console.log(`Searching for character: "${name}"`);
  
  try {
    const session = await getSession();
    
    // First, check if the character exists with a simple query
    const checkQuery = `
      MATCH (c:Character)
      WHERE toLower(c.name) = toLower($name)
      RETURN c.name as name
    `;
    
    const checkResult = await session.readTransaction(tx => tx.run(checkQuery, { name }));
    console.log(`Character check result records: ${checkResult.records.length}`);
    
    if (checkResult.records.length === 0) {
      console.log(`Character "${name}" not found in database`);
      
      // Get a list of available characters to help debugging
      const listQuery = `
        MATCH (c:Character)
        RETURN c.name as name
        ORDER BY c.name
        LIMIT 10
      `;
      
      const listResult = await session.readTransaction(tx => tx.run(listQuery));
      const availableCharacters = listResult.records.map(record => record.get('name'));
      console.log(`First 10 available characters: ${JSON.stringify(availableCharacters)}`);
      
      await session.close();
      return null;
    }
    
    // Neo4j cypher query to fetch character data, related characters, and related poems
    const query = `
        MATCH (c:Character)
        WHERE toLower(c.name) = toLower($name)
        OPTIONAL MATCH (c)-[r1]->(related:Character)
        // Find poems where the character is involved (as speaker, addressee, or messenger)
        OPTIONAL MATCH (poem:Genji_Poem)<-[r2:ADDRESSEE_OF|MESSENGER_OF|SPEAKER_OF]-(c)
        OPTIONAL MATCH (poem)-[:INCLUDED_IN]->(chapter:Chapter)
        // Get speaker and addressee info for each poem
        OPTIONAL MATCH (poem)<-[:SPEAKER_OF]-(speaker:Character)
        OPTIONAL MATCH (poem)<-[:ADDRESSEE_OF]-(addressee:Character)
        WITH c, related, r1, poem, chapter, speaker, addressee
        WHERE poem IS NOT NULL OR related IS NOT NULL
        WITH c,
        collect(DISTINCT {name: related.name, relationship: type(r1), gender: related.gender}) as relatedCharacters,
        collect(DISTINCT {
        pnum: poem.pnum,
        Japanese: poem.Japanese,
        Romaji: poem.Romaji,
        speaker_name: COALESCE(speaker.name, ""),
        speaker_gender: COALESCE(speaker.gender, ""),
        addressee_name: COALESCE(addressee.name, ""),
        addressee_gender: COALESCE(addressee.gender, ""),
        chapter_number: chapter.chapter_number
        }) as unsortedPoems
        // Query for all character names in the database
        OPTIONAL MATCH (all:Character)
        WITH c, relatedCharacters, unsortedPoems, collect(DISTINCT all.name) AS allCharacterNamesRaw,
            [poem IN unsortedPoems WHERE poem.pnum IS NOT NULL AND poem.chapter_number IS NOT NULL] AS sortablePoems
        RETURN c as character,
        apoc.coll.sort(allCharacterNamesRaw) AS allCharacterNames,
        relatedCharacters,
        apoc.coll.sortMulti(sortablePoems, ['chapter_number', 'pnum']) as relatedPoems
    `;
    
    const res = await session.readTransaction(tx => tx.run(query, { name }));
    await session.close();
    
    // Format and return the data
    if (res.records.length > 0) {
      const record = res.records[0];
      const character = toNativeTypes(record.get('character').properties);
      const relatedCharacters = toNativeTypes(record.get('relatedCharacters'));
      const relatedPoems = toNativeTypes(record.get('relatedPoems'));
      const allCharacterNames = toNativeTypes(record.get('allCharacterNames'));
      
      console.log(`Character found: ${character.name}`);
      console.log(`Related characters count: ${relatedCharacters.length}`);
      console.log(`Related poems count: ${relatedPoems.length}`);
      
      return { character, relatedCharacters, relatedPoems, allCharacterNames };
    } else {
      console.log(`No character data returned for: ${name}`);
      return null;
    }
  } catch (error) {
    console.error(`Error in getCharacterData: ${error}`);
    return { "error": "Error in getCharacterData()", "message": error.toString() };
  }
}

// Export data from API endpoint
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  
  console.log(`API request for character: ${name}`);
  
  if (!name) {
    console.log('No character name provided in request');
    return new Response(JSON.stringify({ message: 'Character name is required' }), { status: 400 });
  }
  
  try {
    const data = await getCharacterData(name);
    
    if (data) {
      console.log(`Returning data for character: ${name}`);
      return new Response(JSON.stringify(data), { status: 200 });
    } else {
      console.log(`Character not found: ${name}`);
      return new Response(JSON.stringify({ message: 'Character not found' }), { status: 404 });
    }
  } catch (error) {
    console.error(`API error: ${error}`);
    return new Response(JSON.stringify({ error: "Error in API", message: error.toString() }), { status: 500 });
  }
}