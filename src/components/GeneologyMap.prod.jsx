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

	//Note: different names for each character in different translations
	const character_names = [
		["Previous Emperor", "天皇（てんのう）"],
		["Kiritsubo Emperor", "桐壺帝（きりつぼてい）"],
		["Kiritsubo Consort", "桐壺更衣（きりつぼのこうい）"],
		["Azechi", "按察使（あぜち）"],
		["Princess Omiya", "大宮（おおみや）"],
		["Momozono Shikubu no Miya", "桃園式部卿宮（ももぞのしきぶきょうのみや）"],
		["Fujitsubo", "藤壺（ふじつぼ）"],
		["Genji", "光源氏（ひかるげんじ）"],
		["Prince Hyōbu", "兵部卿宮（ひょうぶきょうのみや）"],
		["Murasaki no Ue", "紫の上（むらさきのうえ）"],
		["Emperor Reizei", "冷泉帝（れいぜいてい）"],
		["A Minister", "中務省（なかつかさしょう）"],
		["Akashi Nun", "明石の尼君（あかしのあまきみ）"],
		["Novitate", "明石の入道（あかしのにゅうどう）"],
		["The Akashi Lady", "明石の御方（あかしのおんかた）"],
		["Minister of the Left", "左大臣（さだいじん）"],
		["Aoi", "葵の上（あおいのうえ）"],
		["Yūgiri", "夕霧（ゆうぎり）"],
		["Akashi Princess", "明石の姫君（あかしのひめぎみ）"],
		["Kokiden Consort", "弘徽殿女御【桐壺帝の妃】（こきでんのにょうご）"],
		["Emperor Suzaku", "朱雀帝（すざくてい）"],
		["Zenbō", "前坊（ぜんぼう）"],
		["Lady Rokujō", "六条御息所（ろくじょうのみやす）"],
		["Tō no Chūjō", "頭中将（とうのちゅうじょう）"],
		["Yūgao", "夕顔（ゆうがお）"],
		["Tamakazura", "玉鬘（たまかずら）"],
		["The Fourth Princess", "四の君（よんのきみ）"],
		["Minister of the Right", "右大臣（うだいじん）"],
		["Oborozukiyo", "朧月夜（おぼろづきよ）"],
		["Kumoi no Kari's Mother", "雲居の雁の母（くもいのかりのはは）"],
		["Murasaki's Mother", "按察使大納言の娘（あぜちだいなごんのむすめ）"],
		["Kitayama no Amagimi", "北山の尼君（きたやまのあまぎみ）"],
		["The Lady of Jokyoden Palace", "承香殿の女御（じょうきょうでんのにょうご）"],
		["Higekuro", "髭黒（ひげくろ）"],
		["Higekuro's Wife", "髭黒の北の方 （ひげくろのきたのかた）"],
		["Ukon", "右近（うこん）"],
		["Kumoi no Kari", "雲居の雁（くもいのかり）"],
		["Akikonomu", "秋好中宮（あきこのむちゅうぐう）"],
		["Koremitsu", "藤原惟光（ふじわらのこれみつ）"],
		["The Third Princess", "女三宮（おんなさんのみや）"],
		["Kashiwagi", "柏木（かしわぎ）"],
		["The Eighth Prince", "宇治八の宮（うじはちのみや）"],
		["Prince Hitachi", "常陸宮（ひたちのみ）"],
		["Suetsumuhana", "末摘花（すえつむはな）"],
		["Reikeiden Consort", "麗景殿の女御（れいけいでんのにょうご）"],
		["The Lady of the Falling Flowers", "花散里（はなちるさと）"],
		["Kogimi", "小君（こぎみ）"],
		["Utsusemi", "空蝉（うつせみ）"],
		["Iyo no Suke", "伊予介（いよのすけ）"],
		["Ki no Kami", "紀伊守（きのかみ）"],
		["Nokiba no Ogi", "軒端荻（のきばのおぎ）"],
		["Kokiden Consort II", "弘徽殿女御【冷泉帝の妃】（こきでんのにょうご）"],
		["Asagao", "朝顔（あさがお）"],
		["Genji's Horse", "光源氏の🐎"],
		["Cat", "🐈"],
		["Gosechi Dancer", "筑紫の五節（つくしのごせつ）"],
		["Prince Hotaru", "蛍兵部卿宮（ほたるひょうぶきょうのみや）"],
		["Makibashira", "真木柱（まきばしら）"],
		["Ōmi Lady", "近江の君（おうみのきみ）"],
		["Kobai", "紅梅（こうばい）"],
		["The Second Princess", "落葉の宮（おちばのみや）"],
		["Emperor Kinjo", "今上帝（きんじょうてい）"],
		["The Maiden of the Dance", "藤典侍（とうのないしのすけ）"],
		["Kaoru", "薫（かおる）"],
		["Eighth Prince's Wife", "八の宮と北の方（はちのみやのきたのかた"],
		["Agemaki", "大君（おおいぎみ）"],
		["Kozeri", "中君（なかのきみ）"],
		["Ukifune", "浮舟（うきふね）"],
		["Niou", "匂宮（におうのみや）"],
		["The Sixth Princess", "六の君（ろくのきみ）"],
		["Nakatsukasa", "中務 （なかつかさ）"],
		["Omyōbu", "王命婦（おうみょうぶ）"],
		["Yoshikiyo", "源良清（みなもとのよしきよ）"],
		["Shōnagon", "少納言（しょうなごん）"],
		["Gen no Naishi", "源典侍（げんのないしのすけ）"],
		["Bishop of Yokawa", "横川の僧都（よかわのそうづ）"],
		["Chūjō no Kimi", "中将の君（ちゅうじょうのきみ）"]
	]

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
		for (let i = 0; i < character_names.length; i++) {
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
		for (let i = 0; i < character_names.length; i++) {
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
		for (let i = 0; i < character_names.length; i++) {
			if (ver == "jp") {
				document.getElementById("dd" + i.toString()).value = character_names[i][1].slice(0, character_names[i][1].indexOf("（"))
			} else if (ver == "en") {
				document.getElementById("dd" + i.toString()).value = character_names[i][0]
			}
			changeNodeLabelName(i, document.getElementById("dd" + i.toString()).value)
		}
	}

    return (
        <div style={{fontSize: "large"}}>
            <br></br>
            <div>
                <button onClick={() => showAll()} style={{fontSize: "large"}}>Show All</button>
				<button onClick={() => disableAll()} style={{fontSize: "large"}}>Disable All</button>
				<select onChange={(e) => changeLanguage(e.target.value)} style={{marginLeft: "10px", fontSize: "large", width: "175px"}}>
                  <option value="en" selected>English</option>
                  <option value="jp" >Japanese</option>
               </select>
            </div>
            <br></br>
            <div style={{overflowX: "scroll", display: "block", overflow: "auto", whiteSpace: "nowrap", paddingBottom: "5px"}}>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch0" onChange={(e) => enableDisable(0, e.target.checked)} />
                <select onChange={(e) => changeNodeLabelName(0, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd0">
                  <option value={character_names[0][0]} selected>{character_names[0][0]}</option>
                  <option value={character_names[0][1].slice(0, character_names[0][1].indexOf("（"))}>{character_names[0][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch1" onChange={(e) => enableDisable(1, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(1, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd1">
				<option value={character_names[1][0]} selected>{character_names[1][0]}</option>
				<option value={character_names[1][1].slice(0, character_names[1][1].indexOf("（"))}>{character_names[1][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch2" onChange={(e) => enableDisable(2, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(2, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd2">
                <option value={character_names[2][0]} selected>{character_names[2][0]}</option>
				<option value={character_names[2][1].slice(0, character_names[2][1].indexOf("（"))}>{character_names[2][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch3" onChange={(e) => enableDisable(3, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(3, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd3">
                <option value={character_names[3][0]} selected>{character_names[3][0]}</option>
				<option value={character_names[3][1].slice(0, character_names[3][1].indexOf("（"))}>{character_names[3][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch4" onChange={(e) => enableDisable(4, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(4, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd4">
                <option value={character_names[4][0]} selected>{character_names[4][0]}</option>
				<option value={character_names[4][1].slice(0, character_names[4][1].indexOf("（"))}>{character_names[4][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch5" onChange={(e) => enableDisable(5, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(5, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd5">
                <option value={character_names[5][0]} selected>{character_names[5][0]}</option>
				<option value={character_names[5][1].slice(0, character_names[5][1].indexOf("（"))}>{character_names[5][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch6" onChange={(e) => enableDisable(6, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(6, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd6">
                <option value={character_names[6][0]} selected>{character_names[6][0]}</option>
				<option value={character_names[6][1].slice(0, character_names[6][1].indexOf("（"))}>{character_names[6][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch7" onChange={(e) => enableDisable(7, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(7, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd7">
                <option value={character_names[7][0]} selected>{character_names[7][0]}</option>
				<option value={character_names[7][1].slice(0, character_names[7][1].indexOf("（"))}>{character_names[7][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch8" onChange={(e) => enableDisable(8, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(8, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd8">
                <option value={character_names[8][0]} selected>{character_names[8][0]}</option>
				<option value={character_names[8][1].slice(0, character_names[8][1].indexOf("（"))}>{character_names[8][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch9" onChange={(e) => enableDisable(9, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(9, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd9">
                <option value={character_names[9][0]} selected>{character_names[9][0]}</option>
				<option value={character_names[9][1].slice(0, character_names[9][1].indexOf("（"))}>{character_names[9][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch10" onChange={(e) => enableDisable(10, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(10, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd10">
                <option value={character_names[10][0]} selected>{character_names[10][0]}</option>
				<option value={character_names[10][1].slice(0, character_names[10][1].indexOf("（"))}>{character_names[10][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch11" onChange={(e) => enableDisable(11, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(11, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd11">
                <option value={character_names[11][0]} selected>{character_names[11][0]}</option>
				<option value={character_names[11][1].slice(0, character_names[11][1].indexOf("（"))}>{character_names[11][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch12" onChange={(e) => enableDisable(12, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(12, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd12">
                <option value={character_names[12][0]} selected>{character_names[12][0]}</option>
				<option value={character_names[12][1].slice(0, character_names[12][1].indexOf("（"))}>{character_names[12][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch13" onChange={(e) => enableDisable(13, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(13, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd13">
                <option value={character_names[13][0]} selected>{character_names[13][0]}</option>
				<option value={character_names[13][1].slice(0, character_names[13][1].indexOf("（"))}>{character_names[13][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch14" onChange={(e) => enableDisable(14, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(14, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd14">
                <option value={character_names[14][0]} selected>{character_names[14][0]}</option>
				<option value={character_names[14][1].slice(0, character_names[14][1].indexOf("（"))}>{character_names[14][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch15" onChange={(e) => enableDisable(15, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(15, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd15">
                <option value={character_names[15][0]} selected>{character_names[15][0]}</option>
				<option value={character_names[15][1].slice(0, character_names[15][1].indexOf("（"))}>{character_names[15][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch16" onChange={(e) => enableDisable(16, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(16, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd16">
                <option value={character_names[16][0]} selected>{character_names[16][0]}</option>
				<option value={character_names[16][1].slice(0, character_names[16][1].indexOf("（"))}>{character_names[16][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch17" onChange={(e) => enableDisable(17, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(17, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd17">
                <option value={character_names[17][0]} selected>{character_names[17][0]}</option>
				<option value={character_names[17][1].slice(0, character_names[17][1].indexOf("（"))}>{character_names[17][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch18" onChange={(e) => enableDisable(18, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(18, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd18">
                <option value={character_names[18][0]} selected>{character_names[18][0]}</option>
				<option value={character_names[18][1].slice(0, character_names[18][1].indexOf("（"))}>{character_names[18][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch19" onChange={(e) => enableDisable(19, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(19, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd19">
                <option value={character_names[19][0]} selected>{character_names[19][0]}</option>
				<option value={character_names[19][1].slice(0, character_names[19][1].indexOf("（"))}>{character_names[19][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch20" onChange={(e) => enableDisable(20, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(20, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd20">
                <option value={character_names[20][0]} selected>{character_names[20][0]}</option>
				<option value={character_names[20][1].slice(0, character_names[20][1].indexOf("（"))}>{character_names[20][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch21" onChange={(e) => enableDisable(21, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(21, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd21">
                <option value={character_names[21][0]} selected>{character_names[21][0]}</option>
				<option value={character_names[21][1].slice(0, character_names[21][1].indexOf("（"))}>{character_names[21][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch22" onChange={(e) => enableDisable(22, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(22, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd22">
                <option value={character_names[22][0]} selected>{character_names[22][0]}</option>
				<option value={character_names[22][1].slice(0, character_names[22][1].indexOf("（"))}>{character_names[22][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch23" onChange={(e) => enableDisable(23, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(23, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd23">
                <option value={character_names[23][0]} selected>{character_names[23][0]}</option>
				<option value={character_names[23][1].slice(0, character_names[23][1].indexOf("（"))}>{character_names[23][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch24" onChange={(e) => enableDisable(24, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(24, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd24">
                <option value={character_names[24][0]} selected>{character_names[24][0]}</option>
				<option value={character_names[24][1].slice(0, character_names[24][1].indexOf("（"))}>{character_names[24][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch25" onChange={(e) => enableDisable(25, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(25, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd25">
                <option value={character_names[25][0]} selected>{character_names[25][0]}</option>
				<option value={character_names[25][1].slice(0, character_names[25][1].indexOf("（"))}>{character_names[25][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch26" onChange={(e) => enableDisable(26, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(26, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd26">
                <option value={character_names[26][0]} selected>{character_names[26][0]}</option>
				<option value={character_names[26][1].slice(0, character_names[26][1].indexOf("（"))}>{character_names[26][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch27" onChange={(e) => enableDisable(27, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(27, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd27">
                <option value={character_names[27][0]} selected>{character_names[27][0]}</option>
				<option value={character_names[27][1].slice(0, character_names[27][1].indexOf("（"))}>{character_names[27][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch28" onChange={(e) => enableDisable(28, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(28, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd28">
                <option value={character_names[28][0]} selected>{character_names[28][0]}</option>
				<option value={character_names[28][1].slice(0, character_names[28][1].indexOf("（"))}>{character_names[28][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch29" onChange={(e) => enableDisable(29, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(29, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd29">
                <option value={character_names[29][0]} selected>{character_names[29][0]}</option>
				<option value={character_names[29][1].slice(0, character_names[29][1].indexOf("（"))}>{character_names[29][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch30" onChange={(e) => enableDisable(30, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(30, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd30">
                <option value={character_names[30][0]} selected>{character_names[30][0]}</option>
				<option value={character_names[30][1].slice(0, character_names[30][1].indexOf("（"))}>{character_names[30][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch31" onChange={(e) => enableDisable(31, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(31, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd31">
                <option value={character_names[31][0]} selected>{character_names[31][0]}</option>
				<option value={character_names[31][1].slice(0, character_names[31][1].indexOf("（"))}>{character_names[31][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch32" onChange={(e) => enableDisable(32, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(32, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd32">
                <option value={character_names[32][0]} selected>{character_names[32][0]}</option>
				<option value={character_names[32][1].slice(0, character_names[32][1].indexOf("（"))}>{character_names[32][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch33" onChange={(e) => enableDisable(33, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(33, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd33">
                <option value={character_names[33][0]} selected>{character_names[33][0]}</option>
				<option value={character_names[33][1].slice(0, character_names[33][1].indexOf("（"))}>{character_names[33][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch34" onChange={(e) => enableDisable(34, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(34, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd34">
                <option value={character_names[34][0]} selected>{character_names[34][0]}</option>
				<option value={character_names[34][1].slice(0, character_names[34][1].indexOf("（"))}>{character_names[34][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch35" onChange={(e) => enableDisable(35, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(35, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd35">
                <option value={character_names[35][0]} selected>{character_names[35][0]}</option>
				<option value={character_names[35][1].slice(0, character_names[35][1].indexOf("（"))}>{character_names[35][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch36" onChange={(e) => enableDisable(36, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(36, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd36">
                <option value={character_names[36][0]} selected>{character_names[36][0]}</option>
				<option value={character_names[36][1].slice(0, character_names[36][1].indexOf("（"))}>{character_names[36][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch37" onChange={(e) => enableDisable(37, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(37, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd37">
                <option value={character_names[37][0]} selected>{character_names[37][0]}</option>
				<option value={character_names[37][1].slice(0, character_names[37][1].indexOf("（"))}>{character_names[37][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch38" onChange={(e) => enableDisable(38, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(38, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd38">
                <option value={character_names[38][0]} selected>{character_names[38][0]}</option>
				<option value={character_names[38][1].slice(0, character_names[38][1].indexOf("（"))}>{character_names[38][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch39" onChange={(e) => enableDisable(39, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(39, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd39">
                <option value={character_names[39][0]} selected>{character_names[39][0]}</option>
				<option value={character_names[39][1].slice(0, character_names[39][1].indexOf("（"))}>{character_names[39][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch40" onChange={(e) => enableDisable(40, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(40, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd40">
                <option value={character_names[40][0]} selected>{character_names[40][0]}</option>
				<option value={character_names[40][1].slice(0, character_names[40][1].indexOf("（"))}>{character_names[40][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch41" onChange={(e) => enableDisable(41, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(41, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd41">
                <option value={character_names[41][0]} selected>{character_names[41][0]}</option>
				<option value={character_names[41][1].slice(0, character_names[41][1].indexOf("（"))}>{character_names[41][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch42" onChange={(e) => enableDisable(42, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(42, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd42">
                <option value={character_names[42][0]} selected>{character_names[42][0]}</option>
				<option value={character_names[42][1].slice(0, character_names[42][1].indexOf("（"))}>{character_names[42][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch43" onChange={(e) => enableDisable(43, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(43, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd43">
                <option value={character_names[43][0]} selected>{character_names[43][0]}</option>
				<option value={character_names[43][1].slice(0, character_names[43][1].indexOf("（"))}>{character_names[43][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch44" onChange={(e) => enableDisable(44, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(44, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd44">
                <option value={character_names[44][0]} selected>{character_names[44][0]}</option>
				<option value={character_names[44][1].slice(0, character_names[44][1].indexOf("（"))}>{character_names[44][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch45" onChange={(e) => enableDisable(45, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(45, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd45">
                <option value={character_names[45][0]} selected>{character_names[45][0]}</option>
				<option value={character_names[45][1].slice(0, character_names[45][1].indexOf("（"))}>{character_names[45][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch46" onChange={(e) => enableDisable(46, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(46, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd46">
                <option value={character_names[46][0]} selected>{character_names[46][0]}</option>
				<option value={character_names[46][1].slice(0, character_names[46][1].indexOf("（"))}>{character_names[46][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch47" onChange={(e) => enableDisable(47, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(47, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd47">
                <option value={character_names[47][0]} selected>{character_names[47][0]}</option>
				<option value={character_names[47][1].slice(0, character_names[47][1].indexOf("（"))}>{character_names[47][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch48" onChange={(e) => enableDisable(48, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(48, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd48">
                <option value={character_names[48][0]} selected>{character_names[48][0]}</option>
				<option value={character_names[48][1].slice(0, character_names[48][1].indexOf("（"))}>{character_names[48][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch49" onChange={(e) => enableDisable(49, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(49, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd49">
                <option value={character_names[49][0]} selected>{character_names[49][0]}</option>
				<option value={character_names[49][1].slice(0, character_names[49][1].indexOf("（"))}>{character_names[49][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch50" onChange={(e) => enableDisable(50, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(50, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd50">
				<option value={character_names[50][0]} selected>{character_names[50][0]}</option>
				<option value={character_names[50][1].slice(0, character_names[50][1].indexOf("（"))}>{character_names[50][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch51" onChange={(e) => enableDisable(51, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(51, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd51">
                <option value={character_names[51][0]} selected>{character_names[51][0]}</option>
				<option value={character_names[51][1].slice(0, character_names[51][1].indexOf("（"))}>{character_names[51][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch52" onChange={(e) => enableDisable(52, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(52, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd52">
                <option value={character_names[52][0]} selected>{character_names[52][0]}</option>
				<option value={character_names[52][1].slice(0, character_names[52][1].indexOf("（"))}>{character_names[52][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch53" onChange={(e) => enableDisable(53, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(53, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd53">
                <option value={character_names[53][0]} selected>{character_names[53][0]}</option>
				<option value={character_names[53][1].slice(0, character_names[53][1].indexOf("（"))}>{character_names[53][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch54" onChange={(e) => enableDisable(54, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(54, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd54">
                <option value={character_names[54][0]} selected>{character_names[54][0]}</option>
				<option value={character_names[54][1].slice(0, character_names[54][1].indexOf("（"))}>{character_names[54][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch55" onChange={(e) => enableDisable(55, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(55, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd55">
                <option value={character_names[55][0]} selected>{character_names[55][0]}</option>
				<option value={character_names[55][1].slice(0, character_names[55][1].indexOf("（"))}>{character_names[55][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch56" onChange={(e) => enableDisable(56, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(56, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd56">
                <option value={character_names[56][0]} selected>{character_names[56][0]}</option>
				<option value={character_names[56][1].slice(0, character_names[56][1].indexOf("（"))}>{character_names[56][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch57" onChange={(e) => enableDisable(57, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(57, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd57">
                <option value={character_names[57][0]} selected>{character_names[57][0]}</option>
				<option value={character_names[57][1].slice(0, character_names[57][1].indexOf("（"))}>{character_names[57][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch58" onChange={(e) => enableDisable(58, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(58, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd58">
                <option value={character_names[58][0]} selected>{character_names[58][0]}</option>
				<option value={character_names[58][1].slice(0, character_names[58][1].indexOf("（"))}>{character_names[58][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch59" onChange={(e) => enableDisable(59, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(59, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd59">
                <option value={character_names[59][0]} selected>{character_names[59][0]}</option>
				<option value={character_names[59][1].slice(0, character_names[59][1].indexOf("（"))}>{character_names[59][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch60" onChange={(e) => enableDisable(60, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(60, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd60">
                <option value={character_names[60][0]} selected>{character_names[60][0]}</option>
				<option value={character_names[60][1].slice(0, character_names[60][1].indexOf("（"))}>{character_names[60][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch61" onChange={(e) => enableDisable(61, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(61, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd61">
                <option value={character_names[61][0]} selected>{character_names[61][0]}</option>
				<option value={character_names[61][1].slice(0, character_names[61][1].indexOf("（"))}>{character_names[61][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch62" onChange={(e) => enableDisable(62, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(62, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd62">
                <option value={character_names[62][0]} selected>{character_names[62][0]}</option>
				<option value={character_names[62][1].slice(0, character_names[62][1].indexOf("（"))}>{character_names[62][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch63" onChange={(e) => enableDisable(63, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(63, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd63">
                <option value={character_names[63][0]} selected>{character_names[63][0]}</option>
				<option value={character_names[63][1].slice(0, character_names[63][1].indexOf("（"))}>{character_names[63][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch64" onChange={(e) => enableDisable(64, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(64, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd64">
                <option value={character_names[64][0]} selected>{character_names[64][0]}</option>
				<option value={character_names[64][1].slice(0, character_names[64][1].indexOf("（"))}>{character_names[64][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch65" onChange={(e) => enableDisable(65, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(65, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd65">
                <option value={character_names[65][0]} selected>{character_names[65][0]}</option>
				<option value={character_names[65][1].slice(0, character_names[65][1].indexOf("（"))}>{character_names[65][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch66" onChange={(e) => enableDisable(66, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(66, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd66">
                <option value={character_names[66][0]} selected>{character_names[66][0]}</option>
				<option value={character_names[66][1].slice(0, character_names[66][1].indexOf("（"))}>{character_names[66][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch67" onChange={(e) => enableDisable(67, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(67, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd67">
                <option value={character_names[67][0]} selected>{character_names[67][0]}</option>
				<option value={character_names[67][1].slice(0, character_names[67][1].indexOf("（"))}>{character_names[67][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch68" onChange={(e) => enableDisable(68, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(68, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd68">
                <option value={character_names[68][0]} selected>{character_names[68][0]}</option>
				<option value={character_names[68][1].slice(0, character_names[68][1].indexOf("（"))}>{character_names[68][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch69" onChange={(e) => enableDisable(69, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(69, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd69">
                <option value={character_names[69][0]} selected>{character_names[69][0]}</option>
				<option value={character_names[69][1].slice(0, character_names[69][1].indexOf("（"))}>{character_names[69][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch70" onChange={(e) => enableDisable(70, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(70, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd70">
                <option value={character_names[70][0]} selected>{character_names[70][0]}</option>
				<option value={character_names[70][1].slice(0, character_names[70][1].indexOf("（"))}>{character_names[70][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch71" onChange={(e) => enableDisable(71, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(71, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd71">
                <option value={character_names[71][0]} selected>{character_names[71][0]}</option>
				<option value={character_names[71][1].slice(0, character_names[71][1].indexOf("（"))}>{character_names[71][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch72" onChange={(e) => enableDisable(72, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(72, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd72">
                <option value={character_names[72][0]} selected>{character_names[72][0]}</option>
				<option value={character_names[72][1].slice(0, character_names[72][1].indexOf("（"))}>{character_names[72][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch73" onChange={(e) => enableDisable(73, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(73, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd73">
                <option value={character_names[73][0]} selected>{character_names[73][0]}</option>
				<option value={character_names[73][1].slice(0, character_names[73][1].indexOf("（"))}>{character_names[73][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch74" onChange={(e) => enableDisable(74, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(74, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd74">
                <option value={character_names[74][0]} selected>{character_names[74][0]}</option>
				<option value={character_names[74][1].slice(0, character_names[74][1].indexOf("（"))}>{character_names[74][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch75" onChange={(e) => enableDisable(75, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(75, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd75">
                <option value={character_names[75][0]} selected>{character_names[75][0]}</option>
				<option value={character_names[75][1].slice(0, character_names[75][1].indexOf("（"))}>{character_names[75][1]}</option>
               </select>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch76" onChange={(e) => enableDisable(76, e.target.checked)} />
				<select onChange={(e) => changeNodeLabelName(76, e.target.value)} style={{fontSize: "large", width: "175px"}} id="dd76">
                <option value={character_names[76][0]} selected>{character_names[76][0]}</option>
				<option value={character_names[76][1].slice(0, character_names[76][1].indexOf("（"))}>{character_names[76][1]}</option>
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

