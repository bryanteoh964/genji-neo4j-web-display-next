import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function TimelineGanttChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip") 
    .attr("style", "position: absolute; text-align: center; width: 220px; height: fit-content; padding: 2px; font: 12px sans-serif; background: white; border: 0px; border-radius: 8px; pointer-events: none; opacity: 0;");
    
    if (!data || data.length === 0) return; 

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous chart

    const margin = { top: 20, right: 0, bottom: 30, left: 0 };
    const width = +svg.attr('width') - margin.left - margin.right;
    const height = +svg.attr('height') - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const y = d3
      .scaleBand()
      .rangeRound([0, height])
      .paddingInner(0.1)
      .domain(data.map((d) => d.task));

    const minDate = new Date('0000-01-01'); 
    const maxDate = new Date('0060-01-01');
    const x = d3
      .scaleTime()
      .rangeRound([0, width])
      .domain([minDate, maxDate]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y).tickFormat(''); 

    const gridlinesX = d3
      .axisBottom(x)
      .tickSize(-height)
      .tickFormat('')
      .ticks(10);


      

    g.append('g') 
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(gridlinesX)
      .attr('color', 'black');

    g.append('g').attr('class', 'x axis').attr('transform', `translate(0,${height})`).call(xAxis).attr('color', 'black').style('-webkit-filter', 'drop-shadow(-1px 1px 2px rgba(255, 255, 255, 1))')
    .style('filter', 'drop-shadow(-1px 1px 2px rgba(255, 255, 255, 1))').selectAll(".tick text")
    .text(function(d) {
      const yearString = d3.timeFormat("%Y-%m")(d);
      return parseInt(yearString, 10).toString(); 
    })
    .style('font-size', '20px')       // Make the text bigger
    .style('font-weight', 'bold')    // Make the text bold
    .style('-webkit-filter', 'drop-shadow(-1px 1px 2px rgba(255, 255, 255, 1))')
    .style('filter', 'drop-shadow(-1px 1px 2px rgba(255, 255, 255, 1))');

    g.append('g').attr('class', 'y axis').call(yAxis).attr('color', 'black');

    
    
      g.selectAll(".start-dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "start-dot")
      .attr("cy", d => y(d.task) + y.bandwidth() / 2)
      .attr("cx", d => x(d.startDate))
      .attr("r", 12) // Increased radius for better interaction
      .attr('fill', "white")  
      .style("cursor", "pointer")
      .style("opacity", 1)
      .style("transition", "opacity 0.3s ease")
      .on("mouseover", function(event, d) {
        d3.select(this).attr('fill', 'rgb(145, 189, 225)');
        tooltip.transition()
          .duration(200)
          .style("opacity", 1)  
          .style("border", "solid 3px " + d.color);
        tooltip.html(d.value)
          .style("left", (event.pageX + 50) + "px")
          .style("top", (event.pageY - 28) + "px")
          .style("font-size", "20px");
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', "white");
        tooltip.transition()
        .duration(500)
        .style("opacity", 0);
      })
      .on('click', (event, d) => { // Corrected click function
        document.getElementById("myRange").value = d.year 
        d.myRange(d.year, false, "")   
        setTimeout(() => {  
          document.getElementById(d.id).style.border = "solid 3px " + d.color 
          document.getElementById(d.id).style.filter = 'drop-shadow(-1px 1px 5px rgba(0, 0, 0, 0.7))';
          document.getElementById(d.id).style.boxShadow = ' inset 0 0 0 4px #333, inset 0 0 0 8px #444, inset 0 0 0 12px #bbb, inset 0 0 0 16px #ccc, inset 0 0 0 20px #ddd, inset 0 0 0 20px #eee, inset 0 0 0 20px #fff'; 
        },1000)
        window.location.hash = d.id 
      }); 

    const zoom = d3
      .zoom()
      .scaleExtent([1, 1000])
      .on('zoom', zoomed);

    svg.call(zoom);

    function zoomed(event) {
      const newXScale = event.transform.rescaleX(x);

      g.select(".x.axis")
        .call(xAxis.scale(newXScale))
        .selectAll(".tick text")
        .text(function(d) {
          const date = d3.timeFormat("%Y-%m-%d")(d).toString();
          if  (d3.timeFormat("%m-%d")(d).toString() == "01-01") {
            const yearString = d3.timeFormat("%Y")(d);
            return parseInt(yearString, 10).toString(); 
          } else if  (d3.timeFormat("%d")(d).toString() == "01") {
            return d3.timeFormat("%b")(d).toString();
          } else {
            return d3.timeFormat("%b %d")(d).toString();
          }
        })
        .style('font-size', '20px')       // Make the text bigger 
        .style('font-weight', 'bold')    // Make the text bold
        .style('-webkit-filter', 'drop-shadow(-1px 1px 2px rgba(255, 255, 255, 1))')
        .style('filter', 'drop-shadow(-1px 1px 2px rgba(255, 255, 255, 1))')
  
      g.selectAll(".bar")
        .attr("x", d => newXScale(d.startDate))
        .attr("width", d => newXScale(d.endDate) - newXScale(d.startDate));
        
      g.select(".grid")
        .call(gridlinesX.scale(newXScale));

      g.selectAll(".start-dot")
        .attr("cx", d => newXScale(d.startDate));
    }
  }, [data]);

  return (
    <svg ref={svgRef} width="1440" height="600" style={{ backgroundImage: "url(/images/timeline_background.png)", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', 
      backgroundBlendMode: 'overlay'}}></svg> 
  );
}

export default TimelineGanttChart; 