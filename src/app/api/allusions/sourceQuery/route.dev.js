const { getSession } = require('../../neo4j_driver/route.dev.js');

export const POST = async (request )=> {
	try{
		// const session = await getSession();
		// const{searchParams} = new URL(request.url)
		// const sourceQuery = searchParams.get('sourceQuery')
		// let write = await session.writeTransaction(tx => tx.run(sourceQuery))

		const write = undefined;

		return new Response(JSON.stringify(write), {status: 200})
	}catch(error){
		return new Response(error,{status:500})
	}
}