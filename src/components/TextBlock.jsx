// components/TextBlock.js

function TextBlock({ text, searchTerm,data}) {
  const height = Math.min(text.length, 500);  // Adjust max value as needed
  
  const occurrences = data[searchTerm] || [];
  const blockSize = height / text.length;
  const blocksPerRow = 5; 
  return (
     // Adjust this to how many blocks you want in a row

<div style={{ height: `${height}px`, width: `${50 * blocksPerRow}px`, background: 'lightgray', position: 'relative' }}>
  {occurrences.map((_, index) => {
    const row = Math.floor(index / blocksPerRow);
    const col = index % blocksPerRow;
    
    return (
      <div
        key={index}
        style={{
          height: `${blockSize * searchTerm.length}px`,  // Adjust for word length
          width: '50px',
          background: 'red',
          position: 'absolute',
          bottom: `${(blockSize * searchTerm.length + 5) * row}px`,  // Add 5 for spacing in height
          left: `${(50 + 5) * col}px`  // 50px is the width of each block + 5px spacing
        }}
      ></div>
    );
  })}
</div>
  );
}

export default TextBlock;
