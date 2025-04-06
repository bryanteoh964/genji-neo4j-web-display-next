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
    .style('filter', 'drop-shadow(-1px 1px 2px rgba(255, 255, 255, 1))');

    g.append('g').attr('class', 'y axis').call(yAxis).attr('color', 'black');

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', (d) => y(d.task))
      .attr('height', y.bandwidth())
      .attr('x', (d) => x(d.startDate))
      .attr('width', (d) => x(d.endDate) - x(d.startDate))
      .attr('fill', (d) => d.color)
      .attr('stroke-width', 1)
      .attr('stroke', 'rgb(184, 236, 255)')
      .attr('r', -1)
      .style('-webkit-filter', 'drop-shadow(-1px 1px 5px rgba(0, 0, 0, 0.7))')
      .style('filter', 'drop-shadow(-1px 1px 5px rgba(0, 0, 0, 0.7))')
      .on("mouseover", function(event, d) {
        d3.select(this).attr('fill', 'rgb(145, 189, 225)');
        tooltip.transition()
          .duration(200)
          .style("opacity", 1)  
          .style("border", "solid 3px " + d.color);
        tooltip.html(d.value)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px")
          .style("font-size", "20px");
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', d.color);
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

      g.select(".x.axis").call(xAxis.scale(newXScale));
  
      g.selectAll(".bar")
        .attr("x", d => newXScale(d.startDate))
        .attr("width", d => newXScale(d.endDate) - newXScale(d.startDate));
        
      g.select(".grid")
        .call(gridlinesX.scale(newXScale));
    }
  }, [data]);

  const bI = "https://img.freepik.com/free-photo/white-cloud-blue-sky_74190-7728.jpg";

  return (
    <svg ref={svgRef} width="1200" height="600" style={{backgroundImage: `url(${bI})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}></svg>
  );
}

export default TimelineGanttChart; 