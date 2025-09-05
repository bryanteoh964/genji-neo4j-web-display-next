const { getSession } = require('../../neo4j_driver/route.prod.js');
import { toNativeTypes } from '../../neo4j_driver/utils.prod.js';

async function getBlogData(title) {
  const session = await getSession();

  try {
    const result = await session.readTransaction(tx => 
      tx.run(
        'MATCH (b:Blog {title: $title}) OPTIONAL MATCH (b)<-[:AUTHOR_OF]-(a:People) RETURN b.content as content, b.showOnPage as showOnPage, a.email as authorEmail, a.is_user as isUser',
        { title }
      )
    );
    
    const content = result.records[0]?.get('content') || null;
    const showOnPage = result.records[0]?.get('showOnPage') || false;
    const authorEmail = result.records[0]?.get('authorEmail') || null;
    const isUser = result.records[0]?.get('isUser') || null;

    
    return { content, showOnPage, authorEmail, isUser };
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
    
    const { content, showOnPage, authorEmail, isUser } = await getBlogData(title);
    
    if (!content) {
      return new Response(JSON.stringify({ message: "Blog not found" }), { status: 404 });
    }
    
    return new Response(JSON.stringify({ content: content, showOnPage: showOnPage, authorEmail: authorEmail, isUser: isUser }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}