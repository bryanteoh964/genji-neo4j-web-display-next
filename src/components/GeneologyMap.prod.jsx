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
	constructor(identifier, english_name, japanese_name, x, y, color, db_name) {
		this.identifier = identifier
		this.english_name = english_name
		this.japanese_name = japanese_name
		this.x = x
		this.y = y
		this.color = color 
		this.db_name = db_name
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
		
		var character_info = [new Character("Previous Emperor", "Previous Emperor", "先皇 （せんてい）", 0, -350, "#2c3e78", "Previous Emperor"), 
			new Character("Kiritsubo Emperor", "Kiritsubo Emperor", "桐壺帝（きりつぼてい）", -100, -25, "#782c4b", "Kiritsubo Emperor"),  
			new Character("Kiritsubo Consort", "Kiritsubo Consort", "桐壺更衣（きりつぼのこうい）", -300, 90, "#1e5e3b", "Kiritsubo Consort"), 
			new Character("Azechi no Dainagon 1", "Azechi no Dainagon I", "按察使の大納言（あぜちのだいなごん）", -387, -5, "#7d6227", "Azechi Dainagon"), 
			new Character("Princess Omiya", "Princess Omiya", "大宮（おおみや）", 175, -125, "#91ab80", "Princess Omiya"), 
			new Character("Momozono Shikubu no Miya", "Momozono Shikubu no Miya", "桃園式部卿宮（ももぞのしきぶきょうのみや）", -215, -205, "#8f9945", "Momozono Shikubu no Miya"), 
			new Character("Fujitsubo", "Fujitsubo", "藤壺中宮（ふじつぼのちゅうぐう）", 62, 100, "#c47a2f", "Fujitsubo"), 
			new Character("Genji", "Genji", "光源氏（ひかるげんじ）", -213, 168, "#e0dd22", "Genji"), 
			new Character("Prince Hyōbu", "Prince Hyōbu", "兵部卿宮（ひょうぶきょうのみや）", 280, 95, "#5f9945", "Prince Hyōbu"), 
			new Character("Murasaki no Ue", "Murasaki no Ue", "紫の上（むらさきのうえ）", -13, 205, "#c603fc", "Murasaki"), 
			new Character("Emperor Reizei", "Emperor Reizei", "冷泉帝（れいぜいてい）", -100, 320, "#fc44ad", "Reizei"), 
			new Character("A Minister", "A Minister", "大臣（だいじん）", -530, -75, "#445a69", "A Minister"),  
			new Character("Akashi Nun", "Akashi Nun", "明石の尼君（あかしのあまきみ）", -538, -5, "#4e6158", "Akashi Nun"),
			new Character("Novitiate", "Novitiate", "明石の入道（あかしのにゅうどう）", -693, -5, "#918d56", "Novitiate"), 
			new Character("The Akashi Lady", "The Akashi Lady", "明石の御方（あかしのおんかた）", -365, 168, "#3acc1d", "The Akashi Lady"), 
			new Character("Minister of the Left 1", "Minister of the Left I", "左大臣（さだいじん）", 325, -125, "#745b85", "Minister of the Left"), 
			new Character("Aoi", "Aoi", "葵の上（あおいのうえ）", 207, 240, "#00c8fa", "Aoi"), 
			new Character("Yūgiri", "Yūgiri", "夕霧（ゆうぎり）", -130, 440, "#578fff", "Yūgiri"), 
			new Character("Akashi Princess", "Akashi Princess", "明石の姫君（あかしのひめぎみ）", -300, 290, "#7cdb53", "Akashi Princess"), 
			new Character("Kokiden Consort 1", "Kokiden Consort I", "弘徽殿女御【桐壺帝の妃】（こきでんのにょうご）", -630, 85, "#db537c", "Kokiden Consort"), 
			new Character("Emperor Suzaku", "Emperor Suzaku", "朱雀帝（すざくてい）", -740, 168, "#d98e04", "Suzaku"), 
			new Character("Zenbō", "Zenbō", "前坊（ぜんぼう）", -385, -200, "#82708c", "Zenbō"), 
			new Character("Lady Rokujō", "Lady Rokujō", "六条御息所（ろくじょうのみやす）", -647.734, -241.997, "#fc1717", "Lady Rokujo"), 
			new Character("To no Chujo", "Tō no Chūjō", "頭中将（とうのちゅうじょう）", 445, 95, "#5300c7", "Tō no Chūjō"), 
			new Character("Yūgao", "Yūgao", "夕顔（ゆうがお）", 230, 300, "#f56ee5", "Yūgao"), 
			new Character("Tamakazura", "Tamakazura", "玉鬘（たまかずら）", 345, 522, "#d64f6c", "Tamakazura"), 
			new Character("The Fourth Princess 1", "The Fourth Princess I", "四の君（よんのきみ）", 625, 205, "#c2de6d", null), 
			new Character("Minister of the Right", "Minister of the Right", "右大臣（うだいじん）", 655, -285, "#40e3a7", "Minister of the Right"), 
			new Character("Oborozukiyo", "Oborozukiyo", "朧月夜（おぼろづきよ）", -917, 168, "#b5d468", "Oborozukiyo"), 
			new Character("Kumoinokari's Mother", "Kumoi no Kari's Mother", "雲居の雁の母（くもいのかりのはは）", 612, 95, "#756f56", null), 
			new Character("Murasaki's Mother", "Murasaki's Mother", "按察使大納言の娘（あぜちだいなごんのむすめ）", 400, 205, "#92ba61", "Murasaki's Mother"), 
			new Character("Kitayama no Amagimi", "Kitayama no Amagimi", "北山の尼君（きたやまのあまぎみ）", 550, -125, "#c2af91", "Murasaki's Grandmother"), 
			new Character("The Lady of Jokyoden Palace", "The Lady of Jokyoden Palace", "承香殿の女御（じょうきょうでんのにょうご）", -500, 290, "#1f4f28", null), 
			new Character("Higekuro", "Higekuro", "髭黒（ひげくろ）", 458, 465, "#543a00", "The Major Captain"),   
			new Character("Higekuro's Wife", "Higekuro's Wife", "髭黒の北の方 （ひげくろのきたのかた）", 655, 400, "#00542b", "The Major Captain's principle wife"), 
			new Character("Ukon", "Ukon", "右近（うこん）", 420, 300, "#496b62", "Ukon"), 
			new Character("Kumoi no Kari", "Kumoi no Kari", "雲居の雁（くもいのかり）", 33, 425, "#4da392", "Kumoinokari"), 
			new Character("Akikonomu", "Akikonomu", "秋好中宮（あきこのむちゅうぐう）", -518, 483, "#2e3cbf", "Akikonomu"), 
			new Character("Koremitsu", "Koremitsu", "藤原惟光（ふじわらのこれみつ）", -500, 578, "#8002ad", "Koremitsu"), 
			new Character("The Third Princess", "The Third Princess", "女三宮（おんなさんのみや）", -300, 590, "#ff4f9e", "The Third Princess"), 
			new Character("Kashiwagi", "Kashiwagi", "柏木（かしわぎ）", 217, 465, "#b2fc72", "Kashiwagi"), 
			new Character("The Eighth Prince", "The Eighth Prince", "宇治八の宮（うじはちのみや）", -668, 623, "#54e8c0", "Prince Hachi"),  
			new Character("Prince Hitachi", "Prince Hitachi", "常陸宮（ひたちのみ）", -885, 75, "#879c62", "Hitachi no Miya"), 
			new Character("Suetsumuhana", "Suetsumuhana", "末摘花（すえつむはな）", -1171, 168, "#d1884f", "Suetsumuhana"), 
			new Character("Reikeiden Consort", "Reikeiden Consort", "麗景殿の女御（れいけいでんのにょうご）", 62, 0, "#95dadb", "Reikeiden Consort"), 
			new Character("The Lady of the Falling Flowers", "The Lady of the Falling Flowers", "花散里（はなちるさと）", 285, 0, "#4b65db", "Hanachirusato"), 
			new Character("Kogimi", "Kogimi", "小君（こぎみ）", -815, 320, "#5abaed", "Kogimi"), 
			new Character("Utsusemi", "Utsusemi", "空蝉（うつせみ）", -885, 422, "#b56804", "Utsusemi"), 
			new Character("Iyo no Suke", "Iyo no Suke", "伊予介（いよのすけ）", -1075, 422, "#005c0b", "Iyo no Suke"), 
			new Character("Ki no Kami", "Ki no Kami", "紀伊守（きのかみ）", -1109, 608, "#80231b", "Ki no Kami"), 
			new Character("Nokiba no Ogi", "Nokiba no Ogi", "軒端荻（のきばのおぎ）", -885, 520, "#e675de", "Nokiba no Ogi"), 
			new Character("Kokiden Consort 2", "Kokiden Consort II", "弘徽殿の女御【冷泉帝の妃】（こきでんのにょうご）", 505, 370, "#0ee39f", null), 
			new Character("Asagao", "Asagao", "朝顔（あさがお）", -708, -96, "#c0ff99", "Asagao"), 
			new Character("Genji's Horse", "Genji's Horse", "光源氏の馬🐎（ひかるげんじのうま）", -973, 350, "#b4d68b", "Genji's horse"), 
			new Character("Cat", "Cat", "猫🐈（ねこ）", -10, 685, "#c98a00", "Cat"), 
			new Character("Gosechi Lady", "Gosechi Lady", "筑紫の五節（つくしのごせつ）", -1000, 225, "#309ae6", "Gosechi Lady"),  
			new Character("Prince Hotaru", "Prince Hotaru", "蛍兵部卿宮（ほたるひょうぶきょうのみや）", 900, 575, "#c2e37b", "Hotaru no Miya"), 
			new Character("Makibashira", "Makibashira", "真木柱（まきばしら）", 587, 600, "#c57be3", "The Major Captain's Daughter"),  
			new Character("Ōmi Lady", "Ōmi Lady", "近江の君（おうみのきみ）", 887, 215, "#ccb285", "The Ōmi Lady"), 
			new Character("Kobai", "Kobai", "紅梅（こうばい）", 765, 370, "#c76554", "Kōbai"), 
			new Character("The Second Princess 1", "The Second Princess I", "落葉の宮（おちばのみや）", 94, 530, "#8c4c7b", "The Second Princess"), 
			new Character("Emperor Kinjo", "Emperor Kinjo", "今上帝（きんじょうてい）", -430, 430, "#0fff0f", "The Current Emperor"), 
			new Character("Koremitsu's daughter", "Koremitsu's daughter", "藤典侍（とうのないしのすけ）", -210, 520, "#fc8114", "Koremitsu's daughter"), 
			new Character("Kaoru", "Kaoru", "薫（かおる）", -257, 793, "#3273a8", "Kaoru"), 
			new Character("Eighth Prince's Wife", "Eighth Prince's Wife", "八の宮と北の方（はちのみやのきたのかた", -850, 635, "#7a9c5c", null), 
			new Character("Agemaki", "Agemaki", "大君（おおいぎみ）", -850, 800, "#5c9c71", "Agemaki"), 
			new Character("Kozeri", "Kozeri", "宇治の中君（うじのなかのきみ）", -685, 835, "#ba59a2", "Kozeri"), 
			new Character("Ukifune", "Ukifune", "浮舟（うきふね）", -625, 740, "#ff5f4a", "Ukifune"), 
			new Character("Niou", "Niou", "匂宮（におうのみや）", -390, 700, "#186328", "Niou"), 
			new Character("The Sixth Princess", "The Sixth Princess", "六の君（ろくのきみ）", -90, 760, "#b85876", "Roku no Kimi"), 
			new Character("Nakatsukasa", "Nakatsukasa", "中務 （なかつかさ）", 190, 680, "#9c79ed", "Nakatsukasa"), 
			new Character("Omyōbu", "Omyōbu", "王命婦（おうみょうぶ）", 277, 615, "#997112", "Omyobu"), 
			new Character("Yoshikiyo", "Yoshikiyo", "源良清（みなもとのよしきよ）", -844, -5, "#994a12", "Yoshikiyo"), 
			new Character("Shōnagon", "Shōnagon", "少納言（しょうなごん）", 77, 760, "#6ddeba", "Shonagon"), 
			new Character("Gen no Naishi", "Gen no Naishi", "源典侍（げんのないしのすけ）", -725, 430, "#8d9181", "Naishi"), 
			new Character("Bishop of Yokawa", "Bishop of Yokawa", "横川の僧都（よかわのそうづ）", -475, 933, "#dbb98a", "Bishop of Yokawa"), 
			new Character("Chūjō no Kimi 1", "Chūjō no Kimi I", "中将の君（ちゅうじょうのきみ）", -533, 650, "#36188f", "Ukifune's Mother"),  
			new Character("The Fourth Princess 2", "The Fourth Princess II", "女四の宮（おんなしのみや）", -1140, 350, "#a186c4", null), 
			new Character("Ben no Kimi", "Ben no Kimi", "弁の君（べんのきみ）", -960, 860, "#8f6e0a", "Ben no Kimi"), 
			new Character("Kurōdo no Shōshō 2", "Kurōdo no Shōshō II", "蔵人の少将（くろうどのしょうしょう）", 256, 760, "#5b6660", "Kurodo no Shosho"), 
			new Character("Himegimi", "Himegimi", "大姫君（おおひめぎみ）", 430, 760, "#b34f8c", "Oigimi (Tamakazura's elder daughter)"), 
			new Character("Chūnagon 1", "Chūnagon I", "中納言の君（ちゅうなごんのきみ）", -1325, 325, "#6b754d", null), 
			new Character("Jijū", "Jijū", "侍従（じじゅう）", -1330, 260, "#715dc2", "Jijū"), 
			new Character("The Bishop of Kitayama", "The Bishop of Kitayama", "北山の僧都（きたやまのそうず）", 800, -125, "#4f30c9", "The Bishop"), 
			new Character("Azechi no Kimi", "Azechi no Kimi", "按察使の君（あぜちのきみ)", 220, 830, "#768bad", "Azechi no Kimi"), 
			new Character("Azechi no Dainagon 2", "Azechi no Dainagon II", "按察使の大納言（あぜちのだいなごん）", 430, -210, "#644e6e", null), 
			new Character("Azechi no Dainagon 3", "Azechi no Dainagon III", "按察使の大納言（あぜちのだいなごん）", 785, 95, "#498258", null), 
			new Character("The Holy Man of Kitayama", "The Holy Man of Kitayama", "北山の聖（きたやまのひじり）", 968, -100, "#dedda2", "The Healer"), 
			new Character("Naishi no Kimi", "Naishi no Kimi", "尚侍の君（ないしのきみ）", 595, 760, "#d17d77", "Naka no Kimi (Tamakazura's younger daughter)"), 
			new Character("Taifu no Kimi 1", "Taifu no Kimi I", "大輔の君（たいふのきみ）", 595, 880, "#94c98d", null),  
			new Character("Taifu no Kimi 2", "Taifu no Kimi II", "大輔の君（たいふのきみ）", 985, 330, "#63511d", null),  
			new Character("Taifu no Kimi 3", "Taifu no Kimi III", "大輔の君（たいふのきみ）", -685, 980, "#a157e6", "Taifu no Kimi"), 
			new Character("The Fujitsubo Consort 2", "The Fujitsubo Consort II", "藤壺の女御（ふじつぼのにょうご）", -584, 430, "#c7e657", null), 
			new Character("Late Minister of the Left", "Late Minister of the Left", "故左大臣（こさだいじん）", -1030, 670, "#a16d90", null), 
			new Character("The Fujitsubo Consort 3", "The Fujitsubo Consort III", "藤壺の女御（ふじつぼのにょうご）", -1030, 770, "#65a4fc", null), 
			new Character("The Fujitsubo Princess", "The Fujitsubo Princess", "女二の宮【藤壺の宮】（おんなにのみや）", -850, 940, "#f2aacb", "The Fujitsubo Princess"), 
			new Character("The Nun at Ono", "The Nun at Ono", "小野の妹尼（おののいもうとあま）", -209, 928, "#b7aaf2", "Amagimi"), 
			new Character("Emon no Kami", "Emon no Kami", "衛門の督（えもんのかみ）", -65, 960, "#687d55", null),  
			new Character("Deceased Daughter of Nun at Ono", "Deceased Daughter of Nun at Ono", "妹尼の亡き娘（いもうとあまのなきむすめ）", -230, 1080, "#58c784", "Deceased daughter of Amagimi"), 
			new Character("Sakon no Shōshō", "Sakon no Shōshō", "左近の少将（さこんのしょうしょう）", -430, 1030, "#573e0e", "The Captain"), 
			new Character("The First Princess 1", "The First Princess I", "女一の宮【桐壺帝の第一皇女】（おんないちのみや）", -588, 168, "#65b577", null), 
			new Character("The First Princess 2", "The First Princess II", "女一の宮【朱雀帝の第一皇女】（おんないちのみや）", -1240, 410, "#526ccc", null), 
			new Character("The First Princess 3", "The First Princess III", "女一の宮【冷泉帝の第一皇女】（おんないちのみや）", 50, 830, "#cc8f52", null), 
			new Character("The First Princess 4", "The First Princess IV", "女一の宮【今上帝の第一皇女】（おんないちのみや）", -805, 1078, "#52ccc0", "The First Princess"),  
			new Character("The Second Princess 2", "The Second Princess II", "女二の宮【今上帝の第二皇女】（おんなにのみや）", -101, 835, "#6052cc", null), 
			new Character("Nurse 1", "Nurse I", "明石の姫君の乳母（あかしのひめぎみのうば）", -215, 390, "#2f6c7a", "Akashi Princess's Nurse"), 
			new Character("Chūjō no Kimi 2", "Chūjō no Kimi II", "中将の君（ちゅうじょうのきみ）", -5, 615, "#5abf88", "Chujo"), 
			new Character("Chūjō no Omoto 1", "Chūjō no Omoto I", "中将の御許（おもと）", 635, 505, "#5dbec2", "Chujo no moto"), 
			new Character("Daini", "Daini", "大弐の典侍（だいにのてんじ）", 585, 685, "#383c96", "Daini"),  
			new Character("Older Daughter of Tamakazura's Nurse", "Older Daughter of Tamakazura's Nurse", "玉鬘の乳母の長女（たまかずらのうばのちょうじょ）", 235, 1072, "#673bb3", "Older daughter of Tamakazura's nurse"),  
			new Character("Ateki", "Ateki", "玉鬘の乳母の末娘（たまかずらのうばのすえむすめ）", 393, 922, "#e6bf7c", "Hyōbu"),  
			new Character("Taifu no Kimi 4", "Taifu no Kimi IV", "大輔の君（たいふのきみ）", 140, 930, "#66ed91", "Taifu"), 
			new Character("Saishō no Chūjō", "Saishō no Chūjō", "宰相の中将（さいしょうのちゅうじょう）", -275, 870, "#9fd67e", "Saishō no Chūjō"),  
			new Character("Uemon no Kami", "Uemon no Kami", "右衛の門督（うえもんのかみ）", -15, 890, "#9fd67e", "Emon no Kami"),  
			new Character("Taifu no Myōbu", "Taifu no Myōbu", "大輔の命婦（たいふのみょうぶ）", -1500, 260, "#72e872", "Taifu no Myōbu"), 
			new Character("Chūnagon 2", "Chūnagon II", "弘徽殿の女御の女房（こきでんのにょうごのにょうぼう）", 755, 760, "#e69360", "Chūnagon"),
			new Character("Tamakazura's Wet Nurse", "Tamakazura's Wet Nurse", "玉鬘の乳母（たまかずらのうば）", 0, 1070, "#e3a252", "Tamakazura's nurse"),
			new Character("Lady Ichijou", "Lady Ichijou", "一条御息所（いちじょうのみやすんどころ）", -655, 300, "#7fc792", "The Second Princess's Mother"),
			new Character("Previous Wife of Iyonosuke", "Previous Wife of Iyo no Suke", "伊予の介の前妻（いよのすけのぜんさい）", -1240, 470, "#81d6be", "Previous wife of Iyo no Suke"),
			new Character("The Priest", "The Priest", "導師（どうし）", -1200, 830, "#aae08d", "Priest"),
			new Character("Younger Sister Nun", "Younger Sister Nun", "妹尼君（いもうとあまぎみ）", -275, 1015, "#aae08d", "Imoto"),
			new Character("Koshosho no Kimi", "Koshosho no Kimi", "小少将の君（こしょうしょうのきみ）", 580, 1060, "#de6e3e", "Koshosho"), 
			new Character("Major Controller of the Left", "Major Controller of the Left", "左大弁（さだいべん）", 803, 295, "#70c410", "Major Controller of the Left"),
			new Character("Moku", "Moku", "木工の君（もっこうのきみ）", 440, 850, "#b2e882", "Moku"),
			new Character("Commander of the Left Palace", "Commander of the Left Palace", "左兵衛督（さひょうえのかみ）", 190, 163, "#42109e", "Commander of the Left Palace"),
			new Character("Azechi no Kita no Kata", "Azechi no Kita no Kata", "按察使大納言の北の方（あぜちだいなごんのきたのかた）", -255, -55, "#42f5e3", "Genji's Grandmother"),
			new Character("The Warden of the Left Mounted Guard", "The Warden of the Left Mounted Guard", "左馬頭（さまのかみ）", -1000, -96, "#c0ff99", "The Warden of the Left Mounted Guard"), 
			new Character("The Warden's Wife", "The Warden's Wife", "左馬頭の亡き妻（さまのかみのなきつま）", -1189, -96, "#457bd1", "The Warden's Wife"), 
			new Character("The Warden's Other Woman", "The Warden's Other Woman", "左馬頭の愛人（さまのかみのあいじん）", -1004, 10, "#91add9", "The Warden's Other Woman"), 
			new Character("A Certain High-Ranking Courtier", "A Certain High-Ranking Courtier", "ある殿上役人（あるてんじょうやくにん）", -1334, 40, "#d9b991", "A Certain High-Ranking Courtier"), 
			new Character("Younger Sister Nun", "Younger Sister Nun", "妹尼君（いもうとあまぎみ）", -275, 1015, "#aae08d", "Imoto"),
			new Character("Nareki", "Nareki", "左方の童女（さほうのどうじょ）", 400, 1010, "#507d67", "Nareki"),
			new Character("The Junior Secretary from the Ministry of Rites", "The Junior Secretary from the Ministry of Rites", "藤式部の丞（とうのしきぶのじょう）", 962, 416, "#4b989c", "The Junior Secretary from the Ministry of Rites"),
			new Character("A Clever Young Woman", "A Clever Young Woman", "賢女（けんじょ）", 1120, 420, "#7acf5b", "A Clever Young Woman"), 
			new Character("Heinaishi", "Heinaishi", "左方の平典侍（へいてんじ）", -656, 562, "#53eaf5", "Heinaishi"),
			new Character("Chūjō no Kimi 3", "Chūjō no Kimi III", "中将の君（ちゅうじょうのきみ）", -808, -160, "#5abf88", "Rokujō's Lady-in-Waiting"),
			new Character("Saishou no Kimi 1", "Saishou no Kimi I", "夕霧の宰相の乳母（ゆうぎりのさいしょうのうば）", -56, 550, "#6ce09a", "Saisho (old nurse of Genji's son)"),
			new Character("Taifu no Gen", "Taifu no Gen", "大夫監（たゆうのげん）", 755, 930, "#496b34", "Taifu no Gen"),
			new Character("Kurōdo no Shōshō 1", "Kurōdo no Shōshō I", "蔵人の少将（くろうどのしょうしょう）", 340, 415, "#c25bd9", "Tō no Chūjō's son"), 
			new Character("Yugei no Myōbu", "Yugei no Myōbu", "靫負の命婦（ゆげいのみょうぶ）", 815, 500, "#9d5adb", "Yugei no Myōbu"), 
			new Character("A Secret Love", "A Secret Love", "下仕えの女（しもづかえのおんな）", -1450, 410,  "#9d5adb", "A Secret Love"), 
			new Character("The God of Sumiyoshi", "The God of Sumiyoshi", "住吉の神（すみのえのかみ）", 310, -256,  "#fc6b03", "The God of Sumiyoshi"), 
			new Character("A Woman at Nakagawa", "A Woman at Nakagawa", "中川の女（なかがわのおんな）", -960, 995, "#57cf4c", "A Woman at Nakagawa"), 
			new Character("Ben no Omoto", "Ben no Omoto", "弁の御許（べんのおもと）", -472, 1170, "#96a143", "Ben no Omoto"), 
			new Character("Chūjō no Omoto 2", "Chūjō no Omoto II", "中将の御許（おもと）", -638, 1170, "#69cf94", "Chujo no Omoto"),
			new Character("Kosaisho", "Kosaisho", "小宰相の君（こざいしょうのきみ）", -805, 1170, "#628c4c", "Kosaisho"),
			new Character("Master of the Akashi Empress's Household", "Master of the Akashi Empress's Household", "中宮の大夫（ちゅうぐのだいぶ）", -420, 1240, "#355c27", "Master of the Akashi Empress's Household"),
			new Character("Azeri", "Azeri", "阿闍梨（あじゃり）", -970, 1170, "#6973f5", "Azeri"),
			new Character("Lady in Waiting 1", "Lady in Waiting I", "女房（にょうぼう）", -1025, 940, "#2f8a76", "Another Lady in Waiting"),
			new Character("Saishou no Kimi 2", "Saishou no Kimi II", "宰相の君（さいしょうのきみ）", -111, 1167, "#ad6cc4", "Saisho no Kimi"),
			new Character("Lady in Waiting 2", "Lady in Waiting II", "女房（にょうぼう）", 375, 1175, "#6cc489", "Lady-in-waiting"),
			new Character("Tō no Jijū", "Tō no Jijū", "藤侍従（とうのじじゅう）", 755, 840, "#3fcc9f", "Tō no Jijū"),
			new Character("Page Girl", "Page Girl", "女房（にょうぼう）", 665, 1155, "#eb3fe5", "Page Girl"),
		]

	//relationships
	var relationships = useRef([])

	//Nodes: Marriages and Love affairs
	var linkages = [new Linkage("Kiritsubo Consort","Kiritsubo Emperor",-83,111,"💍"), 
		new Linkage("Kiritsubo Emperor","Fujitsubo",-25,111,"💍"), 
		new Linkage("Genji","Murasaki no Ue",-130,270,"💍"), 
		new Linkage("Genji","Fujitsubo",0,175,"❤️"), 
		new Linkage("Novitiate","Akashi Nun",-390,110,"💍"),
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
		new Linkage("Genji","Kogimi",-538,386,"❤️"), 
		new Linkage("Genji","Utsusemi",-750,485,"❤️"), 
		new Linkage("Iyo no Suke","Utsusemi",-940,520,"💍"), 
		new Linkage("Emperor Reizei","Kokiden Consort 2",187,433,"💍"), 
		new Linkage("Genji","Asagao",-700,115,"💔"), 
		new Linkage("Genji","Gosechi Lady",-840,297,"❤️"), 
		new Linkage("Higekuro","Higekuro's Wife",590,540,"💍"), 
		new Linkage("Prince Hotaru","Tamakazura",788,595,"💔"), 
		new Linkage("Prince Hotaru","Makibashira",800,675,"💍"), 
		new Linkage("Kobai","Makibashira",775,525,"💍"), 
		new Linkage("The Second Princess 1","Kashiwagi",177,635,"💍"), 
		new Linkage("The Second Princess 1","Yūgiri",-50,635,"💍"), 
		new Linkage("Kumoi no Kari","Yūgiri",0,490,"💍"), 
		new Linkage("Emperor Kinjo","Akashi Princess",-280,460,"💍"), 
		new Linkage("The Eighth Prince","Eighth Prince's Wife",-720,750,"💍"), 
		new Linkage("Niou","Ukifune",-420,800,"💔"), 
		new Linkage("Kaoru","Ukifune",-305,832,"💔"), 
		new Linkage("Niou","Kozeri",-550,930,"💍"), 
		new Linkage("Yūgiri","Koremitsu's daughter",-110,620,"💍"), 
		new Linkage("Niou","The Sixth Princess",-255,753,"💍"), 
		new Linkage("Higekuro","Tamakazura",460,645,"💍"), 
		new Linkage("The Akashi Lady","Yoshikiyo",-745,70,"💔"), 
		new Linkage("Genji","Gen no Naishi",-695,545,"❤️"), 
		new Linkage("The Eighth Prince","Chūjō no Kimi 1",-573,696,"💍"), 
		new Linkage("Genji","Nokiba no Ogi",-717,635,"❤️"), 
		new Linkage("Emperor Reizei","Himegimi",366,718,"💍"), 
		new Linkage("Kurōdo no Shōshō 2","Himegimi",390,885,"💔"), 
		new Linkage("Kitayama no Amagimi","Azechi no Dainagon 2",470,25,"💍"), 
		new Linkage("Kumoinokari's Mother","Azechi no Dainagon 3",800,250,"💍"), 
		new Linkage("Emperor Suzaku","The Fujitsubo Consort 2",-600,510,"💍"), 
		new Linkage("Emperor Kinjo","The Fujitsubo Consort 3",-857,730,"💍"), 
		new Linkage("Emon no Kami","The Nun at Ono",-75,1068,"💍"),
		new Linkage("Sakon no Shōshō","Ukifune",-510,1100,"💔"), 
		new Linkage("Sakon no Shōshō","Deceased Daughter of Nun at Ono",-320,1160,"💍"), 
		new Linkage("Kaoru","The Second Princess 2",-130,890,"💍"), 
		new Linkage("Emperor Suzaku","Lady Ichijou",-590,385,"💍"), 
		new Linkage("Iyo no Suke","Previous Wife of Iyonosuke",-1097, 528,"💍"), 
		new Linkage("Azechi no Dainagon 1","Azechi no Kita no Kata",-222, 40,"💍"), 
		new Linkage("The Warden of the Left Mounted Guard","The Warden's Wife",-1055, 10,"💍"), 
		new Linkage("The Warden of the Left Mounted Guard","The Warden's Other Woman",-1080, 90,"❤️"), 
		new Linkage("The Junior Secretary from the Ministry of Rites","A Clever Young Woman", 1062, 543,"💍"), 
		new Linkage("Taifu no Gen","Tamakazura",670, 980,"💔"), 
		new Linkage("Genji","A Secret Love",-1312, 518,"❤️"), 
		new Linkage("Kaoru","Kosaisho",-630, 1295,"❤️"), 
		new Linkage("Niou","Kosaisho",-600,1100,"❤️"), 
	]

	//Important note: parent order has to be the consistent throughout this list (order of parent1 and parent2)
	var children = [new Child("Kiritsubo Consort","Kiritsubo Emperor","Genji"),
		new Child("Genji","Fujitsubo","Emperor Reizei"),
		new Child("Novitiate","Akashi Nun","The Akashi Lady"),
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
		new Child("Yūgiri","Koremitsu's daughter","The Sixth Princess"),
		new Child("The Eighth Prince","Chūjō no Kimi 1","Ukifune"),
		new Child("Kumoi no Kari","Yūgiri","Kurōdo no Shōshō 2"),
		new Child("Higekuro","Tamakazura","Himegimi"),
		new Child("Kitayama no Amagimi","Azechi no Dainagon 2","Murasaki's Mother"),
		new Child("Higekuro","Tamakazura","Naishi no Kimi"),
		new Child("Emperor Suzaku","The Fujitsubo Consort 2","The Third Princess"),
		new Child("Emperor Kinjo","The Fujitsubo Consort 3","The Fujitsubo Princess"),
		new Child("Emon no Kami","The Nun at Ono","Deceased Daughter of Nun at Ono"),
		new Child("Kiritsubo Emperor","Kokiden Consort 1","The First Princess 1"),
		new Child("Emperor Reizei","Kokiden Consort 2","The First Princess 3"),
		new Child("Emperor Kinjo","Akashi Princess","The First Princess 4"), 
		new Child("Kumoi no Kari","Yūgiri","Saishō no Chūjō"), 
		new Child("Kumoi no Kari","Yūgiri","Uemon no Kami"), 
		new Child("Emperor Suzaku","Lady Ichijou","The Second Princess 1"),  
		new Child("Iyo no Suke","Previous Wife of Iyonosuke","Nokiba no Ogi"),
		new Child("Iyo no Suke","Previous Wife of Iyonosuke","Ki no Kami"),
		new Child("Azechi no Dainagon 1","Azechi no Kita no Kata","Kiritsubo Consort"),
		new Child("To no Chujo","The Fourth Princess 1","Kurōdo no Shōshō 1"), 
		new Child("Higekuro","Tamakazura","Tō no Jijū"),
	]
	var labeled_relationships = [new Labeled("Kiritsubo Emperor","son","Previous Emperor"),
		new Labeled("Princess Omiya","daughter","Previous Emperor"),
		new Labeled("Princess Omiya","full-sister","Kiritsubo Emperor"),
		new Labeled("Momozono Shikubu no Miya","half-brother","Kiritsubo Emperor"),
		new Labeled("Zenbō","half-brother","Kiritsubo Emperor"),
		new Labeled("Prince Hotaru","son","Kiritsubo Emperor"),
		new Labeled("Yoshikiyo","retainer","Genji"),
		new Labeled("Aoi","💀","Lady Rokujō"),
		new Labeled("Prince Hyōbu","full-brother","Fujitsubo"),
		new Labeled("Akashi Princess","adopted daughter","Genji + Murasaki no Ue"),
		new Labeled("Tamakazura","adopted daughter","Genji"),
		new Labeled("The Eighth Prince","son","Kiritsubo Emperor"),
		new Labeled("Emperor Reizei","ostensible child","Kiritsubo Emperor"),
		new Labeled("Novitiate","son","A Minister"),
		new Labeled("Azechi no Dainagon 1","brother","A Minister"),
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
		new Labeled("Ki no Kami","older brother","Nokiba no Ogi"),
		new Labeled("Akikonomu","adopted daughter","Genji"),
		new Labeled("Asagao","daughter","Momozono Shikubu no Miya"),
		new Labeled("Genji's Horse","pet","Genji"),
		new Labeled("Cat","pet","The Third Princess"),
		new Labeled("Prince Hotaru","half-brother","Genji"),
		new Labeled("Ōmi Lady","lost daughter","To no Chujo"),
		new Labeled("Koremitsu's daughter","daughter","Koremitsu"),
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
		new Labeled("Chūnagon 1","servant","Oborozukiyo"),
		new Labeled("Jijū","servant","Suetsumuhana"),
		new Labeled("The Bishop of Kitayama","older brother","Kitayama no Amagimi"),
		new Labeled("Azechi no Kimi","servant","The Third Princess"),
		new Labeled("Genji","visitor","The Holy Man of Kitayama"),
		new Labeled("Taifu no Kimi 1","servant","Naishi no Kimi"),
		new Labeled("Taifu no Kimi 2","servant","Ōmi Lady"), 
		new Labeled("Taifu no Kimi 3","servant","Kozeri"),
		new Labeled("The Fujitsubo Consort 3","daughter","Late Minister of the Left"),
		new Labeled("The Nun at Ono","younger sister","Bishop of Yokawa"),
		new Labeled("Ukifune","adopted daughter","The Nun at Ono"),
		new Labeled("The First Princess 2","daughter","Emperor Suzaku"),
		new Labeled("The Second Princess 2","daughter","Emperor Kinjo"),
		new Labeled("Nurse 1","servant","Akashi Princess"),
		new Labeled("Chūjō no Kimi 2","servant","Genji"), 
		new Labeled("Chūjō no Omoto 1","servant","Higekuro's Wife"),
		new Labeled("Daini","servant","Emperor Reizei"),
		new Labeled("Older Daughter of Tamakazura's Nurse","daughter","Tamakazura's Wet Nurse"),
		new Labeled("Ateki","daughter","Tamakazura's Wet Nurse"), 
		new Labeled("Taifu no Kimi 4","servant","Kumoi no Kari"), 
		new Labeled("Taifu no Myōbu","servant","Suetsumuhana"), 
		new Labeled("Chūnagon 2","servant","Kokiden Consort 2"), 
		new Labeled("Tamakazura's Wet Nurse","servant","Tamakazura"), 
		new Labeled("Ateki","servant","Tamakazura"), 
		new Labeled("The Priest","spiritual officiant","Genji"),  
		new Labeled("Younger Sister Nun","caretaker","Ukifune"),  
		new Labeled("Koshosho no Kimi","servant","The Second Princess 1"),  
		new Labeled("Major Controller of the Left","servant","Kiritsubo Emperor"), 
		new Labeled("Moku","servant","Higekuro"), 
		new Labeled("Commander of the Left Palace","son","Prince Hyōbu"), 
		new Labeled("Murasaki no Ue","half-sister","Commander of the Left Palace"), 
		new Labeled("Momozono Shikubu no Miya","son","Previous Emperor"), 
		new Labeled("The Warden of the Left Mounted Guard","friend","Genji"), 
		new Labeled("A Certain High-Ranking Courtier","fellow passenger","The Warden of the Left Mounted Guard"),
		new Labeled("Nareki","servant","Himegimi"), 
		new Labeled("The Junior Secretary from the Ministry of Rites","friend","To no Chujo"), 
		new Labeled("Heinaishi","servant","Akikonomu"), 
		new Labeled("Chūjō no Kimi 3","servant","Lady Rokujō"), 
		new Labeled("Saishou no Kimi 1","servant","Yūgiri"),
		new Labeled("Yugei no Myōbu","servant","Kiritsubo Emperor"),
		new Labeled("Genji","believer","The God of Sumiyoshi"),
		new Labeled("Koremitsu","acquaintance","A Woman at Nakagawa"),
		new Labeled("Kaoru","acquaintance","Ben no Omoto"),
		new Labeled("Kaoru","acquaintance","Chūjō no Omoto 2"),
		new Labeled("Kosaisho","servant","The First Princess 4"),
		new Labeled("Master of the Akashi Empress's Household","servant","Akashi Princess"),
		new Labeled("Azeri","acquaintance","Kozeri"),
		new Labeled("Lady in Waiting 1","servant","Kozeri"),
		new Labeled("Saishou no Kimi 2","servant","Tamakazura"),
		new Labeled("Kaoru","acquaintance","Saishou no Kimi 2"),
		new Labeled("Kurōdo no Shōshō 2","acquaintance","Lady in Waiting 2"),
		new Labeled("Page Girl","servant","Himegimi"),
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
			<button id="disableMenuButton" style={{borderRadius: "50%", margin: '4px', marginRight: '8px',visibility: 'hidden'}} title="disable menu" onClick={() => {document.getElementById('myMenu').style.display = 'none'; document.getElementById('disableMenuButton').style.visibility = 'hidden'; document.getElementById('mySearch').value = ""}}>✖</button>
			<input type="text" id="mySearch" onClick={(e) => {if (e.target.value == "") {myFunction("")}}} onKeyUp={(e) => myFunction(e.target.value)} title="Type in a category" onSelectCapture={() => {document.getElementById('myMenu').style.display = 'block';  document.getElementById('disableMenuButton').style.visibility = 'visible'}} style={{width: "175px", fontSize: "13px", padding: "11px", border: "1px solid #ddd", marginBottom: '10px'}}/>
			<button onMouseDown={() => shrink_start()} onMouseUp={() => shrink_end()} style={{fontSize:"20px", marginLeft: '8px', marginRight:'4px', borderRadius: '10px'}} title={"Shrink"}>❇️</button> 
			<button onMouseDown={() => expand_start()} onMouseUp={() => expand_end()} style={{fontSize:"20px", marginLeft: '4px', marginRight:'4px', borderRadius: '10px'}} title={"Expand"}>✳️</button>
			<div style={{position: 'relative', height:0, width: 0, left:'50%',transform:'translate(-50)', marginLeft:'-175px'}}>
				<div style={{position: 'absolute', height:'0px', width: '420px', zIndex: 1,}}>
					<ul id="myMenu" style={{listStyle: "none inside", margin: 0,width: 'fit-content',  height: 'fit-cotent', maxHeight: '225px', overflowY: 'scroll', display: 'none', scrollbarWidth: 'none', background: 'white', marginLeft: 0, paddingLeft:0}} >
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
											<button id={"display_all_rels_"+i.toString()} style={{borderRadius: "95%", margin: '4px',fontSize:"20px", background: '#bdbdbd'}} title={"Display all relationships for " + c_info.english_name} onClick={() => {allRel(i)}}>📌</button>
											<a id={"info_"+i.toString()} style={{border: "2px solid black",fontSize:"18px", background: '#bdbdbd', padding: '2px', textDecoration: "none", }} rel="noopener noreferrer" target="_blank" href={"/characters/"+c_info.db_name} title={"Redirect to info page about: " + c_info.db_name}>{info_emoji}</a> 
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

