import { getChpList } from '../utils.js';

export const GET = async (request) =>{
	try {
		const data = await getChpList();

		return new Response(JSON.stringify(data), {status: 200})
	}catch (error){
		return new Response(error, {status: 500})
	}
} 