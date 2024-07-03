const { getSession } = require('../neo4j_driver/route.prod.js');
const { toNativeTypes } = require('../neo4j_driver/utils.prod.js');

// Query for getting character information
async function getCharacterData(name) {
    try {
        const session = await getSession();
        console.log(`Searching for character: ${name}`);
        
        // Run query
        const query = `
            MATCH (c:Character)
            WHERE toLower(c.name) = toLower($name) 
            OPTIONAL MATCH (c)-[r]->(related:Character)
            RETURN c as character, 
                collect(DISTINCT {name: related.name, relationship: type(r)}) as relatedCharacters
        `;
        const res = await session.readTransaction(tx => tx.run(query, { name }));

        await session.close();

        if (res.records.length > 0) {
            const record = res.records[0];
            const character = toNativeTypes(record.get('character').properties);
            const relatedCharacters = toNativeTypes(record.get('relatedCharacters'));

            return { character, relatedCharacters };
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