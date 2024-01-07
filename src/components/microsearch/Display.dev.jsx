import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

import Reader1 from './MicroSearchReader1.dev';

const SimpleHeatmap = ({ sentenceIndex, setSentenceIndex }) => {
  const svgRef = useRef(null);
  const gridSize = 50; // Adjust grid size for the larger dataset
  const totalWords = 580000; // Total number of words in the dataset
  const [blockIndices, setBlockIndices] = useState(Array.from({ length: gridSize * gridSize }, () => []));
  console.log(setSentenceIndex )
  
  useEffect(() => {
    const fetchData = async () => {
      const wordToTrack = 'winter'; // Word to track in the dataset

      // Fetching logic...
      const response = await fetch(`/api/micro_search`);
      const wordIndices = await response.json();
      console.log('Word Indices:', wordIndices); // Log the word indices to check the API response

      if (wordToTrack.toLowerCase() in wordIndices) {
        console.log(`${wordToTrack} exists in the data.`); // Log if the word to track exists

        const occurrences = Array(gridSize * gridSize).fill(0);
        const wordIndicesArray = wordIndices[wordToTrack.toLowerCase()];
        
        const blockIndices = Array(gridSize * gridSize).fill(null).map(() => []);

        // Assign occurrences and block indices for each word index
        wordIndicesArray.forEach(([wordIndex, sentenceIndex]) => {
          const blockIndex = Math.floor((wordIndex / totalWords) * (gridSize * gridSize));
          occurrences[blockIndex]++;
          blockIndices[blockIndex].push([wordIndex, sentenceIndex]);
          console.log(blockIndex)
        });

        const margin = { top: 10, right: 20, bottom: 30, left: 30 };
        const width = 375 - margin.left - margin.right; // Adjusted width for the heatmap
        const height = 550 - margin.top - margin.bottom; // Adjusted height for the heatmap

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
          .domain([0, Math.max(...occurrences)]); // Values based on word occurrences

        svg.selectAll()
          .data(occurrences)
          .enter()
          .append('rect')
          .attr('x', (_, i) => xScale(i % gridSize))
          .attr('y', (_, i) => yScale(Math.floor(i / gridSize)))
          .attr('width', xScale.bandwidth())
          .attr('height', yScale.bandwidth())
          .style('fill', d => colorScale(d))
          .on('click', function (event, d, i) {
            const mouseX = event.offsetX; // X-coordinate of the mouse click relative to the SVG
            const mouseY = event.offsetY; // Y-coordinate of the mouse click relative to the SVG
          
            const blockX = Math.floor((mouseX / width) * gridSize);
            const blockY = Math.floor((mouseY / height) * gridSize);
            let blockIndex = blockY * gridSize + blockX ;
          
            // Access data associated with the clicked block index
            const data = blockIndices[blockIndex];
            let cnt = 0;
            while(cnt < 150 && (data.length ==0 )){
   
              blockIndex--;
              cnt++;
              if(blockIndices[blockIndex].length != 0){
                break;
              }
            }
            setSentenceIndex(blockIndex)
            console.log('Block clicked!', blockIndex, blockIndices[blockIndex]);
            //Reader1(blockIndex, blockIndices[blockIndex]);
          });
      } else {
        console.error(`${wordToTrack} not found in the data.`);
      }
    };

    fetchData();
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default SimpleHeatmap;
