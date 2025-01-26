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
			characters.current.push({ id: c.identifier, position: {x: c.x, y: c.y }, data: { label: c.english_name }, draggable: true, style: {border: "2px solid " + c.color, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'}, hidden: true}, )
		}
	
		for (const l of linkages) {
			characters.current.push({ id: l.person1 + " + " + l.person2, position: { x: l.x, y: l.y }, data: { label: l.emoji }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'},  hidden: true})
		}  
	
		for (const c of children) {
			for (const nd of characters.current) {
				if (nd.id == c.child) {
					relationships.current.push({ id: c.parent1 + " + " + c.parent2 + " -> " + c.child, source: c.parent1 + " + " + c.parent2, target: c.child, style:{ stroke: nd.style.border.slice(nd.style.border.indexOf("2px solid ")+10), strokeWidth: '2'},type: 'smoothstep', hidden: true})
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
					relationships.current.push({ id: nd.id + " - " + malas.current[nd.id].toString(), source: nd.id, target: link_id, style:{ stroke: nd.style.border.slice(nd.style.border.indexOf("2px solid ")+10), strokeWidth: '2'},type: 'smoothstep', hidden: true})
				} 
			}
		}
	
		for (const rel of labeled_relationships) {
			var edge = { id: rel.of + " - " + rel.character, source: rel.of, target: rel.character, style:{ stroke:"", hidden: true, strokeWidth: '2', opacity: "100%"}, data: {label: rel.is, type: "smoothstep"}, type: 'custom'}
			if (rel.is != "servant" && rel.is != "ostensible child" && (!rel.is.includes("adopted"))) {
				for (const nd of characters.current) { 
					if (nd.id == rel.of) {  
						var s = nd.style.border + ""
						edge.style.stroke = s.slice(s.indexOf("2px solid ")+10)
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
						edge.style.stroke = s.slice(s.indexOf("2px solid ")+10) 
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
		var new_nodes = [...nodes]
		var new_edges = [...edges]
		new_nodes[num].style.border = new_nodes[num].style.border.replace("2", "5")
		new_nodes[num].style.fontWeight = "bold"

		//disable all first after showAll (else just disable animated)  
		for (const ch of new_edges) {
			if (showedAll.current) {
				ch.hidden = true
			} 
			if (ch.label != 'parent') {
				ch.animated = false
			} 
		}
		if (showedAll.current) {
			showedAll.current = false
			for (const ch of new_nodes) {
				ch.hidden = true
			}
		}

		for (const e1 of new_edges) {
			if (e1.source.includes(" + ")) {
				const people1 = e1.source.slice(0, e1.source.indexOf(" + "))
				const people2 = e1.source.slice(e1.source.indexOf(" + ")+3)
				const offspring = e1.target
				const linkage = e1.source
				if (people1 == characters.current[num].id || people2 == characters.current[num].id) {
					for (const n1 of new_nodes) {
						if (n1.id == offspring || n1.id == linkage || n1.id == people1 || n1.id == people2) {
							n1.hidden = false
						}
					}
					e1.hidden = false
					e1.animated = true
				} else if (offspring == characters.current[num].id) {
					for (const n1 of new_nodes) {
						if (n1.id == people1 || n1.id == people2 || n1.id == linkage) {
							n1.hidden = false
						}
					}
					for (const e2 of new_edges) {
						if ((e2.source == people1 || e2.source == people2) && e2.target == linkage) {
							e2.hidden = false
							e2.animated = true
						}
						if (e2.source == e1.source && e2.target != characters.current[num].id) { //sibling or adopted sibling 
							const sibling = e2.target 
							for (const n2 of new_nodes) {
								if (n2.id == sibling) { 
									n2.hidden = false 
									break
								}
							}
						} 
					}
					e1.hidden = false
					e1.animated = true
				} 
			} else if (e1.source == characters.current[num].id || e1.target == characters.current[num].id) {
				for (const n1 of new_nodes) {
					if (n1.id == e1.source || n1.id == e1.target) {
						n1.hidden = false
					}
				}
				e1.hidden = false
				e1.animated = true
			}
			if (e1.label == "parent") {
				e1.hidden = true
			}
		}

		for (const n1 of new_nodes) {
			if (n1.id.includes(" + ") && n1.id.includes(characters.current[num].id)) {
				const people1 = n1.id.slice(0, n1.id.indexOf(" + "))
				const people2 = n1.id.slice(n1.id.indexOf(" + ")+3)
				const linkage = n1.id
				for (const n2 of new_nodes) {
					if (n2.id == people1 || n2.id == people2) {
						n2.hidden = false
					}
				}
				for (const e1 of new_edges) {
					if (e1.target == linkage) {
						e1.hidden = false
						e1.animated = true
					} 
					if (e1.label == "parent") {
						e1.hidden = true
					}
				}
			}
		}

		//other linkages (additional info)
		for (const n1 of new_nodes) {
			if (n1.id.includes(" + ")) {
				const people1 = n1.id.slice(0, n1.id.indexOf(" + "))
				const people2 = n1.id.slice(n1.id.indexOf(" + ")+3)
				const linkage = n1.id
				for (const n2 of new_nodes) {
					if (n2.id == people1 && !n2.hidden) {
						for (const n3 of new_nodes) {
							if (n3.id == people2 && !n3.hidden) {
								n1.hidden = false
								break
							}
						}
						break
					}
				}
			}
		}

		//other edges (additional info)
		for (const e1 of new_edges) {
			if (e1.hidden && e1.label != 'parent') {
				for (const n1 of new_nodes) {
					if (!n1.hidden && e1.source == n1.id) {
						for (const n2 of new_nodes) {
							if (!n2.hidden && e1.target == n2.id) {
								e1.hidden = false
								break
							}
						}
						break
					}
				}
			}
		}
		

		//check and uncheckboxes
		for (let i = 0; i < character_info.length; i++) {
			if (new_nodes[i].hidden == false) {
				document.getElementById("ch" + i.toString()).checked = true
			} else {
				document.getElementById("ch" + i.toString()).checked = false
			}
		}

		//* ::: restructure ::: *//
		var dir = "left"
		var this_persons_rel = []
		var x_occupy =[]

		for (const [c_name, , , rel] of c_X_Y) {
			if (characters.current[num].id == c_name) {
				this_persons_rel = rel
				break
			}
		}

		for (const ch of new_nodes) {
			if (ch.hidden == false && !(ch.id.includes("+")) && ch.id != characters.current[num].id) { 
				var this_rel = ""
				for (const [rel_type, c_n] of this_persons_rel) {
					if (c_n == ch.id) {
						this_rel = rel_type
						break
					}	
				}
				if (this_rel == "SON_OF" || this_rel == "DAUGHTER_OF") {
					if (gender_dict[ch.id] == "male") {
						ch.position.x = new_nodes[num].position.x - 250
					} else {
						ch.position.x = new_nodes[num].position.x + 250 
					}
					ch.position.y = new_nodes[num].position.y - 250 
				} else if (this_rel != "") {
					var x = new_nodes[num].position.x - 250
					while (x_occupy.includes(x)) {
						if (dir == "left") {
							x -= 250
						} else {
							x += 250
						} 
					} 
					ch.position.x = x
					x_occupy.push(x) 
					ch.position.y = new_nodes[num].position.y + Math.abs(x)*0.2  
					if (this_rel == "FATHER_OF" || this_rel == "MOTHER_OF") {
						ch.position.y += 500
					} else {
						ch.position.y += 250
					}


					//prep for next
					if (dir == "left") {
						dir = "right"
					} else {
						dir = "left"
					}
				}
			}
		}
		
		//love nodes
		for (const l_n of new_nodes) { 
			if ((l_n.id.includes("+")) && l_n.hidden == false) {
				const people1 = l_n.id.slice(0, l_n.id.indexOf(" + "))
				const people2 = l_n.id.slice(l_n.id.indexOf(" + ")+3)

				for (const n2 of new_nodes) {
					if (!(n2.id.includes("+")) && n2.hidden == false && n2.id != characters.current[num].id && (n2.id == people1 || n2.id == people2)) {
						var x = n2.position.x + 25
						while (x_occupy.includes(x)) {
							if (dir == "left") {
								x -= 75
							} else {
								x += 75 
							} 
						} 
						l_n.position.x = x
						x_occupy.push(x) 
						l_n.position.y = n2.position.y + 100

						if (dir == "left") {
							dir = "right"
						} else {
							dir = "left"
						}
						break
					}
				}

				//adjust children position, check children array
				for (const child of children) {
					if (child.parent1 == people1 && child.parent2 == people2 ) {
						for (const n3 of new_nodes) {
							if (child.child == n3.id) {
								var x = l_n.position.x
								while (x_occupy.includes(x)) {
									if (dir == "left") {
										x -= 125
									} else {
										x += 125
									} 
								} 
								n3.position.x = x
								x_occupy.push(x) 
								n3.position.y = l_n.position.y + 200 
								if (dir == "left") {
									dir = "right"
								} else {
									dir = "left"
								} 
								break
							}
						}
					}
				}
			}
		}


		setNodes(new_nodes)
		setEdges(new_edges)
	}

	const enableDisable = (num, bool) => {
		var new_nodes = [...nodes]
		var new_edges = [...edges]

		if (bool) {
			for (const ch of new_nodes) {
				if (ch.id == characters.current[num].id) {
					ch.hidden = false
				} else if (ch.id.includes(characters.current[num].id) && ch.id.includes(" + ")) {
					const people1 = ch.id.slice(0, ch.id.indexOf(" + "))
					const people2 = ch.id.slice(ch.id.indexOf(" + ")+3)
					for (const ch2 of new_nodes) {
						if ((ch2.id == people1 || ch2.id == people2) && (ch2.id != characters.current[num].id)) {
							if (ch2.hidden == false) {
								ch.hidden = false
								break
							}
						}
					}
				}
			}
			for (const ch of new_edges) {
				if (ch.source.includes(characters.current[num].id) || ch.target.includes(characters.current[num].id)) {
					for (const ch2 of new_nodes) {
						if ((ch2.id == ch.source || ch2.id == ch.target) && ch2.hidden == false) {
							for (const ch3 of new_nodes) {
								if ((ch3.id == ch.source || ch3.id == ch.target) && ch2.id != ch3.id && ch3.hidden == false) {
									ch.hidden = false
									break
								}
							}
						}
					}
				} 
			}
		} else {
			for (const ch of new_nodes) {
				if (ch.id.includes(characters.current[num].id)) {
					ch.hidden = true
				}
			}
			for (const ch of new_edges) {
				if (ch.source.includes(characters.current[num].id) || ch.target.includes(characters.current[num].id)) {
					ch.hidden = true
				} 
			}
		}

		for (const ch of new_nodes) {
			if (ch.id.includes(" + ")) {
				const people1 = ch.id.slice(0, ch.id.indexOf(" + "))
				const people2 = ch.id.slice(ch.id.indexOf(" + ")+3)
				for (const ch2 of new_edges) {
					if (ch2.source == ch.id) {
						const offspring = ch2.target
						if (!ch.hidden) {
							for (const ch3 of new_edges) {
								if (ch3.target == offspring && (people1 == ch3.source || people2 == ch3.source) && ch3.label == "parent") {
									ch3.hidden = true
								}
							}
						} else {
							for (const ch3 of new_nodes) {
								if (ch3.id == people1 && !ch3.hidden) {
									for (const ch4 of new_edges) {
										if (ch4.source == people1 && ch4.target == offspring) {
											for (const ch5 of new_nodes) {
												if (ch5.id == offspring && !ch5.hidden) {
													ch4.hidden = false
												}
											}
										}
									}
								}
							}
							for (const ch3 of new_nodes) {
								if (ch3.id == people2 && !ch3.hidden) {
									for (const ch4 of new_edges) {
										if (ch4.source == people2 && ch4.target == offspring) {
											for (const ch5 of new_nodes) {
												if (ch5.id == offspring && !ch5.hidden) {
													ch4.hidden = false
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}

		setNodes(new_nodes)
		setEdges(new_edges)
	}

    const showAll = () => {
		showedAll.current = true
		var new_nodes = [...nodes]
		var new_edges = [...edges]
		for (let i = 0; i < character_info.length; i++) {
			document.getElementById("ch" + i.toString()).checked = true
		}
		for (const ch of new_nodes) {
			ch.hidden = false
		}
		for (const ch of new_edges) {
			if (ch.label == "parent") {
				ch.hidden = true
			} else {
				ch.hidden = false
			}
		}
		setNodes(new_nodes)
		setEdges(new_edges)
		handleTransform() 
    }

	const disableAll = () => {
		showedAll.current = false
		var new_nodes = [...nodes]
		var new_edges = [...edges]
		for (let i = 0; i < character_info.length; i++) {
			document.getElementById("ch" + i.toString()).checked = false
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
		var new_nodes = [...nodes]
		new_nodes[num].data = {label: val}
		setNodes(new_nodes)
	}

	const changeLanguage = (ver) => {
		for (let i = 0; i < character_info.length; i++) {
			if (ver == "jp") {
				document.getElementById("dd" + i.toString()).value = character_info[i].japanese_name.slice(0, character_info[i].japanese_name.indexOf("（"))
			} else if (ver == "en") {
				document.getElementById("dd" + i.toString()).value = character_info[i].english_name
			}
			changeNodeLabelName(i, document.getElementById("dd" + i.toString()).value)
		}
	}

	const enableFlow = () => {
		var new_edges = [...edges]
		for (const e1 of new_edges) {
			e1.animated = true
		}
		setEdges(new_edges)
	}

	const disableFlow = () => {
		var new_nodes = [...nodes]
		var new_edges = [...edges]
		for (const n1 of new_nodes) {
			if (n1.style.fontWeight == "bold") {
				n1.style.border = n1.style.border.replace("5", "2")
				n1.style.fontWeight = "normal"
				n1.position.y -= 1
			}
		}
		for (const e1 of new_edges) {
			if (e1.label != 'parent') {
				e1.animated = false
			}
		}
		setNodes(new_nodes)
		setEdges(new_edges)
	}

	function myFunction(query) {
		// Declare variables 
		var filter = query.toUpperCase()
		var li = document.getElementsByTagName("li")
	  
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

	//expand | shrink
	const expand_counter = useRef(null);
  
	function expand_start() {
		expand_counter.current = setInterval(function() {
			var new_nodes = [...nodes]
			for (const n1 of new_nodes) {
				n1.position.x *= 1.01
				//n1.position.y *= 1.01  //disabled for now
			}
			setNodes(new_nodes)
		}, 50);
	}
	function expand_end() {
		clearInterval(expand_counter.current)
	}

	const shrink_counter = useRef(null);
  
	function shrink_start() {
		shrink_counter.current = setInterval(function() {
			var new_nodes = [...nodes]
			for (const n1 of new_nodes) {
				n1.position.x *= 0.99
				//n1.position.y *= 0.99 //disabled for now
			}
			setNodes(new_nodes)
		}, 50);
	}
	function shrink_end() {
		clearInterval(shrink_counter.current)
	}

	function disableMenu() {
		{document.getElementById('myMenu').style.display = 'none'; document.getElementById('disableMenuButton').style.visibility = 'hidden'; document.getElementById('mySearch').value = ""}
	}

	function Reset() {
		window.location.reload(); 
	}

	function pinLocation(c_info) {
		disableMenu(); 
		for (const c_node of nodes) {
			if (c_node.id == c_info.identifier) {
				find_X.current = c_node.position.x
				find_Y.current = c_node.position.y
			}  
		} 
		console.log("zooming to ", find_X.current, find_Y.current);
		handleTransform(c_info.identifier);
		setTimeout(function(){
			zoomTo(0.9, { duration: 1000}); 
		}, 1000); 
	}

    return (
        <div style={{fontSize: "large"}}>
            <br></br>
            <div >
                <button onClick={() => {showAll();disableMenu()}} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', fontWeight: 'bold'}}>Show All</button>
				<button onClick={() => {disableAll();disableMenu()}} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', fontWeight: 'bold'}}>Disable All</button>
				<button onClick={() => {enableFlow();disableMenu()}} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}}>Enable Animations</button> 
				<button onClick={() => {disableFlow();disableMenu()}} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}}>Disable Animations</button>
				<select onChange={(e) => {changeLanguage(e.target.value);disableMenu()}} style={{marginLeft: "10px", fontSize: "large", width: "175px", marginRight: "10px",}}>
                  <option value="en" selected>English</option>
                  <option value="jp" >Japanese</option> 
               </select> 
			   <button onClick={() => {Reset()}} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}}>Reset</button>
            </div>
			<br></br>
			<button id="disableMenuButton" style={{borderRadius: "50%", margin: '4px', marginRight: '8px',visibility: 'hidden'}} title="disable menu" onClick={() => disableMenu()}>✖</button>
			<input type="text" id="mySearch" onClick={(e) => {if (e.target.value == "") {myFunction("")}}} onKeyUp={(e) => myFunction(e.target.value)} title="Type in a character name" onSelectCapture={() => {document.getElementById('myMenu').style.display = 'block';  document.getElementById('disableMenuButton').style.visibility = 'visible'}} style={{width: "175px", fontSize: "13px", padding: "11px", border: "1px solid #ddd", marginBottom: '10px'}}/>
			<button onMouseDown={() => shrink_start()} onMouseUp={() => shrink_end()} style={{fontSize:"20px", marginLeft: '8px', marginRight:'4px', borderRadius: '10px'}} title={"Shrink"}>❇️</button> 
			<button onMouseDown={() => expand_start()} onMouseUp={() => expand_end()} style={{fontSize:"20px", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}} title={"Expand"}>✳️</button>
			<div style={{position: 'relative', height:0, width: 0, left:'50%',transform:'translate(-50)', marginLeft:'-175px'}}>
				<div style={{position: 'absolute', height:'0px', width: '520px', zIndex: 1}}>
					<ul id="myMenu" style={{listStyle: "none inside", margin: 0,width: 'fit-content',  height: 'fit-cotent', maxHeight: '225px', overflowY: 'scroll', display: 'none', scrollbarWidth: 'none', background: 'white', marginLeft: 0, paddingLeft:0, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)'}} >
					{
						character_info.map(
							function(c_info, i) {
								var info_emoji = "📜 Read Info"
								if (c_info.db_name == null) {
									info_emoji = "ㅤㅤㅤㅤㅤㅤ"
								}
								return (
									<li>
										<div className="a" id={c_info.english_name+c_info.japanese_name} style={{margin: '4px'}}>
											<input type="checkbox" id={"ch"+i.toString()} onChange={(e) => enableDisable(i, e.target.checked)} style={{width:"25px"}} />
											<select onChange={(e) => changeNodeLabelName(i, e.target.value)} style={{fontSize:"20px", width: "175px"}} id={"dd" + +i.toString()}>
												<option value={c_info.english_name} selected>{c_info.english_name}</option>
												<option value={c_info.japanese_name.slice(0, c_info.japanese_name.indexOf("（"))}>{c_info.japanese_name}</option>
											</select> 
											<button id={"display_all_rels_"+i.toString()} style={{borderRadius: "95%", margin: '4px',fontSize:"20px", background: '#bdbdbd'}} title={"Display all relationships for " + c_info.english_name} onClick={() => {allRel(i); disableMenu();  setInterval(pinLocation(c_info), 3000)}}>📌</button>
											<a id={"info_"+i.toString()} style={{border: "2px solid black",fontSize:"18px", background: '#bdbdbd', padding: '2px', textDecoration: "none", }} rel="noopener noreferrer" target="_blank" href={"/characters/"+c_info.db_name} title={"Redirect to info page about: " + c_info.db_name}>{info_emoji}</a> 
											<button style={{borderRadius: "95%", margin: '4px',fontSize:"20px", background: '#bdbdbd'}} onClick={() => {
												pinLocation(c_info)
											}}>📍</button> 
										</div> 
									</li> 
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
        > 
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
        </div>
    )
}

