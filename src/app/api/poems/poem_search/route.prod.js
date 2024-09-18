const { getSession } = require('../../neo4j_driver/route.prod.js');
const { toNativeTypes } = require('../../neo4j_driver/utils.prod.js');

// Query for getting character information
async function generalSearch(q) {
    try {
        const session = await getSession();
        
        
        // Neo4j cypher query to filter poems' Japanese, Romaji, Translation with search keyword q
        const query = `
            MATCH (p:Genji_Poem)
            WHERE p.Japanese CONTAINS $q OR p.Romaji CONTAINS $q
            OPTIONAL MATCH (p)<-[r:TRANSLATION_OF]-(t:Translation)<-[tr:TRANSLATOR_OF]-(translator:People)
            WITH p, 
                collect({translator_name: translator.name, text: t.translation}) AS translations
            RETURN 
                p.Japanese AS Japanese,
                p.pnum AS pnum,
                p.Romaji AS Romaji,
                COALESCE([x IN translations WHERE x.translator_name = "Waley"][0].text, "") AS Waley_translation,
                COALESCE([x IN translations WHERE x.translator_name = "Seidensticker"][0].text, "") AS Seidensticker_translation,
                COALESCE([x IN translations WHERE x.translator_name = "Tyler"][0].text, "") AS Tyler_translation,
                COALESCE([x IN translations WHERE x.translator_name = "Washburn"][0].text, "") AS Washburn_translation,
                COALESCE([x IN translations WHERE x.translator_name = "Cranston"][0].text, "") AS Cranston_translation
            `;
        
        const res = await session.readTransaction(tx => tx.run(query, { q }));
        console.log("res:", res.records)
        await session.close();

         // Format and sort related poems
        if (res.records.length > 0) {
            const searchResults = res.records.map(record => ({
                chapterNum: toNativeTypes(record.get('pnum').substring(0, 2)),
                poemNum: toNativeTypes(record.get('pnum').substring(2, 4)),
                //japanese: toNativeTypes(record.get('Japanese')),
                //romaji: toNativeTypes(record.get('Romaji')),
                //translation: record.get('p.introduction')
              }));
            //console.log("searchResult:", searchResults)
            return { searchResults };
        } else {
            console.log(`No poem found with name: ${q}`);
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
    const q = searchParams.get('q');

    if (!q) {
        return new Response(JSON.stringify({ message: 'search content is required' }), { status: 400 });
    }

    try {
        const data = await generalSearch(q);
        if (data) {
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error in API", message: error.toString() }), { status: 500 });
    }
}