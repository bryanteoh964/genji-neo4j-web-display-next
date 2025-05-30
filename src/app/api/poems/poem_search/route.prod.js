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
            MATCH (p:Genji_Poem)
            ${q.toLowerCase() !== '=#=' ? `
            WHERE toLower(p.Japanese) CONTAINS toLower($q) 
            OR toLower(p.Romaji) CONTAINS toLower($q)
            OR EXISTS {
                    (p)<-[:TRANSLATION_OF]-(t:Translation)
                    WHERE toLower(t.translation) CONTAINS toLower($q)
                }
            ` : ''}
            WITH DISTINCT p
            OPTIONAL MATCH (p)<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(translator:People)
            OPTIONAL MATCH (p)<-[:ADDRESSEE_OF]-(addressee:Character)
            OPTIONAL MATCH (p)<-[:SPEAKER_OF]-(speaker:Character)
            OPTIONAL MATCH (p)-[:IN_SEASON_OF]->(season:Season)
            OPTIONAL MATCH (p)-[:USES_POETIC_TECHNIQUE_OF]->(pt:Poetic_Technique)
            OPTIONAL MATCH (p)-[:AT_GENJI_AGE_OF]->(ga:Genji_Age)
            WITH p, 
                collect(DISTINCT {translator_name: COALESCE(translator.name, ""), text: t.translation}) AS translations,
                collect(DISTINCT addressee.name) AS addressee_names,
                collect(DISTINCT addressee.gender) AS addressee_genders,
                speaker,
                season,
                pt,
                ga
            RETURN DISTINCT
                p.Japanese AS Japanese,
                p.pnum AS pnum,
                p.Romaji AS Romaji,
                COALESCE(p.paraphrase, "") AS paraphrase,
                COALESCE(apoc.text.join(addressee_names, " & "), "") AS addressee_name,
                COALESCE(apoc.text.join(addressee_genders, " & "), "") AS addressee_gender,
                COALESCE(speaker.name, "") AS speaker_name,
                COALESCE(speaker.gender, "") AS speaker_gender,
                COALESCE(speaker.color, "") AS speaker_color,
                COALESCE(season.name, "") AS season,
                COALESCE(pt.name, "") AS poetic_tech,
                COALESCE(ga.age, "") AS genji_age,
                COALESCE([x IN translations WHERE x.translator_name = "Waley"][0].text, "") AS Waley_translation,
                COALESCE([x IN translations WHERE x.translator_name = "Seidensticker"][0].text, "") AS Seidensticker_translation,
                COALESCE([x IN translations WHERE x.translator_name = "Tyler"][0].text, "") AS Tyler_translation,
                COALESCE([x IN translations WHERE x.translator_name = "Washburn"][0].text, "") AS Washburn_translation,
                COALESCE([x IN translations WHERE x.translator_name = "Cranston"][0].text, "") AS Cranston_translation
            ORDER BY p.pnum
        `;

        let res;
        try {
            res = await session.readTransaction(tx => tx.run(query, { q }));
        } catch (queryError) {
            console.error('Cypher query execution failed:', queryError);
            throw queryError;
        }

        await session.close();

        // Format and sort related poems
        if (res.records.length > 0) {
            const searchResults = res.records.map(record => ({
                chapterNum: toNativeTypes(record.get('pnum').substring(0, 2)),
                poemNum: toNativeTypes(record.get('pnum').substring(4)),
                chapterAbr: toNativeTypes(record.get('pnum').substring(2, 4)),
                japanese: toNativeTypes(record.get('Japanese')),
                romaji: toNativeTypes(record.get('Romaji')),
                paraphrase: toNativeTypes(record.get('paraphrase')),
                genji_age: toNativeTypes(record.get('genji_age')),
                addressee_name: toNativeTypes(record.get('addressee_name')),
                addressee_gender: toNativeTypes(record.get('addressee_gender')),
                speaker_name: toNativeTypes(record.get('speaker_name')),
                speaker_gender: toNativeTypes(record.get('speaker_gender')),
                speaker_color: toNativeTypes(record.get('speaker_color')), // Added to results
                season: toNativeTypes(record.get('season')),
                peotic_tech: toNativeTypes(record.get('poetic_tech')),
                waley_translation: toNativeTypes(record.get('Waley_translation')),
                seidensticker_translation: toNativeTypes(record.get('Seidensticker_translation')),
                tyler_translation: toNativeTypes(record.get('Tyler_translation')),
                washburn_translation: toNativeTypes(record.get('Washburn_translation')),
                cranston_translation: toNativeTypes(record.get('Cranston_translation'))
            }));

            return { searchResults };
        } else {
            console.log(`No poem found with name: ${q}`);
            return null;
        }
    }
    catch (error) {
        console.error('Error in generalSearch:', error);
        return null;
    }
}

// Export data from API endpoint
export const GET = async (request) => {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const gender = searchParams.get('gender'); // Get gender filter

    if (!q) {
        return new Response(JSON.stringify({ message: 'Search keyword is required' }), { status: 400 });
    }

    try {
        const data = await generalSearch(q, gender); // Pass gender to search
        if (data) {
            return new Response(JSON.stringify(data), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: 'Search keyword Not found' }), { status: 404 });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error in API", message: error.toString() }), { status: 500 });
    }
};