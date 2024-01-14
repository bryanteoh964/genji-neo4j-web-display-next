import React, { useRef, useEffect, useState, useContext } from 'react';
import * as d3 from 'd3';
import { ThingsContext } from './context.dev.js';


import Reader1 from './MicroSearchReader1.dev';

const SimpleHeatmap = ({ sentenceIndex, setSentenceIndex }) => {
  const svgRef = useRef(null);
  const gridSize = 50;
  const totalWords = 580000;
  const [wordToTrack, setWordToTrack] = useState('winter');
  const [block, setBlock] = useState("");
  const [occurences, setOccurences] = useState("");
  const [sentenceIndices, setSentenceIndices] = useState("");
  const [blockIndices, setBlockIndices] = useState(Array.from({ length: gridSize * gridSize }, () => []));

  const { value, setValue } = useContext(ThingsContext);
  useEffect(() => {
    setWordToTrack(value)
    console.log("value updated")
  }, [value]);

  const fetchData = async () => {
    const words = wordToTrack
    const translation = 'waley'
    // Fetching logic
    const response = await fetch(`/api/micro_search?words=${words}&&translation=${translation}`);
    const wordIndices = await response.json();
    console.log('Word Indices:', wordIndices); // Log the word indices to check the API response

    if (wordToTrack in wordIndices) {
      console.log(`${wordToTrack} exists in the data.`); // Log if the word to track exists
      processWordIndices(wordIndices[wordToTrack]);
      setOccurences(wordIndices[wordToTrack].length)
      // setOccurences(JSON.stringify(wordIndices[wordToTrack]))
    }
  };

  const processWordIndices = (wordIndicesArray) => {
    console.log("processWordIndices called")
    const occurrences = Array(gridSize * gridSize).fill(0);
    const newBlockIndices = Array(gridSize * gridSize).fill(null).map(() => []);

    // Assign occurrences and block indices for each word index
    wordIndicesArray.forEach(([wordIndex, sentenceIdx]) => {
      const blockIndex = Math.floor((wordIndex / totalWords) * (gridSize * gridSize));
      occurrences[blockIndex]++;
      newBlockIndices[blockIndex].push([wordIndex, sentenceIdx]);
    });

    setBlockIndices(newBlockIndices);
    createHeatmap(occurrences);
  };

  const createHeatmap = (occurrences) => {
    console.log("createHeatmap called")
    const margin = { top: 10, right: 20, bottom: 30, left: 30 };
    const width = 375 - margin.left - margin.right;
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
      .domain([0, Math.max(...occurrences)]);

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    svg.selectAll('rect')
      .data(occurrences)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i % gridSize))
      .attr('y', (_, i) => yScale(Math.floor(i / gridSize)))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .on('mouseover', function (d, i) {
          d3.select(this).transition()
              .duration('50')
              .attr('opacity', '.65')
              .style('stroke', 'black')
              .style('stroke-width', '1px')
              .style('stroke-opacity', 0.35)
          div.transition()
              .duration('50')
              .style("opacity", 1);
          let num = "100";
          div.html(num)
              .style("left", (d.pageX + 10) + "px")
              .style("top", (d.pageY - 15) + "px")
    })
      .on('mouseout', function (d, i) {
          d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1')
               .style('stroke', 'none')
      })
      .style('fill', d => colorScale(d))
      .on('click', (event, d, i) => handleClick(event, i));
  };

  const handleClick = (event, blockIndex) => {
    const width = 375 - 30 - 30;  // Adjusted width for the heatmap
    const height = 550 - 10 - 30; // Adjusted height for the heatmap

    // Calculate the block index based on the mouse click coordinates
    const mouseX = event.offsetX -30; // Adjust for left margin
    const mouseY = event.offsetY - 10; // Adjust for top margin

    const blockX = Math.floor((mouseX / width) * gridSize);
    const blockY = Math.floor((mouseY / height) * gridSize);
    blockIndex = blockY * gridSize + blockX;

    // Adjust blockIndex if necessary
    let count = 0;
    while (count < 150 && (blockIndices[blockIndex]?.length === 0)) {
      blockIndex--;
      count++;
      if (blockIndices[blockIndex]?.length !== 0) {
        break;
      }
    }
    setSentenceIndex(blockIndices[blockIndex]);
    console.log('Block clicked!', blockIndex, blockIndices[blockIndex]);
    // console.log(blockIndices)
    // console.log(sentenceIndex)
    setBlock(JSON.stringify(blockIndex))
    setSentenceIndices(JSON.stringify(blockIndices[blockIndex]))
  };

  return (
    <div>
      <button onClick={fetchData}>Load Data</button>
      <h5>Word: {wordToTrack}</h5>
      <h5>Occurences: {occurences}</h5>
      <h5>Block Index: {block}</h5>
      <h5>Sentence Indices: {sentenceIndices}</h5>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default SimpleHeatmap;