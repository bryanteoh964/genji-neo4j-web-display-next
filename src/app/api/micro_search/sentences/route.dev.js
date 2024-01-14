import sentence from '../waley_sentences.json' 

export const GET = async (request) => {
	try{
		const write = sentence;
    
		return new Response(JSON.stringify(write), {status: 200})
	} catch(error){
		return new Response(error,{status:500})
  	}
}