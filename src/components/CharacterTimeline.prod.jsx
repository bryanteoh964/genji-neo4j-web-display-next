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

            var date_info = oi.name + "<br>" + oi.age_of_genji + " • " + oi.chapter + " • "
            if (oi.month) {
                date_info += " " + months[oi.month-1] 
            } 
            if (oi.day) {
                date_info += " " + oi.day 
            }

            if (oi.spring) {
                ganttTimeline.push({task: oi.name , startDate: new Date(genji_age+"-03-01"), endDate: new Date(genji_age+"-03-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "Spring </strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})
            } else if (oi.summer) { 
                ganttTimeline.push({task: oi.name , startDate: new Date(genji_age+"-06-01"), endDate: new Date(genji_age+"-06-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "Summer </strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})
            } else if (oi.fall || oi.autumn) {
                ganttTimeline.push({task: oi.name , startDate: new Date(genji_age+"-09-01"), endDate: new Date(genji_age+"-09-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "Autumn </strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})
            } else if (oi.winter) {
                ganttTimeline.push({task: oi.name , startDate: new Date(genji_age+"-12-01"), endDate: new Date(genji_age+"-12-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "Winter </strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})
            } else if (oi.day != null) {
                var dd = oi.day.toString() 
                if (dd.length == 1) {
                    dd = "0" + dd
                }
                var mm = oi.month.toString()
                if (mm.length == 1) {
                    mm = "0" + mm
                }
                if (oi.month == 12) {
                    ganttTimeline.push({task: oi.name, startDate: new Date(genji_age+"-12-" + dd), endDate: new Date(genji_age+"-12-" + dd), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})
                } else {
                    ganttTimeline.push({task: oi.name, startDate: new Date(genji_age+"-"+mm+ "-" + dd), endDate: new Date(genji_age+"-"+mm+ "-" + dd), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})
                }
            } else if (oi.month != null) {  
                var mm = oi.month.toString() 
                if (mm.length == 1) {
                    mm = "0" + mm
                } 
                if (oi.month == 12) {
                    ganttTimeline.push({task: oi.name, startDate: new Date(genji_age+"-12-01"), endDate: new Date(genji_age+"-12-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})
                } else { 
                    ganttTimeline.push({task: oi.name, startDate: new Date(genji_age+"-"+mm+ "-01"), endDate: new Date(genji_age+"-"+mm+ "-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})
                } 
            } else {
                ganttTimeline.push({task: oi.name, startDate: new Date(genji_age+"-01-01"), endDate: new Date(genji_age+"-01-01"), id: oi.id, color: oi.color, value: "<strong>" + date_info + "</strong> <br><br>" + oi.english + "<br><br>" + oi.japanese + "<br><br>", year: oi.age_of_genji, myRange: myRange})  
            }
        }
        gantt.current = ganttTimeline
    }
     
    return (
        <div>
            <div id="timeline_gantt" >
                <TimelineGanttChart style={{width: "100%"}} data={gantt.current} /> 
            </div> 
        </div>
    )
}
