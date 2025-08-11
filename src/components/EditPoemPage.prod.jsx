import React, { useEffect, useState } from "react";
import "../styles/pages/editPoemPage.css";


// Helper: check if value is primitive or array of primitives
function isPrimitiveOrPrimitiveArray(value) {
  if (
    value === null ||
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(
      (item) =>
        item === null ||
        item === undefined ||
        typeof item === "string" ||
        typeof item === "number" ||
        typeof item === "boolean"
    );
  }
  return false;
}

// Helper: clean data by skipping empty, NO_VALUE, or complex objects
function cleanProps(input) {
  const output = {};
  for (const [key, val] of Object.entries(input)) {
    if (val === null || val === undefined) continue; // skip null/undefined
    if (typeof val === "string" && val.trim() === "") continue; // skip empty strings
    if (val === "NO_VALUE") continue; // skip placeholders

    if (isPrimitiveOrPrimitiveArray(val)) {
      output[key] = val;
    } else {
      console.log(`Skipping invalid prop ${key}:`, val);
    }
  }
  return output;
}

// Check if user is admin
async function isAdmin() {
    const res = await fetch("/api/user/checkAdmin");
    if (!res.ok) return false;
    const data = await res.json();
    return data.isAdmin === true;
}

// Fetch poem data
async function fetchPoemData(chapter, number) {
    const res = await fetch(`/api/poems?chapter=${chapter}&&number=${number}`);
    if (!res.ok) throw new Error("Failed to fetch poem data");
    return res.json();
}

// Update poem data
async function updatePoemData(pnum, updatedData) {
    const res = await fetch(`/api/poems/edit_poem?pnum=${pnum}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error("Failed to update poem data");
    return res.json();
}

// Order of fields to render - updated to match actual data structure
const fieldOrder = [
  "speaker", "addressee", "poemId", "age", "JPRM_Japanese", "JPRM_Romaji",
  "Waley", "Seidensticker", "Tyler", "Washburn", "Cranston",
  "narrativeContext", "paraphrase", "notes", "paperMediumType", "deliveryStyle",
  "season", "season_evidence", "spoken", "written",
];

//   "pt", "pw", "placeOfComp", "placeOfComp_evidence",
//   "placeOfReceipt", "placeOfReceipt_evidence","spoken", "written", "spoken_or_written_evidence", 
//   "messenger", "repCharacter", "groupPoems", "replyPoems", "furtherReadings",
//   "proxy", "kigo", "handwritingDescription", "source", "relWithEvidence", "tag",

export default function EditPoemPage({ chapter, poemNum }) {
    const [showButton, setShowButton] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [poemData, setPoemData] = useState(null);
    const [editData, setEditData] = useState(null);
    const [error, setError] = useState(null);
    const number = poemNum.toString().padStart(2, '0');

    useEffect(() => {
        isAdmin().then(setShowButton);
    }, []);

    useEffect(() => {
        if (showPopup && !poemData) {
            setLoading(true);
            fetchPoemData(chapter, number)
                .then((responseData) => {
                    console.log("Raw response data:", responseData);
                    
                    const exchange = responseData[0];
                    const transTemp = responseData[1];
                    const sources = responseData[2];
                    const relatedWithEvidence = responseData[3];
                    const tags = responseData[4];
                    const pls = responseData[6];

                    let speaker = [...new Set(exchange.map(e => e.start.properties.name))];
                    let addressee = [...new Set(exchange.map(e => e.end.properties.name))];
                    
                    let src_obj = [];
                    let index = 0;
                    let entered_honka = [];

                    sources.forEach(e => {
                        if (entered_honka.includes(e[0])) {
                            src_obj[src_obj.findIndex(el => el.honka === e[0])].translation.push([e[5], e[6]]);
                        } else {
                            src_obj.push({
                                id: index,
                                honka: e[0],
                                source: e[1],
                                romaji: e[2],
                                poet: e[3],
                                order: e[4],
                                translation: [[e[5], e[6]]],
                                notes: e[7]
                            });
                            entered_honka.push(e[0]);
                            index++;
                        }
                    });

                    let poemId = pls?.[0] ? Object.values(pls[0])[0] : null;

                    // Initialize all to empty string
                    let waley = "";
                    let seidensticker = "";
                    let tyler = "";
                    let washburn = "";
                    let cranston = "";

                    // Map incoming translation array from Neo4j
                    transTemp.forEach(e => {
                    const translatorName = e[0];
                    const text = e[1]; // assuming e[1] is the actual translation text
                    switch (translatorName) {
                        case "Waley": waley = text; break;
                        case "Seidensticker": seidensticker = text; break;
                        case "Tyler": tyler = text; break;
                        case "Washburn": washburn = text; break;
                        case "Cranston": cranston = text; break;
                        default: break;
                    }
                    });

                    const jprmJapanese = exchange[0]?.segments[0]?.end?.properties?.Japanese || "";
                    const jprmRomaji = exchange[0]?.segments[0]?.end?.properties?.Romaji || "";

                    // Build state with translators as separate fields
                    const newPoemState = {
                    speaker,
                    addressee,
                    JPRM_Japanese: jprmJapanese, // keep as string with \n
                    JPRM_Romaji: jprmRomaji,
                    Waley: waley,
                    Seidensticker: seidensticker,
                    Tyler: tyler,
                    Washburn: washburn,
                    Cranston: cranston,
                    source: src_obj,
                    relWithEvidence: relatedWithEvidence,
                    tag: tags,
                    notes: exchange[0]?.segments[0]?.end?.properties?.notes,
                    poemId,
                    narrativeContext: responseData[7],
                    paraphrase: responseData[8],
                    handwritingDescription: responseData[9],
                    paperMediumType: responseData[10],
                    deliveryStyle: responseData[11],
                    season: responseData[12],
                    kigo: responseData[13],
                    pt: responseData[14],
                    pw: responseData[15],
                    proxy: responseData[16],
                    messenger: responseData[17],
                    age: responseData[18],
                    repCharacter: responseData[19],
                    placeOfComp: responseData[20],
                    placeOfReceipt: responseData[21],
                    spoken: responseData[22],
                    written: responseData[23],
                    season_evidence: responseData[24],
                    placeOfComp_evidence: responseData[25],
                    placeOfReceipt_evidence: responseData[26],
                    groupPoems: responseData[27],
                    replyPoems: responseData[28],
                    furtherReadings: responseData[29],
                    spoken_or_written_evidence: responseData[30]
                    };

                    console.log("Parsed poem state:", newPoemState);

                    // Fixed serialization logic
                    const serialized = {};
                    Object.entries(newPoemState).forEach(([key, val]) => {
                        if (val === null || val === undefined) {
                            serialized[key] = "";
                        } else if (typeof val === "object") {
                            serialized[key] = JSON.stringify(val, null, 2);
                        } else {
                            serialized[key] = val.toString();
                        }
                    });

                    console.log("Serialized data:", serialized);
                    
                    setPoemData(serialized);
                    setEditData({ ...serialized });
                })
                .catch((e) => {
                    console.error("Error fetching poem data:", e);
                    setError(e.message);
                })
                .finally(() => setLoading(false));
        }
    }, [showPopup, poemData, chapter, number]);

    function prepareForSave(data) {
        const result = {};

        // Recombine JPRM fields into array for backend
        if (data.JPRM_Japanese !== undefined || data.JPRM_Romaji !== undefined) {
            result.JPRM = [
            data.JPRM_Japanese || null,
            data.JPRM_Romaji || null
            ];
        }

        for (let key of fieldOrder) {
            if (key === "JPRM_Japanese" || key === "JPRM_Romaji") continue;

            const val = data[key];
            if (!val || val === "") {
            result[key] = null;
            continue;
            }

            if (key === "spoken" || key === "written") {
                // Accept only "true" or "false" string on save; fallback to "false"
                const valLower = val.toLowerCase();
                result[key] = valLower === "true" ? "true" : "false";
            } else if (key === "season") {
                // Handle season as a simple string value - backend will create the relationship
                result[key] = val;
            } else {
            try {
                result[key] = JSON.parse(val);
            } catch {
                result[key] = val;
            }
            }
        }

        return result;
    }


    async function handleSave() {
        setLoading(true);
        setError(null);
        try {
            const prepared = prepareForSave(editData);


            // CLEAN the prepared data here before sending:
            const cleaned = cleanProps(prepared);

            // Use poemId from state for pnum
            const pnum = editData?.poemId || poemData?.poemId;
            if (!pnum) {
                throw new Error("Poem ID (pnum) is not available for saving.");
            }

            console.log("Saving prepared data for", pnum, cleaned);
            await updatePoemData(pnum, cleaned);

            setPoemData({ ...editData });
            setShowPopup(false);
        } catch (e) {
            console.error("Error saving poem data:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        setEditData({ ...poemData });
        setShowPopup(false);
    }

    async function handleDelete(key) {
        const confirmDelete = window.confirm(`Delete field "${key}"?`);
        if (!confirmDelete) return;

        // Map local key to backend field name expected by API
        const fieldMap = {
            spoken: "Spoken",
            written: "Written",
            season: "season", // season maps directly
            narrativeContext: "narrative_context",
            paraphrase: "paraphrase",
            notes: "notes",
            paperMediumType: "paper_or_medium_type",
            deliveryStyle: "delivery_style",
            season_evidence: "season_evidence",
        };
        const fieldToDelete = fieldMap[key] || key;

        try {
            const res = await fetch(`/api/poems/edit_poem?pnum=${encodeURIComponent(editData.poemId)}&field=${encodeURIComponent(fieldToDelete)}`, {
            method: "DELETE",
            });

            if (!res.ok) {
            const err = await res.json();
            alert(`Error: ${err.error}`);
            return;
            }

            // Remove field from local state
            setEditData((prev) => {
            const updated = { ...prev };
            delete updated[key];
            return updated;
            });

        } catch (error) {
            console.error("Error deleting field:", error);
            alert(`Error: ${error.message}`);
        }
    }


    // Helper function to format field names
    function formatFieldName(key) {
        // Handle specific field name mappings first
        if (key === 'notes') return 'Commentary';
        if (key === 'narrativeContext') return 'Where We Are In The Tale';
        if (key === 'paraphrase') return 'What The Poem Is Saying';
        
        return key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize each word
            .replace(/J P R M/g, 'JPRM') // Fix acronym
            .replace(/Rel With Evidence/g, 'Related With Evidence')
            .replace(/Rep Character/g, 'Representative Character')
            .replace(/Place Of Comp/g, 'Place Of Composition')
            .replace(/Place Of Receipt/g, 'Place Of Receipt')
            .replace(/Pt/g, 'Poetic Techniques')
            .replace(/Pw/g, 'Pivot Words');
    }

    function renderFields() {
        if (!editData) return null;

        const compactFields = [
            "speaker",
            "addressee",
            "poemId",
            "season",
            "age",
            "spoken",
            "written",
        ];

        const readOnlyFields = ["speaker", "addressee", "poemId"];

        const seasonHint = "Possible values: Spring, Summer, Autumn, Winter";

        const booleanHint = 'Possible value: lowercase "true" or "false"';

        const compactItems = compactFields.map((key) => {
            const isReadOnly = readOnlyFields.includes(key);

            // For spoken and written, ensure value is either "true" or "false"
            let inputValue = editData[key] ?? "";

            inputValue = editData[key] ?? "";

            return (
            <div key={key} className="compact-field-container">
                <label
                className="compact-field-label"
                style={{ display: "flex", alignItems: "center" }}
                >
                {formatFieldName(key)}

                {(key === "spoken" || key === "written") && (
                    <span
                    title={booleanHint}
                    style={{
                        marginLeft: "0.3rem",
                        cursor: "help",
                        color: "#888",
                        fontWeight: "bold",
                    }}
                    >
                    ?
                    </span>
                )}

                {key === "season" && (
                    <span
                    title={seasonHint}
                    style={{
                        marginLeft: "0.3rem",
                        cursor: "help",
                        color: "#888",
                        fontWeight: "bold",
                    }}
                    >
                    ?
                    </span>
                )}

                {!isReadOnly && (
                    <button
                    type="button"
                    className="delete-button"
                    aria-label={`Delete field ${formatFieldName(key)}`}
                    onClick={() => handleDelete(key)}
                    title="Clear field"
                    style={{
                        marginLeft: "0.5rem",
                        color: "red",
                        cursor: "pointer",
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        fontSize: "1rem",
                        lineHeight: 1,
                    }}
                    >
                    ❌
                    </button>
                )}
                </label>
                <input
                    type="text"
                    className="compact-field-input"
                    value={inputValue}
                    readOnly={isReadOnly}
                    style={isReadOnly ? { backgroundColor: "#f5f5f5" } : {}}
                    onChange={(e) => {
                        if (isReadOnly) return;

                        let newValue = e.target.value;
                        
                        // For spoken/written, convert to lowercase
                        if (key === "spoken" || key === "written") {
                            newValue = newValue.toLowerCase();
                        }
                        // For season, capitalize first letter to match Season node names
                        else if (key === "season") {
                            newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1).toLowerCase();
                        }
                        
                        setEditData((prev) => ({ ...prev, [key]: newValue }));
                    }}
                />
            </div>
            );
        });

        const fullFields = fieldOrder.filter((key) => !compactFields.includes(key));

        return (
            <div className="fields-container">
                <div className="compact-fields-grid">
                    {compactItems}
                </div>

                {fullFields.map((key) => (
                    <div key={key} className="full-field-container">
                        <label className="full-field-label">
                            {formatFieldName(key)}
                        </label>
                        <div className="full-input-wrapper">
                            <textarea
                                className="full-field-textarea"
                                value={editData[key] || ""}
                                onChange={(e) =>
                                    setEditData((prev) => ({
                                        ...prev,
                                        [key]: e.target.value
                                    }))
                                }
                            />
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(key)}
                                title="Clear field"
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            {showButton && (
                <button
                    onClick={() => setShowPopup(true)}
                    className="edit-poem-button"
                >
                    ✏️ Edit Poem
                </button>
            )}

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-container">
                        <div className="popup-header">
                            <h2 className="popup-title">Edit Poem Data</h2>
                            <p className="popup-subtitle">Chapter {chapter} • Poem {poemNum}</p>
                        </div>
                        
                        {loading && (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                Loading poem data...
                            </div>
                        )}
                        
                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}
                        
                        {!loading && renderFields()}
                        
                        <div className="buttons-container">
                            <button
                                onClick={handleCancel}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="save-button"
                                disabled={loading}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}