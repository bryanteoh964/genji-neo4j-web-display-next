import data from './data'

export const GET = async (request) => {
	try{
		const write = data;
    
		return new Response(JSON.stringify(write), {status: 200})
	} catch(error){
		return new Response(error,{status:500})
  	}
}