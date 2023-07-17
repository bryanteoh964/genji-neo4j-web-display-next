import { isInt, isDate, isDateTime, isTime, isLocalDateTime, isLocalTime, isDuration } from 'neo4j-driver'
import { traj } from './traj'

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

        return [ key, value ]
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
    let [chp, _, smt] = pnum.match(/.{1,2}/g)
    let chp_name
    switch(chp){
        case '01':
            chp_name = "Kiritsubo 桐壺"
            break
        case '02':
            chp_name = "Hahakigi 帚木"
            break
        case '03': 
            chp_name = "Utsusemi 空蝉"
            break
        case '04': 
            chp_name = "Yūgao 夕顔"
            break
        case '05': 
            chp_name = "Wakamurasaki 若紫"
            break
        case '06': 
            chp_name = "Suetsumuhana 末摘花"
            break
        case '07': 
            chp_name = "Momiji no Ga 紅葉賀"
            break
        case '08': 
            chp_name = "Hana no En 花宴"
            break
        case '09': 
            chp_name = "Aoi 葵"
            break
        case '10': 
            chp_name = "Sakaki 榊"
            break
        case '11': 
            chp_name = "Hana Chiru Sato 花散里"
            break
        case '12': 
            chp_name = "Suma 須磨"
            break
        case '13': 
            chp_name = "Akashi 明石"
            break
        case '14': 
            chp_name = "Miotsukushi 澪標"
            break
        case '15': 
            chp_name = "Yomogiu 蓬生"
            break
        case '16': 
            chp_name = "Sekiya 関屋"
            break
        case '17': 
            chp_name = "E Awase 絵合"
            break
        case '18': 
            chp_name = "Matsukaze 松風"
            break
        case '19': 
            chp_name = "Usugumo 薄雲"
            break
        case '20': 
            chp_name = "Asagao 朝顔"
            break
        case '21': 
            chp_name = "Otome 乙女"
            break
        case '22': 
            chp_name = "Tamakazura 玉鬘"
            break
        case '23': 
            chp_name = "Hatsune 初音"
            break
        case '24': 
            chp_name = "Kochō 胡蝶"
            break
        case '25': 
            chp_name = "Hotaru 螢"
            break
        case '26': 
            chp_name = "Tokonatsu 常夏"
            break
        case '27': 
            chp_name = "Kagaribi 篝火"
            break
        case '28': 
            chp_name = "Nowaki 野分"
            break
        case '29': 
            chp_name = "Miyuki 行幸"
            break
        case '30': 
            chp_name = "Fujibakama 藤袴"
            break
        case '31': 
            chp_name = "Makibashira 真木柱"
            break
        case '32': 
            chp_name = "Umegae 梅枝"
            break
        case '33': 
            chp_name = "Fuji no Uraba 藤裏葉"
            break
        case '34': 
            chp_name = "Wakana: Jō 若菜上"
            break
        case '35': 
            chp_name = "Wakana: Ge 若菜下"
            break
        case '36': 
            chp_name = "Kashiwagi 柏木"
            break
        case '37': 
            chp_name = "Yokobue 横笛"
            break
        case '38': 
            chp_name = "Suzumushi 鈴虫"
            break
        case '39':
            chp_name = "Yūgiri 夕霧"
            break
        case '40': 
            chp_name = "Minori 御法"
            break
        case '41': 
            chp_name = "Maboroshi 幻"
            break
        case '42': 
            chp_name = "Niou Miya 匂宮"
            break
        case '43': 
            chp_name = "Kōbai 紅梅"
            break
        case '44': 
            chp_name = "Takekawa 竹河"
            break
        case '45': 
            chp_name = "Hashihime 橋姫"
            break
        case '46': 
            chp_name = "Shii ga Moto 椎本"
            break
        case '47': 
            chp_name = "Agemaki 総角"
            break
        case '48': 
            chp_name = "Sawarabi 早蕨"
            break
        case '49': 
            chp_name = "Yadorigi 宿木"
            break
        case '50': 
            chp_name = "Azumaya 東屋"
            break
        case '51':
            chp_name = "Ukifune 浮舟"
            break
        case '52':
            chp_name = "Kagerō 蜻蛉"
            break
        case '53':
            chp_name = "Tenarai 手習"
            break
        case '54':
            chp_name = "Yume no Ukihashi 夢浮橋"
            break
        default: 
            console.log('unknown chapter caught')
    }
    return (
        <p>{chp} {chp_name}</p>
    )
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
        if (element[0].length === 1 ) {
            console.log('DB entry issue at: '+element)
        }
    });
    Japanese.forEach(e => {
        let n = e.pnum
        if (info[n] === undefined) {
            info[n] = {}
            info[n]['WaleyPageNum'] = 'N/A'
            console.log('manually creating info object for '+n)
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