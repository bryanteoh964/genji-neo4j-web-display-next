'use client'

import { useCallback, useEffect, useState, useRef} from 'react';
import ReactFlow, {
    applyEdgeChanges,
    applyNodeChanges,
    MiniMap,
    Controls,
    Background, 
} from 'reactflow'; 
import 'reactflow/dist/style.css';

import styles from '../styles/pages/characters.module.css';
import CustomEdge from "../../CustomEdge.tsx";

class Character { //Edges indicating child from a relationship linkage
	constructor(identifier, english_name, japanese_name, x, y, color) {
		this.identifier = identifier
		this.english_name = english_name
		this.japanese_name = japanese_name
		this.x = x
		this.y = y
		this.color = color 
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
export default function GeneologyMap() { 
    //characters
		var characters = useRef([])
		
		var character_info = [new Character("Previous Emperor", "Previous Emperor", "先皇 （せんてい）", 0, -350, "#2c3e78"), 
			new Character("Kiritsubo Emperor", "Kiritsubo Emperor", "桐壺帝（きりつぼてい）", -100, -25, "#782c4b"), 
			new Character("Kiritsubo Consort", "Kiritsubo Consort", "桐壺更衣（きりつぼのこうい）", -300, 90, "#1e5e3b"), 
			new Character("Azechi no Dainagon 1", "Azechi no Dainagon I", "按察使の大納言（あぜちのだいなごん）", -300, 0, "#7d6227"), 
			new Character("Princess Omiya", "Princess Omiya", "大宮（おおみや）", 175, -125, "#91ab80"), 
			new Character("Momozono Shikubu no Miya", "Momozono Shikubu no Miya", "桃園式部卿宮（ももぞのしきぶきょうのみや）", -215, -205, "#8f9945"), 
			new Character("Fujitsubo", "Fujitsubo", "藤壺中宮（ふじつぼのちゅうぐう）", 62, 100, "#c47a2f"), 
			new Character("Genji", "Genji", "光源氏（ひかるげんじ）", -213, 168, "#e0dd22"), 
			new Character("Prince Hyōbu", "Prince Hyōbu", "兵部卿宮（ひょうぶきょうのみや）", 280, 95, "#5f9945"), 
			new Character("Murasaki no Ue", "Murasaki no Ue", "紫の上（むらさきのうえ）", 62, 205, "#c603fc"), 
			new Character("Emperor Reizei", "Emperor Reizei", "冷泉帝（れいぜいてい）", -100, 320, "#fc44ad"), 
			new Character("A Minister", "A Minister", "中務省（なかつかさしょう）", -530, -75, "#445a69"), 
			new Character("Akashi Nun", "Akashi Nun", "明石の尼君（あかしのあまきみ）", -460, 0, "#4e6158"), 
			new Character("Novitate", "Novitate", "明石の入道（あかしのにゅうどう）", -620, 0, "#918d56"), 
			new Character("The Akashi Lady", "The Akashi Lady", "明石の御方（あかしのおんかた）", -365, 168, "#3acc1d"), 
			new Character("Minister of the Left 1", "Minister of the Left I", "左大臣（さだいじん）", 325, -125, "#745b85"), 
			new Character("Aoi", "Aoi", "葵の上（あおいのうえ）", 230, 205, "#00c8fa"), 
			new Character("Yūgiri", "Yūgiri", "夕霧（ゆうぎり）", -130, 425, "#578fff"), 
			new Character("Akashi Princess", "Akashi Princess", "明石の姫君（あかしのひめぎみ）", -300, 290, "#7cdb53"), 
			new Character("Kokiden Consort 1", "Kokiden Consort I", "弘徽殿女御【桐壺帝の妃】（こきでんのにょうご）", -630, 85, "#db537c"), 
			new Character("Emperor Suzaku", "Emperor Suzaku", "朱雀帝（すざくてい）", -740, 168, "#d98e04"), 
			new Character("Zenbō", "Zenbō", "前坊（ぜんぼう）", -385, -200, "#82708c"), 
			new Character("Lady Rokujō", "Lady Rokujō", "六条御息所（ろくじょうのみやす）", -647.734, -241.997, "#fc1717"), 
			new Character("To no Chujo", "Tō no Chūjō", "頭中将（とうのちゅうじょう）", 445, 95, "#5300c7"), 
			new Character("Yūgao", "Yūgao", "夕顔（ゆうがお）", 230, 300, "#f56ee5"), 
			new Character("Tamakazura", "Tamakazura", "玉鬘（たまかずら）", 345, 522, "#d64f6c"), 
			new Character("The Fourth Princess 1", "The Fourth Princess I", "四の君（よんのきみ）", 625, 205, "#c2de6d"), 
			new Character("Minister of the Right", "Minister of the Right", "右大臣（うだいじん）", 655, -285, "#40e3a7"), 
			new Character("Oborozukiyo", "Oborozukiyo", "朧月夜（おぼろづきよ）", -917, 168, "#b5d468"), 
			new Character("Kumoinokari's Mother", "Kumoi no Kari's Mother", "雲居の雁の母（くもいのかりのはは）", 612, 95, "#756f56"), 
			new Character("Murasaki's Mother", "Murasaki's Mother", "按察使大納言の娘（あぜちだいなごんのむすめ）", 400, 205, "#92ba61"), 
			new Character("Kitayama no Amagimi", "Kitayama no Amagimi", "北山の尼君（きたやまのあまぎみ）", 550, -125, "#c2af91"), 
			new Character("The Lady of Jokyoden Palace", "The Lady of Jokyoden Palace", "承香殿の女御（じょうきょうでんのにょうご）", -500, 290, "#1f4f28"), 
			new Character("Higekuro", "Higekuro", "髭黒（ひげくろ）", 458, 465, "#543a00"), 
			new Character("Higekuro's Wife", "Higekuro's Wife", "髭黒の北の方 （ひげくろのきたのかた）", 655, 400, "#00542b"), 
			new Character("Ukon", "Ukon", "右近（うこん）", 420, 300, "#496b62"), 
			new Character("Kumoi no Kari", "Kumoi no Kari", "雲居の雁（くもいのかり）", 33, 425, "#4da392"), 
			new Character("Akikonomu", "Akikonomu", "秋好中宮（あきこのむちゅうぐう）", -518, 483, "#2e3cbf"), 
			new Character("Koremitsu", "Koremitsu", "藤原惟光（ふじわらのこれみつ）", -500, 578, "#8002ad"), 
			new Character("The Third Princess", "The Third Princess", "女三宮（おんなさんのみや）", -300, 590, "#ff4f9e"), 
			new Character("Kashiwagi", "Kashiwagi", "柏木（かしわぎ）", 217, 465, "#b2fc72"), 
			new Character("The Eighth Prince", "The Eighth Prince", "宇治八の宮（うじはちのみや）", -685, 570, "#54e8c0"), 
			new Character("Prince Hitachi", "Prince Hitachi", "常陸宮（ひたちのみ）", -885, 75, "#879c62"), 
			new Character("Suetsumuhana", "Suetsumuhana", "末摘花（すえつむはな）", -1171, 168, "#d1884f"), 
			new Character("Reikeiden Consort", "Reikeiden Consort", "麗景殿の女御（れいけいでんのにょうご）", 62, 0, "#95dadb"), 
			new Character("The Lady of the Falling Flowers", "The Lady of the Falling Flowers", "花散里（はなちるさと）", 285, 0, "#4b65db"), 
			new Character("Kogimi", "Kogimi", "小君（こぎみ）", -770, 315, "#5abaed"), 
			new Character("Utsusemi", "Utsusemi", "空蝉（うつせみ）", -885, 422, "#b56804"), 
			new Character("Iyo no Suke", "Iyo no Suke", "伊予介（いよのすけ）", -1075, 422, "#005c0b"), 
			new Character("Ki no Kami", "Ki no Kami", "紀伊守（きのかみ）", -1109, 608, "#80231b"), 
			new Character("Nokiba no Ogi", "Nokiba no Ogi", "軒端荻（のきばのおぎ）", -836, 558, "#e675de"), 
			new Character("Kokiden Consort 2", "Kokiden Consort II", "弘徽殿女御【冷泉帝の妃】（こきでんのにょうご）", 505, 370, "#0ee39f"), 
			new Character("Asagao", "Asagao", "朝顔（あさがお）", -708, -96, "#c0ff99"), 
			new Character("Genji's Horse", "Genji's Horse", "光源氏の馬🐎（ひかるげんじのうま）", -973, 350, "#b4d68b"), 
			new Character("Cat", "Cat", "猫🐈（ねこ）", -10, 685, "#c98a00"), 
			new Character("Gosechi Dancer", "Gosechi Dancer", "筑紫の五節（つくしのごせつ）", -1000, 225, "#309ae6"), 
			new Character("Prince Hotaru", "Prince Hotaru", "蛍兵部卿宮（ほたるひょうぶきょうのみや）", 886, 546, "#c2e37b"), 
			new Character("Makibashira", "Makibashira", "真木柱（まきばしら）", 587, 600, "#c57be3"), 
			new Character("Ōmi Lady", "Ōmi Lady", "近江の君（おうみのきみ）", 887, 215, "#ccb285"), 
			new Character("Kobai", "Kobai", "紅梅（こうばい）", 765, 370, "#c76554"), 
			new Character("The Second Princess 1", "The Second Princess I", "落葉の宮（おちばのみや）", 5, 530, "#8c4c7b"), 
			new Character("Emperor Kinjo", "Emperor Kinjo", "今上帝（きんじょうてい）", -430, 430, "#0fff0f"), 
			new Character("The Maiden of the Dance", "The Maiden of the Dance", "藤典侍（とうのないしのすけ）", -210, 520, "#fc8114"), 
			new Character("Kaoru", "Kaoru", "薫（かおる）", -257, 793, "#3273a8"), 
			new Character("Eighth Prince's Wife", "Eighth Prince's Wife", "八の宮と北の方（はちのみやのきたのかた", -850, 635, "#7a9c5c"), 
			new Character("Agemaki", "Agemaki", "大君（おおいぎみ）", -850, 800, "#5c9c71"), 
			new Character("Kozeri", "Kozeri", "中君（なかのきみ）", -685, 835, "#ba59a2"), 
			new Character("Ukifune", "Ukifune", "浮舟（うきふね）", -625, 740, "#ff5f4a"), 
			new Character("Niou", "Niou", "匂宮（におうのみや）", -390, 700, "#186328"), 
			new Character("The Sixth Princess", "The Sixth Princess", "六の君（ろくのきみ）", -90, 760, "#b85876"), 
			new Character("Nakatsukasa", "Nakatsukasa", "中務 （なかつかさ）", 190, 680, "#9c79ed"), 
			new Character("Omyōbu", "Omyōbu", "王命婦（おうみょうぶ）", 277, 615, "#997112"), 
			new Character("Yoshikiyo", "Yoshikiyo", "源良清（みなもとのよしきよ）", -844, -5, "#994a12"), 
			new Character("Shōnagon", "Shōnagon", "少納言（しょうなごん）", 77, 760, "#6ddeba"), 
			new Character("Gen no Naishi", "Gen no Naishi", "源典侍（げんのないしのすけ）", -725, 430, "#8d9181"), 
			new Character("Bishop of Yokawa", "Bishop of Yokawa", "横川の僧都（よかわのそうづ）", -475, 933, "#dbb98a"), 
			new Character("Chūjō no Kimi", "Chūjō no Kimi", "中将の君（ちゅうじょうのきみ）", -533, 650, "#36188f"), 
			new Character("The Fourth Princess 2", "The Fourth Princess II", "女四の宮（おんなしのみや）", -1350, 460, "#a186c4"), 
			new Character("Ben no Kimi", "Ben no Kimi", "弁の君（べんのきみ）", -960, 860, "#8f6e0a"), 
			new Character("Kurōdo no Shōshō", "Kurōdo no Shōshō", "蔵人の少将（くろうどのしょうしょう）", 256, 760, "#5b6660"), 
			new Character("Himegimi", "Himegimi", "姫君（ひめぎみ）", 430, 760, "#b34f8c"), 
			new Character("Chūnagon", "Chūnagon", "中納言の君（ちゅうなごんのきみ）", -1325, 325, "#6b754d"), 
			new Character("Jijū", "Jijū", "侍従（じじゅう）", -1330, 260, "#715dc2"), 
			new Character("The Bishop of Kitayama", "The Bishop of Kitayama", "北山の僧都（きたやまのそうず）", 800, -125, "#4f30c9"), 
			new Character("Azechi no Kimi", "Azechi no Kimi", "按察使の君（あぜちのきみ)", 220, 830, "#768bad"), 
			new Character("Azechi no Dainagon 2", "Azechi no Dainagon II", "按察使の大納言（あぜちのだいなごん）", 430, -210, "#644e6e"), 
			new Character("Azechi no Dainagon 3", "Azechi no Dainagon III", "按察使の大納言（あぜちのだいなごん）", 785, 95, "#498258"), 
			new Character("The Holy Man of Kitayama", "The Holy Man of Kitayama", "北山の聖（きたやまのひじり）", 968, -100, "#dedda2"), 
			new Character("Naishi no Kimi", "Naishi no Kimi", "尚侍の君（ないしのきみ）", 595, 760, "#d17d77"), 
			new Character("Taifu no Kimi 1", "Taifu no Kimi I", "大輔の君（たいふのきみ）", 520, 880, "#94c98d"), 
			new Character("Taifu no Kimi 2", "Taifu no Kimi II", "大輔の君（たいふのきみ）", -1140, 350, "#63511d"), 
			new Character("Taifu no Kimi 3", "Taifu no Kimi III", "大輔の君（たいふのきみ）", -685, 980, "#a157e6"), 
			new Character("The Fujitsubo Consort 2", "The Fujitsubo Consort II", "藤壺の女御（ふじつぼのにょうご）", -584, 430, "#c7e657"), 
			new Character("Late Minister of the Left", "Late Minister of the Left", "故左大臣（こさだいじん）", -1030, 670, "#a16d90"), 
			new Character("The Fujitsubo Consort 3", "The Fujitsubo Consort III", "藤壺の女御（ふじつぼのにょうご）", -1030, 770, "#65a4fc"), 
			new Character("The Fujitsubo Princess", "The Fujitsubo Princess", "女二の宮【藤壺の宮】（おんなにのみや）", -850, 940, "#f2aacb"), 
			new Character("The Nun at Ono", "The Nun at Ono", "小野の妹尼（おののいもうとあま）", -230, 930, "#b7aaf2"), 
			new Character("Emon no Kami", "Emon no Kami", "衛門の督（えもんのかみ）", -65, 930, "#687d55"), 
			new Character("Deceased Daughter of Nun at Ono", "Deceased Daughter of Nun at Ono", "妹尼の亡き娘（いもうとあまのなきむすめ）", -230, 1080, "#58c784"), 
			new Character("Sakon no Shōshō", "Sakon no Shōshō", "左近の少将（さこんのしょうしょう）", -430, 1030, "#573e0e"), 
			new Character("The First Princess 1", "The First Princess I", "女一の宮【桐壺帝の第一皇女】（おんないちのみや）", -588, 168, "#65b577"), 
			new Character("The First Princess 2", "The First Princess II", "女一の宮【朱雀帝の第一皇女】（おんないちのみや）", -1240, 410, "#526ccc"), 
			new Character("The First Princess 3", "The First Princess III", "女一の宮【冷泉帝の第一皇女】（おんないちのみや）", 50, 830, "#cc8f52"), 
			new Character("The First Princess 4", "The First Princess IV", "女一の宮【今上帝の第一皇女】（おんないちのみや）", -1310, 605, "#52ccc0"), 
			new Character("The Second Princess 2", "The Second Princess II", "女二の宮【今上帝の第二皇女】（おんなにのみや）", -101, 835, "#6052cc"), 
		]

	//relationships 　
	var relationships = useRef([])

	//Nodes: Marriages and Love affairs 
	var linkages = [new Linkage("Kiritsubo Consort","Kiritsubo Emperor",-83,111,"💍"), 
		new Linkage("Kiritsubo Emperor","Fujitsubo",-25,111,"💍"), 
		new Linkage("Genji","Murasaki no Ue",60,325,"💍"), 
		new Linkage("Genji","Fujitsubo",0,175,"❤️"), 
		new Linkage("Novitate","Akashi Nun",-390,110,"💍"), 
		new Linkage("Genji","The Akashi Lady",-282,250,"💍"), 
		new Linkage("Princess Omiya","Minister of the Left 1",425,27,"💍"), 
		new Linkage("Genji","Aoi",125,305,"💍"), 
		new Linkage("Kiritsubo Emperor","Kokiden Consort 1",-360,80,"💍"), 
		new Linkage("Genji","Lady Rokujō",-300,-69,"💔"), 
		new Linkage("Genji","Yūgao",185,313,"❤️"), 
		new Linkage("To no Chujo","Yūgao",350,375,"💍"), 
		new Linkage("Prince Hyōbu","Murasaki's Mother",364,190,"💍"), 
		new Linkage("Emperor Suzaku","Oborozukiyo",-585,250,"💍"), 
		new Linkage("Genji","Oborozukiyo",-355,310,"❤️"), 
		new Linkage("Emperor Suzaku","The Lady of Jokyoden Palace",-480,250,"💍"), 
		new Linkage("Zenbō","Lady Rokujō",-513,-167,"💍"), 
		new Linkage("To no Chujo","Kumoinokari's Mother",550,200,"💍"), 
		new Linkage("To no Chujo","The Fourth Princess 1",580,326,"💍"), 
		new Linkage("Akikonomu","Emperor Reizei",-265,535,"💍"), 
		new Linkage("The Third Princess","Kashiwagi",-80,715,"❤️"), 
		new Linkage("Genji","Suetsumuhana",-770,270,"💍"), 
		new Linkage("Kiritsubo Emperor","Reikeiden Consort",20,111,"💍"), 
		new Linkage("Genji","The Lady of the Falling Flowers",225,70,"💍"), 
		new Linkage("Genji","The Third Princess",-180,695,"💍"), 
		new Linkage("Genji","Kogimi",-538,363,"❤️"), 
		new Linkage("Genji","Utsusemi",-750,485,"❤️"), 
		new Linkage("Iyo no Suke","Utsusemi",-940,520,"💍"), 
		new Linkage("Emperor Reizei","Kokiden Consort 2",187,433,"💍"), 
		new Linkage("Genji","Asagao",-700,115,"💔"), 
		new Linkage("Genji","Gosechi Dancer",-840,297,"❤️"), 
		new Linkage("Higekuro","Higekuro's Wife",590,540,"💍"), 
		new Linkage("Prince Hotaru","Tamakazura",788,595,"💔"), 
		new Linkage("Prince Hotaru","Makibashira",800,675,"💍"), 
		new Linkage("Kobai","Makibashira",775,525,"💍"), 
		new Linkage("The Second Princess 1","Kashiwagi",177,635,"💍"), 
		new Linkage("The Second Princess 1","Yūgiri",-50,635,"💍"), 
		new Linkage("Kumoi no Kari","Yūgiri",-18,510,"💍"), 
		new Linkage("Emperor Kinjo","Akashi Princess",-280,460,"💍"), 
		new Linkage("The Eighth Prince","Eighth Prince's Wife",-720,750,"💍"), 
		new Linkage("Niou","Ukifune",-420,800,"💔"), 
		new Linkage("Kaoru","Ukifune",-305,832,"💔"), 
		new Linkage("Niou","Kozeri",-550,930,"💍"), 
		new Linkage("Yūgiri","The Maiden of the Dance",-110,620,"💍"), 
		new Linkage("Niou","The Sixth Princess",-255,753,"💍"), 
		new Linkage("Higekuro","Tamakazura",475,645,"💍"), 
		new Linkage("The Akashi Lady","Yoshikiyo",-745,70,"💔"), 
		new Linkage("Genji","Gen no Naishi",-695,545,"❤️"), 
		new Linkage("The Eighth Prince","Chūjō no Kimi",-615,685,"💍"), 
		new Linkage("Genji","Nokiba no Ogi",-717,635,"❤️"), 
		new Linkage("Emperor Reizei","Himegimi",366,718,"💍"), 
		new Linkage("Kurōdo no Shōshō","Himegimi",390,885,"💔"), 
		new Linkage("Kitayama no Amagimi","Azechi no Dainagon 2",470,25,"💍"), 
		new Linkage("Kumoinokari's Mother","Azechi no Dainagon 3",800,250,"💍"), 
		new Linkage("Emperor Suzaku","The Fujitsubo Consort 2",-600,510,"💍"), 
		new Linkage("Emperor Kinjo","The Fujitsubo Consort 3",-857,730,"💍"), 
		new Linkage("Emon no Kami","The Nun at Ono",-100,1040,"💍"), 
		new Linkage("Sakon no Shōshō","Ukifune",-510,1100,"💔"), 
		new Linkage("Sakon no Shōshō","Deceased Daughter of Nun at Ono",-320,1160,"💍"), 
		new Linkage("Kaoru","The Second Princess 2",-130,890,"💍"), 
	]
	var children = [new Child("Kiritsubo Consort","Kiritsubo Emperor","Genji"),
		new Child("Genji","Fujitsubo","Emperor Reizei"),
		new Child("Novitate","Akashi Nun","The Akashi Lady"),
		new Child("Princess Omiya","Minister of the Left 1","Aoi"),
		new Child("Genji","Aoi","Yūgiri"),
		new Child("Genji","The Akashi Lady","Akashi Princess"),
		new Child("Kiritsubo Emperor","Kokiden Consort 1","Emperor Suzaku"),
		new Child("Princess Omiya","Minister of the Left 1","To no Chujo"),
		new Child("To no Chujo","Yūgao","Tamakazura"),
		new Child("Prince Hyōbu","Murasaki's Mother","Murasaki no Ue"),
		new Child("To no Chujo","Kumoinokari's Mother","Kumoi no Kari"),
		new Child("Zenbō","Lady Rokujō","Akikonomu"),
		new Child("To no Chujo","The Fourth Princess 1","Kashiwagi"),
		new Child("To no Chujo","The Fourth Princess 1","Kokiden Consort 2"),
		new Child("Higekuro","Higekuro's Wife","Makibashira"),
		new Child("To no Chujo","The Fourth Princess 1","Kobai"),
		new Child("Emperor Suzaku","The Lady of Jokyoden Palace","Emperor Kinjo"),
		new Child("The Third Princess","Kashiwagi","Kaoru"),
		new Child("The Eighth Prince","Eighth Prince's Wife","Agemaki"),
		new Child("The Eighth Prince","Eighth Prince's Wife","Kozeri"),
		new Child("Emperor Kinjo","Akashi Princess","Niou"),
		new Child("Yūgiri","The Maiden of the Dance","The Sixth Princess"),
		new Child("The Eighth Prince","Chūjō no Kimi","Ukifune"),
		new Child("Kumoi no Kari","Yūgiri","Kurōdo no Shōshō"),
		new Child("Higekuro","Tamakazura","Himegimi"),
		new Child("Kitayama no Amagimi","Azechi no Dainagon 2","Murasaki's Mother"),
		new Child("Higekuro","Tamakazura","Naishi no Kimi"),
		new Child("Emperor Suzaku","The Fujitsubo Consort 2","The Third Princess"),
		new Child("Emperor Kinjo","The Fujitsubo Consort 3","The Fujitsubo Princess"),
		new Child("Emon no Kami","The Nun at Ono","Deceased Daughter of Nun at Ono"),
		new Child("Kiritsubo Emperor","Kokiden Consort 1","The First Princess 1"),
		new Child("Emperor Reizei","Kokiden Consort 2","The First Princess 3"),
	]
	var labeled_relationships = [new Labeled("Kiritsubo Emperor","son","Previous Emperor"),
		new Labeled("Princess Omiya","daughter","Previous Emperor"),
		new Labeled("Princess Omiya","full-sister","Kiritsubo Emperor"),
		new Labeled("Momozono Shikubu no Miya","half-brother","Kiritsubo Emperor"),
		new Labeled("Zenbō","half-brother","Kiritsubo Emperor"),
		new Labeled("Prince Hotaru","son","Kiritsubo Emperor"),
		new Labeled("Kiritsubo Consort","daughter","Azechi no Dainagon 1"),
		new Labeled("Yoshikiyo","retainer","Genji"),
		new Labeled("Aoi","💀","Lady Rokujō"),
		new Labeled("Prince Hyōbu","full-brother","Fujitsubo"),
		new Labeled("Akashi Princess","adopted daughter","Genji + Murasaki no Ue"),
		new Labeled("Tamakazura","adopted daughter","Genji"),
		new Labeled("The Eighth Prince","son","Kiritsubo Emperor"),
		new Labeled("Emperor Reizei","ostensible child","Kiritsubo Emperor"),
		new Labeled("Novitate","son","A Minister"),
		new Labeled("Azechi no Dainagon 1","half-brother","A Minister"),
		new Labeled("Kokiden Consort 1","daughter","Minister of the Right"),
		new Labeled("The Fourth Princess 1","daughter","Minister of the Right"),
		new Labeled("Oborozukiyo","daughter","Minister of the Right"),
		new Labeled("Higekuro","full-brother","The Lady of Jokyoden Palace"),
		new Labeled("Higekuro's Wife","daughter","Prince Hyōbu"),
		new Labeled("Ukon","servant","Yūgao"),
		new Labeled("Koremitsu","servant","Genji"),
		new Labeled("The Eighth Prince","half-brother","Emperor Suzaku"),
		new Labeled("Suetsumuhana","daughter","Prince Hitachi"),
		new Labeled("The Lady of the Falling Flowers","younger sister","Reikeiden Consort"),
		new Labeled("Utsusemi","older sister","Kogimi"),
		new Labeled("Ki no Kami","son","Iyo no Suke"),
		new Labeled("Nokiba no Ogi","daughter","Iyo no Suke"),
		new Labeled("Ki no Kami","older brother","Nokiba no Ogi"),
		new Labeled("Akikonomu","adopted daughter","Genji"),
		new Labeled("Asagao","daughter","Momozono Shikubu no Miya"),
		new Labeled("Genji's Horse","pet","Genji"),
		new Labeled("Cat","pet","The Third Princess"),
		new Labeled("Prince Hotaru","half-brother","Genji"),
		new Labeled("Ōmi Lady","lost daughter","To no Chujo"),
		new Labeled("The Second Princess 1","daughter","Emperor Suzaku"),
		new Labeled("The Maiden of the Dance","daughter","Koremitsu"),
		new Labeled("Kaoru","ostensible child","Genji"),
		new Labeled("Ukifune","half-sister","Kozeri"),
		new Labeled("Nakatsukasa","servant","Murasaki no Ue"),
		new Labeled("Omyōbu","servant","Fujitsubo"),
		new Labeled("Shōnagon","wet nurse","Murasaki no Ue"),
		new Labeled("To no Chujo","👊","Genji"),
		new Labeled("Ukifune","saved by","Bishop of Yokawa"),
		new Labeled("Emperor Suzaku","half-brother","Genji"),
		new Labeled("The Fourth Princess 2","daughter","Emperor Suzaku"),
		new Labeled("Ben no Kimi","servant","The Eighth Prince"),
		new Labeled("Chūnagon","servant","Oborozukiyo"),
		new Labeled("Jijū","servant","Suetsumuhana"),
		new Labeled("The Bishop of Kitayama","older brother","Kitayama no Amagimi"),
		new Labeled("Azechi no Kimi","servant","The Third Princess"),
		new Labeled("Genji","visitor","The Holy Man of Kitayama"),
		new Labeled("Taifu no Kimi 1","servant","Naishi no Kimi"),
		new Labeled("Taifu no Kimi 2","servant","Kokiden Consort 1"),
		new Labeled("Taifu no Kimi 3","servant","Kozeri"),
		new Labeled("The Fujitsubo Consort 3","daughter","Late Minister of the Left"),
		new Labeled("The Nun at Ono","younger sister","Bishop of Yokawa"),
		new Labeled("Ukifune","adopted daughter","The Nun at Ono"),
		new Labeled("The First Princess 2","daughter","Emperor Suzaku"),
		new Labeled("The First Princess 4","daughter","Emperor Kinjo"),
		new Labeled("The Second Princess 2","daughter","Emperor Kinjo"),
	] 

	var malas = useRef({})
	var loaded = useRef(false)

	if (!loaded.current) {
		for (const c of character_info) {
			characters.current.push({ id: c.identifier, position: {x: c.x, y: c.y }, data: { label: c.english_name }, draggable: true, style: {border: "2px solid " + c.color}, hidden: true}, )
		}
	
		for (const l of linkages) {
			characters.current.push({ id: l.person1 + " + " + l.person2, position: { x: l.x, y: l.y }, data: { label: l.emoji }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true})
		}  
	
		for (const c of children) {
			for (const nd of characters.current) {
				if (nd.id == c.child) {
					relationships.current.push({ id: c.parent1 + " + " + c.parent2 + " -> " + c.child, source: c.parent1 + " + " + c.parent2, target: c.child, style:{ stroke: nd.style.border.slice(nd.style.border.indexOf("2px solid ")+10), strokeWidth: '2'},type: 'straight', hidden: true})
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
			var edge = { id: rel.of + " - " + rel.character, source: rel.of, target: rel.character, style:{ stroke:"", hidden: true, strokeWidth: '2'}, data: {label: rel.is, type: ""}, type: 'custom'}
			if (rel.is != "servant" && rel.is != "ostensible child" && (!rel.is.includes("adopted"))) {
				for (const nd of characters.current) { 
					if (nd.id == rel.of) {  
						var s = nd.style.border + ""
						edge.style.stroke = s.slice(s.indexOf("2px solid ")+10)
						if (rel.is == "daughter" || rel.is == "son") { 
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
							edge.data.type = "straight" 
						} else if (rel.is.includes("adopted")) {
							edge.data.type = "straight" 
							edge.id = rel.of + " -> " + rel.character + " (adopted)" 
						} 
						break
					}
				}
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
	} 
	

	const [nodes, setNodes] =useState([...characters.current])
    const [edges, setEdges] = useState([...relationships.current])

    const onInit = (reactFlowInstance) => {};
    const onConnect = () => null
    const minimapStyle = {
        height: 120,
    };
    const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
    const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );

	const showedAll = useRef(false) 

	//all relationships of that character  
	const allRel = (num) => {
		var new_nodes = [...nodes]
		var new_edges = [...edges]

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
		var new_edges = [...edges]
		for (const e1 of new_edges) {
			if (e1.label != 'parent') {
				e1.animated = false
			}
		}
		setEdges(new_edges)
	}

	function myFunction(query) {
		// Declare variables 
		var filter = query.toUpperCase()
		var li = document.getElementsByTagName("li")
	  
		// Loop through all list items, and hide those who don't match the search query
		for (var i = 0; i < li.length; i++) {
		  var a = li[i].getElementsByClassName("a")[0];
		  if (a.id.toUpperCase().indexOf(filter) > -1) {
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
				n1.position.y *= 1.01
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
				n1.position.y *= 0.99
			}
			setNodes(new_nodes)
		}, 50);
	}
	function shrink_end() {
		clearInterval(shrink_counter.current)
	}

    return (
        <div style={{fontSize: "large"}}>
            <br></br>
            <div >
                <button onClick={() => showAll()} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', fontWeight: 'bold'}}>Show All</button>
				<button onClick={() => disableAll()} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', fontWeight: 'bold'}}>Disable All</button>
				<button onClick={() => enableFlow()} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}}>Enable Flow</button>
				<button onClick={() => disableFlow()} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}}>Disable Flow</button>
				<select onChange={(e) => changeLanguage(e.target.value)} style={{marginLeft: "10px", fontSize: "large", width: "175px", marginRight: "10px",}}>
                  <option value="en" selected>English</option>
                  <option value="jp" >Japanese</option>
               </select>
            </div>
			<br></br>
			<button id="disableMenuButton" style={{borderRadius: "50%", margin: '4px', visibility: 'hidden'}} title="disable menu" onClick={() => {document.getElementById('myMenu').style.display = 'none'; document.getElementById('disableMenuButton').style.visibility = 'hidden'; document.getElementById('mySearch').value = ""}}>✖</button>
			<input type="text" id="mySearch" onKeyUp={(e) => myFunction(e.target.value)} title="Type in a category" onSelectCapture={() => {document.getElementById('myMenu').style.display = 'block';  document.getElementById('disableMenuButton').style.visibility = 'visible'}} style={{width: "175px", fontSize: "13px", padding: "11px", border: "1px solid #ddd", marginBottom: '10px'}}/>
			<button onMouseDown={() => shrink_start()} onMouseUp={() => shrink_end()} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}}>❇️</button>
			<button onMouseDown={() => expand_start()} onMouseUp={() => expand_end()} style={{fontSize: "large", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}}>✳️</button>
			<div style={{position: 'relative', height:0, width: 0, left:'50%',transform:'translate(-50)', marginLeft:'-135px'}}>
				<div style={{position: 'absolute', height:'0px', width: '320px', zIndex: 1,}}>
					<ul id="myMenu" style={{listStyle: "none inside", margin: 0,width: 'fit-content',  height: 'fit-cotent', maxHeight: '225px', overflowY: 'scroll', display: 'none', scrollbarWidth: 'none', background: 'white', marginLeft: 0, paddingLeft:0}} >
					{
						character_info.map(
							function(c_info, i) {
								return (
									<li>
										<div className="a" id={c_info.english_name+c_info.japanese_name} style={{margin: '4px'}}>
											<input type="checkbox" id={"ch"+i.toString()} onChange={(e) => enableDisable(i, e.target.checked)} />
											<select onChange={(e) => changeNodeLabelName(i, e.target.value)} style={{fontSize: "large", width: "175px"}} id={"dd" + +i.toString()}>
												<option value={c_info.english_name} selected>{c_info.english_name}</option>
												<option value={c_info.japanese_name.slice(0, c_info.japanese_name.indexOf("（"))}>{c_info.japanese_name}</option>
											</select>
											<button id={"display_all_rels_"+i.toString()} style={{borderRadius: "95%", margin: '4px', background: '#bdbdbd'}} title={"display all relationships for " + c_info.english_name} onClick={() => {allRel(i)}}>📌</button>
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
            fitView
            attributionPosition="top-right"
			edgeTypes={{'custom': CustomEdge}}
        >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
        </div>
    )
}

