import waley from '../waley_sentences.json' 

let washburn = {}
let seidensticker = {}
let tyler = {}

/*
export const GET = async (request) => {
	try{
		const write = waley;
    
		return new Response(JSON.stringify(write), {status: 200})
	} catch(error){
		return new Response(error,{status:500})
  	}
}
*/
async function getData(index) {
	
	//return waley[index+2];
	//const newindex = index+2;
	return waley[index];
}

export const GET = async (request) => {
	try{
		const {searchParams} = new URL(request.url);
		let index = searchParams.get('index')
	

		//const translation = searchParams.get('translation')
		index = parseInt(index)+2
	
		const data = await getData(index);

		return new Response(JSON.stringify(data), {status: 200})
	} catch(error){
		return new Response(error,{status:500})
  	}
}