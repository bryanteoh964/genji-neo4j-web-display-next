const { getSession } = require('../neo4j_driver/route.js');
    


export const GET = async (request )=> {
  try{const session = await getSession();
    const{searchParams} = new URL(request.url)
    const key = searchParams.get('key')
    const selectedTranslation = searchParams.get('selectedTranslation')
    const translation = searchParams.get('translation')
    let write = await session.writeTransaction(tx => tx.run('MATCH (h:Honka {id: $key}), (p:People {name:$selectedTranslation}) CREATE (t:Translation {translation: $translation}) MERGE (h)<-[:TRANSLATION_OF]-(t)<-[:TRANSLATOR_OF]-(p) return "OK"', {key: key, selectedTranslation: selectedTranslation, translation: translation}
    ))
    console.log('sucess',write)
    return new Response(JSON.stringify(write), {status: 200})
  }catch(error){
    return new Response(error,{status:500})
  }
}