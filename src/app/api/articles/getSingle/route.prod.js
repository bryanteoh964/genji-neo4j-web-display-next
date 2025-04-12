const { getSession } = require('../../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../../neo4j_driver/utils.prod.js';

async function getArticleData(title) {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (a:Article {title: $title}) RETURN a.content as content',
        { title }
      )
    );
    
    const content = result.records[0]?.get('content') || null;
    
    return { content };
  } catch(error) {
    console.error('Failed to fetch article info:', error);
    throw new Error('Failed to fetch article info');
  } finally {
    await session.close();
  }
}

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    
    if (!title) {
      return new Response(JSON.stringify({ message: "Article title is required" }), { status: 400 });
    }
    
    const { content } = await getArticleData(title);
    
    if (!content) {
      return new Response(JSON.stringify({ message: "Article not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ content: content }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}