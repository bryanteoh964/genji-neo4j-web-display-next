import { getSession } from '../neo4j_driver/route.prod.js';
import { toNativeTypes } from '../neo4j_driver/utils.prod.js';

// Query for getting character information along with all character names
// Used in character page
async function getCharacterData(name) {
    try {
        const session = await getSession();

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
            WHERE poem IS NOT NULL
            
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
            RETURN c as character,
                collect(DISTINCT all.name) AS allCharacterNames,
                relatedCharacters,
                apoc.coll.sortMulti(unsortedPoems, ['chapter_number', 'pnum']) as relatedPoems
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

            return { character, relatedCharacters, relatedPoems, allCharacterNames };
        } else {
            console.log(`No character found with name: ${name}`);
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

    if (!name) {
        return new Response(JSON.stringify({ message: 'Character name is required' }), { status: 400 });
    }

    try {
        const data = await getCharacterData(name);
        if (data) {
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'Character not found' }), { status: 404 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error in API", message: error.toString() }), { status: 500 });
    }
}
