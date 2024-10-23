import React from 'react'
import ReactDOM from 'react-dom'
import { useCallback, useEffect, useState, useRef} from 'react'
import '../styles/pages/characterTimeline.css'

export default function CharacterTimeline({l}) {    
    // Back-end 

    var loaded = useRef(false)
    var characters_list = []
    if (!loaded.current) { //pre-load information
        for (const tpi of l) {
            if (!characters_list.includes(tpi.name)) {
                characters_list.push(tpi.name)
            }
        }
        loaded.current = true
    }
    
    function callDataAge(i, showAll, character) {
        var ordered_info = []
        if (showAll && character == "") {
            for (const timeline_piece_info of l) {
                ordered_info.push(timeline_piece_info)
            }
            console.log(ordered_info)
        } else if (character != "") {
            for (const timeline_piece_info of l) {
                if (timeline_piece_info.name == character) {
                    ordered_info.push(timeline_piece_info)
                }
            }
        } else {
            for (const timeline_piece_info of l) {
                if (timeline_piece_info.age_of_genji == i) {
                    ordered_info.push(timeline_piece_info)
                }
            }
            if (ordered_info == []) {
                return []
            }
        }

        ordered_info = ordered_info.sort((a,b) => {
            function see(a) {
                var month_days = [31,28,31,30,31,30,31,31,30,31,30,31]
                var n_value = 0
                if (a.day != null) {
                    n_value += a.day
                }
                if (a.month != null) {
                    for (const i = 0; i < a.month; a++) {
                        n_value += month_days[i]
                    }
                }
                if (n_value == 0) {
                    if (a.winter) {n_value = 335}
                    if (a.spring) {n_value = 60}
                    if (a.summer) {n_value = 152}
                    if (a.fall) {n_value = 244} 
                }
                
                if (showAll) {
                    n_value += 365*(a.age_of_genji-1)
                }


                return n_value
            }
            var a_value = see(a)
            var b_value = see(b)
            
            return a_value - b_value
        })

        //Append the bubbles to the timeline! 
        
        document.getElementById("timeline_elements").innerHTML = "";
        for (const oi of ordered_info) {
            var li = document.createElement("li")
            var div = document.createElement("div")
            div.style.display = "flex"
            div.className = "speech_bubble"

            var link_character = document.createElement("a")
            link_character.href = "/characters/" + oi.name
            link_character.className = "a_hv"
            link_character.rel="noopener noreferrer" 
            link_character.target="_blank" 
            var JP_div = document.createElement("h1")
            JP_div.className = "japanese"
            JP_div.innerHTML = oi.jp_name.slice(0, oi.jp_name.indexOf("（"))
            JP_div.style.textShadow = oi.color + " 1px 0 10px"
            link_character.appendChild(JP_div)
            div.appendChild(link_character)

            var descrip_div = document.createElement("div")
            descrip_div.style.marginTop = "0"
            descrip_div.style.display = "inline"
            descrip_div.style.width = "400px"
            descrip_div.style.textAlign = "left"

            var name_l = document.createElement("h1")
            name_l.innerHTML = oi.name
            name_l.style.marginTop = "3px" 
            descrip_div.appendChild(name_l)

            var age_div = document.createElement("h1")
            age_div.innerHTML = oi.age_of_genji.toString() + " 𖤓 " + oi.chapter 
            descrip_div.appendChild(age_div)

            var date = document.createElement("h2")
            date.innerHTML = ""
            if (oi.month != null) {
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                date.innerHTML += months[oi.month-1] 
                if (oi.day != null) {
                    date.innerHTML += " " + oi.day.toString() 
                }
            }
            date.style.marginTop = "3px" 
            descrip_div.appendChild(date)

            var paragraph = document.createElement("p")
            paragraph.innerHTML = ""
            paragraph.className = "paragraph"
            paragraph.innerHTML += oi.japanese + "<br>"
            paragraph.style.marginTop = "3px" 
            paragraph.style.fontSize = " 18px"
            if (oi.english.length > 75) {
                paragraph.innerHTML += oi.english.slice(0, 75) + "..."
            } else {
                paragraph.innerHTML += oi.english
            }
            descrip_div.appendChild(paragraph)

            var popupbox = document.createElement("a")
            popupbox.innerHTML = "read more"
            popupbox.href = "#popup-box"
            popupbox.className = "a_hv"
            popupbox.id = oi.name + oi.age_of_genji + oi.english + "link"
            descrip_div.appendChild(popupbox)


            div.appendChild(descrip_div)
            
            var season_div = document.createElement("div")
            season_div.style.display = "inline"
            
            var JP_season = document.createElement("h1")
            JP_season.style.marginTop = "30px"
            JP_season.style.marginBottom = "15px"
            JP_season.style.fontSize = "75px"
            if (oi.winter) {JP_season.innerHTML = "冬"}
            if (oi.spring) {JP_season.innerHTML = "春"}
            if (oi.summer) {JP_season.innerHTML = "夏"}
            if (oi.fall) {JP_season.innerHTML = "秋"}
            season_div.appendChild(JP_season)
 
            var EN_season = document.createElement("h3")
            if (oi.winter) {EN_season.innerHTML = "winter"}
            if (oi.spring) {EN_season.innerHTML = "spring"}
            if (oi.summer) {EN_season.innerHTML = "summer"}
            if (oi.fall) {EN_season.innerHTML = "autumn"}
            JP_season.style.marginTop = "30px"
            season_div.appendChild(EN_season)

            div.id = oi.name + oi.age_of_genji + oi.english
            div.appendChild(season_div)
            li.appendChild(div)
            popupbox.addEventListener("click", () => {
                var popupdiv = document.getElementById("timeline_piece_info")
                popupdiv.innerHTML = ""
                var cloneN = document.getElementById(oi.name + oi.age_of_genji + oi.english).cloneNode(true)
                cloneN.className = "timeline_information"
                popupdiv.appendChild(cloneN)

                document.querySelector(".timeline_information div a").innerHTML = ""
                document.querySelector(".timeline_information div .paragraph").innerHTML = oi.japanese + "<br><br>" +  oi.english
                window.scrollTo(0, document.body.scrollHeight);
            });
            document.getElementById("timeline_elements").appendChild(li) 
        }

        //Append all speech bubbles
        document.getElementById("timeline_elements").appendChild(document.createElement("li")) 
    }








    // Front-end
    function myRange(val, showAll, character) {
        var output = document.getElementById("demo");
        output.innerHTML = val;
        callDataAge(val, showAll, character);
        if (showAll) {
            document.getElementById("myRange").value = 1
            document.getElementById("demo").innerHTML = "1~53"
            if (character == "") {
                document.getElementById("characters").value = ""
            }
        }
    }
    
    return (
        <div>
            <h2>Age of Genji: <span id="demo" class="glow">1</span> 
                &#160; &#160;
                <select id="characters" style={{fontSize: "20px", backgroundColor: "RGB(252,252,252)"}} onChange={(e) => myRange(0, true, e.target.value)}>
                    <option value={""}>{""}</option>
                    {
                        characters_list.map(
                            (name) => {
                                return <option value={name}>{name}</option>
                            }
                        )
                    }
                </select> 
                &#160; &#160;
                <button id="bottom" onClick={(e) => myRange(0, true, "")}>
                    <h3 style={{color: "#615f61"}}>Show All</h3>
                </button>
            </h2>
            <div class="slidecontainer">
                <input type="range" min={1} max={55} defaultValue={1} class="slider" id="myRange" onChange={(e) => myRange(e.target.value, false, "")} list="steplist"/>
            </div>
            <datalist id="steplist">
                    {
                        Array(55+1).fill(0).map(
                            (_, i) => {
                                if ((i+1) % 5 == 0 ) {
                                    return <option>{i+1}</option>
                                }
                                if (i+1 == 1 ) {
                                    return <option >{i+1}</option>
                                }
                            }
                        )
                    }
                </datalist>
            <br></br>
            <br></br>
            <section class="timeline">
                <ol id="timeline_elements">
                <li>
                    <div class="speech_bubble">
                        <h3 style={{marginLeft: "auto", marginRight: "auto", width: "200px"}}>Drag the interval to start!</h3>
                    </div>
                </li>
                <li></li> 
                </ol>
            </section>
            <br></br>


            <div id="popup-box" class="modal">
                <div class="content">
                    <a href="#bottom" class="a_hv" style={{fontSize: "50px",  color: "black"}}>&times;</a>
                    <div id="timeline_piece_info" style={{padding: "50px"}}>
                        INFO
                    </div>
                </div>
            </div>
        </div>
    )
}
