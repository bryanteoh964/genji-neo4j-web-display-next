const { getSession } = require('../neo4j_driver/route.js');



export const GET = async (request )=> {
  try{
    const session = await getSession();
    const{searchParams} = new URL(request.url)
    const sourceQuery = searchParams.get('sourceQuery')

    let write = await session.writeTransaction(tx => tx.run(sourceQuery))

    
    console.log('sucess',write)
    return new Response(JSON.stringify(write), {status: 200})
  }catch(error){
    return new Response(error,{status:500})
  }
}