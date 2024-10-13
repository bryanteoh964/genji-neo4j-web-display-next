const { getSession } = require('../neo4j_driver/route.prod.js');
const { toNativeTypes } = require('../neo4j_driver/utils.prod.js');

// Query for getting character information
async function getCharacterData(name) {
    try {
        const session = await getSession();
        
        
        // Neo4j cypher query to fetch character data, related characters, and related poems
        const query = `
            MATCH (c:Character)
            WHERE toLower(c.name) = toLower($name) 
            OPTIONAL MATCH (c)-[r1]->(related:Character)
            OPTIONAL MATCH (c)-[r2:ADDRESSEE_OF|MESSENGER_OF|SPEAKER_OF]->(poem:Genji_Poem)-[:INCLUDED_IN]->(chapter:Chapter)
            WITH c, related, r1, poem, chapter, r2,
                 count(poem) + 1 as poemCountInChapter
            WITH c,
                collect(DISTINCT {name: related.name, relationship: type(r1)}) as relatedCharacters,
                collect(DISTINCT {
                    poem: poem,
                    chapter: chapter,
                    relationship: type(r2),
                    poemNumber: poemCountInChapter,
                    chapterNumber: chapter.chapter_number
                }) as unsortedPoems
            RETURN c as character,
                relatedCharacters,
                apoc.coll.sortMulti(unsortedPoems, ['chapterNumber', 'poemNumber']) as relatedPoems
        `;
        
        const res = await session.readTransaction(tx => tx.run(query, { name }));

        await session.close();

         // Format and sort related poems
        if (res.records.length > 0) {
            const record = res.records[0];
            const character = toNativeTypes(record.get('character').properties);
            const relatedCharacters = toNativeTypes(record.get('relatedCharacters'));
            const rawRelatedPoems = toNativeTypes(record.get('relatedPoems'));

            const relatedPoems = Object.values(rawRelatedPoems)
                .filter(poem => poem && poem.poem && poem.chapter)
                .map(poem => {
                    const pnum = poem.poem.properties.pnum;
                    const chapterNum = pnum.substring(0, 2);
                    const poemNum = pnum.substring(4);
                    return {
                        ...poem,
                        poem: poem.poem.properties,
                        chapter: poem.chapter.properties,
                        chapterNum,
                        poemNum,
                        url: `/poems/${parseInt(chapterNum)}/${parseInt(poemNum)}`
                    };
                })
                .sort((a, b) => {
                    if (a.chapterNum !== b.chapterNum) {
                        return parseInt(a.chapterNum) - parseInt(b.chapterNum);
                    }
                    return parseInt(a.poemNum) - parseInt(b.poemNum);
                });

            return { character, relatedCharacters, relatedPoems };
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
export const GET = async (request) => {
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