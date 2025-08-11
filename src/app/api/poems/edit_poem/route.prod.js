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
    console.log("Received data:", data);
    console.log("pnum:", pnum);

    await updatePoemProperties(pnum, data);

    return new Response(JSON.stringify({ message: "Poem updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// Delete a single field from a poem node
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pnum = searchParams.get("pnum");
    const field = searchParams.get("field");

    if (!pnum || !field) {
      return new Response(JSON.stringify({ error: "Missing pnum or field param" }), { status: 400 });
    }

    const session = await getSession();

    // **Sanitize field name** - expanded to include season and other allowed fields
    const allowedFields = ["Spoken", "Written", "season", "paper_or_medium_type", "delivery_style", "season_evidence", "narrative_context", "paraphrase", "notes"];
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
      if (data.pt !== undefined) props.poetic_techniques = data.pt || null;
      if (data.pw !== undefined) props.pivot_words = data.pw || null;
      if (data.proxy !== undefined) props.proxy = data.proxy || null;
      if (data.messenger !== undefined) props.messenger = data.messenger || null;
      if (data.repCharacter !== undefined) props.representative_character = data.repCharacter || null;
      if (data.placeOfComp_evidence !== undefined) props.place_of_comp_evidence = data.placeOfComp_evidence || null;
      if (data.placeOfReceipt_evidence !== undefined) props.place_of_receipt_evidence = data.placeOfReceipt_evidence || null;
      if (data.groupPoems !== undefined) props.group_poems = data.groupPoems || null;
      if (data.furtherReadings !== undefined) props.further_readings = data.furtherReadings || null;

      console.log("Props being set:", props);

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
          console.log(`Creating season relationship to: ${data.season}`);
          
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
        console.log(`Updating season evidence: ${data.season_evidence}`);
        
        await tx.run(`
          MATCH (g:Genji_Poem {pnum: $pnum})-[r:IN_SEASON_OF]->(s:Season)
          SET r.evidence = $evidence
        `, { 
          pnum: pnum.toString(),
          evidence: data.season_evidence || null
        });
      }

      // 3️⃣ Update each Translation node separately if provided
      for (const [translatorName, letter] of Object.entries(translatorMap)) {
        if (data[translatorName] !== undefined) {
          const translationText = data[translatorName] || null;

          console.log(`Updating translation for ${translatorName} (${letter})`);

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