const { getSession } = require('../../neo4j_driver/route.prod.js');
const { toNativeTypes, valueToNativeType,concatObj, sortPnumsFromObjList } = require('../../neo4j_driver/utils.prod.js');


async function getData (){
	const session = await getSession();

	// All the Quearies that return the DB data
	let getHonka = 'match (a:Honka) return (a) as honka'
	let getPnum = 'match (g:Genji_Poem) return g.pnum as pnum'
	let getPoemHonka = 'MATCH (n:Honka)-[r:ALLUDES_TO]-(p:Genji_Poem) RETURN n.id as id, p.pnum as pnum, r.notes as notes'
	let getPoet = 'match (p:People) return p.name as poet'
	let getHonkaPoet = 'match (h:Honka)<-[:AUTHOR_OF]-(p:People) return h.id as id, p.name as name'
	let getSource = 'match (s:Source) return s.title as source'
	let getHonkaSource = 'match (h:Honka)-[r:ANTHOLOGIZED_IN]-(s:Source) return h.id as id, r.order as order, s.title as title'
	let getTrans = 'match (h:Honka)<-[:TRANSLATION_OF]-(t:Translation)<-[:TRANSLATOR_OF]-(p:People) return h.id as id, t.translation as trans, p.name as name'


	try {
		const resHonka = await session.readTransaction(tx => tx.run(getHonka))
		const resPnum = await session.readTransaction(tx => tx.run(getPnum))
		const resPoemHonka = await session.readTransaction(tx => tx.run(getPoemHonka))
		const resPoet = await session.readTransaction(tx => tx.run(getPoet))
		const resPoetEdge = await session.readTransaction(tx => tx.run(getHonkaPoet))
		const resSrc = await session.readTransaction(tx => tx.run(getSource))
		const resSourceEdge = await session.readTransaction(tx => tx.run(getHonkaSource))
		const resTrans = await session.readTransaction(tx => tx.run(getTrans))

		// Return variables
		let ans = []
		let max = 0
		let key = 0
		let translators = new Set()


		// For translators
    	let transLs = resTrans.records.map(e => [concatObj(toNativeTypes(e.get('id'))), concatObj(toNativeTypes(e.get('trans'))), concatObj(toNativeTypes(e.get('name')))])
		let transObj = {}
		transLs.forEach(e => {
			translators.add(e[2])
			if (transObj[e[0]] === undefined) {
				transObj[e[0]] = {}
				transObj[e[0]][e[2]] = e[1]
			} else {
				transObj[e[0]][e[2]] = e[1]
			}
		})
		translators = Array.from(translators).map(e => ({value: e, label: e}))


		// For ans
		resHonka.records.map(e => toNativeTypes(e.get('honka'))).forEach(e => {
			delete Object.assign(e.properties, { ['key']: e.properties['id'] })['id']
			e.properties.translations = transObj[e.properties.key]
			ans.push(e.properties)
			key = parseInt(e.properties.key.slice(1))
			if (max < key) {
				max = key
			}
		})
		let tempEdgeList = resSourceEdge.records.map(e => [concatObj(toNativeTypes(e.get('id'))), concatObj(toNativeTypes(e.get('title'))), concatObj(toNativeTypes(e.get('order')))])
		let tempEdgeObj = {}
		tempEdgeList.forEach(e => {
			if (tempEdgeObj[e[0]] === undefined) {
				tempEdgeObj[e[0]] = [[e[1], e[2], true]]
			} else {
				tempEdgeObj[e[0]].push([e[1], e[2], true])
			}
		})
		ans.forEach(e => {
			if (tempEdgeObj[e.key] !== undefined) {
				e.Source = tempEdgeObj[e.key]
			} 
		})
		let poetEdge = resPoetEdge.records.map(e => [concatObj(toNativeTypes(e.get('id'))), concatObj(toNativeTypes(e.get('name')))])
		poetEdge.forEach(e => {
			let index = ans.findIndex(ele => ele.key === e[0])
			ans[index].Poet = e[1]
		})


		// For init_src and init_order
		let init_src = {}
		let init_order = {}
		for (let i = 0; i < max; i ++) {
			init_src['H'+JSON.stringify(i)] = ''
			init_order['H'+JSON.stringify(i)] = 'N/A'
		}


		// For ls
		let temp = resPnum.records.map(e => e.get('pnum'))
		let ls = []
		temp.forEach(e => {
			if (e !== null) {
				ls.push({ value: e, label: e })
			}
		})
		ls = sortPnumsFromObjList(ls)


		// For links
		let ll = Array.from(new Set(resPoemHonka.records.map(e => JSON.stringify([e.get('id'), e.get('pnum'), e.get('notes')])))).map(e => JSON.parse(e))
		let links = {}
		ll.forEach(e => {
			if (e[0] in links) {
				links[e[0]].push([e[1], true, e[2]])
			} else {
				links[e[0]] = [[e[1], true, e[2]]]
			}
		})
	

		// For poets
		temp = resPoet.records.map(e => e.get('poet'))
		let poets = []
		temp.forEach(e => {
			poets.push({ value: e, label: e })
		})

		// For sources
		temp = resSrc.records.map(e => e.get('source'))
		let sources = []
		temp.forEach(e => {
			sources.push({ value: e, label: e })
		})
		
		
		const data = {
			translators: translators, 
			ans: ans, 
			init_src: init_src,
			init_order: init_order,
			ls:ls,
			links:links,
			poets:poets,
			sources:sources,
			max: max
		};
		return (data);
	} catch(error) {
		console.error('Failed to execute queries in allusions/allusionQuery:', error);
	} finally{
		await session.close();
	}
}

export const GET = async (request) =>{
	try {   
		const data = await getData()
		return new Response(JSON.stringify(data), {status: 200})
	}catch (error){
		return new Response(error, {status: 500})
	}
} 