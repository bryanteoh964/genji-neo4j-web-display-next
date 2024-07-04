import { isInt, isDate, isDateTime, isTime, isLocalDateTime, isLocalTime, isDuration } from 'neo4j-driver'
const traj = require('./traj.prod')

// tag::toNativeTypes[]
/**
 * Convert Neo4j Properties back into JavaScript types
 *
 * @param {Record<string, any>} properties
 * @return {Record<string, any>}
 */
export function toNativeTypes(properties) {
    return Object.fromEntries(Object.keys(properties).map((key) => {
        let value = valueToNativeType(properties[key])

        return [ key , value ]
    }))
}

/**
 * Convert an individual value to its JavaScript equivalent
 *
 * @param {any} value
 * @returns {any}
 */
function valueToNativeType(value) {
    if ( Array.isArray(value) ) {
        value = value.map(innerValue => valueToNativeType(innerValue))
    }
    else if ( isInt(value) ) {
        value = value.toNumber()
    }
    else if (
        isDate(value) ||
        isDateTime(value) ||
        isTime(value) ||
        isLocalDateTime(value) ||
        isLocalTime(value) ||
        isDuration(value)
    ) {
        value = value.toString()
    }
    else if (typeof value === 'object' && value !== undefined  && value !== null) {
        value = toNativeTypes(value)
    }

    return value
}
// end::toNativeTypes[]

export function getChpList() {
    return ["Kiritsubo 桐壺","Hahakigi 帚木","Utsusemi 空蝉","Yūgao 夕顔","Wakamurasaki 若紫","Suetsumuhana 末摘花","Momiji no Ga 紅葉賀","Hana no En 花宴","Aoi 葵","Sakaki 榊","Hana Chiru Sato 花散里","Suma 須磨","Akashi 明石","Miotsukushi 澪標","Yomogiu 蓬生","Sekiya 関屋","E Awase 絵合","Matsukaze 松風","Usugumo 薄雲","Asagao 朝顔","Otome 乙女","Tamakazura 玉鬘","Hatsune 初音","Kochō 胡蝶","Hotaru 螢","Tokonatsu 常夏","Kagaribi 篝火","Nowaki 野分","Miyuki 行幸","Fujibakama 藤袴","Makibashira 真木柱","Umegae 梅枝","Fuji no Uraba 藤裏葉","Wakana: Jō 若菜上","Wakana: Ge 若菜下","Kashiwagi 柏木","Yokobue 横笛","Suzumushi 鈴虫","Yūgiri 夕霧","Minori 御法","Maboroshi 幻","Niou Miya 匂宮","Kōbai 紅梅","Takekawa 竹河","Hashihime 橋姫","Shii ga Moto 椎本","Agemaki 総角","Sawarabi 早蕨","Yadorigi 宿木","Azumaya 東屋","Ukifune 浮舟","Kagerō 蜻蛉","Tenarai 手習","Yume no Ukihashi 夢浮橋"]
}

// input: String pnum, poem number
// output: A html paragraph that contains the chapter name of a Genji poem with Romaji in front of Kanji
export function parseChp(pnum) {
    const chapterNames = {'01':'Kiritsubo 桐壺','02':'Hahakigi 帚木','03':'Utsusemi 空蝉','04':'Yūgao 夕顔','05':'Wakamurasaki 若紫','06':'Suetsumuhana 末摘花','07':'Momiji no Ga 紅葉賀','08':'Hana no En 花宴','09':'Aoi 葵','10':'Sakaki 榊','11':'Hana Chiru Sato 花散里','12':'Suma 須磨','13':'Akashi 明石','14':'Miotsukushi 澪標','15':'Yomogiu 蓬生','16':'Sekiya 関屋','17':'E Awase 絵合','18':'Matsukaze 松風','19':'Usugumo 薄雲','20':'Asagao 朝顔','21':'Otome 乙女','22':'Tamakazura 玉鬘','23':'Hatsune 初音','24':'Kochō 胡蝶','25':'Hotaru 螢','26':'Tokonatsu 常夏','27':'Kagaribi 篝火','28':'Nowaki 野分','29':'Miyuki 行幸','30':'Fujibakama 藤袴','31':'Makibashira 真木柱','32':'Umegae 梅枝','33':'Fuji no Uraba 藤裏葉','34':'Wakana: Jō 若菜上','35':'Wakana: Ge 若菜下','36':'Kashiwagi 柏木','37':'Yokobue 横笛','38':'Suzumushi 鈴虫','39':'Yūgiri 夕霧','40':'Minori 御法','41':'Maboroshi 幻','42':'Niou Miya 匂宮','43':'Kōbai 紅梅','44':'Takekawa 竹河','45':'Hashihime 橋姫','46':'Shii ga Moto 椎本','47':'Agemaki 総角','48':'Sawarabi 早蕨','49':'Yadorigi 宿木','50':'Azumaya 東屋','51':'Ukifune 浮舟','52':'Kagerō 蜻蛉','53':'Tenarai 手習','54':'Yume no Ukihashi 夢浮橋'};

    let [chp, _, smt] = pnum.match(/.{1,2}/g);
    let chp_name = chapterNames[chp];
    if (!chp_name) {
        chp_name = 'Unknown Chapter';
    }

    return (
        <p>{chp} {chp_name}</p>
    );
}

// input: String pnum, poem number
// output: A html paragraph that contains the order of a poem in its chapter
export function parseOrder(pnum) {
    let [chp, _, order] = pnum.match(/.{1,2}/g)
    order = parseInt(order)
    return (
        <p>{order}</p>
    )
}

// plist: a list of string
export function sortPnums(plist) {
    for (let i = 0; i < plist.length-1; i++) {
        for (let j = 0; j < plist.length-i-1; j++) {
            if ((parseInt(plist[j][0].substring(0, 2)) > parseInt(plist[j+1][0].substring(0, 2))) 
            || (parseInt(plist[j][0].substring(0, 2)) >= parseInt(plist[j+1][0].substring(0, 2)) 
            && parseInt(plist[j][0].substring(4, 6)) > parseInt(plist[j+1][0].substring(4, 6)))) {
                let temp = plist[j+1]
                plist[j+1] = plist[j]
                plist[j] = temp
            }
        }
    }
    return plist
}

// objList: a list of object in the form of {value: val, label: lab}, where the values are strings of pnums.
export function sortPnumsFromObjList(objList) {
    for (let i = 0; i < objList.length-1; i++) {
        for (let j = 0; j < objList.length-i-1; j++) {
            if ((parseInt(objList[j].value.substring(0, 2)) > parseInt(objList[j+1].value.substring(0, 2))) 
            || (parseInt(objList[j].value.substring(0, 2)) >= parseInt(objList[j+1].value.substring(0, 2)) 
            && parseInt(objList[j].value.substring(4, 6)) > parseInt(objList[j+1].value.substring(4, 6)))) {
                let temp = objList[j+1]
                objList[j+1] = objList[j]
                objList[j] = temp
            }
        }
    }
    return objList
}

export function getPoemTableContent(poemRes, transTemp) {
    let speakers = poemRes.map(row => row.segments[0].start.properties.name)
    let addressees = poemRes.map(row => row.segments[1].end.properties.name)
    let Japanese = poemRes.map(row => row.segments[1].start.properties)
    let info = {}
    let plist = new Set()
    for (let i = 0; i < Japanese.length; i++) {
        plist.add(JSON.stringify([Japanese[i].pnum, speakers[i], addressees[i]]))
    }
    plist = Array.from(plist).map(item => JSON.parse(item))
    plist = sortPnums(plist)
    // make Japanese non-repetitive
    let jsonObject = Japanese.map(JSON.stringify);
    let uniqueSet = new Set(jsonObject);
    Japanese = Array.from(uniqueSet).map(JSON.parse);
    // prepares translations, notes, Waley#, etc., in info
    transTemp.forEach(element => {
        // element: [keys, properties]
        if (element[0].length !== 0 && element[0].includes('id')) {
            let auth, pnum
            pnum = element[1][element[0].indexOf('id')].substring(0, 6)
            auth = element[1][element[0].indexOf('id')].substring(6, 7)
            if (info[pnum] === undefined) {
                info[pnum] = {}
            }
            if (auth === 'A') {
                auth = 'Waley'
            } else if (auth === 'C') {
                auth = 'Cranston'
            } else if (auth === 'S') {
                auth = 'Seidensticker'
            } else if (auth === 'T') {
                auth = 'Tyler'
            } else {
                auth = 'Washburn'
            }
            if (element[0].includes('translation')) {
                info[pnum][auth] = element[1][element[0].indexOf('translation')]
            } else {
                info[pnum][auth] = 'N/A'
            }
            if (element[0].includes('WaleyPageNum')) {
                info[pnum]['WaleyPageNum'] = element[1][element[0].indexOf('WaleyPageNum')]
            } else if (auth === 'Waley' && typeof(info[pnum]['WaleyPageNum']) !== 'number') {
                info[pnum]['WaleyPageNum'] = 'N/A'
            }
        }
    });
    Japanese.forEach(e => {
        let n = e.pnum
        if (info[n] === undefined) {
            info[n] = {}
            info[n]['WaleyPageNum'] = 'N/A'
        }
        info[n].Japanese = e.Japanese
        info[n].Romaji = e.Romaji
    })
    // preparing a matrix of edit propertyNames
    let propname = Array.from(Array(plist.length), () => new Array(4))
    propname.forEach(row => {
        row[0] = 'Japanese'
        row[1] = 'Romaji'
        row[2] = 'empty'
        row[3] = 'empty'
    })
    return [plist, info, propname]
}

export function concatObj(e) {
    return Object.values(e).join('')
}



//character
export function generateGeneology(l) {
    
    let counts = l.reduce((acc, subArr) => {
        subArr.forEach(str => {
                if (!str.includes('_')){
                    if (!acc[str]) {
                        acc[str] = 1;
                    } else {
                        acc[str]++;
                }}});
        return acc;
    }, {});
    delete counts.Genji
    let ranked = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(pair => pair[0]);
       
    let nodes = [{
        id: '1',
        data: {
            label: 'Genji'
        }, 
        position: {x: traj[0][0], y: traj[0][0]}
    }]
  
    let edges = []
    let id = 2
    ranked.forEach(e => {
        nodes.push({
            id: id.toString(),
            data: {
                label: e
            },
            position: {x : traj[1750-id*2][0], y: traj[1750-id*2][1]},
            draggable: true,
        })
        id += 1
    })
    id = 1
    l.forEach(e => {
        let s = nodes.findIndex(element => element.data.label === e[0])
        let t = nodes.findIndex(element => element.data.label === e[2])
        s = (s+1).toString()
        t = (t+1).toString()
        edges.push({
            id: 'e'+id.toString(),
            source: s,
            target: t,
            label: e[1]
        })
        id += 1
    })

    return [nodes, edges]
  }
  



module.exports = { toNativeTypes, valueToNativeType, getChpList, generateGeneology, concatObj, getPoemTableContent, sortPnumsFromObjList }