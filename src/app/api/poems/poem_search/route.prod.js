const { getSession } = require('../../neo4j_driver/route.prod.js');
const { toNativeTypes } = require('../../neo4j_driver/utils.prod.js');
//var kuromoji = require("kuromoji");


// let tokenizer = null;
// const initializeTokenizer = () => {
//   return new Promise((resolve, reject) => {
//     if (tokenizer) {
//       resolve(tokenizer);
//     } else {
//       kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((err, _tokenizer) => {
//         if(err) {
//           reject(err);
//         } else {
//           tokenizer = _tokenizer;
//           resolve(tokenizer);
//         }
//       });
//     }
//   });
// };


// async function tokenizeJapanese(text) {
//     try {
//       const _tokenizer = await initializeTokenizer();
//       const tokens = _tokenizer.tokenize(text);
//       return tokens.map(token => token.surface_form);
//     } catch (error) {
//       console.error('Tokenization error:', error);
//       return [text]; // if failed tokenizing, return original text
//     }
//   }

  

// api for keyword poem search
async function generalSearch(q) {
    try {
        const session = await getSession();
        //const searchTerms = await tokenizeJapanese(q);
        //console.log('Tokenized search terms:', searchTerms);
        //const searchTerms = [q];
        
        // Neo4j cypher query to filter poems' Japanese, Romaji(, Translation) with search keyword q
        const query = `
        ${q.toLowerCase() === '=#=' ? `
            MATCH (p:Genji_Poem)
        ` : `
            MATCH (p:Genji_Poem)
            WHERE toLower(p.Japanese) CONTAINS toLower($q) OR toLower(p.Romaji) CONTAINS toLower($q)
            OR EXISTS {
                (p)<-[:TRANSLATION_OF]-(t:Translation)
                WHERE toLower(t.translation) CONTAINS toLower($q)
            }
        `}
        WITH DISTINCT p
        MATCH (p)<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(translator:People)
        WITH p, 
            collect({translator_name: translator.name, text: t.translation}) AS translations
        OPTIONAL MATCH (p)<-[:ADDRESSEE_OF]-(addressee:Character)
        OPTIONAL MATCH (p)<-[:SPEAKER_OF]-(speaker:Character)
        OPTIONAL MATCH (p)-[:IN_SEASON_OF]->(season:Season)
        OPTIONAL MATCH (p)-[:USES_POETIC_TECHNIQUE_OF]->(pt:Poetic_Technique)
        RETURN DISTINCT
            p.Japanese AS Japanese,
            p.pnum AS pnum,
            p.Romaji AS Romaji,
            COALESCE(addressee.name, "") AS addressee_name,
            COALESCE(addressee.gender, "") AS addressee_gender,
            COALESCE(speaker.name, "") AS speaker_name,
            COALESCE(speaker.gender, "") AS speaker_gender,
            COALESCE(season.name, "") AS season,
            COALESCE(pt.name, "") AS poetic_tech,
            COALESCE([x IN translations WHERE x.translator_name = "Waley"][0].text, "") AS Waley_translation,
            COALESCE([x IN translations WHERE x.translator_name = "Seidensticker"][0].text, "") AS Seidensticker_translation,
            COALESCE([x IN translations WHERE x.translator_name = "Tyler"][0].text, "") AS Tyler_translation,
            COALESCE([x IN translations WHERE x.translator_name = "Washburn"][0].text, "") AS Washburn_translation,
            COALESCE([x IN translations WHERE x.translator_name = "Cranston"][0].text, "") AS Cranston_translation
        ORDER BY p.pnum
    `;
        
        const res = await session.readTransaction(tx => tx.run(query, { q }));
        // console.log("res:", res.records)
        await session.close();

         // Format and sort related poems
        if (res.records.length > 0) {
            const searchResults = res.records.map(record => ({
                chapterNum: toNativeTypes(record.get('pnum').substring(0, 2)),
                poemNum: toNativeTypes(record.get('pnum').substring(4)),
                japanese: toNativeTypes(record.get('Japanese')),
                romaji: toNativeTypes(record.get('Romaji')),
                addressee_name: toNativeTypes(record.get('addressee_name')),
                addressee_gender: toNativeTypes(record.get('addressee_gender')),
                speaker_name: toNativeTypes(record.get('speaker_name')),
                speaker_gender: toNativeTypes(record.get('speaker_gender')),
                season: toNativeTypes(record.get('season')),
                peotic_tech: toNativeTypes(record.get('poetic_tech')),
                waley_translation: toNativeTypes(record.get('Waley_translation')),
                seidensticker_translation: toNativeTypes(record.get('Seidensticker_translation')),
                tyler_translation: toNativeTypes(record.get('Tyler_translation')),
                washburn_translation: toNativeTypes(record.get('Washburn_translation')),
                cranston_translation: toNativeTypes(record.get('Cranston_translation'))

              }));
            //console.log("searchResult:", searchResults)
            return { searchResults };
        } else {
            console.log(`No poem found with name: ${q}`);
            return null;
        }
    } catch (error) {
        //console.error(`Error in generalSearch: ${error}`);
        return { "error": "Error in generalSearch()", "message": error.toString() };
    }
}

// Export data from API endpoint
export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return new Response(JSON.stringify({ message: 'Search keyword is required' }), { status: 400 });
    }

    try {
        const data = await generalSearch(q);
        if (data) {
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'Search keyword Not found' }), { status: 404 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error in API", message: error.toString() }), { status: 500 });
    }
}