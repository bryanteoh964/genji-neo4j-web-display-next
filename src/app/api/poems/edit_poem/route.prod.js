import { getSession } from '../../neo4j_driver/route.prod.js';

// Update (PUT) existing poem
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pnum = searchParams.get("pnum");

    if (!pnum) {
      return new Response(JSON.stringify({ error: "Missing pnum param" }), { status: 400 });
    }

    const data = await request.json();

    await updatePoemProperties(pnum, data);

    return new Response(JSON.stringify({ message: "Poem updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getSession();
  
  try {
    const { searchParams } = new URL(request.url);
    const pnum = searchParams.get("pnum");
    const field = searchParams.get("field");

    if (!pnum || !field) {
      return new Response(JSON.stringify({ error: "Missing pnum or field param" }), { status: 400 });
    }

    // **Sanitize field name** - expanded to include season and other allowed fields
    const allowedFields = ["Spoken", "Written", "season", "paper_or_medium_type", "delivery_style", "season_evidence", "narrative_context", "paraphrase", "notes", "pt", "tag", "placeOfComp", "placeOfReceipt", "placeOfComp_evidence", "placeOfReceipt_evidence", "evidence_for_spoken_or_written"];
    if (!allowedFields.includes(field)) {
      return new Response(JSON.stringify({ error: "Invalid field param" }), { status: 400 });
    }

    // Handle season deletion specially (remove relationship)
    if (field === "season") {
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})-[r:IN_SEASON_OF]->(s:Season)
        DELETE r
        RETURN g
      `;
      
      const result = await session.run(query, { pnum });
      
      if (result.records.length > 0) {
        return new Response(JSON.stringify({ message: "Season relationship deleted successfully" }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ message: "No season relationship found to delete" }), { status: 200 });
      }
    } 
    // Handle season_evidence deletion specially (remove evidence property from relationship)
    else if (field === "season_evidence") {
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})-[r:IN_SEASON_OF]->(s:Season)
        REMOVE r.evidence
        RETURN r
      `;
      
      const result = await session.run(query, { pnum });
      
      if (result.records.length > 0) {
        return new Response(JSON.stringify({ message: "Season evidence property deleted successfully" }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ message: "No season relationship found to delete evidence from" }), { status: 200 });
      }
    } 
    // Handle poetic techniques deletion specially (remove all EMPLOYS_POETIC_TECHNIQUE relationships)
    else if (field === "pt") {
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})-[r:EMPLOYS_POETIC_TECHNIQUE]->(pt:Poetic_Technique)
        DELETE r
        RETURN count(r) as deletedCount
      `;
      
      const result = await session.run(query, { pnum });
      
      const deletedCount = result.records[0]?.get("deletedCount")?.toNumber() || 0;
      return new Response(JSON.stringify({ message: `Deleted ${deletedCount} poetic technique relationships` }), { status: 200 });
    } 
    // Handle poem types/tags deletion specially (remove all TAGGED_AS relationships)
    else if (field === "tag") {
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})-[r:TAGGED_AS]->(t:Tag)
        DELETE r
        RETURN count(r) as deletedCount
      `;
      
      const result = await session.run(query, { pnum });
      
      const deletedCount = result.records[0]?.get("deletedCount")?.toNumber() || 0;
      return new Response(JSON.stringify({ message: `Deleted ${deletedCount} poem type relationships` }), { status: 200 });
    } 
    // Handle place of composition deletion specially (remove PLACE_OF_COMPOSITION relationship)
    else if (field === "placeOfComp") {
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})-[r:PLACE_OF_COMPOSITION]->(p:Place)
        DELETE r
        RETURN count(r) as deletedCount
      `;
      
      const result = await session.run(query, { pnum });
      
      const deletedCount = result.records[0]?.get("deletedCount")?.toNumber() || 0;
      return new Response(JSON.stringify({ message: `Deleted ${deletedCount} place of composition relationships` }), { status: 200 });
    } 
    // Handle place of receipt deletion specially (remove PLACE_OF_RECEIPT relationship)
    else if (field === "placeOfReceipt") {
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})-[r:PLACE_OF_RECEIPT]->(p:Place)
        DELETE r
        RETURN count(r) as deletedCount
      `;
      
      const result = await session.run(query, { pnum });
      
      const deletedCount = result.records[0]?.get("deletedCount")?.toNumber() || 0;
      return new Response(JSON.stringify({ message: `Deleted ${deletedCount} place of receipt relationships` }), { status: 200 });
    } 
    // Handle place evidence deletion specially (remove evidence property from place relationships)
    else if (field === "placeOfComp_evidence") {
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})-[r:PLACE_OF_COMPOSITION]->(p:Place)
        REMOVE r.evidence
        RETURN r
      `;
      
      const result = await session.run(query, { pnum });
      
      if (result.records.length > 0) {
        return new Response(JSON.stringify({ message: "Place of composition evidence deleted successfully" }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ message: "No place of composition relationship found to delete evidence from" }), { status: 200 });
      }
    } 
    else if (field === "placeOfReceipt_evidence") {
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})-[r:PLACE_OF_RECEIPT]->(p:Place)
        REMOVE r.evidence
        RETURN r
      `;
      
      const result = await session.run(query, { pnum });
      
      if (result.records.length > 0) {
        return new Response(JSON.stringify({ message: "Place of receipt evidence deleted successfully" }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ message: "No place of receipt relationship found to delete evidence from" }), { status: 200 });
      }
    } 
    else {
      // Handle other field deletions (remove property)
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})
        REMOVE g.\`${field}\`
        RETURN g
      `;

      const result = await session.run(query, { pnum });

      if (result.records.length > 0) {
        return new Response(JSON.stringify({ message: `Field '${field}' deleted successfully` }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: "Poem not found" }), { status: 404 });
      }
    }
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    await session.close();
  }
}

// Optional GET if needed
export async function GET(request) {
  return new Response(JSON.stringify({ message: "GET method" }), { status: 200 });
}

async function updatePoemProperties(pnum, data) {
  const session = await getSession();

  const translatorMap = {
    Waley: "A",
    Seidensticker: "S",
    Tyler: "T",
    Washburn: "W",  // check if "A" is correct for Washburn in your DB
    Cranston: "C"
  };

  const validSeasons = ["Spring", "Summer", "Autumn", "Winter"];

  try {
    await session.writeTransaction(async (tx) => {
      // 1️⃣ Update main Genji_Poem properties
      const query = `
        MATCH (g:Genji_Poem {pnum: $pnum})
        SET g += $props
        RETURN g, g.pnum as pnum
      `;

      const props = {};

      if (data.deliveryStyle !== undefined) props.delivery_style = data.deliveryStyle || null;
      if (data.spoken_or_written_evidence !== undefined) props.evidence_for_spoken_or_written = data.spoken_or_written_evidence || null;
      if (data.age !== undefined) props.age = data.age || null;
      if (data.JPRM !== undefined && Array.isArray(data.JPRM)) {
        props.Japanese = data.JPRM[0] || null;
        props.Romaji = data.JPRM[1] || null;
      }
      if (data.narrativeContext !== undefined) props.narrative_context = data.narrativeContext || null;
      if (data.notes !== undefined) props.notes = data.notes || null;
      if (data.paperMediumType !== undefined) props.paper_or_medium_type = data.paperMediumType || null;
      if (data.paraphrase !== undefined) props.paraphrase = data.paraphrase || null;
      if (data.spoken !== undefined) props.Spoken = (data.spoken !== undefined && data.spoken !== null) ? String(data.spoken).toLowerCase() : null;
      if (data.written !== undefined) props.Written = (data.written !== undefined && data.written !== null) ? String(data.written).toLowerCase() : null;
      if (data.handwritingDescription !== undefined) props.handwriting_description = data.handwritingDescription || null;
      if (data.kigo !== undefined) props.kigo = data.kigo || null;
      if (data.pw !== undefined) props.pivot_words = data.pw || null;
      if (data.proxy !== undefined) props.proxy = data.proxy || null;
      if (data.messenger !== undefined) props.messenger = data.messenger || null;
      if (data.repCharacter !== undefined) props.representative_character = data.repCharacter || null;
      if (data.groupPoems !== undefined) props.group_poems = data.groupPoems || null;
      if (data.furtherReadings !== undefined) props.further_readings = data.furtherReadings || null;

      await tx.run(query, { pnum: pnum.toString(), props });

      // 2️⃣ Handle season relationship
      if (data.season !== undefined) {
        // First, remove any existing season relationship
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:IN_SEASON_OF]->(s:Season)
          DELETE r
        `, { pnum: pnum.toString() });

        // Then, if a valid season is provided, create new relationship
        if (data.season && validSeasons.includes(data.season)) {
          // Create relationship with evidence property if provided
          const evidence = data.season_evidence || null;
          
          await tx.run(`
            MATCH (g:Genji_Poem {pnum: $pnum})
            MATCH (s:Season {name: $seasonName})
            CREATE (g)-[r:IN_SEASON_OF]->(s)
            SET r.evidence = $evidence
          `, { 
            pnum: pnum.toString(), 
            seasonName: data.season,
            evidence: evidence
          });
        } else if (data.season && !validSeasons.includes(data.season)) {
          console.warn(`Invalid season provided: ${data.season}. Valid options: ${validSeasons.join(', ')}`);
        }
      }

      // 2️⃣b Handle season_evidence separately (update evidence property on existing relationship)
      if (data.season_evidence !== undefined && data.season === undefined) {
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:IN_SEASON_OF]->(s:Season)
          SET r.evidence = $evidence
        `, { 
          pnum: pnum.toString(),
          evidence: data.season_evidence || null
        });
      }

      // 2️⃣c Handle poetic techniques relationships
      if (data.pt !== undefined) {
        // First, remove all existing poetic technique relationships
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:EMPLOYS_POETIC_TECHNIQUE]->(pt:Poetic_Technique)
          DELETE r
        `, { pnum: pnum.toString() });

        // Parse the pt data and create new relationships for selected techniques
        let ptData = [];
        try {
          ptData = Array.isArray(data.pt) ? data.pt : JSON.parse(data.pt);
        } catch (e) {
          ptData = [];
        }

        if (Array.isArray(ptData)) {
          // Create relationships for techniques that are marked as true
          for (const [techniqueName, isSelected] of ptData) {
            if (isSelected) {
              // First check if the Poetic_Technique node exists
              const checkQuery = `
                MATCH (pt:Poetic_Technique {name: $techniqueName})
                RETURN pt.name as name
              `;
              
              const checkResult = await tx.run(checkQuery, { techniqueName: techniqueName });
              
              if (checkResult.records.length === 0) {
                continue;
              }
              
              // Create the relationship
              await tx.run(`
                MATCH (g:Genji_Poem {pnum: $pnum})
                MATCH (pt:Poetic_Technique {name: $techniqueName})
                CREATE (g)-[r:EMPLOYS_POETIC_TECHNIQUE]->(pt)
              `, { 
                pnum: pnum.toString(), 
                techniqueName: techniqueName
              });
            }
          }
        }
      }

      // 2️⃣d Handle poem types/tags relationships
      if (data.tag !== undefined) {
        // First, remove all existing tag relationships
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:TAGGED_AS]->(t:Tag)
          DELETE r
        `, { pnum: pnum.toString() });

        // Parse the tag data and create new relationships for selected types
        let tagData = [];
        try {
          tagData = Array.isArray(data.tag) ? data.tag : JSON.parse(data.tag);
        } catch (e) {
          tagData = [];
        }

        if (Array.isArray(tagData)) {
          // Create relationships for selected poem types
          for (const typeName of tagData) {
            if (typeName && typeName.trim()) {
              // First check if the Tag node exists
              const checkQuery = `
                MATCH (t:Tag {Type: $typeName})
                RETURN t.Type as type
              `;
              
              const checkResult = await tx.run(checkQuery, { typeName: typeName });
              
              if (checkResult.records.length === 0) {
                // Create the Tag node if it doesn't exist
                await tx.run(`
                  CREATE (t:Tag {Type: $typeName})
                `, { typeName: typeName });
              }
              
              // Create the relationship
              await tx.run(`
                MATCH (g:Genji_Poem {pnum: $pnum})
                MATCH (t:Tag {Type: $typeName})
                CREATE (g)-[r:TAGGED_AS]->(t)
              `, { 
                pnum: pnum.toString(), 
                typeName: typeName
              });
            }
          }
        }
      }

      // 2️⃣e Handle place of composition relationships
      if (data.placeOfComp !== undefined) {
        // First, remove any existing place of composition relationship
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:PLACE_OF_COMPOSITION]->(p:Place)
          DELETE r
        `, { pnum: pnum.toString() });

        // Then, if a place is provided, create new relationship
        if (data.placeOfComp && data.placeOfComp.trim()) {
          const placeName = data.placeOfComp.trim();
          const evidence = data.placeOfComp_evidence || null;
          
          // First check if Place node exists, create if it doesn't
          const checkQuery = `
            MATCH (p:Place {name: $placeName})
            RETURN p.name as name
          `;
          
          const checkResult = await tx.run(checkQuery, { placeName });
          
          if (checkResult.records.length === 0) {
            // Create the Place node if it doesn't exist
            await tx.run(`
              CREATE (p:Place {name: $placeName})
            `, { placeName });
          }
          
          // Create the relationship
          await tx.run(`
            MATCH (g:Genji_Poem {pnum: $pnum})
            MATCH (p:Place {name: $placeName})
            CREATE (g)-[r:PLACE_OF_COMPOSITION]->(p)
            SET r.evidence = $evidence
          `, { 
            pnum: pnum.toString(), 
            placeName: placeName,
            evidence: evidence
          });
        }
      }

      // 2️⃣f Handle place of receipt relationships
      if (data.placeOfReceipt !== undefined) {
        // First, remove any existing place of receipt relationship
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:PLACE_OF_RECEIPT]->(p:Place)
          DELETE r
        `, { pnum: pnum.toString() });

        // Then, if a place is provided, create new relationship
        if (data.placeOfReceipt && data.placeOfReceipt.trim()) {
          const placeName = data.placeOfReceipt.trim();
          const evidence = data.placeOfReceipt_evidence || null;
          
          // First check if Place node exists, create if it doesn't
          const checkQuery = `
            MATCH (p:Place {name: $placeName})
            RETURN p.name as name
          `;
          
          const checkResult = await tx.run(checkQuery, { placeName });
          
          if (checkResult.records.length === 0) {
            // Create the Place node if it doesn't exist
            await tx.run(`
              CREATE (p:Place {name: $placeName})
            `, { placeName });
          }
          
          // Create the relationship
          await tx.run(`
            MATCH (g:Genji_Poem {pnum: $pnum})
            MATCH (p:Place {name: $placeName})
            CREATE (g)-[r:PLACE_OF_RECEIPT]->(p)
            SET r.evidence = $evidence
          `, { 
            pnum: pnum.toString(), 
            placeName: placeName,
            evidence: evidence
          });
        }
      }

      // 2️⃣g Handle place evidence separately (update evidence property on existing relationships)
      if (data.placeOfComp_evidence !== undefined && data.placeOfComp === undefined) {
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:PLACE_OF_COMPOSITION]->(p:Place)
          SET r.evidence = $evidence
        `, { 
          pnum: pnum.toString(),
          evidence: data.placeOfComp_evidence || null
        });
      }

      if (data.placeOfReceipt_evidence !== undefined && data.placeOfReceipt === undefined) {
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:PLACE_OF_RECEIPT]->(p:Place)
          SET r.evidence = $evidence
        `, { 
          pnum: pnum.toString(),
          evidence: data.placeOfReceipt_evidence || null
        });
      }

      // 3️⃣ Update each Translation node separately if provided
      for (const [translatorName, letter] of Object.entries(translatorMap)) {
        if (data[translatorName] !== undefined) {
          const translationText = data[translatorName] || null;

          const translationQuery = `
            MATCH (t:Translation {id: $translationId})-[:TRANSLATION_OF]->(g:Genji_Poem {pnum: $pnum})
            SET t.translation = $translationText
            RETURN t.id as id
          `;

          await tx.run(translationQuery, {
            pnum: pnum.toString(),
            translationId: `${pnum}${letter}`,
            translationText
          });
        }
      }
    });
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    await session.close();
  }
}