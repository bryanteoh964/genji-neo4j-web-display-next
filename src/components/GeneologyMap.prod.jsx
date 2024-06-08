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
import { Button } from 'antd';

/**
 * @param {Array} l the array of edges
 */
export default function GeneologyMap() {
    //characters
		var characters = [
			{ id: 'Previous Emperor', position: { x: 0, y: -350 }, data: { label: 'Previous Emperor' }, draggable: true, style: {border: '2px solid #2c3e78'}},
			{ id: 'Kiritsubo Emperor', position: { x: -100, y: -25 }, data: { label: 'Kiritsubo Emperor' }, draggable: true, style: {border: '2px solid #782c4b'}},
			{ id: 'Kiritsubo Consort', position: { x: -300, y: 90 }, data: { label: 'Kiritsubo Consort' }, draggable: true, style: {border: '2px solid #1e5e3b'}},
			{ id: 'Azechi', position: { x: -300, y: 0 }, data: { label: 'Azechi' }, draggable: true, style: {border: '2px solid #7d6227'}},
			{ id: 'Princess Omiya', position: { x: 175, y: -125 }, data: { label: 'Princess Omiya' }, draggable: true, style: {border: '2px solid #91ab80'}},
			{ id: 'Momozono Shikubu no Miya', position: {x: -215, y: -175 }, data: { label: 'Momozono Shikubu no Miya' }, draggable: true, style: {border: '2px solid #8f9945'}},
			{ id: 'Fujitsubo', position: { x: 62, y: 100 }, data: { label: 'Fujitsubo' }, draggable: true, style: {border: '2px solid #c47a2f'}},
			{ id: 'Genji', position: { x: -213, y: 168 }, data: { label: 'Genji' }, draggable: true, style: {border: '2px solid #e0dd22'}},
			{ id: 'Prince Hyōbu', position: { x: 280, y: 95 }, data: { label: 'Prince Hyōbu' }, draggable: true, style: {border: '2px solid #5f9945'}},
			{ id: 'Murasaki', position: { x: 62, y: 205 }, data: { label: 'Murasaki' }, draggable: true, style: {border: '2px solid #c603fc'}},
			{ id: 'Emperor Reizei', position: { x: -100, y: 320 }, data: { label: 'Emperor Reizei' }, draggable: true, style: {border: '2px solid #fc44ad'}},
			{ id: 'A Minister', position: { x: -530, y: -75 }, data: { label: 'A Minister' }, draggable: true, style: {border: '2px solid #445a69'}},
			{ id: 'Akashi Nun', position: { x: -460, y: 0 }, data: { label: 'Akashi Nun' }, draggable: true, style: {border: '2px solid #4e6158'}},
			{ id: 'Novitate', position: { x: -620, y: 0 }, data: { label: 'Novitate' }, draggable: true, style: {border: '2px solid #918d56'}},
			{ id: 'The Akashi Lady', position: { x: -365, y: 168 }, data: { label: 'The Akashi Lady' }, draggable: true, style: {border: '2px solid #3acc1d'}},
			{ id: 'Minister of the Left', position: { x: 325, y: -125 }, data: { label: 'Minister of the Left' }, draggable: true, style: {border: '2px solid #745b85'}},
			{ id: 'Aoi', position: { x: 230, y: 205 }, data: { label: 'Aoi' }, draggable: true, style: {border: '2px solid #00c8fa'}},
			{ id: 'Yūgiri', position: {x: -130, y: 425 }, data: { label: 'Yūgiri' }, draggable: true, style: {border: '2px solid #578fff'}},
			{ id: 'Akashi Princess', position: { x: -300, y: 290  }, data: { label: 'Akashi Princess' }, draggable: true, style: {border: '2px solid #7cdb53'}},
			{ id: 'Kokiden Consort', position: { x: -630, y: 85 }, data: { label: 'Kokiden Consort' }, draggable: true, style: {border: '2px solid #db537c'}},
			{ id: 'Emperor Suzaku', position: { x: -550, y: 168  }, data: { label: 'Emperor Suzaku' }, draggable: true, style: {border: '2px solid #d98e04'}},
			{ id: 'Zenbō', position: {x: -385, y: -200 }, data: { label: 'Zenbō' }, draggable: true, style: {border: '2px solid #82708c'}},
			{ id: 'Lady Rokujō', position: {x: -647.734, y: -241.997 }, data: { label: 'Lady Rokujō' }, draggable: true, style: {border: '2px solid #fc1717'}},
			{ id: 'Tō no Chūjō', position: { x: 445, y: 95 }, data: { label: 'Tō no Chūjō' }, draggable: true, style: {border: '2px solid #5300c7'}},
			{ id: 'Yūgao', position: { x: 230, y: 300 }, data: { label: 'Yūgao' }, draggable: true, style: {border: '2px solid #f56ee5'}},
			{ id: 'Tamakazura', position: { x: 345, y:  522 }, data: { label: 'Tamakazura' }, draggable: true, style: {border: '2px solid #d64f6c'}},
			{ id: 'Yon no Kimi', position: {x: 625, y: 205 }, data: { label: 'Yon no Kimi' }, draggable: true, style: {border: '2px solid #c2de6d'}},
			{ id: 'Minister of the Right', position: { x: 655, y: -285 }, data: { label: 'Minister of the Right' }, draggable: true, style: {border: '2px solid #40e3a7'}},
			{ id: 'Oborozukiyo', position: { x: -725, y: 168  }, data: { label: 'Oborozukiyo' }, draggable: true, style: {border: '2px solid #b5d468'}},
			{ id: 'Kumoi no Kari\'s Mother', position: { x: 612, y: 95 }, data: { label: 'Kumoi no Kari\'s Mother' }, draggable: true, style: {border: '2px solid #756f56'}},
			{ id: 'Murasaki\'s Mother', position: { x: 400, y: 205 }, data: { label: 'Murasaki\'s Mother' }, draggable: true, style: {border: '2px solid #92ba61'}},
			{ id: 'Kitayama no Amagimi', position: { x: 475, y: -10 }, data: { label: 'Kitayama no Amagimi' }, draggable: true, style: {border: '2px solid #c2af91'}},
			{ id: 'The Lady of Jokyoden Palace', position: { x: -500, y: 290 }, data: { label: 'The Lady of Jokyoden Palace' }, draggable: true, style: {border: '2px solid #1f4f28'}},
			{ id: 'Higekuro', position: { x: 458, y:  465 }, data: { label: 'Higekuro' }, draggable: true, style: {border: '2px solid #543a00'}},
			{ id: 'Higekuro\'s Wife', position: { x: 615, y: 445 }, data: { label: 'Higekuro\'s Wife' }, draggable: true, style: {border: '2px solid #00542b'}},
			{ id: 'Ukon', position: { x: 420, y: 300 }, data: { label: 'Ukon' }, draggable: true, style: {border: '2px solid #496b62'}},
			{ id: 'Kumoi no Kari', position: { x: 33, y: 425 }, data: { label: 'Kumoi no Kari' }, draggable: true, style: {border: '2px solid #4da392'}},
			{ id: 'Akikonomu', position: { x: -570, y: 515  }, data: { label: 'Akikonomu' }, draggable: true, style: {border: '2px solid #2e3cbf'}},
			{ id: 'Koremitsu', position: { x:-482, y: 595  }, data: { label: 'Koremitsu' }, draggable: true, style: {border: '2px solid #8002ad'}},
			{ id: 'The Third Princess', position: { x: -300, y: 610 }, data: { label: 'The Third Princess' }, draggable: true, style: {border: '2px solid #ff4f9e'}},
			{ id: 'Kashiwagi', position: { x: 217, y: 465 }, data: { label: 'Kashiwagi' }, draggable: true, style: {border: '2px solid #b2fc72'}},
			{ id: 'The Eighth Prince', position: { x: -685, y: 570 }, data: { label: 'The Eighth Prince' }, draggable: true, style: {border: '2px solid #54e8c0'}},
			{ id: 'Prince Hitachi', position: { x: -885, y: 75 }, data: { label: 'Prince Hitachi' }, draggable: true, style: {border: '2px solid #879c62'}},
			{ id: 'Suetsumuhana', position: { x: -885, y: 168 }, data: { label: 'Suetsumuhana' }, draggable: true, style: {border: '2px solid #d1884f'}},
			{ id: 'Reikeiden Consort', position: { x: 62, y: 0 }, data: { label: 'Reikeiden Consort' }, draggable: true, style: {border: '2px solid #95dadb'}},
			{ id: 'The Lady of the Falling Flowers', position: { x: 285, y: 0 }, data: { label: 'The Lady of the Falling Flowers' }, draggable: true, style: {border: '2px solid #4b65db'}},
			{ id: 'Kogimi', position: { x: -770, y: 315 }, data: { label: 'Kogimi' }, draggable: true, style: {border: '2px solid #5abaed'}},
			{ id: 'Utsusemi', position: { x: -885, y: 422 }, data: { label: 'Utsusemi' }, draggable: true, style: {border: '2px solid #b56804'}},
			{ id: 'Iyo no Suke', position: { x: -1075, y: 422 }, data: { label: 'Iyo no Suke' }, draggable: true, style: {border: '2px solid #005c0b'}},
			{ id: 'Ki no Kami', position: { x: -1109, y: 608 }, data: { label: 'Ki no Kami' }, draggable: true, style: {border: '2px solid #80231b'}},
			{ id: 'Nokiba no Ogi', position: { x: -865, y: 550 }, data: { label: 'Nokiba no Ogi' }, draggable: true, style: {border: '2px solid #e675de'}},
			{ id: 'Kokiden no Nyōgo', position: { x: 505, y: 370 }, data: { label: 'Kokiden no Nyōgo' }, draggable: true, style: {border: '2px solid #0ee39f'}},
			{ id: 'Asagao', position: { x: -708, y: -96 }, data: { label: 'Asagao' }, draggable: true, style: {border: '2px solid #c0ff99'}},
			{ id: 'Genji\'s Horse', position: { x: -1000, y: 350 }, data: { label: 'Genji\'s Horse' }, draggable: true, style: {border: '2px solid #b4d68b'}},
			{ id: 'Cat', position: { x: -10, y: 685 }, data: { label: 'Cat' }, draggable: true, style: {border: '2px solid #c98a00'}},
			{ id: 'Gosechi Dancer', position: { x: -1000, y: 225 }, data: { label: 'Gosechi Dancer' }, draggable: true, style: {border: '2px solid #309ae6'}},
			{ id: 'Prince Hotaru', position: { x: 886, y: 546 }, data: { label: 'Prince Hotaru' }, draggable: true, style: {border: '2px solid #c2e37b'}},
			{ id: 'Makibashira', position: { x: 587, y: 600 }, data: { label: 'Makibashira' }, draggable: true, style: {border: '2px solid #c57be3'}},
			{ id: 'Omi Lady', position: {x: 972, y: 223 }, data: { label: 'Omi Lady' }, draggable: true, style: {border: '2px solid #ccb285'}},
			{ id: 'Kobai', position: {x: 765, y: 370 }, data: { label: 'Kobai' }, draggable: true, style: {border: '2px solid #c76554'}},
			{ id: 'The Second Princess', position: { x: 5, y: 530 }, data: { label: 'The Second Princess' }, draggable: true, style: {border: '2px solid #8c4c7b'}},
			{ id: 'Emperor Kinjo', position: {x: -500, y: 430 }, data: { label: 'Emperor Kinjo' }, draggable: true, style: {border: '2px solid #0fff0f'}},
			{ id: 'The Maiden of the Dance', position: {x: -210, y: 520 }, data: { label: 'The Maiden of the Dance' }, draggable: true, style: {border: '2px solid #fc8114'}},
			{ id: 'Kaoru', position: {x: -257, y: 835 }, data: { label: 'Kaoru' }, draggable: true, style: {border: '2px solid #3273a8'}},
			{ id: 'The Eighth Prince\'s Wife', position: { x: -850, y: 635 }, data: { label: 'The Eighth Prince\'s Wife' }, draggable: true, style: {border: '2px solid #7a9c5c'}},
			{ id: 'Agemaki', position: { x: -850, y: 800 }, data: { label: 'Agemaki' }, draggable: true, style: {border: '2px solid #5c9c71'}},
			{ id: 'Kozeri', position: { x: -685, y: 835 }, data: { label: 'Kozeri' }, draggable: true, style: {border: '2px solid #ba59a2'}},
			{ id: 'Ukifune', position: { x: -625, y: 740 }, data: { label: 'Ukifune' }, draggable: true, style: {border: '2px solid #ff5f4a'}},
			{ id: 'Niou', position: { x: -390, y: 700 }, data: { label: 'Niou' }, draggable: true, style: {border: '2px solid #186328'}},
			{ id: 'Roku no Kimi', position: { x: -90, y: 760 }, data: { label: 'Roku no Kimi' }, draggable: true, style: {border: '2px solid #b85876'}},
			{ id: 'Nakatsukasa', position: { x: 190, y: 680 }, data: { label: 'Nakatsukasa' }, draggable: true, style: {border: '2px solid #9c79ed'}},
			{ id: 'Omyōbu', position: { x: 277, y: 615 }, data: { label: 'Omyōbu' }, draggable: true, style: {border: '2px solid #997112'}},
			{ id: 'Yoshikiyo', position: { x: -844, y: -5 }, data: { label: 'Yoshikiyo' }, draggable: true, style: {border: '2px solid #994a12'}},
			{ id: 'Shōnagon', position: { x: 77, y: 760 }, data: { label: 'Shōnagon' }, draggable: true, style: {border: '2px solid #6ddeba'}},
			{ id: 'Gen no Naishi', position: { x: -705, y: 445 }, data: { label: 'Gen no Naishinosuke' }, draggable: true, style: {border: '2px solid #8d9181'}},
			{ id: 'Bishop of Yokawa', position: { x: -475, y: 933 }, data: { label: 'Bishop of Yokawa' }, draggable: true, style: {border: '2px solid #dbb98a'}},
			{ id: 'Chūjō no Kimi', position: { x: -575, y: 640 }, data: { label: 'Chūjō no Kimi' }, draggable: true, style: {border: '2px solid #36188f'}},
			{ id: 'Kiritsubo Consort + Kiritsubo Emperor', position: { x: -83, y: 111 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Kiritsubo Emperor + Fujitsubo', position: { x: -25, y: 111 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Murasaki', position: { x: 60, y: 325 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Fujitsubo', position: { x: 0, y: 175 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Novitate + Akashi Nun', position: { x: -390, y: 110 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + The Akashi Lady', position: { x: -282, y: 250 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Princess Omiya + Minister of the Left', position: { x: 425, y: 27 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Aoi', position: { x: 125, y: 305 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Kiritsubo Emperor + Kokiden Consort', position: { x: -360, y: 80 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Lady Rokujō', position: { x: -300, y: -69 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Yūgao', position: { x: 185, y: 313 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Tō no Chūjō + Yūgao', position: { x: 350, y: 375 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Prince Hyōbu + Murasaki\'s Mother', position: { x: 364, y: 190 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Emperor Suzaku + Oborozukiyo', position: { x: -585, y: 250 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Oborozukiyo', position: { x: -355, y: 310 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Emperor Suzaku + The Lady of Jokyoden Palace', position: { x: -480, y: 250 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Zenbō + Lady Rokujō', position: { x: -513, y: -167 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Tō no Chūjō + Kumoi no Kari\'s Mother', position: {x: 550, y: 200 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Tō no Chūjō + Yon no Kimi', position: {x: 580, y: 326 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Akikonomu + Emperor Reizei', position: {x:-265, y: 535 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'The Third Princess + Kashiwagi', position: { x: -80, y: 715 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Suetsumuhana', position: { x: -770, y: 270 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Kiritsubo Emperor + Reikeiden Consort', position: { x: 20, y: 111 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + The Lady of the Falling Flowers', position: { x: 225, y: 70 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + The Third Princess', position: { x: -180, y: 695}, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Akashi Princess + Emperor Reizei', position: {x:-190, y: 475 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Kogimi', position: { x: -665, y: 395 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Utsusemi', position: { x: -750, y: 485 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Iyo no Suke + Utsusemi', position: { x: -940, y: 520 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Emperor Reizei + Kokiden no Nyōgo', position: { x: 187, y: 433 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Asagao', position: { x: -700, y: 115 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Gosechi Dancer', position: { x: -840, y: 297 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Higekuro + Higekuro\'s Wife', position: { x: 590, y: 540 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Prince Hotaru + Tamakazura', position: { x: 788, y: 595 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Prince Hotaru + Makibashira', position: { x: 800, y: 675 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Kobai + Makibashira', position: { x: 775, y: 525 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'The Second Princess + Kashiwagi', position: { x: 177, y: 635 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'The Second Princess + Yūgiri', position: { x: -50, y: 635 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Kumoi no Kari + Yūgiri', position: { x: -50, y: 500 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Emperor Kinjo + Akashi Princess', position: {x:-340, y: 535 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'The Eighth Prince + The Eighth Prince\'s Wife', position: {x:-720, y: 750 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Niou + Ukifune', position: { x: -420, y: 800 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Kaoru + Ukifune', position: { x: -385, y: 870 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Niou + Kozeri', position: { x: -550, y: 930 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Yūgiri + The Maiden of the Dance', position: {x:-110, y: 620 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Niou + Roku no Kimi', position: { x: -255, y: 770 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Higekuro + Tamakazura', position: {x: 475, y: 645 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'The Akashi Lady + Yoshikiyo', position: { x: -745, y: 70 }, data: { label: '💔' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'Genji + Gen no Naishi', position: { x: -695, y: 545 }, data: { label: '❤️' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
			{ id: 'The Eighth Prince + Chūjō no Kimi', position: {x: -615, y: 685 }, data: { label: '💍' }, draggable: true, style: { height: 50, width: 50, border: 50, borderRadius: 50, marginLeft:0, background: 'transparent'}, sourcePosition: 'top'},
		]

		//relationships 
		var relationships = [
			{ id: 'Previous Emperor - Kiritsubo Emperor', source: 'Previous Emperor', target: 'Kiritsubo Emperor', label: 'son', style:{ stroke: '#2c3e78', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Previous Emperor - Princess Omiya', source: 'Previous Emperor', target: 'Princess Omiya', label: 'daughter', style:{ stroke: '#2c3e78', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kiritsubo Emperor - Princess Omiya', source: 'Kiritsubo Emperor', target: 'Princess Omiya', label: 'full-sister', style:{ stroke: '#782c4b', strokeWidth: '2'}},
			{ id: 'Kiritsubo Emperor - Momozono Shikubu no Miya', source: 'Kiritsubo Emperor', target: 'Momozono Shikubu no Miya', label: 'half-brother', style:{ stroke: '#782c4b', strokeWidth: '2'}},
			{ id: 'Kiritsubo Emperor - Zenbō', source: 'Kiritsubo Emperor', target: 'Zenbō', label: 'half-brother', style:{ stroke: '#782c4b', strokeWidth: '2'}},
			{ id: 'Kiritsubo Emperor - Prince Hotaru', source: 'Kiritsubo Emperor', target: 'Prince Hotaru', label: 'son', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kiritsubo Emperor - 💍', source: 'Kiritsubo Emperor', target: 'Kiritsubo Consort + Kiritsubo Emperor', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kiritsubo Consort - 💍', source: 'Kiritsubo Consort', target: 'Kiritsubo Consort + Kiritsubo Emperor', style:{ stroke: '#1e5e3b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kiritsubo Consort - Azechi', source: 'Azechi', target: 'Kiritsubo Consort', label: 'daughter', style:{ stroke: '#7d6227', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Fujitsubo - 💍', source: 'Fujitsubo', target: 'Kiritsubo Emperor + Fujitsubo', style:{ stroke: '#c47a2f', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kiritsubo Emperor - 💍', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Fujitsubo', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Genji', source: 'Kiritsubo Consort + Kiritsubo Emperor', target: 'Genji', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'straight'},
			{ id: 'Genji - Yoshikiyo', source: 'Genji', target: 'Yoshikiyo', style:{ stroke: '#e0dd22', strokeWidth: '2'}, label: 'retainer'},
			{ id: 'Genji - Ki no Kami', source: 'Genji', target: 'Ki no Kami', style:{ stroke: '#e0dd22', strokeWidth: '2'}, label: 'retainer'},
			{ id: 'Lady Rokujō - Aoi', source: 'Lady Rokujō', target: 'Aoi', label: '💀', style:{ stroke: '#fc1717', strokeWidth: '2'}},
			{ id: 'Prince Hyōbu - Fujitsubo', source: 'Fujitsubo', target: 'Prince Hyōbu', label: 'full-brother', style:{ stroke: '#c47a2f', strokeWidth: '2'}},
			{ id: 'Murasaki - 💍', source: 'Murasaki', target: 'Genji + Murasaki', style:{ stroke: '#c603fc', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + Murasaki', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Akashi Princess', source: 'Genji + Murasaki', target: 'Akashi Princess', style:{ stroke: '#c603fc', strokeWidth: '2'}, label: 'adopted daughter'},
			{ id: 'Genji - Tamakazura', source: 'Genji', target: 'Tamakazura', label: 'adopted daughter', style:{ stroke: '#e0dd22', strokeWidth: '2'}},
			{ id: 'Fujitsubo - ❤️', source: 'Fujitsubo', target: 'Genji + Fujitsubo', style:{ stroke: '#c47a2f', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Fujitsubo', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '❤️ -> Emperor Reizei', source: 'Genji + Fujitsubo', target: 'Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'straight'},
			{ id: 'Kiritsubo Emperor - The Eighth Prince', source: 'Kiritsubo Emperor', target: 'The Eighth Prince', label: 'son', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kiritsubo Emperor - Emperor Reizei', source: 'Kiritsubo Emperor', target: 'Emperor Reizei', style:{ stroke: '#782c4b', strokeWidth: '2'}, label: 'ostensible child', type: 'straight'},
			{ id: 'A Minister - Novitate', source: 'A Minister', target: 'Novitate', style:{ stroke: '#445a69', strokeWidth: '2'}, label: 'son',type: 'smoothstep'},
			{ id: 'Novitate - 💍', source: 'Novitate', target: 'Novitate + Akashi Nun', style:{ stroke: '#918d56', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Akashi Nun - 💍', source: 'Akashi Nun', target: 'Novitate + Akashi Nun', style:{ stroke: '#4e6158', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> The Akashi Lady', source: 'Novitate + Akashi Nun', target: 'The Akashi Lady', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'straight'},
			{ id: 'A Minister - Azechi', source: 'A Minister', target: 'Azechi', label: 'brother', style:{ stroke: '#445a69', strokeWidth: '2'}},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + The Akashi Lady', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'The Akashi Lady - 💍', source: 'The Akashi Lady', target: 'Genji + The Akashi Lady', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Princess Omiya - 💍', source: 'Princess Omiya', target: 'Princess Omiya + Minister of the Left', style:{ stroke: '#91ab80', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Minister of the Left - 💍', source: 'Minister of the Left', target: 'Princess Omiya + Minister of the Left', style:{ stroke: '#745b85', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Aoi', source: 'Princess Omiya + Minister of the Left', target: 'Aoi', style:{ stroke: '#00c8fa', strokeWidth: '2'},type: 'straight'},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + Aoi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Aoi - 💍', source: 'Aoi', target: 'Genji + Aoi', style:{ stroke: '#00c8fa', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Gen no Naishi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Gen no Naishi - ❤️', source: 'Gen no Naishi', target: 'Genji + Gen no Naishi', style:{ stroke: '#8d9181', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Yūgiri', source: 'Genji + Aoi', target: 'Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'straight'},
			{ id: '💍 -> Akashi Princess', source: 'Genji + The Akashi Lady', target: 'Akashi Princess', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'straight'},
			{ id: 'Kiritsubo Emperor - 💍', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Kokiden Consort', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kokiden Consort - 💍', source: 'Kokiden Consort', target: 'Kiritsubo Emperor + Kokiden Consort', style:{ stroke: '#db537c', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Emperor Suzaku', source: 'Kiritsubo Emperor + Kokiden Consort', target: 'Emperor Suzaku', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'straight'},
			{ id: 'Genji - 💔', source: 'Genji', target: 'Genji + Lady Rokujō', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Lady Rokujō - 💔', source: 'Lady Rokujō', target: 'Genji + Lady Rokujō', style:{ stroke: '#fc1717', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Tō no Chūjō', source: 'Princess Omiya + Minister of the Left', target: 'Tō no Chūjō', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'straight'},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Yūgao', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Yūgao - ❤️', source: 'Yūgao', target: 'Genji + Yūgao', style:{ stroke: '#f56ee5', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Yūgao - 💍', source: 'Yūgao', target: 'Tō no Chūjō + Yūgao', style:{ stroke: '#f56ee5', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Tō no Chūjō - 💍', source: 'Tō no Chūjō', target: 'Tō no Chūjō + Yūgao', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Tamakazura', source: 'Tō no Chūjō + Yūgao', target: 'Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'straight'},
			{ id: 'Minister of the Right - Kokiden Consort', source: 'Minister of the Right', target: 'Kokiden Consort', label: 'daughter', style:{ stroke: '#40e3a7', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Minister of the Right - Yon no Kimi', source: 'Minister of the Right', target: 'Yon no Kimi', label: 'daughter', style:{ stroke: '#40e3a7', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Minister of the Right - Oborozukiyo', source: 'Minister of the Right', target: 'Oborozukiyo', label: 'daughter', style:{ stroke: '#40e3a7', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Murasaki', source: 'Prince Hyōbu + Murasaki\'s Mother', target: 'Murasaki', style:{ stroke: '#c603fc', strokeWidth: '2'},type: 'straight'},
			{ id: 'Prince Hyōbu - 💍', source: 'Prince Hyōbu', target: 'Prince Hyōbu + Murasaki\'s Mother', style:{ stroke: '#5f9945', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Murasaki\'s Mother - 💍', source: 'Murasaki\'s Mother', target: 'Prince Hyōbu + Murasaki\'s Mother', style:{ stroke: '#92ba61', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kitayama no Amagimi - Murasaki\'s Mother', source: 'Kitayama no Amagimi', target: 'Murasaki\'s Mother', label: 'daughter', style:{ stroke: '#c2af91', strokeWidth: '2'}},
			{ id: 'Oborozukiyo - 💍', source: 'Oborozukiyo', target: 'Emperor Suzaku + Oborozukiyo', style:{ stroke: '#b5d468', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Emperor Suzaku - 💍', source: 'Emperor Suzaku', target: 'Emperor Suzaku + Oborozukiyo', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Oborozukiyo - ❤️', source: 'Oborozukiyo', target: 'Genji + Oborozukiyo', style:{ stroke: '#b5d468', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Oborozukiyo', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'The Lady of Jokyoden Palace - 💍', source: 'The Lady of Jokyoden Palace', target: 'Emperor Suzaku + The Lady of Jokyoden Palace', style:{ stroke: '#1f4f28', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Emperor Suzaku - 💍', source: 'Emperor Suzaku', target: 'Emperor Suzaku + The Lady of Jokyoden Palace', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'The Lady of Jokyoden Palace - Higekuro', source: 'The Lady of Jokyoden Palace', target: 'Higekuro', style:{ stroke: '#1f4f28', strokeWidth: '2'}, label: 'full-brother'},
			{ id: 'Prince Hyōbu - Higekuro\'s Wife', source: 'Prince Hyōbu', target: 'Higekuro\'s Wife', style:{ stroke: '#5f9945', strokeWidth: '2'}, label: 'daughter',type: 'smoothstep'},
			{ id: 'Ukon - Yūgao', source: 'Ukon', target: 'Yūgao', style:{ stroke: '#496b62', strokeWidth: '2'}, label: 'serves', type: 'smoothstep'},
			{ id: 'Lady Rokujō - 💍', source: 'Lady Rokujō', target: 'Zenbō + Lady Rokujō', style:{ stroke: '#fc1717', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Zenbō - 💍', source: 'Zenbō', target: 'Zenbō + Lady Rokujō', style:{ stroke: '#82708c', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Tō no Chūjō - 💍', source: 'Tō no Chūjō', target: 'Tō no Chūjō + Yon no Kimi', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Yon no Kimi - 💍', source: 'Yon no Kimi', target: 'Tō no Chūjō + Yon no Kimi', style:{ stroke: '#c2de6d', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Tō no Chūjō - 💍', source: 'Tō no Chūjō', target: 'Tō no Chūjō + Kumoi no Kari\'s Mother', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kumoi no Kari\'s Mother - 💍', source: 'Kumoi no Kari\'s Mother', target: 'Tō no Chūjō + Kumoi no Kari\'s Mother', style:{ stroke: '#756f56', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Kumoi no Kari', source: 'Tō no Chūjō + Kumoi no Kari\'s Mother', target: 'Kumoi no Kari', style:{ stroke: '#4da392', strokeWidth: '2'},type: 'straight'},
			{ id: '💍 -> Akikonomu', source: 'Zenbō + Lady Rokujō', target: 'Akikonomu', style:{ stroke: '#2e3cbf', strokeWidth: '2'},type: 'straight'},
			{ id: 'Akikonomu - 💍', source: 'Akikonomu', target: 'Akikonomu + Emperor Reizei', style:{ stroke: '#2e3cbf', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Emperor Reizei - 💍', source: 'Emperor Reizei', target: 'Akikonomu + Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Koremitsu - Genji', source: 'Koremitsu', target: 'Genji', label: 'serves', style:{ stroke: '#8002ad', strokeWidth: '2'}},
			{ id: 'Emperor Suzaku - The Third Princess', source: 'Emperor Suzaku', target: 'The Third Princess', label: 'daughter', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Kashiwagi', source: 'Tō no Chūjō + Yon no Kimi', target: 'Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'straight'},
			{ id: 'The Third Princess - ❤️', source: 'The Third Princess', target: 'The Third Princess + Kashiwagi', style:{ stroke: '#ff4f9e', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kashiwagi - ❤️', source: 'Kashiwagi', target: 'The Third Princess + Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Emperor Suzaku - The Eighth Prince', source: 'Emperor Suzaku', target: 'The Eighth Prince', label: 'half-brother', style:{ stroke: '#d98e04', strokeWidth: '2'}},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + Suetsumuhana', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Suetsumuhana - 💍', source: 'Suetsumuhana', target: 'Genji + Suetsumuhana', style:{ stroke: '#d1884f', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Prince Hitachi - Suetsumuhana', source: 'Prince Hitachi', target: 'Suetsumuhana', label: 'daughter', style:{ stroke: '#879c62', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Reikeiden Consort - The Lady of the Falling Flowers', source: 'Reikeiden Consort', target: 'The Lady of the Falling Flowers', label: 'younger sister', style:{ stroke: '#95dadb', strokeWidth: '2'}},
			{ id: 'Kiritsubo Emperor - 💍', source: 'Kiritsubo Emperor', target: 'Kiritsubo Emperor + Reikeiden Consort', style:{ stroke: '#782c4b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Reikeiden Consort - 💍', source: 'Reikeiden Consort', target: 'Kiritsubo Emperor + Reikeiden Consort', style:{ stroke: '#95dadb', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'The Lady of the Falling Flowers - 💍', source: 'The Lady of the Falling Flowers', target: 'Genji + The Lady of the Falling Flowers', style:{ stroke: '#4b65db', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + The Lady of the Falling Flowers', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - 💍', source: 'Genji', target: 'Genji + The Third Princess', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'The Third Princess - 💍', source: 'The Third Princess', target: 'Genji + The Third Princess', style:{ stroke: '#ff4f9e', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Emperor Reizei - 💍', source: 'Emperor Reizei', target: 'Akashi Princess + Emperor Reizei', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Akashi Princess - 💍', source: 'Akashi Princess', target: 'Akashi Princess + Emperor Reizei', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Kogimi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kogimi - ❤️', source: 'Kogimi', target: 'Genji + Kogimi', style:{ stroke: '#5abaed', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Utsusemi', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Utsusemi - ❤️', source: 'Utsusemi', target: 'Genji + Utsusemi', style:{ stroke: '#b56804', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kogimi - Utsusemi', source: 'Kogimi', target: 'Utsusemi', label: 'half-sister', style:{ stroke: '#5abaed', strokeWidth: '2'}},
			{ id: 'Iyo no Suke - 💍', source: 'Iyo no Suke', target: 'Iyo no Suke + Utsusemi', style:{ stroke: '#005c0b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Utsusemi - 💍', source: 'Utsusemi', target: 'Iyo no Suke + Utsusemi', style:{ stroke: '#b56804', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Iyo no Suke - Ki no Kami', source: 'Iyo no Suke', target: 'Ki no Kami', label: 'son', style:{ stroke: '#005c0b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Utsusemi - Nokiba no Ogi', source: 'Utsusemi', target: 'Nokiba no Ogi', label: 'daughter', style:{ stroke: '#b56804', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Nokiba no Ogi - Ki no Kami', source: 'Nokiba no Ogi', target: 'Ki no Kami', label: 'step-brother', style:{ stroke: '#e675de', strokeWidth: '2'}},
			{ id: 'Emperor Reizei - 💍', source: 'Emperor Reizei', target: 'Emperor Reizei + Kokiden no Nyōgo', style:{ stroke: '#fc44ad', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kokiden no Nyōgo - 💍', source: 'Kokiden no Nyōgo', target: 'Emperor Reizei + Kokiden no Nyōgo', style:{ stroke: '#0ee39f', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Kokiden no Nyōgo', source: 'Tō no Chūjō + Yon no Kimi', target: 'Kokiden no Nyōgo', style:{ stroke: '#0ee39f', strokeWidth: '2'},type: 'straight'},
			{ id: 'Genji - Akikonomu', source: 'Genji', target: 'Akikonomu', label: 'adopted daughter', style:{ stroke: '#e0dd22', strokeWidth: '2'}},
			{ id: 'Momozono Shikubu no Miya - Asagao', source: 'Momozono Shikubu no Miya', target: 'Asagao', label: 'daughter', style:{ stroke: '#8f9945', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - 💔', source: 'Genji', target: 'Genji + Asagao', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Asagao - 💔', source: 'Asagao', target: 'Genji + Asagao', style:{ stroke: '#c0ff99', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - Genji\'s Horse', source: 'Genji', target: 'Genji\'s Horse', label: 'pet', style:{ stroke: '#e0dd22', strokeWidth: '2'}},
			{ id: 'The Third Princess - Cat', source: 'The Third Princess', target: 'Cat', label: 'pet', style:{ stroke: '#ff4f9e', strokeWidth: '2'}},
			{ id: 'Genji - ❤️', source: 'Genji', target: 'Genji + Gosechi Dancer', style:{ stroke: '#e0dd22', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Gosechi Dancer - ❤️', source: 'Gosechi Dancer', target: 'Genji + Gosechi Dancer', style:{ stroke: '#309ae6', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Genji - Prince Hotaru', source: 'Genji', target: 'Prince Hotaru', label: 'half-brother', style:{ stroke: '#e0dd22', strokeWidth: '2'}},
			{ id: 'Higekuro - 💍', source: 'Higekuro', target: 'Higekuro + Higekuro\'s Wife', style:{ stroke: '#543a00', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Higekuro\'s Wife - 💍', source: 'Higekuro\'s Wife', target: 'Higekuro + Higekuro\'s Wife', style:{ stroke: '#00542b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Makibashira', source: 'Higekuro + Higekuro\'s Wife', target: 'Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'straight'},
			{ id: 'Tamakazura - 💔', source: 'Tamakazura', target: 'Prince Hotaru + Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Prince Hotaru - 💔', source: 'Prince Hotaru', target: 'Prince Hotaru + Tamakazura', style:{ stroke: '#c2e37b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Prince Hotaru - 💍', source: 'Prince Hotaru', target: 'Prince Hotaru + Makibashira', style:{ stroke: '#c2e37b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Makibashira - 💍', source: 'Makibashira', target: 'Prince Hotaru + Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Tō no Chūjō - Omi Lady', source: 'Tō no Chūjō', target: 'Omi Lady', label: 'lost daughter', style:{ stroke: '#5300c7', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Kobai', source: 'Tō no Chūjō + Yon no Kimi', target: 'Kobai', style:{ stroke: '#c76554', strokeWidth: '2'},type: 'straight'},
			{ id: 'Makibashira - 💍', source: 'Makibashira', target: 'Kobai + Makibashira', style:{ stroke: '#c57be3', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kobai - 💍', source: 'Kobai', target: 'Kobai + Makibashira', style:{ stroke: '#c76554', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Emperor Suzaku - The Second Princess', source: 'Emperor Suzaku', target: 'The Second Princess', label: 'daughter', style:{ stroke: '#d98e04', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'The Second Princess', source: 'The Second Princess', target: 'The Second Princess + Kashiwagi', style:{ stroke: '#8c4c7b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kashiwagi', source: 'Kashiwagi', target: 'The Second Princess + Kashiwagi', style:{ stroke: '#b2fc72', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'The Second Princess', source: 'The Second Princess', target: 'The Second Princess + Yūgiri', style:{ stroke: '#8c4c7b', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Yūgiri', source: 'Yūgiri', target: 'The Second Princess + Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Kumoi no Kari', source: 'Kumoi no Kari', target: 'Kumoi no Kari + Yūgiri', style:{ stroke: '#4da392', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Yūgiri', source: 'Yūgiri', target: 'Kumoi no Kari + Yūgiri', style:{ stroke: '#578fff', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Emperor Kinjo', source: 'Emperor Suzaku + The Lady of Jokyoden Palace', target: 'Emperor Kinjo', style:{ stroke: '#0fff0f', strokeWidth: '2'},type: 'straight'},
			{ id: 'Akashi Princess - 💍', source: 'Akashi Princess', target: 'Emperor Kinjo + Akashi Princess', style:{ stroke: '#7cdb53', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Emperor Kinjo - 💍', source: 'Emperor Kinjo', target: 'Emperor Kinjo + Akashi Princess', style:{ stroke: '#0fff0f', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Koremitsu - The Maiden of the Dance', source: 'Koremitsu', target: 'The Maiden of the Dance', label: 'daughter', style:{ stroke: '#8002ad', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '❤️ -> Kaoru', source: 'The Third Princess + Kashiwagi', target: 'Kaoru', style:{ stroke: '#3273a8', strokeWidth: '2'}, type: 'straight'},
			{ id: '❤️ -> Kaoru', source: 'Genji + The Third Princess', target: 'Kaoru', style:{ stroke: '#e0dd22', strokeWidth: '2'}, label: 'ostensible child', type: 'straight'},
			{ id: 'The Eighth Prince\'s Wife - 💍', source: 'The Eighth Prince\'s Wife', target: 'The Eighth Prince + The Eighth Prince\'s Wife', style:{ stroke: '#7a9c5c', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'The Eighth Prince - 💍', source: 'The Eighth Prince', target: 'The Eighth Prince + The Eighth Prince\'s Wife', style:{ stroke: '#54e8c0', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Agemaki', source: 'The Eighth Prince + The Eighth Prince\'s Wife', target: 'Agemaki', style:{ stroke: '#5c9c71', strokeWidth: '2'},type: 'straight'},
			{ id: '💍 -> Kozeri', source: 'The Eighth Prince + The Eighth Prince\'s Wife', target: 'Kozeri', style:{ stroke: '#ba59a2', strokeWidth: '2'},type: 'straight'},
			{ id: 'Kozeri - Ukifune', source: 'Kozeri', target: 'Ukifune', label: 'half-sister', style:{ stroke: '#ba59a2', strokeWidth: '2'}},
			{ id: '💍 -> Niou', source: 'Emperor Kinjo + Akashi Princess', target: 'Niou', style:{ stroke: '#186328', strokeWidth: '2'},type: 'straight'},
			{ id: 'Kaoru - 💔', source: 'Kaoru', target: 'Kaoru + Ukifune', style:{ stroke: '#3273a8', strokeWidth: '2'}, type: 'smoothstep'},
			{ id: 'Ukifune - 💔', source: 'Ukifune', target: 'Kaoru + Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Niou - 💔', source: 'Niou', target: 'Niou + Ukifune', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep'},
			{ id: 'Ukifune - 💔', source: 'Ukifune', target: 'Niou + Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Niou - 💍', source: 'Niou', target: 'Niou + Kozeri', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep'},
			{ id: 'Kozeri - 💍', source: 'Kozeri', target: 'Niou + Kozeri', style:{ stroke: '#ba59a2', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Yūgiri - 💍', source: 'Yūgiri', target: 'Yūgiri + The Maiden of the Dance', style:{ stroke: '#578fff', strokeWidth: '2'}, type: 'smoothstep'},
			{ id: 'The Maiden of the Dance - 💍', source: 'The Maiden of the Dance', target: 'Yūgiri + The Maiden of the Dance', style:{ stroke: '#fc8114', strokeWidth: '2'}, type: 'smoothstep'},
			{ id: '💍 -> Roku no Kimi', source: 'Yūgiri + The Maiden of the Dance', target: 'Roku no Kimi', style:{ stroke: '#b85876', strokeWidth: '2'},type: 'straight'},
			{ id: 'Niou - 💍', source: 'Niou', target: 'Niou + Roku no Kimi', style:{ stroke: '#186328', strokeWidth: '2'}, type: 'smoothstep'},
			{ id: 'Roku no Kimi - 💍', source: 'Roku no Kimi', target: 'Niou + Roku no Kimi', style:{ stroke: '#b85876', strokeWidth: '2'}, type: 'smoothstep'},
			{ id: 'Higekuro - 💍', source: 'Higekuro', target: 'Higekuro + Tamakazura', style:{ stroke: '#543a00', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Tamakazura - 💍', source: 'Tamakazura', target: 'Higekuro + Tamakazura', style:{ stroke: '#d64f6c', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Nakatsukasa - Murasaki', source: 'Nakatsukasa', target: 'Murasaki', style:{ stroke: '#9c79ed', strokeWidth: '2'}, label: 'serves'},
			{ id: 'Omyōbu - Fujitsubo', source: 'Omyōbu', target: 'Fujitsubo', style:{ stroke: '#997112', strokeWidth: '2'}, label: 'serves'},
			{ id: 'The Akashi Lady - 💔', source: 'The Akashi Lady', target: 'The Akashi Lady + Yoshikiyo', style:{ stroke: '#3acc1d', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Yoshikiyo - 💔', source: 'Yoshikiyo', target: 'The Akashi Lady + Yoshikiyo', style:{ stroke: '#994a12', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Shōnagon - Murasaki', source: 'Shōnagon', target: 'Murasaki', style:{ stroke: '#6ddeba', strokeWidth: '2'}, label: 'wet nurse'},
			{ id: 'Genji - Tō no Chūjō', source: 'Genji', target: 'Tō no Chūjō', style:{ stroke: '#e0dd22', strokeWidth: '2'}, label: '👊'},
			{ id: 'Ukifune - Bishop of Yokawa', source: 'Ukifune', target: 'Bishop of Yokawa', style:{ stroke: '#ff5f4a', strokeWidth: '2'}, label: 'saved by'},
			{ id: 'The Eighth Prince - 💍', source: 'The Eighth Prince', target: 'The Eighth Prince + Chūjō no Kimi', style:{ stroke: '#54e8c0', strokeWidth: '2'},type: 'smoothstep'},
			{ id: 'Chūjō no Kimi - 💍', source: 'Chūjō no Kimi', target: 'The Eighth Prince + Chūjō no Kimi', style:{ stroke: '#36188f', strokeWidth: '2'},type: 'smoothstep'},
			{ id: '💍 -> Ukifune', source: 'The Eighth Prince + Chūjō no Kimi', target: 'Ukifune', style:{ stroke: '#ff5f4a', strokeWidth: '2'},type: 'straight'},
		]

    const [nodes, setNodes] =useState([])
    const [edges, setEdges] = useState([])
    const onInit = (reactFlowInstance) => {};
    const onConnect = () => null
    const minimapStyle = {
        height: 120,
    };
    const onNodesChange = useCallback( (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),[] );
    const onEdgesChange = useCallback( (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),[] );

	const pair = useRef(0) //if pair == 2 then add linkage
	const enableDisable = (num, bool) => {
		const new_nodes = [...nodes]
		const new_edges = [...edges]
		if (bool) {
			new_nodes.push(characters[num])
		} else {
			for (let i = 0; i < new_nodes.length; i++) {
				if (characters[num].id == new_nodes[i].id) {
					new_nodes.splice(i, 1)
					break
				}
			}
		}

		//check for adding or deleting linkages
		for (let i = 77; i < characters.length; i++) {
			pair.current = 0
			const id = characters[i].id
			const source = id.slice(0, id.indexOf(" + "))
			const target = id.slice(id.indexOf(" + ")+3)
			if (source != characters[num].id && target != characters[num].id) {
				continue
			} else {
				if (bool) {
					for (const element of new_nodes) {
						if (element.id == source || element.id == target) {
							pair.current += 1
						}
					}
					if (pair.current == 2) { 
						new_nodes.push(characters[i])
					} 
				} else {
					let rem = -1
					for (let i = 0; i < new_nodes.length; i++) {
						if (id == new_nodes[i].id) {
							new_nodes.splice(i, 1)
							break
						}
					}
				}
			}
		}

		//check for adding or deleting edges
		for (let i = 0; i < relationships.length; i++) {
			pair.current = 0
			const id = relationships[i].id
			const source = relationships[i].source
			const target = relationships[i].target
			if (bool) {
				for (const element of new_nodes) {
					if (element.id == source || element.id == target) {
						pair.current += 1
					}
				}
				if (pair.current == 2) { 
					new_edges.push(relationships[i])
				} 
			} else {
				let rem = -1
				for (let i = 0; i < new_nodes.length; i++) {
					if (id == new_nodes[i].id) {
						new_edges.splice(i, 1)
						break
					}
				}
			}
		}

		setNodes(new_nodes)
		setEdges(new_edges)
	}

    const showAll = () => {
		setNodes([]) //reset
		for (let i = 0; i < 77; i++) {
			document.getElementById("ch" + i.toString()).checked = true
		}
		setNodes(characters)
		setEdges(relationships)
    }

	const disableAll = () => {
		for (let i = 0; i < 77; i++) {
			document.getElementById("ch" + i.toString()).checked = false
		}
		setNodes([])
		setEdges([])
    }

    return (
        <div style={{fontSize: "large"}}>
            <br></br>
            <div>
                <button onClick={() => showAll()}>Show All</button>
				<button onClick={() => disableAll()}>Disable All</button>
            </div>
            <br></br>
            <div style={{overflowX: "scroll", display: "block", overflow: "auto", whiteSpace: "nowrap", scrollbarWidth: "none"}}>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch0" onChange={(e) => enableDisable(0, e.target.checked)} />
                <label>Previous Emperor</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch1" onChange={(e) => enableDisable(1, e.target.checked)} />
                <label>Kiritsubo Emperor</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch2" onChange={(e) => enableDisable(2, e.target.checked)} />
                <label>Kiritsubo Consort</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch3" onChange={(e) => enableDisable(3, e.target.checked)} />
                <label>Azechi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch4" onChange={(e) => enableDisable(4, e.target.checked)} />
                <label>Princess Omiya</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch5" onChange={(e) => enableDisable(5, e.target.checked)} />
                <label>Momozono Shikubu no Miya</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch6" onChange={(e) => enableDisable(6, e.target.checked)} />
                <label>Fujitsubo</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch7" onChange={(e) => enableDisable(7, e.target.checked)} />
                <label>Genji</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch8" onChange={(e) => enableDisable(8, e.target.checked)} />
                <label>Prince Hyōbu</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch9" onChange={(e) => enableDisable(9, e.target.checked)} />
                <label>Murasaki</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch10" onChange={(e) => enableDisable(10, e.target.checked)} />
                <label>Emperor Reizei</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch11" onChange={(e) => enableDisable(11, e.target.checked)} />
                <label>A Minister</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch12" onChange={(e) => enableDisable(12, e.target.checked)} />
                <label>Akashi Nun</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch13" onChange={(e) => enableDisable(13, e.target.checked)} />
                <label>Novitate</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch14" onChange={(e) => enableDisable(14, e.target.checked)} />
                <label>The Akashi Lady</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch15" onChange={(e) => enableDisable(15, e.target.checked)} />
                <label>Minister of the Left</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch16" onChange={(e) => enableDisable(16, e.target.checked)} />
                <label>Aoi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch17" onChange={(e) => enableDisable(17, e.target.checked)} />
                <label>Yūgiri</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch18" onChange={(e) => enableDisable(18, e.target.checked)} />
                <label>Akashi Princess</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch19" onChange={(e) => enableDisable(19, e.target.checked)} />
                <label>Kokiden Consort</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch20" onChange={(e) => enableDisable(20, e.target.checked)} />
                <label>Emperor Suzaku</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch21" onChange={(e) => enableDisable(21, e.target.checked)} />
                <label>Zenbō</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch22" onChange={(e) => enableDisable(22, e.target.checked)} />
                <label>Lady Rokujō</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch23" onChange={(e) => enableDisable(23, e.target.checked)} />
                <label>Tō no Chūjō</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch24" onChange={(e) => enableDisable(24, e.target.checked)} />
                <label>Yūgao</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch25" onChange={(e) => enableDisable(25, e.target.checked)} />
                <label>Tamakazura</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch26" onChange={(e) => enableDisable(26, e.target.checked)} />
                <label>Yon no Kimi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch27" onChange={(e) => enableDisable(27, e.target.checked)} />
                <label>Minister of the Right</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch28" onChange={(e) => enableDisable(28, e.target.checked)} />
                <label>Oborozukiyo</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch29" onChange={(e) => enableDisable(29, e.target.checked)} />
                <label>Kumoi no Kari's Mother</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch30" onChange={(e) => enableDisable(30, e.target.checked)} />
                <label>Murasaki's Mother</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch31" onChange={(e) => enableDisable(31, e.target.checked)} />
                <label>Kitayama no Amagimi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch32" onChange={(e) => enableDisable(32, e.target.checked)} />
                <label>The Lady of Jokyoden Palace</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch33" onChange={(e) => enableDisable(33, e.target.checked)} />
                <label>Higekuro</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch34" onChange={(e) => enableDisable(34, e.target.checked)} />
                <label>Higekuro's Wife</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch35" onChange={(e) => enableDisable(35, e.target.checked)} />
                <label>Ukon</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch36" onChange={(e) => enableDisable(36, e.target.checked)} />
                <label>Kumoi no Kari</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch37" onChange={(e) => enableDisable(37, e.target.checked)} />
                <label>Akikonomu</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch38" onChange={(e) => enableDisable(38, e.target.checked)} />
                <label>Koremitsu</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch39" onChange={(e) => enableDisable(39, e.target.checked)} />
                <label>The Third Princess</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch40" onChange={(e) => enableDisable(40, e.target.checked)} />
                <label>Kashiwagi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch41" onChange={(e) => enableDisable(41, e.target.checked)} />
                <label>The Eighth Prince</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch42" onChange={(e) => enableDisable(42, e.target.checked)} />
                <label>Prince Hitachi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch43" onChange={(e) => enableDisable(43, e.target.checked)} />
                <label>Suetsumuhana</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch44" onChange={(e) => enableDisable(44, e.target.checked)} />
                <label>Reikeiden Consort</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch45" onChange={(e) => enableDisable(45, e.target.checked)} />
                <label>The Lady of the Falling Flowers</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch46" onChange={(e) => enableDisable(46, e.target.checked)} />
                <label>Kogimi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch47" onChange={(e) => enableDisable(47, e.target.checked)} />
                <label>Utsusemi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch48" onChange={(e) => enableDisable(48, e.target.checked)} />
                <label>Iyo no Suke</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch49" onChange={(e) => enableDisable(49, e.target.checked)} />
                <label>Ki no Kami</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch50" onChange={(e) => enableDisable(50, e.target.checked)} />
                <label>Nokiba no Ogi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch51" onChange={(e) => enableDisable(51, e.target.checked)} />
                <label>Kokiden no Nyōgo</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch52" onChange={(e) => enableDisable(52, e.target.checked)} />
                <label>Asagao</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch53" onChange={(e) => enableDisable(53, e.target.checked)} />
                <label>Genji's Horse</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch54" onChange={(e) => enableDisable(54, e.target.checked)} />
                <label>Cat</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch55" onChange={(e) => enableDisable(55, e.target.checked)} />
                <label>Gosechi Dancer</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch56" onChange={(e) => enableDisable(56, e.target.checked)} />
                <label>Prince Hotaru</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch57" onChange={(e) => enableDisable(57, e.target.checked)} />
                <label>Makibashira</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch58" onChange={(e) => enableDisable(58, e.target.checked)} />
                <label>Omi Lady</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch59" onChange={(e) => enableDisable(59, e.target.checked)} />
                <label>Kobai</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch60" onChange={(e) => enableDisable(60, e.target.checked)} />
                <label>The Second Princess</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch61" onChange={(e) => enableDisable(61, e.target.checked)} />
                <label>Emperor Kinjo</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch62" onChange={(e) => enableDisable(62, e.target.checked)} />
                <label>The Maiden of the Dance</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch63" onChange={(e) => enableDisable(63, e.target.checked)} />
                <label>Kaoru</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch64" onChange={(e) => enableDisable(64, e.target.checked)} />
                <label>The Eighth Prince's Wife</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch65" onChange={(e) => enableDisable(65, e.target.checked)} />
                <label>Agemaki</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch66" onChange={(e) => enableDisable(66, e.target.checked)} />
                <label>Kozeri</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch67" onChange={(e) => enableDisable(67, e.target.checked)} />
                <label>Ukifune</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch68" onChange={(e) => enableDisable(68, e.target.checked)} />
                <label>Niou</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch69" onChange={(e) => enableDisable(69, e.target.checked)} />
                <label>Roku no Kimi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch70" onChange={(e) => enableDisable(70, e.target.checked)} />
                <label>Nakatsukasa</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch71" onChange={(e) => enableDisable(71, e.target.checked)} />
                <label>Omyōbu</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch72" onChange={(e) => enableDisable(72, e.target.checked)} />
                <label>Yoshikiyo</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch73" onChange={(e) => enableDisable(73, e.target.checked)} />
                <label>Shōnagon</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch74" onChange={(e) => enableDisable(74, e.target.checked)} />
                <label>Gen no Naishi</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch75" onChange={(e) => enableDisable(75, e.target.checked)} />
                <label>Bishop of Yokawa</label>
                <input type="checkbox" style ={{marginLeft: "10px"}} id="ch76" onChange={(e) => enableDisable(76, e.target.checked)} />
                <label>Chūjō no Kimi</label>
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

