import data from '../micro_search/data'

export const GET = async (request)=> {
	try{
    console.log('in progress')
		const write = data;
    
		return new Response(JSON.stringify(write), {status: 200})
	}catch(error){
		return new Response(error,{status:500})
  	}
}