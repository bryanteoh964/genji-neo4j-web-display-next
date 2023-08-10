const { getSession } = require('../../neo4j_driver/route.dev.js');
const { toNativeTypes, valueToNativeType, getChpList } = require('../../neo4j_driver/utils.dev.js');

// Query for getting chapter information
async function getChapterInfo() {
    try{
        const session = await getSession();

        // Run query
        const query = 'match (:Genji_Poem)-[r:INCLUDED_IN]->(c:Chapter) return c.chapter_number as num, c.chapter_name as name, count(r) as count'
        const res = await session.readTransaction(tx => tx.run(query))
        let chp = []
        const ls = getChpList()
        res.records.forEach(element => {
            chp.push({
                num: Object.values(toNativeTypes(element.get('num'))).join(''),
                count: toNativeTypes(element.get('count')).low,
                name: ls[chp.length]
            })
        });

        await session.close();

        return chp;
    } catch (error) {
        return {"error": "Error in getChapterInfo()", "message": error};
    }
}

// Export data from API endpoint
export const GET = async (request) => {
    try{
        const get = await getChapterInfo();
        return new Response(JSON.stringify(get), {status: 200})
    } catch (error) {
        return new Response(error, {status: 500})
    }
}