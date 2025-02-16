'use client'

import { useCallback, useEffect, useState, useRef} from 'react';
import ReactFlow, {
    applyEdgeChanges,
    applyNodeChanges,
    MiniMap,
    Controls,
    Background, 
	useReactFlow
} from 'reactflow'; 
import 'reactflow/dist/style.css';

import styles from '../styles/pages/characters.module.css';
import CustomEdge from "../../CustomEdge.tsx";
import { autoType } from 'd3';

class Character { //Edges indicating child from a relationship linkage
	constructor(identifier, english_name, japanese_name, x, y, color, db_name, gender) {
		this.identifier = identifier
		this.english_name = english_name
		this.japanese_name = japanese_name
		this.x = x
		this.y = y
		this.color = color 
		this.db_name = db_name
		this.gender = gender
	}
}

class Labeled { //Labeled edge
	constructor(character, is, of) {
		this.character = character
		this.is = is
		this.of = of
	}
}

class Linkage { //Linkage node indicating love affairs, marriages, etc. 
	constructor(person1, person2, x, y, emoji) {
		this.person1 = person1
		this.person2 = person2
		this.x = x
		this.y = y
		this.emoji = emoji 
	}
}

class Child { //Edges indicating child from a relationship linkage
	constructor(parent1, parent2, child) {
		this.parent1 = parent1
		this.parent2 = parent2
		this.child = child
	}
}
 
/**
 * @param {Array} l the array of edges
 */ 
export default function GeneologyMap({l}) { 

	// : make dictionaries
	var [c_X_Y, rels, love_nodes, jp_dict, color_dict, gender_dict] = l

    // **Characters** //
	var characters = useRef([])

	//Important note: parent order has to be the consistent throughout this list (order of parent1 (male) and parent2 (female))
	var children = []

	var labeled_relationships = []
	
	var character_info = []

	for (const [c_name ,x, y, people_rel] of c_X_Y) {
		character_info.push(new Character(c_name, c_name.replace("1", 'I').replace("2", 'II').replace("3", 'III').replace("4", 'IV').replace("5", 'V'), jp_dict[c_name], x, y, color_dict[c_name], c_name, gender_dict[c_name]) )
		var child_type = ""
		var child_of = ""
		var both_parents_found = false
		for (const [rel_t, p] of people_rel) {
			if (rel_t == "SON_OF" || rel_t == "DAUGHTER_OF") {
				if (child_type == "") {
					child_type = rel_t
					child_of = p
				} else { //second time
					both_parents_found = true
					if (gender_dict[child_of] == "male") {
						children.push(new Child(child_of, p, c_name))
					} else {
						children.push(new Child(p, child_of, c_name))
					} 
				}
			} else if ( !(rel_t.includes("FATHER") || rel_t.includes("MOTHER") || rel_t.includes("HUSBAND") || rel_t.includes("WIFE") || rel_t.includes("SON") || rel_t.includes("DAUGHTER") || rel_t.includes("LOVER")) ) {  
				var extra_edge_detected = false
				for (const lr of labeled_relationships) {
					if (lr.character == p && lr.of == c_name) {
						extra_edge_detected = true
						break 
					}
				}
				if (!extra_edge_detected) {
					labeled_relationships.push(new Labeled(c_name, rel_t.toLowerCase().replace("_of", "").replace("is_pet", "🐶").replace("friend", "👊🏻").replace("murder_victim", "💀").replace("_", " "), p))
				} 
			} 
		}
		if (!both_parents_found) {
			labeled_relationships.push(new Labeled(c_name, child_type.toLowerCase().replace("_of", ""), child_of))
		}
	} 

	// **Relationships 
	var relationships = useRef([])

	//Nodes: Marriages and Love affairs
	var linkages = []

	for (const [p1, p2, rel_type, x, y] of love_nodes) {
		if (rel_type == "TROUBLED_LOVER_OF") {
			linkages.push(new Linkage(p1, p2, x, y, "💔"))
		} else if (rel_type == "LOVER_OF") {
			linkages.push(new Linkage(p1, p2, x, y, "❤️"))
		} else if (rel_type == "HUSBAND_OF") {
			linkages.push(new Linkage(p1, p2, x, y, "💍")) 
		}
	}

	// **** //

	var malas = useRef({})
	var loaded = useRef(false)

	//nodes and edges
	const [nodes, setNodes] =useState([])
    const [edges, setEdges] = useState([])

	if (!loaded.current) {
		for (const c of character_info) {
			characters.current.push({ id: c.identifier, position: {x: c.x, y: c.y }, data: { label: c.english_name }, draggable: true, style: {border: "1px solid " + c.color, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'}, hidden: true}, )
		}
	
		for (const l of linkages) {
			characters.current.push({ id: l.person1 + " + " + l.person2, position: { x: l.x, y: l.y }, data: { label: l.emoji }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'},  hidden: true})
		}  
	
		for (const c of children) {
			for (const nd of characters.current) {
				if (nd.id == c.child) {
					relationships.current.push({ id: c.parent1 + " + " + c.parent2 + " -> " + c.child, source: c.parent1 + " + " + c.parent2, target: c.child, style:{ stroke: nd.style.border.slice(nd.style.border.indexOf("1px solid ")+10), strokeWidth: '2'},type: 'smoothstep', hidden: true})
				} 
			}
		}
			
		//Edges: Marriages and Love affairs
		for (let i = character_info.length; i < characters.current.length; i++) {
			const link_id = characters.current[i].id 
			const people1 = link_id.slice(0, link_id.indexOf(" + ")) 
			const people2 = link_id.slice(link_id.indexOf(" + ")+3)
			for (const nd of characters.current) { 
				if (nd.id == people1 || nd.id == people2) {
					if (nd.id in malas.current) {
						malas.current[nd.id] += 1
					} else { 
						malas.current[nd.id] = 1
					}
					relationships.current.push({ id: nd.id + " - " + malas.current[nd.id].toString(), source: nd.id, target: link_id, style:{ stroke: nd.style.border.slice(nd.style.border.indexOf("1px solid ")+10), strokeWidth: '2'},type: 'smoothstep', hidden: true})
				} 
			}
		}
	
		for (const rel of labeled_relationships) {
			var edge = { id: rel.of + " - " + rel.character, source: rel.of, target: rel.character, style:{ stroke:"", hidden: true, strokeWidth: '2', opacity: "100%"}, data: {label: rel.is, type: "smoothstep"}, type: 'custom'}
			if (rel.is != "servant" && rel.is != "ostensible child" && (!rel.is.includes("adopted"))) {
				for (const nd of characters.current) { 
					if (nd.id == rel.of) {  
						var s = nd.style.border + ""
						edge.style.stroke = s.slice(s.indexOf("1px solid ")+10)
						if (rel.is.includes("daughter") || rel.is.includes("son") ) { 
							edge.data.type = "smoothstep"
						} else 
						break
					}
				}
			} else {
				for (const nd of characters.current) {
					if (nd.id == rel.character) {
						var s = nd.style.border + ""
						edge.style.stroke = s.slice(s.indexOf("1px solid ")+10) 
						if (rel.is == "ostensible child") {
							edge.data.type = "smoothstep" 
						} else if (rel.is.includes("adopted")) {
							edge.data.type = "smoothstep"  
							edge.id = rel.of + " -> " + rel.character + " (adopted)" 
						} 
						break
					}
				}
			}

			if (rel.is == "servant") {
				edge.style.opacity = "50%"
			}
			relationships.current.push(edge)
		}
	
		console.log("characters count: ", characters.current.length) 
		console.log("relationships count: ", relationships.current.length) 
	 
		var extra_edges = [...relationships.current]
		for (const ch of extra_edges) { 
			if (ch.source.includes(" + ") && !(ch.id.includes("(adopted)"))) {
				const people1 = ch.source.slice(0, ch.source.indexOf(" + ")) 
				const people2 = ch.source.slice(ch.source.indexOf(" + ")+3)
				extra_edges.push({ id: people1 + " ~ " + ch.target, source: people1, target: ch.target, style:{strokeWidth: '2'}, hidden: true, label: "parent", animated: true})
				extra_edges.push({ id: people2 + " ~ " + ch.target, source: people2, target: ch.target, style:{strokeWidth: '2'}, hidden: true, label: "parent", animated: true})
			} 
		}
		relationships.current = extra_edges
		loaded.current = true  

		setNodes([...characters.current])
		setEdges([...relationships.current])
	}  

    const onInit = (reactFlowInstance) => {};
    const onConnect = () => null
    const minimapStyle = {
        height: 120,
    };
    const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
    const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );
	const { fitBounds, zoomTo} = useReactFlow();

	const find_X = useRef(0);
	const find_Y = useRef(0);
	const handleTransform = useCallback(() => {
		fitBounds({ x: (find_X.current), y: (find_Y.current), width: 200, height: 100}, { duration: 800 });
	}, [fitBounds]); 

	const showedAll = useRef(false) 

	//all relationships of that character  
	const allRel = (num) => {
		disableAll()
		var new_nodes = [...nodes]
		var new_edges = [...edges]

		var character_name = characters.current[num].id
		var all_rel = []
		for (const [ch_name, x, y, a_r] of c_X_Y) {
			if (ch_name == character_name) {
				all_rel = a_r
				break
			}
		}

		// 1. Add everyone except children
		var position_dict = {}
		var top_row = 0 //how many people on the top layer
		var bottom_row = 0
		var parent_count = 0 // if there are two parents, show linkage node
		var parents = []

		function activate_edge(person_a, person_b) {
			// console.log("Set:" +x + " " + y)
			for (const ne of new_edges) {
				if ((ne.target == person_a && ne.source == person_b) || (ne.target == person_b && ne.source == person_a)) {
					ne.hidden = false
				}
			}
		}

		function set_pos(chr_name, x, y) {
			console.log("Set:" +x + " " + y)
			for (const nn of new_nodes) {
				if (nn.id == chr_name) {
					nn.position.x = x
					nn.position.y = y
					nn.hidden = false
					break
				}
			}
			for (let i = 0; i < character_info.length; i++) {
				if (character_info[i].english_name == chr_name) {
					document.getElementById("ch" + i.toString()).checked = true
					document.getElementById("ch" + i.toString() + "_2").checked = true
				}
			}  
		}  

		set_pos(character_name, 0, 0)

		function find_pos() { 
			var x = 250
			var y = 110
			if (top_row >= 4 && top_row > bottom_row) {
				y += 650
				bottom_row += 1
			} else {
				top_row += 1
			}

			var left = true
			var times = 0
			while (position_dict[[x,y]]) {
				times += 1
				if (left) {
					x -= 450*times
					left = false
				} else {
					x += 450*times
					left = true
				}
			}
			position_dict[[x,y]] = true
			return [x, y]
		}

		function find_pos_based_on_parent(p_x, p_y) {
			var x = p_x + 75
			var y = p_y + 500

			var left = true
			var times = 0
			while (position_dict[[x,y]]) {
				times += 1
				if (left) {
					x -= 150*times
					left = false
				} else {
					x += 150*times
					left = true
				}
			}
			position_dict[[x,y]] = true
			return [x, y]
		}

		for (const [rel, ch_name] of all_rel) {
			if (rel != 'FATHER_OF' && rel != 'MOTHER_OF' && rel != 'SON_OF' && rel != 'DAUGHTER_OF' 
				&& rel != 'LOVER_OF' && rel != 'HUSBAND_OF' && rel != 'WIFE_OF' && rel != 'TROUBLED_LOVER_OF') {
				var [x, y] = find_pos()
				set_pos(ch_name, x, y)
				activate_edge(character_name, ch_name)
			} else if (rel == 'SON_OF' || rel == 'DAUGHTER_OF') {
				if (gender_dict[ch_name] == "male") {
					set_pos(ch_name, 250, -310)
				} else {
					set_pos(ch_name, -200, -310)
				}
				parent_count += 1
				parents.push(ch_name)
			} else if (rel == 'LOVER_OF' || rel == 'HUSBAND_OF' || rel == 'WIFE_OF' || rel == 'TROUBLED_LOVER_OF') {
				var [x, y] = find_pos()
				var linkage_x = x
				var linkage_y = y+350
				if (x > 0) {
					linkage_x -= 35
				} else {
					linkage_x += 100
				}
				for (const nn of new_nodes) {
					if (nn.id == ch_name + " + " + character_name || nn.id == character_name + " + " + ch_name) {
						activate_edge(character_name, nn.id)
						activate_edge(ch_name, nn.id)
						nn.position.x = linkage_x
						nn.position.y = linkage_y
						nn.hidden = false
						break
					}
				}
				set_pos(ch_name, x, y)
			} 
		}

		// Children
		for (const [rel, ch_name] of all_rel) { 
			if (rel == 'FATHER_OF' || rel == 'MOTHER_OF') {
				for (const ne of new_edges) {
					if (ne.source == character_name && ne.target == ch_name) {
						var [x, y] = find_pos()
						set_pos(ch_name, x, y)
						ne.hidden = false 
						break 
					} else if (ne.source.includes(character_name) && ne.source.includes(" + ") && ne.target == ch_name) {
						// found other parent
						var other_parent = ""
						if (ne.source.slice(0, ne.source.indexOf(" + ")) == character_name) {
							other_parent = ne.source.slice(ne.source.indexOf(" + ")+3)
						} else {
							other_parent = ne.source.slice(0, ne.source.indexOf(" + ")) 
						}
						for (const nn of new_nodes) {
							if (nn.id == other_parent) {
								var [c_x, c_y] = find_pos_based_on_parent(nn.position.x, nn.position.y)
								set_pos(ch_name, c_x, c_y)
								ne.hidden = false 
								break
							}
						}
						break
					}
				}
			}
		}

		if (parent_count == 2) {
			for (const nn of new_nodes) {
				if (nn.id == parents[0] + " + " + parents[1] || nn.id == parents[1] + " + " + parents[0]) {
					activate_edge(nn.id, parents[0])
					activate_edge(nn.id, parents[1])
					activate_edge(nn.id, character_name)
					nn.position.x = 50
					nn.position.y = -130
					nn.hidden = false
					break
				}
			}
		} else if (parent_count == 1) {
			activate_edge(character_name, parents[0])
		}

		setNodes(new_nodes)
		setEdges(new_edges)
	}

	const enableDisable = (num, bool) => {
		document.getElementById("ch" + num.toString()).checked = bool
		document.getElementById("ch" + num.toString() + "_2").checked = bool
		var new_nodes = [...nodes]
		var new_edges = [...edges]

		if (bool) {
			for (const ch of new_nodes) {
				if (ch.id == characters.current[num].id) {
					ch.hidden = false
				} else if (ch.id.includes(characters.current[num].id + " + ") || ch.id.includes(" + " + characters.current[num].id)) { //marriage nodes
					// search other //
					var other_id = ""
					if (ch.id.includes(characters.current[num].id + " + ")) {
						other_id = ch.id.replace(characters.current[num].id + " + ", "")
					} else {
						other_id = ch.id.replace(" + " + characters.current[num].id, "")
					}

					var is_other_hidden = true
					for (const ch2 of new_nodes) {
						if (ch2.id == other_id && ch2.hidden == false) {
							is_other_hidden = false
							break
						}
					}

					if (is_other_hidden == false) {
						ch.hidden = false 
					}
					// *** //
				}
			}

			
			//check edge
			for (const ed of new_edges) {
				if (ed.source  ==  characters.current[num].id || ed.target  ==  characters.current[num].id) {
					// search other //
					var other_id = ""
					if (ed.source  ==  characters.current[num].id) {
						other_id = ed.target
					} else {
						other_id = ed.source
					}

					var is_other_hidden = true
					for (const ch2 of new_nodes) {
						if (ch2.id == other_id && ch2.hidden == false) {
							is_other_hidden = false
							break
						}
					}

					if (is_other_hidden == false) {
						ed.hidden = false 

						// check if this is connected to a marriage node
						if (other_id.includes(" + ")) {
							var other_id_2 = ""
							if (other_id.includes(characters.current[num].id + " + ")) {
								other_id_2 = other_id.replace(characters.current[num].id + " + ", "")
							} else {
								other_id_2 = other_id.replace(" + " + characters.current[num].id, "")
							}

							var is_other_hidden_2 = true
							for (const ch3 of new_nodes) {
								if (ch3.id == other_id_2 && ch3.hidden == false) {
									is_other_hidden_2 = false
									break
								}
							}

							if (is_other_hidden_2 == false) {
								for (const ed2 of new_edges) {
									if (ed2.target == other_id) {
										ed2.hidden = false
									} else if (ed2.source == other_id) { // If the children is there
										for (const nn2 of new_nodes) {
											if (nn2.id == ed2.target) {
												if (!nn2.hidden) {
													ed2.hidden = false
												}  
												break 
											}
										} 
									} 
								}
							}

							// see child is visible or not
						}
						//*** //
					}
					// *** //
				} 
			}
		} else {
			for (const ch of new_nodes) {
				if (ch.id == characters.current[num].id) {
					ch.hidden = true
				} else if (ch.id.includes(characters.current[num].id + " + ") || ch.id.includes(" + " + characters.current[num].id)) {
					ch.hidden = true
				}
			}

			for (const ed of new_edges) {
				if (ed.source  ==  characters.current[num].id || ed.target  ==  characters.current[num].id) {
					ed.hidden = true
				} else if (ed.source.includes(characters.current[num].id + " + ") || ed.source.includes(" + " + characters.current[num].id)) {
					ed.hidden = true

					// activate "parent" edge if needed
					var other_parent = ""
					if (ed.source.slice(ed.source.indexOf(" + ")+3) == characters.current[num].id) {
						other_parent = ed.source.slice(0, ed.source.indexOf(" + ")) 
					} else {
						other_parent = ed.source.slice(ed.source.indexOf(" + ")+3)
					}
					var visible_count = 0 // is both visible? 
					for (const nn of new_nodes) {
						if ((nn.id == ed.target || nn.id == other_parent) && nn.hidden == false) {
							visible_count += 1
						}
					}

					if (visible_count == 2) {
						for (const ne of new_edges) {
							if ((ne.source == other_parent && ne.target == ed.target) ) {
								ne.hidden = false
								break
							}
						}
					}
				} else if (ed.target.includes(characters.current[num].id + " + ") || ed.target.includes(" + " + characters.current[num].id)) {
					ed.hidden = true
				}
			}
			
		}

		setNodes(new_nodes)
		setEdges(new_edges)
	}

	const disableAll = () => {
		showedAll.current = false
		var new_nodes = [...nodes]
		var new_edges = [...edges]
		for (let i = 0; i < character_info.length; i++) {
			document.getElementById("ch" + i.toString()).checked = false
			document.getElementById("ch" + i.toString() + "_2").checked = false
		}
		for (const ch of new_nodes) {
			ch.hidden = true
		}
		for (const ch of new_edges) {
			ch.hidden = true
		}
		setNodes(new_nodes)
		setEdges(new_edges)
    }

	const changeNodeLabelName = (num, val) => {
		document.getElementById("dd" + num.toString()).value = val
		document.getElementById("dd" + num.toString() + "_2").value = val
		var new_nodes = [...nodes]
		new_nodes[num].data = {label: val}
		setNodes(new_nodes)
	} 

	const changeLanguage = (ver) => {
		for (let i = 0; i < character_info.length; i++) {
			if (ver == "jp") {
				var jp_name = character_info[i].japanese_name
				if (jp_name != null) {
					if (jp_name.includes("（")) {
						jp_name = character_info[i].japanese_name.slice(0, character_info[i].japanese_name.indexOf("（"))
					}
				}
				document.getElementById("dd" + i.toString()).value = jp_name
				document.getElementById("dd" + i.toString() + "_2").value = jp_name
			} else if (ver == "en") {
				document.getElementById("dd" + i.toString()).value = character_info[i].english_name
				document.getElementById("dd" + i.toString() + "_2").value = character_info[i].english_name
			}
			changeNodeLabelName(i, document.getElementById("dd" + i.toString()).value)
		}
	}

	function myFunction(query) {
		// Declare variables 
		var filter = query.toUpperCase()
		var li = document.getElementsByClassName("item1")
	  
		// Loop through all list items, and hide those who don't match the search query
		for (var i = 0; i < li.length; i++) {
		  var a = li[i].getElementsByClassName("a")[0];
		  if (a.id.toUpperCase().replace("Ō", "O").replace("Ū", "U").indexOf(filter) > -1) {
			li[i].style.display = ""; 
		  } else {
			li[i].style.display = "none";
		  }
		}
	}

	function myFunction2(query) {
		var filter = query.toUpperCase()
		var li = document.getElementsByClassName("item2")
		for (var i = 0; i < li.length; i++) {
		  var a = li[i].getElementsByClassName("a")[0];
		  if (a.id.toUpperCase().replace("Ō", "O").replace("Ū", "U").indexOf(filter) > -1) {
			li[i].style.display = ""; 
		  } else {
			li[i].style.display = "none";
		  }
		}
	}

	//expand | shrink

	function disableMenu() {
		{document.getElementById('myMenu').style.display = 'none'; document.getElementById('disableMenuButton').style.visibility = 'hidden'; 
		// document.getElementById('mySearch').value = ""
	}
	}

	function disableMenu2() {
		{document.getElementById('myMenu2').style.display = 'none'; document.getElementById('disableMenuButton2').style.visibility = 'hidden'; 
		// document.getElementById('mySearch2').value = ""
	}
	}

	function pinLocation(c_info) {
		disableMenu(); 
		for (const c_node of nodes) {
			if (c_node.id == c_info.identifier) {
				find_X.current = c_node.position.x
				find_Y.current = c_node.position.y
			}  
		} 
		//console.log("zooming to ", find_X.current, find_Y.current);
		handleTransform(c_info.identifier);
		setTimeout(function(){
			zoomTo(0.6, { duration: 1000}); 
		}, 1000); 
	} 
	// Find Relationship between two people
	function findRel() {
		disableMenu()
		disableMenu2() 
		var character1 = document.getElementById("mySearch").value
		var character2 = document.getElementById("mySearch2").value
		var dictionary = {}
		var line1 = [character1] 
		var line2 = [character2]
		var perma1 = [character1]
		var perma2 = [character2]
		var rel_diagram = []
		var other_diagram = []
		var avoid_repeat = {}
		var new_nodes = [...nodes]
		var new_edges = [...edges]

		var character1_found = false
		var character2_found = false

		for (const nn of new_nodes) {
			if (nn.id == character1) {
				character1_found = true
			} else if (nn.id == character2) {
				character2_found = true
			}
		}

		if (character1 == "" || character2 == "") {
			document.getElementById("relationship").innerHTML = "Please enter two character names."
			document.getElementById("relationship").style.color = "gray"
			return
		} else if (!character1_found || !character2_found) {
			document.getElementById("relationship").innerHTML = "Please enter correct character names."
			document.getElementById("relationship").style.color = "red"
			return
		} else { 
			disableAll();
			// TIME TO FIND THE RELATIONSHIP!! //
			//console.log("FIND: " + character1 + " and " + character2)
			dictionary[character1] = ""
			dictionary[character2] = ""
			var turn = 1
			var character_name = ""
			while ((line1.length > 0) || (line2.length > 0) ) {
				if (turn == 1) {
					turn = 2
					if (line1.length == 0) {
						continue
					}
					character_name = line1[0]
					line1 = line1.slice(1)
					//console.log("NEW 1: " + character_name)
				} else {
					turn = 1
					if (line2.length == 0) {
						continue
					}
					character_name = line2[0]
					line2 = line2.slice(1)
					//console.log("NEW 2: " + character_name)
				}

				for (const [ch1, is, ch2] of rels) {
					// See if mentions the name
					

					var other_characters_name = ""
					if (ch1 == character_name && (is.includes("SON") || is.includes("DAUGHTER") || is.includes("SISTER") || is.includes("BROTHER") ) ) {
						other_characters_name = ch2
					} else if (ch2 == character_name && (is.includes("MOTHER") || is.includes("FATHER") || is.includes("SISTER") || is.includes("BROTHER")) ) {
						other_characters_name = ch1
					} else {
						continue
					}

					if (other_characters_name != "") { //don't involve child if they are couples
						var pass = false
						for (const ed of new_edges) {
							if (ed.source == character1 + " + " + character2 && ed.target == other_characters_name) {
								pass = true 
								break
							} else if (ed.source == character2 + " + " + character1 && ed.target == other_characters_name) {
								pass = true 
								break
							}
						}
						if (pass) {
							continue
						}
					}

					// 1. already in dictionary!
					if (dictionary[other_characters_name] !== undefined && !(avoid_repeat[[character_name,other_characters_name]] || avoid_repeat[[other_characters_name,character_name]])) {
						// Ensure it is not wrong
						if (turn == 2) {
							if (perma1.includes(dictionary[other_characters_name]) || (dictionary[other_characters_name] == "" && perma1.includes(other_characters_name)) )
							continue
						} else if (perma2.includes(dictionary[other_characters_name]) || (dictionary[other_characters_name] == "" && perma2.includes(other_characters_name))) {
							continue
						}

						//console.log("found: " + other_characters_name + ", it is:" + dictionary[other_characters_name])
						// Construct Rel diagram!
						rel_diagram = [character_name]
						while (dictionary[character_name] != "") {
							rel_diagram = [dictionary[character_name]].concat(rel_diagram)
							character_name = dictionary[character_name]
						}

						other_diagram = [other_characters_name]

						while (dictionary[other_characters_name] != "") {
							other_diagram.push(dictionary[other_characters_name])
							other_characters_name = dictionary[other_characters_name]
						}

						rel_diagram = rel_diagram.concat(other_diagram)

						line1 = []
						line2 = []

						//console.log("DONE???")
						break
					} else if (!(avoid_repeat[[character_name,other_characters_name]] || avoid_repeat[[other_characters_name,character_name]])) { // 2. not in dictionary!
						// console.log("check: " + ch1 + " + " + ch2)
						// console.log(other_characters_name + " not in dictionary!")
						avoid_repeat[[character_name,other_characters_name]] = true
						dictionary[other_characters_name] = character_name
						if (turn == 2) {
							line1.push(other_characters_name)
							perma1.push(other_characters_name)
						} else {
							line2.push(other_characters_name)
							perma2.push(other_characters_name)
						}
					}
				}
			}

			if (rel_diagram.length > 0) { 
				document.getElementById("relationship").innerHTML = character1 + " ㅤandㅤ " + character2 + " ㅤare related!"
				document.getElementById("relationship").style.color = "black"

				//Graph the details !!!
				var rel_details = []
				var x = 0
				var y = 0
		
				function setpos(chr_name, x, y) {
					for (const nn of new_nodes) {
						if (nn.id == chr_name) {
							nn.position.x = x
							nn.position.y = y
							nn.hidden = false
							break
						}
					}
					for (let i = 0; i < character_info.length; i++) {
						if (character_info[i].english_name == chr_name) {
							document.getElementById("ch" + i.toString()).checked = true
							document.getElementById("ch" + i.toString() + "_2").checked = true
						}
					}  
				} 

				console.log(rel_diagram)
				setpos(rel_diagram[0], x, y)
				for (var i = 1; i < rel_diagram.length; i++) {
					var person1 = rel_diagram[i-1]
					var person2 = rel_diagram[i]
					for (const ne of new_edges) {
						if (ne.source == person1 && ne.target == person2) {
							x += 150
							y += 150
							setpos(person2, x, y)
							ne.hidden = false
							break
						} else if (ne.source == person2 && ne.target == person1) {
							x += 150
							y -= 150
							setpos(person2, x, y)
							ne.hidden = false
							break
						}
					}
				}
				setNodes(new_nodes)	
				setEdges(new_edges)

				find_X.current = 0
				find_Y.current = 0
				handleTransform("Genji")
				setTimeout(function(){
					zoomTo(0.6, { duration: 1000}); 
				}, 1000); 
			} else {
				document.getElementById("relationship").innerHTML = character1 + " ㅤandㅤ " + character2 + " ㅤare not related."
				document.getElementById("relationship").style.color = "#5875a3"
			}
			
			// ********************** //
		}
	}

	function allowDrop(ev) {
		ev.preventDefault();
	}
	
	function drag(ev) {
		ev.dataTransfer.setData("text", ev.target.className);
	}
	
	function drop(ev) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		document.getElementById('mySearch').value = data
	}

	function drop2(ev) {
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		document.getElementById('mySearch2').value = data
	}

    return (
        <div style={{fontSize: "large"}} >
			<h5 id="relationship"></h5>
			<button style={{borderRadius: "5px", margin: '4px', marginRight: '8px', marginLeft: "30px"}} title="disable menu" onClick={() => {location.reload();}}>Reset</button>
			<select onChange={(e) => {changeLanguage(e.target.value);disableMenu()}} style={{marginLeft: "10px", fontSize: "large", width: "175px", marginRight: "10px",}}>
                  <option value="en" selected>English</option>
                  <option value="jp" >Japanese</option> 
            </select> 
			<button id="disableMenuButton" style={{borderRadius: "50%", margin: '4px', marginRight: '8px',visibility: 'hidden'}} title="disable menu" onClick={() => {disableMenu(); document.getElementById('mySearch').value = ""}} >✖</button>
			<input onDrop={(e) => drop(e)} onDragOver={(e) => allowDrop(e)} autocomplete="off" type="text" id="mySearch" onClick={(e) => {if (e.target.value == "") {myFunction(""); disableMenu2()} else {disableMenu2()}}} onKeyUp={(e) => myFunction(e.target.value)} title="Type in a character name" onSelectCapture={() => {document.getElementById('myMenu').style.display = 'block';  document.getElementById('disableMenuButton').style.visibility = 'visible'}} style={{width: "175px", fontSize: "13px", padding: "11px", border: "1px solid #ddd", marginBottom: '10px'}}/>
			<button id="disableMenuButton2" style={{borderRadius: "50%", marginLeft: '10px', marginRight: '10px',visibility: 'hidden', }} title="disable menu" onClick={() => {disableMenu2(); document.getElementById('mySearch2').value = ""}}>✖</button>
			<input onDrop={(e) => drop2(e)} onDragOver={(e) => allowDrop(e)} autocomplete="off" type="text" id="mySearch2" onClick={(e) => {if (e.target.value == "") {myFunction2(""); disableMenu()} else {disableMenu()}}} onKeyUp={(e) => myFunction2(e.target.value)} title="Type in a character name" onSelectCapture={() => {document.getElementById('myMenu2').style.display = 'block';  document.getElementById('disableMenuButton2').style.visibility = 'visible'}} style={{width: "175px", fontSize: "13px", padding: "11px", border: "1px solid #ddd", marginBottom: '10px'}}/>
			<button style={{borderRadius: "50%", margin: '4px', marginRight: '8px', marginLeft: "15px"}} title="disable menu" onClick={() => findRel()}>⇄</button>
			<div style={{position: 'relative', height:0, width: 0, marginLeft: "auto", marginRight: "auto"}}>
				<div style={{position: 'absolute', height:'0px', width: '520px', zIndex: 1}}>
					<ul id="myMenu" style={{listStyle: "none inside", margin: 0,width: 'fit-content',  height: 'fit-cotent', maxHeight: '225px', overflowY: 'scroll', display: 'none', scrollbarWidth: 'none', background: 'white', marginLeft: "-175px", paddingLeft:0, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'}} >
					{  
						character_info.map(
							function(c_info, i) {
								var jp_name = c_info.japanese_name
								if (jp_name != null) {
									if (c_info.japanese_name.includes("（")) {
										jp_name = c_info.japanese_name.slice(0, character_info[i].japanese_name.indexOf("（"))
									}
								}
								return (
									<div className="item1">
										<div className="a" id={c_info.english_name+c_info.japanese_name} style={{margin: '4px'}}>
											<input type="checkbox" id={"ch"+i.toString()+ "_2"} onChange={(e) => enableDisable(i, e.target.checked)} style={{width:"25px"}} />
											<select onChange={(e) => changeNodeLabelName(i, e.target.value)} style={{fontSize:"20px", width: "175px"}} id={"dd" + +i.toString() + "_2"}>
												<option value={c_info.english_name} selected>{c_info.english_name}</option>
												<option value={jp_name}>{c_info.japanese_name}</option>
											</select> 
											<button className={c_info.english_name} draggable={true} onDragStart={(e) => drag(e)} id={"display_all_rels_"+i.toString()} style={{borderRadius: "95%", margin: '4px',fontSize:"20px", background: '#bdbdbd'}} title={"Display all relationships for " + c_info.english_name} onClick={() => {allRel(i); disableMenu();  setInterval(pinLocation(c_info), 3000)}}>📌</button>
										</div> 
									</div> 
									)
							}
						)
					}
					</ul>
				</div>

				<div style={{position: 'absolute', height:'0px', width: '520px', zIndex: 1}}>
					<ul id="myMenu2" style={{listStyle: "none inside", margin: 0,width: 'fit-content',  height: 'fit-cotent', maxHeight: '225px', overflowY: 'scroll', display: 'none', scrollbarWidth: 'none', background: 'white', marginLeft: "100px", paddingLeft:0, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'}} >
					{
						character_info.map(
							function(c_info, i) {
								var jp_name = c_info.japanese_name
								if (jp_name != null) {
									if (c_info.japanese_name.includes("（")) {
										jp_name = c_info.japanese_name.slice(0, character_info[i].japanese_name.indexOf("（"))
									}
								}
								return (
									<div className="item2">
										<div className="a" id={c_info.english_name+c_info.japanese_name} style={{margin: '4px'}}>
											<input type="checkbox" id={"ch"+i.toString()} onChange={(e) => enableDisable(i, e.target.checked)} style={{width:"25px"}} />
											<select onChange={(e) => changeNodeLabelName(i, e.target.value)} style={{fontSize:"20px", width: "175px"}} id={"dd" + +i.toString()}>
												<option value={c_info.english_name} selected>{c_info.english_name}</option>
												<option value={jp_name}>{c_info.japanese_name}</option>
											</select> 
											<button className={c_info.english_name} draggable={true} onDragStart={(e) => drag(e)} id={"display_all_rels_"+i.toString()} style={{borderRadius: "95%", margin: '4px',fontSize:"20px", background: '#bdbdbd'}} title={"Display all relationships for " + c_info.english_name} onClick={() => {allRel(i); disableMenu();  setInterval(pinLocation(c_info), 3000)}}>📌</button>
										</div> 
									</div> 
									)
							}
						)
					}
					</ul>
				</div>
			</div>
			
            <ReactFlow 
			alt="Geneology map diagram"
            className={styles.viewer_window}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            attributionPosition="top-right"
			edgeTypes={{'custom': CustomEdge}}
			maxZoom={10}
			minZoom={0.5}
			onClick={() => {disableMenu(); disableMenu2()}}
        > 
            <Controls />
            <Background color="#aaa"/>
        </ReactFlow>
        </div>
    )
}

