import data from './waley_indexes.json'

export const GET = async (request) => {
	try{
		const write = data;
    console.log()
		return new Response(JSON.stringify(write), {status: 200})
	} catch(error){
		return new Response(error,{status:500})
  	}
}