import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const SimpleHeatmap = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const wordToTrack = 'at'; // Word to track in the dataset

      const response = await fetch(`/api/micro_search`);
      const wordIndices = await response.json();

      console.log('Word Indices:', wordIndices); // Log the word indices to check the API response

      if (wordToTrack.toLowerCase() in wordIndices) {
        console.log(`${wordToTrack} exists in the data.`); // Log if the word to track exists

        const gridSize = 100; // Adjust grid size for the larger dataset

        const data = Array(gridSize * gridSize).fill(0).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);

          const blockStart = Math.floor((wordIndices[wordToTrack.toLowerCase()][0][0] * index) / (gridSize * gridSize));
          const blockEnd = Math.floor((wordIndices[wordToTrack.toLowerCase()][0][0] * (index + 1)) / (gridSize * gridSize));

          const occurrences = (wordIndices[wordToTrack.toLowerCase()] || []).filter(
            ([wordIndex]) => wordIndex >= blockStart && wordIndex < blockEnd
          ).length;

          return {
            x,
            y,
            value: occurrences,
          };
        });

        const margin = { top: 10, right: 20, bottom: 30, left: 30 };
        const width = 350 - margin.left - margin.right;
        const height = 550 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
          .domain(d3.range(gridSize))
          .range([0, width]);

        const yScale = d3.scaleBand()
          .domain(d3.range(gridSize))
          .range([0, height]);

        const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
          .domain([0, 580000 / (gridSize * gridSize)]); // Values based on word occurrences

        svg.selectAll()
          .data(data)
          .enter()
          .append('rect')
          .attr('x', d => xScale(d.x))
          .attr('y', d => yScale(d.y))
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .style('fill', d => colorScale(d.value));
      } else {
        console.error(`${wordToTrack} not found in the data.`);
      }
    };

    fetchData();
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default SimpleHeatmap;
