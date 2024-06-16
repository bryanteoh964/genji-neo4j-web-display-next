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
			{ id: 'Kokiden Consort 1', position: { x: -630, y: 85 }, data: { label: 'Kokiden Consort 1' }, draggable: true, style: {border: '2px solid #db537c'}, hidden: true},
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
			{ id: 'Kitayama no Amagimi', position: { x: 550, y: -125 }, data: { label: 'Kitayama no Amagimi' }, draggable: true, style: {border: '2px solid #c2af91'}, hidden: true},
			{ id: 'The Lady of Jokyoden Palace', position: { x: -500, y: 290 }, data: { label: 'The Lady of Jokyoden Palace' }, draggable: true, style: {border: '2px solid #1f4f28'}, hidden: true},
			{ id: 'Higekuro', position: { x: 458, y:  465 }, data: { label: 'Higekuro' }, draggable: true, style: {border: '2px solid #543a00'}, hidden: true},
			{ id: 'Higekuro\'s Wife', position: { x: 655, y: 400 }, data: { label: 'Higekuro\'s Wife' }, draggable: true, style: {border: '2px solid #00542b'}, hidden: true},
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
			{ id: 'Nokiba no Ogi', position: { x: -836, y: 558 }, data: { label: 'Nokiba no Ogi' }, draggable: true, style: {border: '2px solid #e675de'}, hidden: true},
			{ id: 'Kokiden Consort 2', position: { x: 505, y: 370 }, data: { label: 'Kokiden Consort 2' }, draggable: true, style: {border: '2px solid #0ee39f'}, hidden: true},
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
			{ id: 'Kiritsubo Emperor + Kokiden Consort 1', position: { x: -360, y: 80 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
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
			{ id: 'Emperor Reizei + Kokiden Consort 2', position: { x: 187, y: 433 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top', hidden: true},
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
			{ id: 'Previous Emperor - Kiritsubo Emperor', source: 'Previous Emperor', target: 'Kiritsubo Emperor', style:{ stroke: '#2c3e78', strokeWidth: '2'}, data:{type: 'smoothstep', label: 'son', }, hidden: true, type: 'custom'},
			{ id: 'Previous Emperor - Princess Omiya', source: 'Previous Emperor', target: 'Princess Omiya',  style:{ stroke: '#2c3e78', strokeWidth: '2'}, data:{type: 'smoothstep', label: 'daughter',}, hidden: true, type: 'custom'},
			{ id: 'Kiritsubo Emperor - Princess Omiya', source: 'Kiritsubo Emperor', target: 'Princess Omiya', style:{ stroke: '#782c4b', strokeWidth: '2'}, data:{label: 'full-sister',}, hidden: true, type: 'custom'},
			{ id: 'Kiritsubo Emperor - Momozono Shikubu no Miya', source: 'Kiritsubo Emperor', target: 'Momozono Shikubu no Miya', style:{ stroke: '#782c4b', strokeWidth: '2'}, data:{label: 'half-brother',}, hidden: true, type: 'custom'},
			{ id: 'Kiritsubo Emperor - Zenbō', source: 'Kiritsubo Emperor', target: 'Zenbō', style:{ stroke: '#782c4b', strokeWidth: '2'}, data:{label: 'half-brother', }, hidden: true, type: 'custom'},
			{ id: 'Kiritsubo Emperor - Prince Hotaru', source: 'Kiritsubo Emperor', target: 'Prince Hotaru', style:{ stroke: '#782c4b', strokeWidth: '2'}, data:{type: 'smoothstep',label: 'son',}, hidden: true, type: 'custom'},
			{ id: 'Kiritsubo Emperor - 💍 - 1', source: 'Kiritsubo Emperor', target: 'Kiritsubo Consort + Kiritsubo Emperor', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Consort - 💍', source: 'Kiritsubo Consort', target: 'Kiritsubo Consort + Kiritsubo Emperor', style:{ stroke: '#1e5e3b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Consort - Azechi', source: 'Azechi', target: 'Kiritsubo Consort', style:{ stroke: '#7d6227', strokeWidth: '2'}, data:{type: 'smoothstep', label: 'daughter',}, hidden: true, type: 'custom'},
			{ id: 'Fujitsubo - 💍', source: 'Fujitsubo', target: 'Kiritsubo Emperor + Fujitsubo', style:{ stroke: '#c47a2f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kiritsubo Emperor - 💍 - 2', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Fujitsubo', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Genji', source: 'Kiritsubo Consort + Kiritsubo Emperor', target: 'Genji', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - Yoshikiyo', source: 'Genji', target: 'Yoshikiyo', style:{ stroke: '#e0dd22', strokeWidth: '2'}, data:{label: 'retainer',}, hidden: true, type: 'custom'},
			{ id: 'Lady Rokujō - Aoi', source: 'Lady Rokujō', target: 'Aoi', style:{ stroke: '#fc1717', strokeWidth: '2'}, data:{label: '💀', }, hidden: true, type: 'custom'},
			{ id: 'Prince Hyōbu - Fujitsubo', source: 'Fujitsubo', target: 'Prince Hyōbu', style:{ stroke: '#c47a2f', strokeWidth: '2'}, data:{label: 'full-brother', }, hidden: true, type: 'custom'},
			{ id: 'Murasaki no Ue - 💍', source: 'Murasaki no Ue', target: 'Genji + Murasaki no Ue', style:{ stroke: '#c603fc', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - 💍 - 1', source: 'Genji', target: 'Genji + Murasaki no Ue', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Akashi Princess (adopted)', source: 'Genji + Murasaki no Ue', target: 'Akashi Princess', style:{ stroke: '#c603fc', strokeWidth: '2'}, data:{label: 'adopted daughter',}, hidden: true, type: 'custom'},
			{ id: 'Genji - Tamakazura', source: 'Genji', target: 'Tamakazura', style:{ stroke: '#e0dd22', strokeWidth: '2'}, data:{label: 'adopted daughter',}, hidden: true, type: 'custom'},
			{ id: 'Fujitsubo - ❤️', source: 'Fujitsubo', target: 'Genji + Fujitsubo', style:{ stroke: '#c47a2f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️ - 1', source: 'Genji', target: 'Genji + Fujitsubo', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '❤️ -> Emperor Reizei', source: 'Genji + Fujitsubo', target: 'Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Kiritsubo Emperor - The Eighth Prince', source: 'Kiritsubo Emperor', target: 'The Eighth Prince', style:{ stroke: '#782c4b', strokeWidth: '2'},data:{type: 'smoothstep', label: 'son',}, hidden: true, type: 'custom'},
			{ id: 'Kiritsubo Emperor - Emperor Reizei', source: 'Kiritsubo Emperor', target: 'Emperor Reizei', style:{ stroke: '#782c4b', strokeWidth: '2'}, data:{label: 'ostensible child', type: 'straight'}, hidden: true, type: 'custom'},
			{ id: 'A Minister - Novitate', source: 'A Minister', target: 'Novitate', style:{ stroke: '#445a69', strokeWidth: '2'}, data:{label: 'son',type: 'smoothstep',}, hidden: true, type: 'custom'},
			{ id: 'Novitate - 💍', source: 'Novitate', target: 'Novitate + Akashi Nun', style:{ stroke: '#918d56', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Akashi Nun - 💍', source: 'Akashi Nun', target: 'Novitate + Akashi Nun', style:{ stroke: '#4e6158', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> The Akashi Lady', source: 'Novitate + Akashi Nun', target: 'The Akashi Lady', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'A Minister - Azechi', source: 'A Minister', target: 'Azechi',  style:{ stroke: '#445a69', strokeWidth: '2'}, data:{label: 'half-brother',}, hidden: true, type: 'custom'},
			{ id: 'Genji - 💍 - 2', source: 'Genji', target: 'Genji + The Akashi Lady', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Akashi Lady - 💍', source: 'The Akashi Lady', target: 'Genji + The Akashi Lady', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Princess Omiya - 💍', source: 'Princess Omiya', target: 'Princess Omiya + Minister of the Left', style:{ stroke: '#91ab80', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Minister of the Left - 💍', source: 'Minister of the Left', target: 'Princess Omiya + Minister of the Left', style:{ stroke: '#745b85', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Aoi', source: 'Princess Omiya + Minister of the Left', target: 'Aoi', style:{ stroke: '#00c8fa', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - 💍 - 3', source: 'Genji', target: 'Genji + Aoi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Aoi - 💍', source: 'Aoi', target: 'Genji + Aoi', style:{ stroke: '#00c8fa', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️ - 2', source: 'Genji', target: 'Genji + Gen no Naishi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Gen no Naishi - ❤️', source: 'Gen no Naishi', target: 'Genji + Gen no Naishi', style:{ stroke: '#8d9181', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Yūgiri', source: 'Genji + Aoi', target: 'Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: '💍 -> Akashi Princess', source: 'Genji + The Akashi Lady', target: 'Akashi Princess', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Kiritsubo Emperor - 💍 - 3', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Kokiden Consort 1', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kokiden Consort 1 - 💍', source: 'Kokiden Consort 1', target: 'Kiritsubo Emperor + Kokiden Consort 1', style:{ stroke: '#db537c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Emperor Suzaku', source: 'Kiritsubo Emperor + Kokiden Consort 1', target: 'Emperor Suzaku', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - 💔 - 1', source: 'Genji', target: 'Genji + Lady Rokujō', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Lady Rokujō - 💔', source: 'Lady Rokujō', target: 'Genji + Lady Rokujō', style:{ stroke: '#fc1717', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Tō no Chūjō', source: 'Princess Omiya + Minister of the Left', target: 'Tō no Chūjō', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - ❤️ - 3', source: 'Genji', target: 'Genji + Yūgao', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgao - ❤️', source: 'Yūgao', target: 'Genji + Yūgao', style:{ stroke: '#f56ee5', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgao - 💍', source: 'Yūgao', target: 'Tō no Chūjō + Yūgao', style:{ stroke: '#f56ee5', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tō no Chūjō - 💍 - 1', source: 'Tō no Chūjō', target: 'Tō no Chūjō + Yūgao', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Tamakazura', source: 'Tō no Chūjō + Yūgao', target: 'Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Minister of the Right - Kokiden Consort 1', source: 'Minister of the Right', target: 'Kokiden Consort 1', style:{ stroke: '#40e3a7', strokeWidth: '2'}, data:{type: 'smoothstep',label: 'daughter',},  hidden: true, type: 'custom'},
			{ id: 'Minister of the Right - The Fourth Princess', source: 'Minister of the Right', target: 'The Fourth Princess', style:{ stroke: '#40e3a7', strokeWidth: '2'},data:{type: 'smoothstep',label: 'daughter',},  hidden: true, type: 'custom'},
			{ id: 'Minister of the Right - Oborozukiyo', source: 'Minister of the Right', target: 'Oborozukiyo', style:{ stroke: '#40e3a7', strokeWidth: '2'},data:{type: 'smoothstep',label: 'daughter',}, hidden: true, type: 'custom'},
			{ id: '💍 -> Murasaki no Ue', source: 'Prince Hyōbu + Murasaki\'s Mother', target: 'Murasaki no Ue', style:{ stroke: '#c603fc', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Prince Hyōbu - 💍', source: 'Prince Hyōbu', target: 'Prince Hyōbu + Murasaki\'s Mother', style:{ stroke: '#5f9945', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Murasaki\'s Mother - 💍', source: 'Murasaki\'s Mother', target: 'Prince Hyōbu + Murasaki\'s Mother', style:{ stroke: '#92ba61', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kitayama no Amagimi - Murasaki\'s Mother', source: 'Kitayama no Amagimi', target: 'Murasaki\'s Mother', style:{ stroke: '#c2af91', strokeWidth: '2'}, data:{label: 'daughter',}, hidden: true, type: 'custom'},
			{ id: 'Oborozukiyo - 💍', source: 'Oborozukiyo', target: 'Emperor Suzaku + Oborozukiyo', style:{ stroke: '#b5d468', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Suzaku - 💍 - 1', source: 'Emperor Suzaku', target: 'Emperor Suzaku + Oborozukiyo', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Oborozukiyo - ❤️', source: 'Oborozukiyo', target: 'Genji + Oborozukiyo', style:{ stroke: '#b5d468', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️ - 4', source: 'Genji', target: 'Genji + Oborozukiyo', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Lady of Jokyoden Palace - 💍', source: 'The Lady of Jokyoden Palace', target: 'Emperor Suzaku + The Lady of Jokyoden Palace', style:{ stroke: '#1f4f28', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Suzaku - 💍 - 2', source: 'Emperor Suzaku', target: 'Emperor Suzaku + The Lady of Jokyoden Palace', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Lady of Jokyoden Palace - Higekuro', source: 'The Lady of Jokyoden Palace', target: 'Higekuro', style:{ stroke: '#1f4f28', strokeWidth: '2'}, data:{label: 'full-brother',}, hidden: true, type: 'custom'},
			{ id: 'Prince Hyōbu - Higekuro\'s Wife', source: 'Prince Hyōbu', target: 'Higekuro\'s Wife', style:{ stroke: '#5f9945', strokeWidth: '2'}, data:{label: 'daughter',}, type: 'smoothstep', hidden: true, type: 'custom'},
			{ id: 'Yūgao - Ukon', source: 'Yūgao', target: 'Ukon', style:{ stroke: '#496b62', strokeWidth: '2'},  type: 'smoothstep', data:{label: 'servant',}, hidden: true, type: 'custom'},
			{ id: 'Lady Rokujō - 💍', source: 'Lady Rokujō', target: 'Zenbō + Lady Rokujō', style:{ stroke: '#fc1717', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Zenbō - 💍', source: 'Zenbō', target: 'Zenbō + Lady Rokujō', style:{ stroke: '#82708c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tō no Chūjō - 💍 - 2', source: 'Tō no Chūjō', target: 'Tō no Chūjō + The Fourth Princess', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Fourth Princess - 💍', source: 'The Fourth Princess', target: 'Tō no Chūjō + The Fourth Princess', style:{ stroke: '#c2de6d', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tō no Chūjō - 💍 - 3', source: 'Tō no Chūjō', target: 'Tō no Chūjō + Kumoi no Kari\'s Mother', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kumoi no Kari\'s Mother - 💍', source: 'Kumoi no Kari\'s Mother', target: 'Tō no Chūjō + Kumoi no Kari\'s Mother', style:{ stroke: '#756f56', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Kumoi no Kari', source: 'Tō no Chūjō + Kumoi no Kari\'s Mother', target: 'Kumoi no Kari', style:{ stroke: '#4da392', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: '💍 -> Akikonomu', source: 'Zenbō + Lady Rokujō', target: 'Akikonomu', style:{ stroke: '#2e3cbf', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Akikonomu - 💍', source: 'Akikonomu', target: 'Akikonomu + Emperor Reizei', style:{ stroke: '#2e3cbf', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Reizei - 💍 - 1', source: 'Emperor Reizei', target: 'Akikonomu + Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Koremitsu - Genji', source: 'Koremitsu', target: 'Genji',  style:{ stroke: '#8002ad', strokeWidth: '2'},data:{label: 'servant',},  hidden: true, type: 'custom'},
			{ id: 'Emperor Suzaku - The Third Princess', source: 'Emperor Suzaku', target: 'The Third Princess',  style:{ stroke: '#d98e04', strokeWidth: '2'}, data:{type: 'smoothstep',label: 'daughter',}, hidden: true, type: 'custom'},
			{ id: '💍 -> Kashiwagi', source: 'Tō no Chūjō + The Fourth Princess', target: 'Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'The Third Princess - ❤️', source: 'The Third Princess', target: 'The Third Princess + Kashiwagi', style:{ stroke: '#ff4f9e', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kashiwagi - ❤️', source: 'Kashiwagi', target: 'The Third Princess + Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Suzaku - The Eighth Prince', source: 'Emperor Suzaku', target: 'The Eighth Prince', style:{ stroke: '#d98e04', strokeWidth: '2'}, data:{label: 'half-brother',}, hidden: true, type: 'custom'},
			{ id: 'Genji - 💍 - 4', source: 'Genji', target: 'Genji + Suetsumuhana', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Suetsumuhana - 💍', source: 'Suetsumuhana', target: 'Genji + Suetsumuhana', style:{ stroke: '#d1884f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Prince Hitachi - Suetsumuhana', source: 'Prince Hitachi', target: 'Suetsumuhana', style:{ stroke: '#879c62', strokeWidth: '2'}, data:{label: 'daughter',type: 'smoothstep',}, hidden: true, type: 'custom'},
			{ id: 'Reikeiden Consort - The Lady of the Falling Flowers', source: 'Reikeiden Consort', target: 'The Lady of the Falling Flowers', data:{label: 'younger sister',}, style:{ stroke: '#95dadb', strokeWidth: '2'}, hidden: true, type: 'custom'},
			{ id: 'Kiritsubo Emperor - 💍 - 4', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Reikeiden Consort', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Reikeiden Consort - 💍', source: 'Reikeiden Consort', target: 'Kiritsubo Emperor + Reikeiden Consort', style:{ stroke: '#95dadb', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Lady of the Falling Flowers - 💍', source: 'The Lady of the Falling Flowers', target: 'Genji + The Lady of the Falling Flowers', style:{ stroke: '#4b65db', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - 💍 - 5', source: 'Genji', target: 'Genji + The Lady of the Falling Flowers', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - 💍 - 6', source: 'Genji', target: 'Genji + The Third Princess', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Third Princess - 💍', source: 'The Third Princess', target: 'Genji + The Third Princess', style:{ stroke: '#ff4f9e', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Reizei - 💍 - 2', source: 'Emperor Reizei', target: 'Akashi Princess + Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Akashi Princess - 💍 - 1', source: 'Akashi Princess', target: 'Akashi Princess + Emperor Reizei', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️ - 5', source: 'Genji', target: 'Genji + Kogimi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kogimi - ❤️', source: 'Kogimi', target: 'Genji + Kogimi', style:{ stroke: '#5abaed', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - ❤️ - 6', source: 'Genji', target: 'Genji + Utsusemi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Utsusemi - ❤️', source: 'Utsusemi', target: 'Genji + Utsusemi', style:{ stroke: '#b56804', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kogimi - Utsusemi', source: 'Kogimi', target: 'Utsusemi',style:{ stroke: '#5abaed', strokeWidth: '2'}, data:{label: 'older sister', }, hidden: true, type: 'custom'},
			{ id: 'Iyo no Suke - 💍', source: 'Iyo no Suke', target: 'Iyo no Suke + Utsusemi', style:{ stroke: '#005c0b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Utsusemi - 💍', source: 'Utsusemi', target: 'Iyo no Suke + Utsusemi', style:{ stroke: '#b56804', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Iyo no Suke - Ki no Kami', source: 'Iyo no Suke', target: 'Ki no Kami',  style:{ stroke: '#005c0b', strokeWidth: '2'}, data:{label: 'son',type: 'smoothstep',}, hidden: true,type: 'custom'},
			{ id: 'Iyo no Suke - Nokiba no Ogi', source: 'Iyo no Suke', target: 'Nokiba no Ogi', style:{ stroke: '#005c0b', strokeWidth: '2'}, data:{type: 'smoothstep',label: 'daughter',}, hidden: true,type: 'custom'},
			{ id: 'Nokiba no Ogi - Ki no Kami', source: 'Nokiba no Ogi', target: 'Ki no Kami',  style:{ stroke: '#e675de', strokeWidth: '2'}, data:{label: 'older brother',}, hidden: true,type: 'custom'},
			{ id: 'Emperor Reizei - 💍 - 3', source: 'Emperor Reizei', target: 'Emperor Reizei + Kokiden Consort 2', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kokiden Consort 2 - 💍', source: 'Kokiden Consort 2', target: 'Emperor Reizei + Kokiden Consort 2', style:{ stroke: '#0ee39f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Kokiden Consort 2', source: 'Tō no Chūjō + The Fourth Princess', target: 'Kokiden Consort 2', style:{ stroke: '#0ee39f', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Genji - Akikonomu', source: 'Genji', target: 'Akikonomu',  style:{ stroke: '#e0dd22', strokeWidth: '2'}, data:{label: 'adopted daughter',}, hidden: true,type: 'custom'},
			{ id: 'Momozono Shikubu no Miya - Asagao', source: 'Momozono Shikubu no Miya', target: 'Asagao', style:{ stroke: '#8f9945', strokeWidth: '2'}, data:{label: 'daughter',type: 'smoothstep',}, hidden: true,type: 'custom'},
			{ id: 'Genji - 💔 - 2', source: 'Genji', target: 'Genji + Asagao', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Asagao - 💔', source: 'Asagao', target: 'Genji + Asagao', style:{ stroke: '#c0ff99', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - Genji\'s Horse', source: 'Genji', target: 'Genji\'s Horse',  style:{ stroke: '#e0dd22', strokeWidth: '2'}, data:{label: 'pet',}, hidden: true,type: 'custom'},
			{ id: 'The Third Princess - Cat', source: 'The Third Princess', target: 'Cat', style:{ stroke: '#ff4f9e', strokeWidth: '2'}, data:{label: 'pet',}, hidden: true,type: 'custom'},
			{ id: 'Genji - ❤️ - 7', source: 'Genji', target: 'Genji + Gosechi Dancer', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Gosechi Dancer - ❤️', source: 'Gosechi Dancer', target: 'Genji + Gosechi Dancer', style:{ stroke: '#309ae6', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Genji - Prince Hotaru', source: 'Genji', target: 'Prince Hotaru', style:{ stroke: '#e0dd22', strokeWidth: '2'}, data:{label: 'half-brother', }, hidden: true,type: 'custom'},
			{ id: 'Higekuro - 💍 - 1', source: 'Higekuro', target: 'Higekuro + Higekuro\'s Wife', style:{ stroke: '#543a00', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Higekuro\'s Wife - 💍', source: 'Higekuro\'s Wife', target: 'Higekuro + Higekuro\'s Wife', style:{ stroke: '#00542b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Makibashira', source: 'Higekuro + Higekuro\'s Wife', target: 'Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Tamakazura - 💔', source: 'Tamakazura', target: 'Prince Hotaru + Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Prince Hotaru - 💔', source: 'Prince Hotaru', target: 'Prince Hotaru + Tamakazura', style:{ stroke: '#c2e37b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Prince Hotaru - 💍', source: 'Prince Hotaru', target: 'Prince Hotaru + Makibashira', style:{ stroke: '#c2e37b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Makibashira - 💍', source: 'Makibashira', target: 'Prince Hotaru + Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tō no Chūjō - Ōmi Lady', source: 'Tō no Chūjō', target: 'Ōmi Lady', style:{ stroke: '#5300c7', strokeWidth: '2'}, data:{type: 'smoothstep',label: 'lost daughter',},  hidden: true,type: 'custom'},
			{ id: '💍 -> Kobai', source: 'Tō no Chūjō + The Fourth Princess', target: 'Kobai', style:{ stroke: '#c76554', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Makibashira - 💍', source: 'Makibashira', target: 'Kobai + Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kobai - 💍', source: 'Kobai', target: 'Kobai + Makibashira', style:{ stroke: '#c76554', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Suzaku - The Second Princess', source: 'Emperor Suzaku', target: 'The Second Princess',  style:{ stroke: '#d98e04', strokeWidth: '2'}, data:{type: 'smoothstep',label: 'daughter',}, hidden: true,type: 'custom'},
			{ id: 'The Second Princess- 💍 - 1', source: 'The Second Princess', target: 'The Second Princess + Kashiwagi', style:{ stroke: '#8c4c7b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kashiwagi- 💍', source: 'Kashiwagi', target: 'The Second Princess + Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Second Princess- 💍 0 2', source: 'The Second Princess', target: 'The Second Princess + Yūgiri', style:{ stroke: '#8c4c7b', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgiri- 💍 - 1', source: 'Yūgiri', target: 'The Second Princess + Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Kumoi no Kari- 💍', source: 'Kumoi no Kari', target: 'Kumoi no Kari + Yūgiri', style:{ stroke: '#4da392', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgiri- 💍 - 2', source: 'Yūgiri', target: 'Kumoi no Kari + Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Emperor Kinjo', source: 'Emperor Suzaku + The Lady of Jokyoden Palace', target: 'Emperor Kinjo', style:{ stroke: '#0fff0f', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Akashi Princess - 💍 - 2', source: 'Akashi Princess', target: 'Emperor Kinjo + Akashi Princess', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Emperor Kinjo - 💍', source: 'Emperor Kinjo', target: 'Emperor Kinjo + Akashi Princess', style:{ stroke: '#0fff0f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Koremitsu - The Maiden of the Dance', source: 'Koremitsu', target: 'The Maiden of the Dance',  style:{ stroke: '#8002ad', strokeWidth: '2'},data:{type: 'smoothstep',label: 'daughter',}, hidden: true,type: 'custom'},
			{ id: '❤️ -> Kaoru', source: 'The Third Princess + Kashiwagi', target: 'Kaoru', style:{ stroke: '#3273a8', strokeWidth: '2'}, type: 'straight', hidden: true},
			{ id: '❤️ -> Kaoru', source: 'Genji + The Third Princess', target: 'Kaoru', style:{ stroke: '#e0dd22', strokeWidth: '2'}, data:{label: 'ostensible child', type: 'straight',}, hidden: true,type: 'custom'},
			{ id: 'Eighth Prince\'s Wife - 💍', source: 'Eighth Prince\'s Wife', target: 'The Eighth Prince + Eighth Prince\'s Wife', style:{ stroke: '#7a9c5c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'The Eighth Prince - 💍 - 1', source: 'The Eighth Prince', target: 'The Eighth Prince + Eighth Prince\'s Wife', style:{ stroke: '#54e8c0', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Agemaki', source: 'The Eighth Prince + Eighth Prince\'s Wife', target: 'Agemaki', style:{ stroke: '#5c9c71', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: '💍 -> Kozeri', source: 'The Eighth Prince + Eighth Prince\'s Wife', target: 'Kozeri', style:{ stroke: '#ba59a2', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Kozeri - Ukifune', source: 'Kozeri', target: 'Ukifune',  style:{ stroke: '#ba59a2', strokeWidth: '2'}, data:{label: 'half-sister',}, hidden: true, type: 'custom'},
			{ id: '💍 -> Niou', source: 'Emperor Kinjo + Akashi Princess', target: 'Niou', style:{ stroke: '#186328', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Kaoru - 💔', source: 'Kaoru', target: 'Kaoru + Ukifune', style:{ stroke: '#3273a8', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'Ukifune - 💔 - 1', source: 'Ukifune', target: 'Kaoru + Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Niou - 💔', source: 'Niou', target: 'Niou + Ukifune', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'Ukifune - 💔 - 2', source: 'Ukifune', target: 'Niou + Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Niou - 💍 - 1', source: 'Niou', target: 'Niou + Kozeri', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'Kozeri - 💍', source: 'Kozeri', target: 'Niou + Kozeri', style:{ stroke: '#ba59a2', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yūgiri - 💍 - 3', source: 'Yūgiri', target: 'Yūgiri + The Maiden of the Dance', style:{ stroke: '#578fff', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'The Maiden of the Dance - 💍', source: 'The Maiden of the Dance', target: 'Yūgiri + The Maiden of the Dance', style:{ stroke: '#fc8114', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: '💍 -> The Sixth Princess', source: 'Yūgiri + The Maiden of the Dance', target: 'The Sixth Princess', style:{ stroke: '#b85876', strokeWidth: '2'},type: 'straight', hidden: true},
			{ id: 'Niou - 💍 - 2', source: 'Niou', target: 'Niou + The Sixth Princess', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'The Sixth Princess - 💍', source: 'The Sixth Princess', target: 'Niou + The Sixth Princess', style:{ stroke: '#b85876', strokeWidth: '2'}, type: 'smoothstep', hidden: true},
			{ id: 'Higekuro - 💍 - 2', source: 'Higekuro', target: 'Higekuro + Tamakazura', style:{ stroke: '#543a00', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Tamakazura - 💍', source: 'Tamakazura', target: 'Higekuro + Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Nakatsukasa - Murasaki no Ue', source: 'Murasaki no Ue', target: 'Nakatsukasa', style:{ stroke: '#9c79ed', strokeWidth: '2'}, data:{label: 'servant',}, hidden: true,type: 'custom'},
			{ id: 'Fujitsubo - Omyōbu', source: 'Fujitsubo', target: 'Omyōbu', style:{ stroke: '#997112', strokeWidth: '2'}, data:{label: 'servant',}, hidden: true,type: 'custom'},
			{ id: 'The Akashi Lady - 💔', source: 'The Akashi Lady', target: 'The Akashi Lady + Yoshikiyo', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Yoshikiyo - 💔', source: 'Yoshikiyo', target: 'The Akashi Lady + Yoshikiyo', style:{ stroke: '#994a12', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Murasaki no Ue - Shōnagon', source: 'Murasaki no Ue', target: 'Shōnagon', style:{ stroke: '#6ddeba', strokeWidth: '2'}, data:{label: 'wet nurse',}, hidden: true,type: 'custom'},
			{ id: 'Genji - Tō no Chūjō', source: 'Genji', target: 'Tō no Chūjō', style:{ stroke: '#e0dd22', strokeWidth: '2'}, data:{label: '👊',}, hidden: true,type: 'custom'},
			{ id: 'Ukifune - Bishop of Yokawa', source: 'Bishop of Yokawa', target: 'Ukifune', style:{ stroke: '#dbb98a', strokeWidth: '2'}, data:{label: 'saved by',}, hidden: true,type: 'custom'},
			{ id: 'The Eighth Prince - 💍 - 2', source: 'The Eighth Prince', target: 'The Eighth Prince + Chūjō no Kimi', style:{ stroke: '#54e8c0', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: 'Chūjō no Kimi - 💍', source: 'Chūjō no Kimi', target: 'The Eighth Prince + Chūjō no Kimi', style:{ stroke: '#36188f', strokeWidth: '2'},type: 'smoothstep', hidden: true},
			{ id: '💍 -> Ukifune', source: 'The Eighth Prince + Chūjō no Kimi', target: 'Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'straight', hidden: true},
		])

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
		["Previous Emperor", "先皇 （せんてい）"],
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
		["Kokiden Consort 1", "弘徽殿女御【桐壺帝の妃】（こきでんのにょうご）"],
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
		["Kokiden Consort 2", "弘徽殿女御【冷泉帝の妃】（こきでんのにょうご）"],
		["Asagao", "朝顔（あさがお）"],
		["Genji's Horse", "光源氏の馬🐎（ひかるげんじのうま）"],
		["Cat", "猫🐈（ねこ）"],
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
	const showedAll = useRef(false)

	//all relationships of that character  
	const allRel = (num) => {
		var new_nodes = [...nodes]
		var new_edges = [...edges]

		//disable all first after showAll
		if (showedAll.current) {
			for (const ch of new_nodes) {
				ch.hidden = true
			}
			for (const ch of new_edges) {
				ch.hidden = true
			}
			showedAll.current = false
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

		//check and uncheckboxes
		for (let i = 0; i < character_names.length; i++) {
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
		showedAll.current = false
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
						character_names.map(
							function(names, i) {
								return <li><div className="a" id={names[0]+names[1]} style={{margin: '4px'}}>
										<input type="checkbox" id={"ch"+i.toString()} onChange={(e) => enableDisable(i, e.target.checked)} />
										<select onChange={(e) => changeNodeLabelName(i, e.target.value)} style={{fontSize: "large", width: "175px"}} id={"dd" + +i.toString()}>
											<option value={names[0]} selected>{names[0]}</option>
											<option value={names[1].slice(0, names[1].indexOf("（"))}>{names[1]}</option>
										</select>
										<button id={"display_all_rels_"+i.toString()} style={{borderRadius: "95%", margin: '4px', background: '#bdbdbd'}} title={"display all relationships for " + names[0]} onClick={() => {allRel(i)}}>📌</button>
									</div></li>
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

