import dirver from '../neo4j_dirver';

async function getData (chapter, number){
  try{
    const session = driver.session();
    //all the get method and return the db data
  }catch(error){
    return error;
  }
}

export const GET = async (request) =>{
    try {   
      const{searchParams} = new URL(request.url);
      const chapter = searchParams.get('chapter')
      const number = searchParams.get('number')
      const data = await getData(chapter,number)
      const formattedData = formatData(data);

      return new Response(JSON.stringify(formattedData), {status: 200})
  }catch (error){
    return new Response(error, {status: 500})
  }
} 