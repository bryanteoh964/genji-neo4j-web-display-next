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

/**
 * @param {Array} l the array of edges
 */
export default function GeneologyMap() {
    //characters
		var characters = useRef([
			{ id: 'Previous Emperor', position: { x: 0, y: -350 }, data: { label: 'Previous Emperor' }, draggable: true, style: {border: '2px solid #2c3e78'}, hidden: true},
			{ id: 'Kiritsubo Emperor', position: { x: -100, y: -25 }, data: { label: 'Kiritsubo Emperor' }, draggable: true, style: {border: '2px solid #782c4b'}, hidden: true},
			{ id: 'Kiritsubo Consort', position: { x: -300, y: 90 }, data: { label: 'Kiritsubo Consort' }, draggable: true, style: {border: '2px solid #1e5e3b'}, hidden: true},
			{ id: 'Azechi', position: { x: -300, y: 0 }, data: { label: 'Azechi' }, draggable: true, style: {border: '2px solid #7d6227'}, hidden: true},
			{ id: 'Princess Omiya', position: { x: 175, y: -125 }, data: { label: 'Princess Omiya' }, draggable: true, style: {border: '2px solid #91ab80'}, hidden: true},
			{ id: 'Momozono Shikubu no Miya', position: {x: -215, y: -175 }, data: { label: 'Momozono Shikubu no Miya' }, draggable: true, style: {border: '2px solid #8f9945'}, hidden: true},
			{ id: 'Fujitsubo', position: { x: 62, y: 100 }, data: { label: 'Fujitsubo' }, draggable: true, style: {border: '2px solid #c47a2f'}, hidden: true},
			{ id: 'Genji', position: { x: -213, y: 168 }, data: { label: 'Genji' }, draggable: true, style: {border: '2px solid #e0dd22'}, hidden: true},
			{ id: 'Prince Hyōbu', position: { x: 280, y: 95 }, data: { label: 'Prince Hyōbu' }, draggable: true, style: {border: '2px solid #5f9945'}, hidden: true},
			{ id: 'Murasaki no Ue', position: { x: 62, y: 205 }, data: { label: 'Murasaki no Ue' }, draggable: true, style: {border: '2px solid #c603fc'}, hidden: true},
			{ id: 'Emperor Reizei', position: { x: -100, y: 320 }, data: { label: 'Emperor Reizei' }, draggable: true, style: {border: '2px solid #fc44ad'}, hidden: true},
			{ id: 'A Minister', position: { x: -530, y: -75 }, data: { label: 'A Minister' }, draggable: true, style: {border: '2px solid #445a69'}, hidden: true},
			{ id: 'Akashi Nun', position: { x: -460, y: 0 }, data: { label: 'Akashi Nun' }, draggable: true, style: {border: '2px solid #4e6158'}, hidden: true},
			{ id: 'Novitate', position: { x: -620, y: 0 }, data: { label: 'Novitate' }, draggable: true, style: {border: '2px solid #918d56'}, hidden: true},
			{ id: 'The Akashi Lady', position: { x: -365, y: 168 }, data: { label: 'The Akashi Lady' }, draggable: true, style: {border: '2px solid #3acc1d'}, hidden: true},
			{ id: 'Minister of the Left', position: { x: 325, y: -125 }, data: { label: 'Minister of the Left' }, draggable: true, style: {border: '2px solid #745b85'}, hidden: true},
			{ id: 'Aoi', position: { x: 230, y: 205 }, data: { label: 'Aoi' }, draggable: true, style: {border: '2px solid #00c8fa'}, hidden: true},
			{ id: 'Yūgiri', position: {x: -130, y: 425 }, data: { label: 'Yūgiri' }, draggable: true, style: {border: '2px solid #578fff'}, hidden: true},
			{ id: 'Akashi Princess', position: { x: -300, y: 290  }, data: { label: 'Akashi Princess' }, draggable: true, style: {border: '2px solid #7cdb53'}, hidden: true},
			{ id: 'Kokiden Consort', position: { x: -630, y: 85 }, data: { label: 'Kokiden Consort' }, draggable: true, style: {border: '2px solid #db537c'}, hidden: true},
			{ id: 'Emperor Suzaku', position: { x: -550, y: 168  }, data: { label: 'Emperor Suzaku' }, draggable: true, style: {border: '2px solid #d98e04'}, hidden: true},
			{ id: 'Zenbō', position: {x: -385, y: -200 }, data: { label: 'Zenbō' }, draggable: true, style: {border: '2px solid #82708c'}, hidden: true},
			{ id: 'Lady Rokujō', position: {x: -647.734, y: -241.997 }, data: { label: 'Lady Rokujō' }, draggable: true, style: {border: '2px solid #fc1717'}, hidden: true},
			{ id: 'Tō no Chūjō', position: { x: 445, y: 95 }, data: { label: 'Tō no Chūjō' }, draggable: true, style: {border: '2px solid #5300c7'}, hidden: true},
			{ id: 'Yūgao', position: { x: 230, y: 300 }, data: { label: 'Yūgao' }, draggable: true, style: {border: '2px solid #f56ee5'}, hidden: true},
			{ id: 'Tamakazura', position: { x: 345, y:  522 }, data: { label: 'Tamakazura' }, draggable: true, style: {border: '2px solid #d64f6c'}, hidden: true},
			{ id: 'The Fourth Princess', position: {x: 625, y: 205 }, data: { label: 'The Fourth Princess' }, draggable: true, style: {border: '2px solid #c2de6d'}, hidden: true},
			{ id: 'Minister of the Right', position: { x: 655, y: -285 }, data: { label: 'Minister of the Right' }, draggable: true, style: {border: '2px solid #40e3a7'}, hidden: true},
			{ id: 'Oborozukiyo', position: { x: -725, y: 168  }, data: { label: 'Oborozukiyo' }, draggable: true, style: {border: '2px solid #b5d468'}, hidden: true},
			{ id: 'Kumoi no Kari\'s Mother', position: { x: 612, y: 95 }, data: { label: 'Kumoi no Kari\'s Mother' }, draggable: true, style: {border: '2px solid #756f56'}, hidden: true},
			{ id: 'Murasaki\'s Mother', position: { x: 400, y: 205 }, data: { label: 'Murasaki\'s Mother' }, draggable: true, style: {border: '2px solid #92ba61'}, hidden: true},
			{ id: 'Kitayama no Amagimi', position: { x: 475, y: -10 }, data: { label: 'Kitayama no Amagimi' }, draggable: true, style: {border: '2px solid #c2af91'}, hidden: true},
			{ id: 'The Lady of Jokyoden Palace', position: { x: -500, y: 290 }, data: { label: 'The Lady of Jokyoden Palace' }, draggable: true, style: {border: '2px solid #1f4f28'}, hidden: true},
			{ id: 'Higekuro', position: { x: 458, y:  465 }, data: { label: 'Higekuro' }, draggable: true, style: {border: '2px solid #543a00'}, hidden: true},
			{ id: 'Higekuro\'s Wife', position: { x: 615, y: 445 }, data: { label: 'Higekuro\'s Wife' }, draggable: true, style: {border: '2px solid #00542b'}, hidden: true},
			{ id: 'Ukon', position: { x: 420, y: 300 }, data: { label: 'Ukon' }, draggable: true, style: {border: '2px solid #496b62'}, hidden: true},
			{ id: 'Kumoi no Kari', position: { x: 33, y: 425 }, data: { label: 'Kumoi no Kari' }, draggable: true, style: {border: '2px solid #4da392'}, hidden: true},
			{ id: 'Akikonomu', position: { x: -570, y: 515  }, data: { label: 'Akikonomu' }, draggable: true, style: {border: '2px solid #2e3cbf'}, hidden: true},
			{ id: 'Koremitsu', position: { x:-482, y: 595  }, data: { label: 'Koremitsu' }, draggable: true, style: {border: '2px solid #8002ad'}, hidden: true},
			{ id: 'The Third Princess', position: { x: -300, y: 610 }, data: { label: 'The Third Princess' }, draggable: true, style: {border: '2px solid #ff4f9e'}, hidden: true},
			{ id: 'Kashiwagi', position: { x: 217, y: 465 }, data: { label: 'Kashiwagi' }, draggable: true, style: {border: '2px solid #b2fc72'}, hidden: true},
			{ id: 'The Eighth Prince', position: { x: -685, y: 570 }, data: { label: 'The Eighth Prince' }, draggable: true, style: {border: '2px solid #54e8c0'}, hidden: true},
			{ id: 'Prince Hitachi', position: { x: -885, y: 75 }, data: { label: 'Prince Hitachi' }, draggable: true, style: {border: '2px solid #879c62'}, hidden: true},
			{ id: 'Suetsumuhana', position: { x: -885, y: 168 }, data: { label: 'Suetsumuhana' }, draggable: true, style: {border: '2px solid #d1884f'}, hidden: true},
			{ id: 'Reikeiden Consort', position: { x: 62, y: 0 }, data: { label: 'Reikeiden Consort' }, draggable: true, style: {border: '2px solid #95dadb'}, hidden: true},
			{ id: 'The Lady of the Falling Flowers', position: { x: 285, y: 0 }, data: { label: 'The Lady of the Falling Flowers' }, draggable: true, style: {border: '2px solid #4b65db'}, hidden: true},
			{ id: 'Kogimi', position: { x: -770, y: 315 }, data: { label: 'Kogimi' }, draggable: true, style: {border: '2px solid #5abaed'}, hidden: true},
			{ id: 'Utsusemi', position: { x: -885, y: 422 }, data: { label: 'Utsusemi' }, draggable: true, style: {border: '2px solid #b56804'}, hidden: true},
			{ id: 'Iyo no Suke', position: { x: -1075, y: 422 }, data: { label: 'Iyo no Suke' }, draggable: true, style: {border: '2px solid #005c0b'}, hidden: true},
			{ id: 'Ki no Kami', position: { x: -1109, y: 608 }, data: { label: 'Ki no Kami' }, draggable: true, style: {border: '2px solid #80231b'}, hidden: true},
			{ id: 'Nokiba no Ogi', position: { x: -865, y: 550 }, data: { label: 'Nokiba no Ogi' }, draggable: true, style: {border: '2px solid #e675de'}, hidden: true},
			{ id: 'Kokiden Consort II', position: { x: 505, y: 370 }, data: { label: 'Kokiden Consort II' }, draggable: true, style: {border: '2px solid #0ee39f'}, hidden: true},
			{ id: 'Asagao', position: { x: -708, y: -96 }, data: { label: 'Asagao' }, draggable: true, style: {border: '2px solid #c0ff99'}, hidden: true},
			{ id: 'Genji\'s Horse', position: { x: -1000, y: 350 }, data: { label: 'Genji\'s Horse' }, draggable: true, style: {border: '2px solid #b4d68b'}, hidden: true},
			{ id: 'Cat', position: { x: -10, y: 685 }, data: { label: 'Cat' }, draggable: true, style: {border: '2px solid #c98a00'}, hidden: true},
			{ id: 'Gosechi Dancer', position: { x: -1000, y: 225 }, data: { label: 'Gosechi Dancer' }, draggable: true, style: {border: '2px solid #309ae6'}, hidden: true},
			{ id: 'Prince Hotaru', position: { x: 886, y: 546 }, data: { label: 'Prince Hotaru' }, draggable: true, style: {border: '2px solid #c2e37b'}, hidden: true},
			{ id: 'Makibashira', position: { x: 587, y: 600 }, data: { label: 'Makibashira' }, draggable: true, style: {border: '2px solid #c57be3'}, hidden: true},
			{ id: 'Ōmi Lady', position: {x: 972, y: 223 }, data: { label: 'Ōmi Lady' }, draggable: true, style: {border: '2px solid #ccb285'}, hidden: true},
			{ id: 'Kobai', position: {x: 765, y: 370 }, data: { label: 'Kobai' }, draggable: true, style: {border: '2px solid #c76554'}, hidden: true},
			{ id: 'The Second Princess', position: { x: 5, y: 530 }, data: { label: 'The Second Princess' }, draggable: true, style: {border: '2px solid #8c4c7b'}, hidden: true},
			{ id: 'Emperor Kinjo', position: {x: -500, y: 430 }, data: { label: 'Emperor Kinjo' }, draggable: true, style: {border: '2px solid #0fff0f'}, hidden: true},
			{ id: 'The Maiden of the Dance', position: {x: -210, y: 520 }, data: { label: 'The Maiden of the Dance' }, draggable: true, style: {border: '2px solid #fc8114'}, hidden: true},
			{ id: 'Kaoru', position: {x: -257, y: 835 }, data: { label: 'Kaoru' }, draggable: true, style: {border: '2px solid #3273a8'}, hidden: true},
			{ id: 'Eighth Prince\'s Wife', position: { x: -850, y: 635 }, data: { label: 'Eighth Prince\'s Wife' }, draggable: true, style: {border: '2px solid #7a9c5c'}, hidden: true},
			{ id: 'Agemaki', position: { x: -850, y: 800 }, data: { label: 'Agemaki' }, draggable: true, style: {border: '2px solid #5c9c71'}, hidden: true},
			{ id: 'Kozeri', position: { x: -685, y: 835 }, data: { label: 'Kozeri' }, draggable: true, style: {border: '2px solid #ba59a2'}, hidden: true},
			{ id: 'Ukifune', position: { x: -625, y: 740 }, data: { label: 'Ukifune' }, draggable: true, style: {border: '2px solid #ff5f4a'}, hidden: true},
			{ id: 'Niou', position: { x: -390, y: 700 }, data: { label: 'Niou' }, draggable: true, style: {border: '2px solid #186328'}, hidden: true},
			{ id: 'The Sixth Princess', position: { x: -90, y: 760 }, data: { label: 'The Sixth Princess' }, draggable: true, style: {border: '2px solid #b85876'}, hidden: true},
			{ id: 'Nakatsukasa', position: { x: 190, y: 680 }, data: { label: 'Nakatsukasa' }, draggable: true, style: {border: '2px solid #9c79ed'}, hidden: true},
			{ id: 'Omyōbu', position: { x: 277, y: 615 }, data: { label: 'Omyōbu' }, draggable: true, style: {border: '2px solid #997112'}, hidden: true},
			{ id: 'Yoshikiyo', position: { x: -844, y: -5 }, data: { label: 'Yoshikiyo' }, draggable: true, style: {border: '2px solid #994a12'}, hidden: true},
			{ id: 'Shōnagon', position: { x: 77, y: 760 }, data: { label: 'Shōnagon' }, draggable: true, style: {border: '2px solid #6ddeba'}, hidden: true},
			{ id: 'Gen no Naishi', position: { x: -705, y: 445 }, data: { label: 'Gen no Naishi' }, draggable: true, style: {border: '2px solid #8d9181'}, hidden: true},
			{ id: 'Bishop of Yokawa', position: { x: -475, y: 933 }, data: { label: 'Bishop of Yokawa' }, draggable: true, style: {border: '2px solid #dbb98a'}, hidden: true},
			{ id: 'Chūjō no Kimi', position: { x: -575, y: 640 }, data: { label: 'Chūjō no Kimi' }, draggable: true, style: {border: '2px solid #36188f'}, hidden: true},
			{ id: 'Kiritsubo Consort + Kiritsubo Emperor', position: { x: -83, y: 111 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Kiritsubo Emperor + Fujitsubo', position: { x: -25, y: 111 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Murasaki no Ue', position: { x: 60, y: 325 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Fujitsubo', position: { x: 0, y: 175 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Novitate + Akashi Nun', position: { x: -390, y: 110 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + The Akashi Lady', position: { x: -282, y: 250 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Princess Omiya + Minister of the Left', position: { x: 425, y: 27 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Aoi', position: { x: 125, y: 305 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Kiritsubo Emperor + Kokiden Consort', position: { x: -360, y: 80 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Lady Rokujō', position: { x: -300, y: -69 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Yūgao', position: { x: 185, y: 313 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Tō no Chūjō + Yūgao', position: { x: 350, y: 375 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Prince Hyōbu + Murasaki\'s Mother', position: { x: 364, y: 190 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Emperor Suzaku + Oborozukiyo', position: { x: -585, y: 250 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Oborozukiyo', position: { x: -355, y: 310 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Emperor Suzaku + The Lady of Jokyoden Palace', position: { x: -480, y: 250 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Zenbō + Lady Rokujō', position: { x: -513, y: -167 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Tō no Chūjō + Kumoi no Kari\'s Mother', position: {x: 550, y: 200 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Tō no Chūjō + The Fourth Princess', position: {x: 580, y: 326 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Akikonomu + Emperor Reizei', position: {x:-265, y: 535 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'The Third Princess + Kashiwagi', position: { x: -80, y: 715 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Suetsumuhana', position: { x: -770, y: 270 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Kiritsubo Emperor + Reikeiden Consort', position: { x: 20, y: 111 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + The Lady of the Falling Flowers', position: { x: 225, y: 70 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + The Third Princess', position: { x: -180, y: 695}, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Akashi Princess + Emperor Reizei', position: {x:-190, y: 475 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Kogimi', position: { x: -665, y: 395 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Utsusemi', position: { x: -750, y: 485 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Iyo no Suke + Utsusemi', position: { x: -940, y: 520 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Emperor Reizei + Kokiden Consort II', position: { x: 187, y: 433 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Asagao', position: { x: -700, y: 115 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Gosechi Dancer', position: { x: -840, y: 297 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Higekuro + Higekuro\'s Wife', position: { x: 590, y: 540 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Prince Hotaru + Tamakazura', position: { x: 788, y: 595 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Prince Hotaru + Makibashira', position: { x: 800, y: 675 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Kobai + Makibashira', position: { x: 775, y: 525 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'The Second Princess + Kashiwagi', position: { x: 177, y: 635 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'The Second Princess + Yūgiri', position: { x: -50, y: 635 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Kumoi no Kari + Yūgiri', position: { x: -50, y: 500 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Emperor Kinjo + Akashi Princess', position: {x:-340, y: 535 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'The Eighth Prince + Eighth Prince\'s Wife', position: {x:-720, y: 750 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Niou + Ukifune', position: { x: -420, y: 800 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Kaoru + Ukifune', position: { x: -385, y: 870 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Niou + Kozeri', position: { x: -550, y: 930 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Yūgiri + The Maiden of the Dance', position: {x:-110, y: 620 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Niou + The Sixth Princess', position: { x: -255, y: 770 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Higekuro + Tamakazura', position: {x: 475, y: 645 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'The Akashi Lady + Yoshikiyo', position: { x: -745, y: 70 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'Genji + Gen no Naishi', position: { x: -695, y: 545 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
			{ id: 'The Eighth Prince + Chūjō no Kimi', position: {x: -615, y: 685 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
		])

		//relationships 
		var relationships = useRef([
			{ id: 'Previous Emperor - Kiritsubo Emperor', source: 'Previous Emperor', target: 'Kiritsubo Emperor', label: 'son', style:{ stroke: '#2c3e78', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Previous Emperor - Princess Omiya', source: 'Previous Emperor', target: 'Princess Omiya', label: 'daughter', style:{ stroke: '#2c3e78', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Emperor - Princess Omiya', source: 'Kiritsubo Emperor', target: 'Princess Omiya', label: 'full-sister', style:{ stroke: '#782c4b', strokeWidth: '2'}, hidden: true},
			{ id: 'Kiritsubo Emperor - Momozono Shikubu no Miya', source: 'Kiritsubo Emperor', target: 'Momozono Shikubu no Miya', label: 'half-brother', style:{ stroke: '#782c4b', strokeWidth: '2'}, hidden: true},
			{ id: 'Kiritsubo Emperor - Zenbō', source: 'Kiritsubo Emperor', target: 'Zenbō', label: 'half-brother', style:{ stroke: '#782c4b', strokeWidth: '2'}, hidden: true},
			{ id: 'Kiritsubo Emperor - Prince Hotaru', source: 'Kiritsubo Emperor', target: 'Prince Hotaru', label: 'son', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Emperor - 💍', source: 'Kiritsubo Emperor', target: 'Kiritsubo Consort + Kiritsubo Emperor', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Consort - 💍', source: 'Kiritsubo Consort', target: 'Kiritsubo Consort + Kiritsubo Emperor', style:{ stroke: '#1e5e3b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Consort - Azechi', source: 'Azechi', target: 'Kiritsubo Consort', label: 'daughter', style:{ stroke: '#7d6227', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Fujitsubo - 💍', source: 'Fujitsubo', target: 'Kiritsubo Emperor + Fujitsubo', style:{ stroke: '#c47a2f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Emperor - 💍', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Fujitsubo', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Genji', source: 'Kiritsubo Consort + Kiritsubo Emperor', target: 'Genji', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - Yoshikiyo', source: 'Genji', target: 'Yoshikiyo', style:{ stroke: '#e0dd22', strokeWidth: '2'}, label: 'retainer', hidden: true},
			{ id: 'Genji - Ki no Kami', source: 'Genji', target: 'Ki no Kami', style:{ stroke: '#e0dd22', strokeWidth: '2'}, label: 'retainer', hidden: true},
			{ id: 'Lady Rokujō - Aoi', source: 'Lady Rokujō', target: 'Aoi', label: '💀', style:{ stroke: '#fc1717', strokeWidth: '2'}, hidden: true},
			{ id: 'Prince Hyōbu - Fujitsubo', source: 'Fujitsubo', target: 'Prince Hyōbu', label: 'full-brother', style:{ stroke: '#c47a2f', strokeWidth: '2'}, hidden: true},
			{ id: 'Murasaki no Ue - 💍', source: 'Murasaki no Ue', target: 'Genji + Murasaki no Ue', style:{ stroke: '#c603fc', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + Murasaki no Ue', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Akashi Princess', source: 'Genji + Murasaki no Ue', target: 'Akashi Princess', style:{ stroke: '#c603fc', strokeWidth: '2'}, label: 'adopted daughter', hidden: true},
			{ id: 'Genji - Tamakazura', source: 'Genji', target: 'Tamakazura', label: 'adopted daughter', style:{ stroke: '#e0dd22', strokeWidth: '2'}, hidden: true},
			{ id: 'Fujitsubo - ❤️', source: 'Fujitsubo', target: 'Genji + Fujitsubo', style:{ stroke: '#c47a2f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Fujitsubo', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '❤️ -> Emperor Reizei', source: 'Genji + Fujitsubo', target: 'Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Kiritsubo Emperor - The Eighth Prince', source: 'Kiritsubo Emperor', target: 'The Eighth Prince', label: 'son', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Emperor - Emperor Reizei', source: 'Kiritsubo Emperor', target: 'Emperor Reizei', style:{ stroke: '#782c4b', strokeWidth: '2'}, label: 'ostensible child', type: 'straight', hidden: true},
			{ id: 'A Minister - Novitate', source: 'A Minister', target: 'Novitate', style:{ stroke: '#445a69', strokeWidth: '2'}, label: 'son',type: 'smoothstep', hidden: true},
			{ id: 'Novitate - 💍', source: 'Novitate', target: 'Novitate + Akashi Nun', style:{ stroke: '#918d56', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Akashi Nun - 💍', source: 'Akashi Nun', target: 'Novitate + Akashi Nun', style:{ stroke: '#4e6158', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> The Akashi Lady', source: 'Novitate + Akashi Nun', target: 'The Akashi Lady', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'A Minister - Azechi', source: 'A Minister', target: 'Azechi', label: 'brother', style:{ stroke: '#445a69', strokeWidth: '2'}, hidden: true},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + The Akashi Lady', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Akashi Lady - 💍', source: 'The Akashi Lady', target: 'Genji + The Akashi Lady', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Princess Omiya - 💍', source: 'Princess Omiya', target: 'Princess Omiya + Minister of the Left', style:{ stroke: '#91ab80', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Minister of the Left - 💍', source: 'Minister of the Left', target: 'Princess Omiya + Minister of the Left', style:{ stroke: '#745b85', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Aoi', source: 'Princess Omiya + Minister of the Left', target: 'Aoi', style:{ stroke: '#00c8fa', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + Aoi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Aoi - 💍', source: 'Aoi', target: 'Genji + Aoi', style:{ stroke: '#00c8fa', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Gen no Naishi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Gen no Naishi - ❤️', source: 'Gen no Naishi', target: 'Genji + Gen no Naishi', style:{ stroke: '#8d9181', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Yūgiri', source: 'Genji + Aoi', target: 'Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: '💍 -> Akashi Princess', source: 'Genji + The Akashi Lady', target: 'Akashi Princess', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Kiritsubo Emperor - 💍', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Kokiden Consort', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kokiden Consort - 💍', source: 'Kokiden Consort', target: 'Kiritsubo Emperor + Kokiden Consort', style:{ stroke: '#db537c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Emperor Suzaku', source: 'Kiritsubo Emperor + Kokiden Consort', target: 'Emperor Suzaku', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - 💔', source: 'Genji', target: 'Genji + Lady Rokujō', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Lady Rokujō - 💔', source: 'Lady Rokujō', target: 'Genji + Lady Rokujō', style:{ stroke: '#fc1717', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Tō no Chūjō', source: 'Princess Omiya + Minister of the Left', target: 'Tō no Chūjō', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Yūgao', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgao - ❤️', source: 'Yūgao', target: 'Genji + Yūgao', style:{ stroke: '#f56ee5', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgao - 💍', source: 'Yūgao', target: 'Tō no Chūjō + Yūgao', style:{ stroke: '#f56ee5', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tō no Chūjō - 💍', source: 'Tō no Chūjō', target: 'Tō no Chūjō + Yūgao', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Tamakazura', source: 'Tō no Chūjō + Yūgao', target: 'Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Minister of the Right - Kokiden Consort', source: 'Minister of the Right', target: 'Kokiden Consort', label: 'daughter', style:{ stroke: '#40e3a7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Minister of the Right - The Fourth Princess', source: 'Minister of the Right', target: 'The Fourth Princess', label: 'daughter', style:{ stroke: '#40e3a7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Minister of the Right - Oborozukiyo', source: 'Minister of the Right', target: 'Oborozukiyo', label: 'daughter', style:{ stroke: '#40e3a7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Murasaki no Ue', source: 'Prince Hyōbu + Murasaki\'s Mother', target: 'Murasaki no Ue', style:{ stroke: '#c603fc', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Prince Hyōbu - 💍', source: 'Prince Hyōbu', target: 'Prince Hyōbu + Murasaki\'s Mother', style:{ stroke: '#5f9945', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Murasaki\'s Mother - 💍', source: 'Murasaki\'s Mother', target: 'Prince Hyōbu + Murasaki\'s Mother', style:{ stroke: '#92ba61', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kitayama no Amagimi - Murasaki\'s Mother', source: 'Kitayama no Amagimi', target: 'Murasaki\'s Mother', label: 'daughter', style:{ stroke: '#c2af91', strokeWidth: '2'}, hidden: true},
			{ id: 'Oborozukiyo - 💍', source: 'Oborozukiyo', target: 'Emperor Suzaku + Oborozukiyo', style:{ stroke: '#b5d468', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Suzaku - 💍', source: 'Emperor Suzaku', target: 'Emperor Suzaku + Oborozukiyo', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Oborozukiyo - ❤️', source: 'Oborozukiyo', target: 'Genji + Oborozukiyo', style:{ stroke: '#b5d468', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Oborozukiyo', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Lady of Jokyoden Palace - 💍', source: 'The Lady of Jokyoden Palace', target: 'Emperor Suzaku + The Lady of Jokyoden Palace', style:{ stroke: '#1f4f28', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Suzaku - 💍', source: 'Emperor Suzaku', target: 'Emperor Suzaku + The Lady of Jokyoden Palace', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Lady of Jokyoden Palace - Higekuro', source: 'The Lady of Jokyoden Palace', target: 'Higekuro', style:{ stroke: '#1f4f28', strokeWidth: '2'}, label: 'full-brother', hidden: true},
			{ id: 'Prince Hyōbu - Higekuro\'s Wife', source: 'Prince Hyōbu', target: 'Higekuro\'s Wife', style:{ stroke: '#5f9945', strokeWidth: '2'}, label: 'daughter',type: 'smoothstep', hidden: true},
			{ id: 'Ukon - Yūgao', source: 'Ukon', target: 'Yūgao', style:{ stroke: '#496b62', strokeWidth: '2'}, label: 'serves', type: 'smoothstep', hidden: true},
			{ id: 'Lady Rokujō - 💍', source: 'Lady Rokujō', target: 'Zenbō + Lady Rokujō', style:{ stroke: '#fc1717', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Zenbō - 💍', source: 'Zenbō', target: 'Zenbō + Lady Rokujō', style:{ stroke: '#82708c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tō no Chūjō - 💍', source: 'Tō no Chūjō', target: 'Tō no Chūjō + The Fourth Princess', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Fourth Princess - 💍', source: 'The Fourth Princess', target: 'Tō no Chūjō + The Fourth Princess', style:{ stroke: '#c2de6d', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tō no Chūjō - 💍', source: 'Tō no Chūjō', target: 'Tō no Chūjō + Kumoi no Kari\'s Mother', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kumoi no Kari\'s Mother - 💍', source: 'Kumoi no Kari\'s Mother', target: 'Tō no Chūjō + Kumoi no Kari\'s Mother', style:{ stroke: '#756f56', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Kumoi no Kari', source: 'Tō no Chūjō + Kumoi no Kari\'s Mother', target: 'Kumoi no Kari', style:{ stroke: '#4da392', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: '💍 -> Akikonomu', source: 'Zenbō + Lady Rokujō', target: 'Akikonomu', style:{ stroke: '#2e3cbf', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Akikonomu - 💍', source: 'Akikonomu', target: 'Akikonomu + Emperor Reizei', style:{ stroke: '#2e3cbf', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Reizei - 💍', source: 'Emperor Reizei', target: 'Akikonomu + Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Koremitsu - Genji', source: 'Koremitsu', target: 'Genji', label: 'serves', style:{ stroke: '#8002ad', strokeWidth: '2'}, hidden: true},
			{ id: 'Emperor Suzaku - The Third Princess', source: 'Emperor Suzaku', target: 'The Third Princess', label: 'daughter', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Kashiwagi', source: 'Tō no Chūjō + The Fourth Princess', target: 'Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'The Third Princess - ❤️', source: 'The Third Princess', target: 'The Third Princess + Kashiwagi', style:{ stroke: '#ff4f9e', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kashiwagi - ❤️', source: 'Kashiwagi', target: 'The Third Princess + Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Suzaku - The Eighth Prince', source: 'Emperor Suzaku', target: 'The Eighth Prince', label: 'half-brother', style:{ stroke: '#d98e04', strokeWidth: '2'}, hidden: true},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + Suetsumuhana', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Suetsumuhana - 💍', source: 'Suetsumuhana', target: 'Genji + Suetsumuhana', style:{ stroke: '#d1884f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Prince Hitachi - Suetsumuhana', source: 'Prince Hitachi', target: 'Suetsumuhana', label: 'daughter', style:{ stroke: '#879c62', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Reikeiden Consort - The Lady of the Falling Flowers', source: 'Reikeiden Consort', target: 'The Lady of the Falling Flowers', label: 'younger sister', style:{ stroke: '#95dadb', strokeWidth: '2'}, hidden: true},
			{ id: 'Kiritsubo Emperor - 💍', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Reikeiden Consort', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Reikeiden Consort - 💍', source: 'Reikeiden Consort', target: 'Kiritsubo Emperor + Reikeiden Consort', style:{ stroke: '#95dadb', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Lady of the Falling Flowers - 💍', source: 'The Lady of the Falling Flowers', target: 'Genji + The Lady of the Falling Flowers', style:{ stroke: '#4b65db', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + The Lady of the Falling Flowers', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + The Third Princess', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Third Princess - 💍', source: 'The Third Princess', target: 'Genji + The Third Princess', style:{ stroke: '#ff4f9e', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Reizei - 💍', source: 'Emperor Reizei', target: 'Akashi Princess + Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Akashi Princess - 💍', source: 'Akashi Princess', target: 'Akashi Princess + Emperor Reizei', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Kogimi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kogimi - ❤️', source: 'Kogimi', target: 'Genji + Kogimi', style:{ stroke: '#5abaed', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Utsusemi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Utsusemi - ❤️', source: 'Utsusemi', target: 'Genji + Utsusemi', style:{ stroke: '#b56804', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kogimi - Utsusemi', source: 'Kogimi', target: 'Utsusemi', label: 'older sister', style:{ stroke: '#5abaed', strokeWidth: '2'}, hidden: true},
			{ id: 'Iyo no Suke - 💍', source: 'Iyo no Suke', target: 'Iyo no Suke + Utsusemi', style:{ stroke: '#005c0b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Utsusemi - 💍', source: 'Utsusemi', target: 'Iyo no Suke + Utsusemi', style:{ stroke: '#b56804', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Iyo no Suke - Ki no Kami', source: 'Iyo no Suke', target: 'Ki no Kami', label: 'son', style:{ stroke: '#005c0b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Iyo no Suke - Nokiba no Ogi', source: 'Iyo no Suke', target: 'Nokiba no Ogi', label: 'daughter', style:{ stroke: '#005c0b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Nokiba no Ogi - Ki no Kami', source: 'Nokiba no Ogi', target: 'Ki no Kami', label: 'older brother', style:{ stroke: '#e675de', strokeWidth: '2'}, hidden: true},
			{ id: 'Emperor Reizei - 💍', source: 'Emperor Reizei', target: 'Emperor Reizei + Kokiden Consort II', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kokiden Consort II - 💍', source: 'Kokiden Consort II', target: 'Emperor Reizei + Kokiden Consort II', style:{ stroke: '#0ee39f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Kokiden Consort II', source: 'Tō no Chūjō + The Fourth Princess', target: 'Kokiden Consort II', style:{ stroke: '#0ee39f', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - Akikonomu', source: 'Genji', target: 'Akikonomu', label: 'adopted daughter', style:{ stroke: '#e0dd22', strokeWidth: '2'}, hidden: true},
			{ id: 'Momozono Shikubu no Miya - Asagao', source: 'Momozono Shikubu no Miya', target: 'Asagao', label: 'daughter', style:{ stroke: '#8f9945', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - 💔', source: 'Genji', target: 'Genji + Asagao', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Asagao - 💔', source: 'Asagao', target: 'Genji + Asagao', style:{ stroke: '#c0ff99', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - Genji\'s Horse', source: 'Genji', target: 'Genji\'s Horse', label: 'pet', style:{ stroke: '#e0dd22', strokeWidth: '2'}, hidden: true},
			{ id: 'The Third Princess - Cat', source: 'The Third Princess', target: 'Cat', label: 'pet', style:{ stroke: '#ff4f9e', strokeWidth: '2'}, hidden: true},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Gosechi Dancer', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Gosechi Dancer - ❤️', source: 'Gosechi Dancer', target: 'Genji + Gosechi Dancer', style:{ stroke: '#309ae6', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - Prince Hotaru', source: 'Genji', target: 'Prince Hotaru', label: 'half-brother', style:{ stroke: '#e0dd22', strokeWidth: '2'}, hidden: true},
			{ id: 'Higekuro - 💍', source: 'Higekuro', target: 'Higekuro + Higekuro\'s Wife', style:{ stroke: '#543a00', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Higekuro\'s Wife - 💍', source: 'Higekuro\'s Wife', target: 'Higekuro + Higekuro\'s Wife', style:{ stroke: '#00542b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Makibashira', source: 'Higekuro + Higekuro\'s Wife', target: 'Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Tamakazura - 💔', source: 'Tamakazura', target: 'Prince Hotaru + Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Prince Hotaru - 💔', source: 'Prince Hotaru', target: 'Prince Hotaru + Tamakazura', style:{ stroke: '#c2e37b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Prince Hotaru - 💍', source: 'Prince Hotaru', target: 'Prince Hotaru + Makibashira', style:{ stroke: '#c2e37b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Makibashira - 💍', source: 'Makibashira', target: 'Prince Hotaru + Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tō no Chūjō - Ōmi Lady', source: 'Tō no Chūjō', target: 'Ōmi Lady', label: 'lost daughter', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Kobai', source: 'Tō no Chūjō + The Fourth Princess', target: 'Kobai', style:{ stroke: '#c76554', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Makibashira - 💍', source: 'Makibashira', target: 'Kobai + Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kobai - 💍', source: 'Kobai', target: 'Kobai + Makibashira', style:{ stroke: '#c76554', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Suzaku - The Second Princess', source: 'Emperor Suzaku', target: 'The Second Princess', label: 'daughter', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Second Princess', source: 'The Second Princess', target: 'The Second Princess + Kashiwagi', style:{ stroke: '#8c4c7b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kashiwagi', source: 'Kashiwagi', target: 'The Second Princess + Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Second Princess', source: 'The Second Princess', target: 'The Second Princess + Yūgiri', style:{ stroke: '#8c4c7b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgiri', source: 'Yūgiri', target: 'The Second Princess + Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kumoi no Kari', source: 'Kumoi no Kari', target: 'Kumoi no Kari + Yūgiri', style:{ stroke: '#4da392', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgiri', source: 'Yūgiri', target: 'Kumoi no Kari + Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Emperor Kinjo', source: 'Emperor Suzaku + The Lady of Jokyoden Palace', target: 'Emperor Kinjo', style:{ stroke: '#0fff0f', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Akashi Princess - 💍', source: 'Akashi Princess', target: 'Emperor Kinjo + Akashi Princess', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Kinjo - 💍', source: 'Emperor Kinjo', target: 'Emperor Kinjo + Akashi Princess', style:{ stroke: '#0fff0f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Koremitsu - The Maiden of the Dance', source: 'Koremitsu', target: 'The Maiden of the Dance', label: 'daughter', style:{ stroke: '#8002ad', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '❤️ -> Kaoru', source: 'The Third Princess + Kashiwagi', target: 'Kaoru', style:{ stroke: '#3273a8', strokeWidth: '2'}, type: 'straight', hidden: true},
			{ id: '❤️ -> Kaoru', source: 'Genji + The Third Princess', target: 'Kaoru', style:{ stroke: '#e0dd22', strokeWidth: '2'}, label: 'ostensible child', type: 'straight', hidden: true},
			{ id: 'Eighth Prince\'s Wife - 💍', source: 'Eighth Prince\'s Wife', target: 'The Eighth Prince + Eighth Prince\'s Wife', style:{ stroke: '#7a9c5c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Eighth Prince - 💍', source: 'The Eighth Prince', target: 'The Eighth Prince + Eighth Prince\'s Wife', style:{ stroke: '#54e8c0', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Agemaki', source: 'The Eighth Prince + Eighth Prince\'s Wife', target: 'Agemaki', style:{ stroke: '#5c9c71', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: '💍 -> Kozeri', source: 'The Eighth Prince + Eighth Prince\'s Wife', target: 'Kozeri', style:{ stroke: '#ba59a2', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Kozeri - Ukifune', source: 'Kozeri', target: 'Ukifune', label: 'half-sister', style:{ stroke: '#ba59a2', strokeWidth: '2'}, hidden: true},
			{ id: '💍 -> Niou', source: 'Emperor Kinjo + Akashi Princess', target: 'Niou', style:{ stroke: '#186328', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Kaoru - 💔', source: 'Kaoru', target: 'Kaoru + Ukifune', style:{ stroke: '#3273a8', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'Ukifune - 💔', source: 'Ukifune', target: 'Kaoru + Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Niou - 💔', source: 'Niou', target: 'Niou + Ukifune', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'Ukifune - 💔', source: 'Ukifune', target: 'Niou + Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Niou - 💍', source: 'Niou', target: 'Niou + Kozeri', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'Kozeri - 💍', source: 'Kozeri', target: 'Niou + Kozeri', style:{ stroke: '#ba59a2', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgiri - 💍', source: 'Yūgiri', target: 'Yūgiri + The Maiden of the Dance', style:{ stroke: '#578fff', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'The Maiden of the Dance - 💍', source: 'The Maiden of the Dance', target: 'Yūgiri + The Maiden of the Dance', style:{ stroke: '#fc8114', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: '💍 -> The Sixth Princess', source: 'Yūgiri + The Maiden of the Dance', target: 'The Sixth Princess', style:{ stroke: '#b85876', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Niou - 💍', source: 'Niou', target: 'Niou + The Sixth Princess', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'The Sixth Princess - 💍', source: 'The Sixth Princess', target: 'Niou + The Sixth Princess', style:{ stroke: '#b85876', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'Higekuro - 💍', source: 'Higekuro', target: 'Higekuro + Tamakazura', style:{ stroke: '#543a00', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tamakazura - 💍', source: 'Tamakazura', target: 'Higekuro + Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Nakatsukasa - Murasaki no Ue', source: 'Nakatsukasa', target: 'Murasaki no Ue', style:{ stroke: '#9c79ed', strokeWidth: '2'}, label: 'serves', hidden: true},
			{ id: 'Omyōbu - Fujitsubo', source: 'Omyōbu', target: 'Fujitsubo', style:{ stroke: '#997112', strokeWidth: '2'}, label: 'serves', hidden: true},
			{ id: 'The Akashi Lady - 💔', source: 'The Akashi Lady', target: 'The Akashi Lady + Yoshikiyo', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yoshikiyo - 💔', source: 'Yoshikiyo', target: 'The Akashi Lady + Yoshikiyo', style:{ stroke: '#994a12', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Shōnagon - Murasaki no Ue', source: 'Shōnagon', target: 'Murasaki no Ue', style:{ stroke: '#6ddeba', strokeWidth: '2'}, label: 'wet nurse', hidden: true},
			{ id: 'Genji - Tō no Chūjō', source: 'Genji', target: 'Tō no Chūjō', style:{ stroke: '#e0dd22', strokeWidth: '2'}, label: '👊', hidden: true},
			{ id: 'Ukifune - Bishop of Yokawa', source: 'Ukifune', target: 'Bishop of Yokawa', style:{ stroke: '#ff5f4a', strokeWidth: '2'}, label: 'saved by', hidden: true},
			{ id: 'The Eighth Prince - 💍', source: 'The Eighth Prince', target: 'The Eighth Prince + Chūjō no Kimi', style:{ stroke: '#54e8c0', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Chūjō no Kimi - 💍', source: 'Chūjō no Kimi', target: 'The Eighth Prince + Chūjō no Kimi', style:{ stroke: '#36188f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Ukifune', source: 'The Eighth Prince + Chūjō no Kimi', target: 'Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'straight', hidden: true},
		])

	var extra_edges = [...relationships.current]
	for (const ch of extra_edges) {
		if (ch.source.includes(" + ")) {
			const people1 = ch.source.slice(0, ch.source.indexOf(" + "))
			const people2 = ch.source.slice(ch.source.indexOf(" + ")+3)
			extra_edges.push({ id: people1 + " ~ " + ch.target, source: people1, target: ch.target, style:{strokeWidth: '2'}, hidden: true, label: "parent", animated: true})
			extra_edges.push({ id: people2 + " ~ " + ch.target, source: people2, target: ch.target, style:{strokeWidth: '2'}, hidden: true, label: "parent", animated: true})
		} 
	}
	relationships.current = extra_edges

	const [nodes, setNodes] =useState([...characters.current])
    const [edges, setEdges] = useState([...relationships.current])

    const onInit = (reactFlowInstance) => {};
    const onConnect = () => null
    const minimapStyle = {
        height: 120,
    };
    const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
    const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );

	//Note: please increase character_count if new characters are added
	const character_count = 77 

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
		var new_nodes = [...nodes]
		var new_edges = [...edges]
		for (let i = 0; i < character_count; i++) {
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
		var new_nodes = [...nodes]
		var new_edges = [...edges]
		for (let i = 0; i < character_count; i++) {
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
		for (let i = 0; i < new_nodes.length; i++) {
			if (characters.current[num].id == new_nodes[i].id) {
				new_nodes[i].data = {label: val}
				break
			}
		}
		setNodes(new_nodes)
	}

    return (
        <div style={{fontSize: "large"}}>
            <br></br>
            <div>
                <button onClick={() => showAll()} style={{fontSize: "large"}}>Show All</button>
				<button onClick={() => disableAll()} style={{fontSize: "large"}}>Disable All</button>
            </div>
            <br></br>
            <div style={{overflowX: "scroll", display: "block", overflow: "auto", whiteSpace: "nowrap", scrollbarWidth: "none"}}>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch0" onChange={(e) => enableDisable(0, e.target.checked)} />
                <select onChange={(e) => changeNodeLabelName(0, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Previous Emperor" selected>Previous Emperor</option>
                  <option value="天皇">天皇（てんのう）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch1" onChange={(e) => enableDisable(1, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(1, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kiritsubo Emperor" selected>Kiritsubo Emperor</option>
                  <option value="桐壺帝">桐壺帝（きりつぼてい）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch2" onChange={(e) => enableDisable(2, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(2, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kiritsubo Consort" selected>Kiritsubo Consort</option>
                  <option value="桐壺更衣">桐壺更衣（きりつぼのこうい）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch3" onChange={(e) => enableDisable(3, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(3, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Azechi" selected>Azechi</option>
                  <option value="按察使">按察使（あぜち）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch4" onChange={(e) => enableDisable(4, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(4, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Princess Omiya" selected>Princess Omiya</option>
                  <option value="大宮">大宮（おおみや）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch5" onChange={(e) => enableDisable(5, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(5, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Momozono Shikubu no Miya" selected>Momozono Shikubu no Miya</option>
                  <option value="桃園式部卿宮">桃園式部卿宮（ももぞのしきぶきょうのみや）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch6" onChange={(e) => enableDisable(6, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(6, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Fujitsubo" selected>Fujitsubo</option>
                  <option value="藤壺">藤壺（ふじつぼ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch7" onChange={(e) => enableDisable(7, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(7, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Genji" selected>Genji</option>
                  <option value="光源氏">光源氏（ひかるげんじ）</option>
				  <option value="The Shining Prince">The Shining Prince</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch8" onChange={(e) => enableDisable(8, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(8, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Prince Hyōbu" selected>Prince Hyōbu</option>
                  <option value="兵部卿宮">兵部卿宮（ひょうぶきょうのみや）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch9" onChange={(e) => enableDisable(9, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(9, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Murasaki no Ue" selected>Murasaki no Ue</option>
                  <option value="紫の上">紫の上（むらさきのうえ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch10" onChange={(e) => enableDisable(10, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(10, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Emperor Reizei" selected>Emperor Reizei</option>
                  <option value="冷泉帝">冷泉帝（れいぜいてい）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch11" onChange={(e) => enableDisable(11, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(11, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="A Minister" selected>A Minister</option>
                  <option value="中務省">中務省（なかつかさしょう）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch12" onChange={(e) => enableDisable(12, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(12, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Akashi Nun" selected>Akashi Nun</option>
                  <option value="明石の尼君">明石の尼君（あかしのあまきみ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch13" onChange={(e) => enableDisable(13, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(13, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Novitate" selected>Novitate</option>
                  <option value="明石の入道">明石の入道（あかしのにゅうどう）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch14" onChange={(e) => enableDisable(14, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(14, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Akashi Lady" selected>The Akashi Lady</option>
                  <option value="明石の御方">明石の御方（あかしのおんかた）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch15" onChange={(e) => enableDisable(15, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(15, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Minister of the Left" selected>Minister of the Left</option>
                  <option value="左大臣">左大臣（さだいじん）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch16" onChange={(e) => enableDisable(16, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(16, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Aoi" selected>Aoi</option>
                  <option value="葵の上">葵の上（あおいのうえ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch17" onChange={(e) => enableDisable(17, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(17, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Yūgiri" selected>Yūgiri</option>
                  <option value="夕霧">夕霧（ゆうぎり）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch18" onChange={(e) => enableDisable(18, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(18, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Akashi Princess" selected>Akashi Princess</option>
                  <option value="明石の姫君">明石の姫君（あかしのひめぎみ））</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch19" onChange={(e) => enableDisable(19, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(19, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kokiden Consort" selected>Kokiden Consort</option>
                  <option value="弘徽殿女御【桐壺帝の妃】">弘徽殿女御（こきでんのにょうご）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch20" onChange={(e) => enableDisable(20, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(20, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Emperor Suzaku" selected>Emperor Suzaku</option>
                  <option value="朱雀帝">朱雀帝（すざくてい）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch21" onChange={(e) => enableDisable(21, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(21, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Zenbō" selected>Zenbō</option>
                  <option value="前坊">前坊（ぜんぼう）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch22" onChange={(e) => enableDisable(22, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(22, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Lady Rokujō" selected>Lady Rokujō</option>
                  <option value="六条御息所">六条御息所（ろくじょうのみやす）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch23" onChange={(e) => enableDisable(23, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(23, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Tō no Chūjō" selected>Tō no Chūjō</option>
                  <option value="頭中将">頭中将（とうのちゅうじょう）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch24" onChange={(e) => enableDisable(24, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(24, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Yūgao" selected>Yūgao</option>
                  <option value="夕顔">夕顔（ゆうがお）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch25" onChange={(e) => enableDisable(25, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(25, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Tamakazura" selected>Tamakazura</option>
                  <option value="玉鬘">玉鬘（たまかずら）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch26" onChange={(e) => enableDisable(26, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(26, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Fourth Princess" selected>The Fourth Princess</option>
                  <option value="四の君">四の君（よんのきみ）</option>
				  <option value="Yon no Kimi">Yon no Kimi</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch27" onChange={(e) => enableDisable(27, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(27, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Minister of the Right" selected>Minister of the Right</option>
                  <option value="右大臣">右大臣（うだいじん）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch28" onChange={(e) => enableDisable(28, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(28, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Oborozukiyo" selected>Oborozukiyo</option>
                  <option value="朧月夜">朧月夜（おぼろづきよ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch29" onChange={(e) => enableDisable(29, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(29, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kumoi no Kari's Mother" selected>Kumoi no Kari's Mother</option>
                  <option value="雲居の雁の母">雲居の雁の母（くもいのかりのはは）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch30" onChange={(e) => enableDisable(30, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(30, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Murasaki's Mother" selected>Murasaki's Mother</option>
                  <option value="按察使大納言の娘">按察使大納言の娘（あぜちだいなごんのむすめ）</option>
				  <option value="Azechi no Dainagon's Daughter">Azechi no Dainagon's Daughter</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch31" onChange={(e) => enableDisable(31, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(31, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kitayama no Amagimi" selected>Kitayama no Amagimi</option>
                  <option value="北山の尼君">北山の尼君（きたやまのあまぎみ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch32" onChange={(e) => enableDisable(32, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(32, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Lady of Jokyoden Palace" selected>The Lady of Jokyoden Palace</option>
                  <option value="">承香殿の女御（じょうきょうでんのにょうご）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch33" onChange={(e) => enableDisable(33, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(33, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Higekuro" selected>Higekuro</option>
                  <option value="髭黒">髭黒（ひげくろ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch34" onChange={(e) => enableDisable(34, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(34, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Higekuro's Wife" selected>Higekuro's Wife</option>
                  <option value="髭黒の北の方 ">髭黒の北の方 （ひげくろのきたのかた）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch35" onChange={(e) => enableDisable(35, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(35, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Ukon" selected>Ukon</option>
                  <option value="右近">右近（うこん）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch36" onChange={(e) => enableDisable(36, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(36, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kumoi no Kari" selected>Kumoi no Kari</option>
                  <option value="雲居の雁">雲居の雁（くもいのかり）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch37" onChange={(e) => enableDisable(37, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(37, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Akikonomu" selected>Akikonomu</option>
                  <option value="秋好中宮">秋好中宮（あきこのむちゅうぐう）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch38" onChange={(e) => enableDisable(38, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(38, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Koremitsu" selected>Koremitsu</option>
                  <option value="藤原惟光">藤原惟光（ふじわらのこれみつ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch39" onChange={(e) => enableDisable(39, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(39, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Third Princess" selected>The Third Princess</option>
                  <option value="女三宮">女三宮（おんなさんのみや）</option>
				  <option value="Onna San no Miya">Onna San no Miya</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch40" onChange={(e) => enableDisable(40, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(40, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kashiwagi" selected>Kashiwagi</option>
                  <option value="柏木">柏木（かしわぎ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch41" onChange={(e) => enableDisable(41, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(41, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Eighth Prince" selected>The Eighth Prince</option>
                  <option value="宇治八の宮">宇治八の宮（うじはちのみや）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch42" onChange={(e) => enableDisable(42, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(42, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Prince Hitachi" selected>Prince Hitachi</option>
                  <option value="常陸宮">常陸宮（ひたちのみ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch43" onChange={(e) => enableDisable(43, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(43, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Suetsumuhana" selected>Suetsumuhana</option>
                  <option value="末摘花">末摘花（すえつむはな）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch44" onChange={(e) => enableDisable(44, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(44, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Reikeiden Consort" selected>Reikeiden Consort</option>
                  <option value="麗景殿の女御">麗景殿の女御（れいけいでんのにょうご）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch45" onChange={(e) => enableDisable(45, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(45, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Lady of the Falling Flowers" selected>The Lady of the Falling Flowers</option>
                  <option value="花散里">花散里（はなちるさと）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch46" onChange={(e) => enableDisable(46, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(46, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kogimi" selected>Kogimi</option>
                  <option value="小君">小君（こぎみ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch47" onChange={(e) => enableDisable(47, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(47, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Utsusemi" selected>Utsusemi</option>
                  <option value="空蝉">空蝉（うつせみ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch48" onChange={(e) => enableDisable(48, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(48, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Iyo no Suke" selected>Iyo no Suke</option>
                  <option value="伊予介">伊予介（いよのすけ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch49" onChange={(e) => enableDisable(49, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(49, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Ki no Kami" selected>Ki no Kami</option>
                  <option value="紀伊守">紀伊守（きのかみ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch50" onChange={(e) => enableDisable(50, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(50, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Nokiba no Ogi" selected>Nokiba no Ogi</option>
                  <option value="軒端荻">軒端荻（のきばのおぎ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch51" onChange={(e) => enableDisable(51, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(51, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kokiden Consort II" selected>Kokiden Consort II</option>
                  <option value="弘徽殿女御【冷泉帝の妃】">弘徽殿女御（こきでんのにょうご）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch52" onChange={(e) => enableDisable(52, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(52, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Asagao" selected>Asagao</option>
                  <option value="朝顔">朝顔（あさがお）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch53" onChange={(e) => enableDisable(53, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(53, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Genji's Horse" selected>Genji's Horse</option>
                  <option value="🐎">🐎</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch54" onChange={(e) => enableDisable(54, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(54, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Cat" selected>Cat</option>
                  <option value="🐈">🐈</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch55" onChange={(e) => enableDisable(55, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(55, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Gosechi Dancer" selected>Gosechi Dancer</option>
                  <option value="筑紫の五節">筑紫の五節（つくしのごせつ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch56" onChange={(e) => enableDisable(56, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(56, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Prince Hotaru" selected>Prince Hotaru</option>
                  <option value="蛍兵部卿宮">蛍兵部卿宮（ほたるひょうぶきょうのみや）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch57" onChange={(e) => enableDisable(57, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(57, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Makibashira" selected>Makibashira</option>
                  <option value="真木柱">真木柱（まきばしら）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch58" onChange={(e) => enableDisable(58, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(58, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Ōmi Lady" selected>Ōmi Lady</option>
                  <option value="近江の君">近江の君（おうみのきみ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch59" onChange={(e) => enableDisable(59, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(59, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kobai" selected>Kobai</option>
                  <option value="紅梅">紅梅（こうばい）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch60" onChange={(e) => enableDisable(60, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(60, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Second Princess" selected>The Second Princess</option>
                  <option value="落葉の宮">落葉の宮（おちばのみや）</option>
				  <option value="Ochiba no Miya">Ochiba no Miya</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch61" onChange={(e) => enableDisable(61, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(61, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Emperor Kinjo" selected>Emperor Kinjo</option>
                  <option value="今上帝">今上帝（きんじょうてい）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch62" onChange={(e) => enableDisable(62, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(62, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Maiden of the Dance" selected>The Maiden of the Dance</option>
                  <option value="藤典侍">藤典侍（とうのないしのすけ）</option>
				  <option value="Naishi no Suke">Naishi no Suke</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch63" onChange={(e) => enableDisable(63, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(63, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kaoru" selected>Kaoru</option>
                  <option value="薫">薫（かおる）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch64" onChange={(e) => enableDisable(64, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(64, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Eighth Prince's Wife" selected>Eighth Prince's Wife</option>
                  <option value="八の宮の北の方">八の宮と北の方（はちのみやのきたのかた）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch65" onChange={(e) => enableDisable(65, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(65, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Agemaki" selected>Agemaki</option>
                  <option value="大君">大君（おおいぎみ）</option>
				  <option value="Ōigimi" selected>Ōigimi</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch66" onChange={(e) => enableDisable(66, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(66, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Kozeri" selected>Kozeri</option>
                  <option value="中君">中君（なかのきみ）</option>
				  <option value="Naka no Kimi">Naka no Kimi）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch67" onChange={(e) => enableDisable(67, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(67, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Ukifune" selected>Ukifune</option>
                  <option value="浮舟">浮舟（うきふね）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch68" onChange={(e) => enableDisable(68, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(68, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Niou" selected>Niou</option>
                  <option value="匂宮">匂宮（におうのみや）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch69" onChange={(e) => enableDisable(69, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(69, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="The Sixth Princess" selected>The Sixth Princess</option>
                  <option value="六の君">六の君（ろくのきみ）</option>
				  <option value="Roku no Kimi" selected>Roku no Kimi</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch70" onChange={(e) => enableDisable(70, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(70, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Nakatsukasa" selected>Nakatsukasa</option>
                  <option value="中務 ">中務 （なかつかさ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch71" onChange={(e) => enableDisable(71, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(71, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Omyōbu" selected>Omyōbu</option>
                  <option value="王命婦">王命婦（おうみょうぶ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch72" onChange={(e) => enableDisable(72, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(72, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Yoshikiyo" selected>Yoshikiyo</option>
                  <option value="源良清">源良清（みなもとのよしきよ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch73" onChange={(e) => enableDisable(73, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(73, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Shōnagon" selected>Shōnagon</option>
                  <option value="少納言">少納言（しょうなごん）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch74" onChange={(e) => enableDisable(74, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(74, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Gen no Naishi" selected>Gen no Naishi</option>
                  <option value="源典侍">源典侍（げんのないしのすけ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch75" onChange={(e) => enableDisable(75, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(75, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Bishop of Yokawa" selected>Bishop of Yokawa</option>
                  <option value="横川の僧都">横川の僧都（よかわのそうづ）</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch76" onChange={(e) => enableDisable(76, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(76, e.target.value)} style={{fontSize: "large", width: "175px"}}>
                  <option value="Chūjō no Kimi" selected>Chūjō no Kimi</option>
                  <option value="中将の君">中将の君（ちゅうじょうのきみ）</option>
               </select>
            </div>
            <br></br>
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
        >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
        </div>
    )
}

