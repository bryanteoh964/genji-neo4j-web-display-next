import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function ZoomableGanttChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous chart

    const margin = { top: 20, right: 20, bottom: 30, left: 100 };
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
    const yAxis = d3.axisLeft(y);

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

    g.append('g').attr('class', 'x axis').attr('transform', `translate(0,${height})`).call(xAxis).attr('color', 'black');

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
      .attr('fill', 'steelblue')
      .attr('stroke-width', 1)
      .attr('stroke', 'rgb(184, 236, 255)')
      .attr('r', -1)
      .style('-webkit-filter', 'drop-shadow(-1px 1px 5px rgba(0, 0, 0, 0.7))')
      .style('filter', 'drop-shadow(-1px 1px 5px rgba(0, 0, 0, 0.7))')
      .on('mouseover', function () {
        d3.select(this).attr('fill', 'rgb(145, 189, 225)');
      })
      .on('mouseout', function () {
        d3.select(this).attr('fill', 'steelblue');
      })
      .on('click', (event, d) => { // Corrected click function
        if (d && d.id && document.getElementById(d.id)) {
          for (const div of document.querySelectorAll('div.descripDiv')) {
            div.style.boxShadow = 'none';
          }
          document.getElementById(d.id).style.boxShadow = '3px 3px 5px 6px #006400'; 
          window.location.hash = d.id;
        } else {
          console.warn('Click event: Element ID not found or data missing.', d);
        }
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

  return (
    <svg ref={svgRef} width="800" height="250"></svg>
  );
}

export default ZoomableGanttChart;