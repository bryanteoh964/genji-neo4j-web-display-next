const { getSession } = require('../../neo4j_driver/route.prod.js');
import { auth } from "../../../../auth.prod";

async function updateBlog(title, content) {
  const session = await getSession();

  try {
    const result = await session.writeTransaction(tx => 
      tx.run(
        'MATCH (b:Blog {title: $title}) SET b.content = $content RETURN b',
        { title, content }
      )
    );
    
    if (result.records.length === 0) {
      throw new Error('Blog not found');
    }
    
    return { success: true };
  } catch(error) {
    console.error('Failed to update blog:', error);
    throw new Error('Failed to update blog');
  } finally {
    await session.close();
  }
}

export const POST = async (request) => {
  try {
    // Check if user is authenticated
    const session = await auth();
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: Add proper admin role check when roles are implemented
    // if (session.user.role !== 'admin') {
    //   return new Response(JSON.stringify({ message: "Forbidden" }), { 
    //     status: 403,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }

    const { title, content } = await request.json();
    
    if (!title || content === undefined) {
      return new Response(JSON.stringify({ message: "Title and content are required" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const result = await updateBlog(title, content);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Blog updated successfully" 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    return new Response(JSON.stringify({ 
      message: "Internal server error",
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
