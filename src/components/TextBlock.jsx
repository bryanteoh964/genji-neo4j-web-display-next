'use client'



function TextBlock({ text, searchTerm, data }) {
  const height = Math.min(text.length, 500); 
  const weidth = text.length  // Adjust max value as needed
  const blockSize = height /text.length;
  
  // Generate an array to count the number of occurrences at each character index
  const charOccurrence = new Array(text.length).fill(0);
  Object.keys(data).forEach(word => {
    data[word].forEach(index => {
      for (let i = 0; i < word.length; i++) {
        charOccurrence[index + i]++;
      }
    });
  });

  return (
    <div style={{ height: `${height}px`, width: '500px', background: 'lightgray', position: 'relative' }}>
      {charOccurrence.map((occurrence, index) => (
        <div
          key={index}
          style={{
            height: `${blockSize * searchTerm.length}px`,
            width: '50px',
            background: occurrence > 0 ? `rgba(255, 0, 0, ${Math.min(occurrence / 10, 1)})` : 'transparent',
            position: 'absolute',
            bottom: `${index * blockSize}px`
          }}
        ></div>
      ))}
    </div>
  );
}

export default TextBlock;