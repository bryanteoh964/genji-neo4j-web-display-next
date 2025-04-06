import React from 'react'
import ReactDOM from 'react-dom'
import { useCallback, useEffect, useState, useRef} from 'react'
import '../styles/pages/characterTimeline.css'
import TimelineGanttChart from './TimelineGanttChart';  

export default function CharacterTimeline({l}) {    
    // Back-end  
    const gantt = useRef([]) 
    const ganttShow = useRef(true) 
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    var loaded = useRef(false) 
    var characters_list = useRef([])

    // Front-end
    function myRange(val, showAll, character) {
        ganttShow.current = false 
        document.getElementById("show_gantt").innerHTML = "Show Gantt"
        document.getElementById("timeline_gantt").style.display = "none"
        document.getElementById("timeline_window").style.display = "block"
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

    const callDataAge = (i, showAll, character) => {
        var ordered_info = []
        if (showAll && character == "") {
            for (const timeline_piece_info of l) {
                ordered_info.push(timeline_piece_info)
            }
            //console.log(ordered_info)
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
                if (a.spring) {
                    return a.age_of_genji * 10000 + 3 * 100 + 1
                } else if (a.summer) {
                    return a.age_of_genji * 10000 + 6 * 100 + 1
                } else if (a.fall || a.autumn) {
                    return a.age_of_genji * 10000 + 9 * 100 + 1
                } else if (a.winter) {
                    return a.age_of_genji * 10000 + 12 * 100 + 1
                } else { 
                    return a.age_of_genji * 10000 + a.month * 100 + a.day
                } 
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
            var JP_div = document.createElement("h3")
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

            var name_l = document.createElement("h3")
            name_l.innerHTML = oi.name
            name_l.style.marginTop = "0px" 
            descrip_div.appendChild(name_l)

            var age_div = document.createElement("h3")
            age_div.innerHTML = oi.age_of_genji.toString() + " 𖤓 " + oi.chapter 
            if (oi.month != null) {
                age_div.innerHTML += " | " + months[oi.month-1] 
                if (oi.day != null) {
                    age_div.innerHTML += " " + oi.day.toString() 
                }
            }
            descrip_div.appendChild(age_div)

            var paragraph = document.createElement("p")
            paragraph.style.backgroundColor = "#e6e6e6"
            paragraph.style.border = "solid 2px black"
            paragraph.style.color = "black" 
            paragraph.style.fontFamily = "Monospace"
            paragraph.style.padding = "5px"
            paragraph.style.height = "150px"
            paragraph.style.overflowY = "scroll"
            paragraph.innerHTML = ""
            paragraph.className = "paragraph"
            paragraph.innerHTML += oi.japanese + "<br>"
            paragraph.style.marginTop = "3px" 
            paragraph.style.fontSize = " 18px"
            paragraph.innerHTML += oi.english + "<br>" + "<br>"
            descrip_div.appendChild(paragraph)


            div.appendChild(descrip_div)
            
            var season_div = document.createElement("div")
            season_div.style.display = "inline"
            season_div.style.backgroundColor = "white"
            season_div.style.borderRadius = "10px"
            
            var JP_season = document.createElement("h1")
            JP_season.style.marginTop = "14px"
            JP_season.style.marginBottom = "5px"
            JP_season.style.fontSize = "30px"
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
            season_div.appendChild(EN_season)

            div.id = oi.id 
            div.appendChild(season_div)
            li.appendChild(div)
            document.getElementById("timeline_elements").appendChild(li) 

            
        }

        //Append all speech bubbles 
        document.getElementById("timeline_elements").appendChild(document.createElement("li")) 
    }


    if (!loaded.current) { //pre-load information
        for (const tpi of l) {
            if (!characters_list.current.includes(tpi.name)) {
                characters_list.current.push(tpi.name)
            }
        }
        loaded.current = true

        var ordered_info = []
        for (const timeline_piece_info of l) {
            ordered_info.push(timeline_piece_info)
        }

        ordered_info = ordered_info.sort((a,b) => {
            function see(a) {
                if (a.spring) {
                    return a.age_of_genji * 10000 + 3 * 100 + 1
                } else if (a.summer) {
                    return a.age_of_genji * 10000 + 6 * 100 + 1
                } else if (a.fall || a.autumn) {
                    return a.age_of_genji * 10000 + 9 * 100 + 1
                } else if (a.winter) {
                    return a.age_of_genji * 10000 + 12 * 100 + 1
                } else { 
                    return a.age_of_genji * 10000 + a.month * 100 + a.day
                } 
            } 
            var a_value = see(a)
            var b_value = see(b)
            
            return a_value - b_value
        })

        var ganttTimeline = []
        for (const oi of ordered_info) {
            var genji_age = oi.age_of_genji.toString()
            if (genji_age.length == 1) {
                genji_age = "000" + genji_age
            } else {
                genji_age = "00" + genji_age
            }
            var genji_age_next = (oi.age_of_genji+1).toString()
            if (genji_age_next.length == 1) {
                genji_age_next = "000" + genji_age_next
            } else {
                genji_age_next = "00" + genji_age_next
            } 

            var date_info = oi.name + "<br>" + oi.age_of_genji + " 𖤓 "
            if (oi.month) {
                date_info += " " + months[oi.month-1] 
            } 
            if (oi.day) {
                date_info += " " + oi.day 
            }

            if (oi.spring) {
                ganttTimeline.push({task: oi.name + " Seasonal Event", startDate: new Date(genji_age+"-03-01"), endDate: new Date(genji_age+"-05-31"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "Spring </strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})
            } else if (oi.summer) { 
                ganttTimeline.push({task: oi.name + " Seasonal Event", startDate: new Date(genji_age+"-06-01"), endDate: new Date(genji_age+"-08-31"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "Summer </strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})
            } else if (oi.fall || oi.autumn) {
                ganttTimeline.push({task: oi.name + " Seasonal Event", startDate: new Date(genji_age+"-09-01"), endDate: new Date(genji_age+"-11-30"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "Autumn </strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})
            } else if (oi.winter) {
                ganttTimeline.push({task: oi.name + " Seasonal Event", startDate: new Date(genji_age+"-12-01"), endDate: new Date(genji_age_next+"-02-28"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "Winter </strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})
            } else if (oi.day != null) {
                var dd = oi.day.toString() 
                if (dd.length == 1) {
                    dd = "0" + dd
                }
                var mm = oi.month.toString()
                if (mm.length == 1) {
                    mm = "0" + mm
                }
                var mm_next = (oi.month + 1).toString()
                if (mm_next.length  == 1) {
                    mm_next = "0" + mm_next
                } 
                if (oi.month == 12) {
                    ganttTimeline.push({task: oi.name + " Day Event", startDate: new Date(genji_age+"-12-" + dd), endDate: new Date(genji_age_next+"-01-" +dd), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})
                } else {
                    ganttTimeline.push({task: oi.name + " Day Event", startDate: new Date(genji_age+"-"+mm+ "-" + dd), endDate: new Date(genji_age+"-"+mm_next+ "-" +dd), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})
                }
            } else if (oi.month != null) { 
                var mm = oi.month.toString() 
                if (mm.length == 1) {
                    mm = "0" + mm
                }
                var mm_next = (oi.month + 1).toString()
                if (mm_next.length  == 1) {
                    mm_next = "0" + mm_next
                } 
                if (oi.month == 12) {
                    ganttTimeline.push({task: oi.name + " Month Event", startDate: new Date(genji_age+"-12-01"), endDate: new Date(genji_age_next+"-01-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})
                } else { 
                    ganttTimeline.push({task: oi.name + " Month Event", startDate: new Date(genji_age+"-"+mm+ "-01"), endDate: new Date(genji_age+"-"+mm_next+ "-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})
                } 
            } else {
                ganttTimeline.push({task: oi.name + " Year Event", startDate: new Date(genji_age+"-01-01"), endDate: new Date(genji_age+"-06-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>", year: oi.age_of_genji, myRange: myRange})  
            }
        }
        gantt.current = ganttTimeline
    }


    function ganttSwitch() {
        if (ganttShow.current) {
            document.getElementById("timeline_gantt").style.display = "none"  
            document.getElementById("timeline_window").style.display = "block"
            ganttShow.current = false
            document.getElementById("show_gantt").innerHTML = "Show Gantt"
        } else {
            document.getElementById("timeline_gantt").style.display = "block"; 
            document.getElementById("timeline_window").style.display = "none"
            ganttShow.current = true 
            document.getElementById("show_gantt").innerHTML = "Show Timeline"
        }
    }
     
    return (
        <div>
            <h2 >Age of Genji: <span id="demo" class="glow">1</span> 
                &#160; &#160;
                <select id="characters" style={{fontSize: "20px", backgroundColor: "RGB(252,252,252)"}} onChange={(e) => myRange(0, true, e.target.value)}>
                    <option value={""}>{""}</option>
                    {characters_list.current.map((name) => (
                        <option value={name}>
                        {name}
                        </option>
                    ))}
                </select> 
                &#160; &#160;
                <button id="bottom" onClick={(e) => ganttSwitch()} style={{backgroundColor: "#f0eed1"}}>
                    <h3 style={{color: "black"}} id="show_gantt">Show Timeline</h3>
                </button>
                &#160; &#160;
                <button id="bottom" onClick={(e) => myRange(0, true, "")}>
                    <h3 style={{color: "#615f61"}} id="show">Show All</h3> 
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
            <div id="timeline_gantt" >
                <TimelineGanttChart style={{width: "100%"}} data={gantt.current} /> 
            </div>  
            <section class="timeline" id = "timeline_window" style={{display: "none"}}>
                <ol id="timeline_elements" >
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
