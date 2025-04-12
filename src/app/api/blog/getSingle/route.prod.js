const { getSession } = require('../../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../../neo4j_driver/utils.prod.js';

async function getBlogData(title) {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (b:Blog {title: $title}) RETURN b.content as content',
        { title }
      )
    );
    
    const content = result.records[0]?.get('content') || null;
    
    return { content };
  } catch(error) {
    console.error('Failed to fetch blog info:', error);
    throw new Error('Failed to fetch blog info');
  } finally {
    await session.close();
  }
}

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    
    if (!title) {
      return new Response(JSON.stringify({ message: "Blog title is required" }), { status: 400 });
    }
    
    const { content } = await getBlogData(title);
    
    if (!content) {
      return new Response(JSON.stringify({ message: "Blog not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ content: content }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}