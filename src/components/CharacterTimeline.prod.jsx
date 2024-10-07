import React from 'react'
import ReactDOM from 'react-dom'
import { useCallback, useEffect, useState, useRef} from 'react'
import '../styles/pages/characterTimeline.css'

export default function CharacterTimeline({l}) {
    //console.log(l)
    
    // Back-end
    function callDataAge(i) {
        var ordered_info = []
        for (const timeline_piece_info of l) {
            if (timeline_piece_info.age_of_genji == i) {
                ordered_info.push(timeline_piece_info)
                console.log(timeline_piece_info)
            }
        }
        if (ordered_info == []) {
            return []
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
                    if (a.winter) {
                        n_value = 335
                    }
                    if (a.spring) {
                        n_value = 60
                    }
                    if (a.summer) {
                        n_value = 152
                    }
                    if (a.fall) {
                        n_value = 244
                    } 
                }
                return n_value
            }
            var a_value = see(a)
            var b_value = see(b)
            
            return a_value - b_value
        })

        document.getElementById("timeline_elements").innerHTML = "";
        for (const oi of ordered_info) {
            var date = "| Genji Age: " + i + " | " 
            if (oi.month != null) {
                date += "Month: " + oi.month  + " | "
            }
            if (oi.day != null) {
                date += "Day: " + oi.day  + " | " 
            }
            if (oi.winter) {
                date += "Winter |"
            }
            if (oi.spring) {
                date += "Spring |"
            }
            if (oi.summer) {
                date += "Summer |"
            }
            if (oi.fall) {
                date += "Fall |"
            } 
            var li = document.createElement("li")
            var div = document.createElement("div")
            div.innerHTML = 
                "<time>" + oi.name + "</time>" +
                "<h3>" + oi.chapter + "</h3>" + "\n" +
                "<h4>" + date + "</h4>" + "\n" 
                + oi.english + "<br><br>" + 
                "<h4>" + oi.japanese + "</h4>"
            li.appendChild(div)
            document.getElementById("timeline_elements").appendChild(li) 
        }
        document.getElementById("timeline_elements").appendChild(document.createElement("li")) 
    }








    // Front-end
    function myRange(val) {
        var output = document.getElementById("demo");
        output.innerHTML = val;
        callDataAge(val);
    }
    
    return (
        <div>
            <section class="timeline">
            <ol id="timeline_elements">
               <li>
                <div>
                <h3>Drag the interval to start!</h3>
                </div>
               </li>
               <li></li> 
            </ol>
            </section>
            <br></br>

            <div class="slidecontainer">
                <input type="range" min={1} max={62} defaultValue={1} class="slider" id="myRange" onChange={(e) => myRange(e.target.value)}/>
                <h2 style={{color: "#615f61"}}>Age of Genji: <span id="demo">1</span></h2>
            </div>
            <br></br>
        </div>
    )
}
