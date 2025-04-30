const { getSession } = require('../../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../../neo4j_driver/utils.prod.js';

async function getSourceData(blogTitle) {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (b:Blog {title: $title})<-[:INCLUDED_IN]-(s:Source) OPTIONAL MATCH (s)<-[:AUTHOR_OF]-(a:People) ORDER BY s.title RETURN s.title as title, a.name as author',
        { title: blogTitle }
      )
    );
    
    const sources = result.records.map(record => ({
      title: record.get('title') || null,
      author: record.get('author') || null
    }));
    
    return { sources };
  } catch(error) {
    console.error('Failed to fetch source info:', error);
    throw new Error('Failed to fetch source info');
  } finally {
    await session.close();
  }
}

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const blogTitle = searchParams.get('title');
    
    if (!blogTitle) {
      return new Response(JSON.stringify({ message: "Blog title is required" }), { status: 400 });
    }
    
    const { sources } = await getSourceData(blogTitle);
    
    if (!sources || sources.length === 0) {
      return new Response(JSON.stringify({ message: "No sources found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ sources }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}