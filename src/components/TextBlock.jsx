function TextBlock({ text, searchTerm, data }) {
  const maxDisplayWidth = 800;
  const maxDisplayHeight = 300;
  const dotSize = 5;
  const minOpacity = 0.5;  // This ensures a single occurrence is still visible

  const occurrences = data[searchTerm] || [];
  const textLength = 7000;

  const dotsPerRow = Math.floor(maxDisplayWidth / (dotSize + 1));
  const totalRows = Math.ceil(textLength / dotsPerRow);
  const displayHeight = Math.min(totalRows * (dotSize + 1), maxDisplayHeight);

  const getColor = (position) => {
      const range = Math.ceil(textLength / dotsPerRow);
      
      const closeOccurrences = occurrences.filter(
          pos => pos > position - range && pos < position + range
      ).length;

      let opacity = Math.min(closeOccurrences / 10, 10);
      opacity = Math.max(opacity, minOpacity);  // Ensure it's at least the minimum opacity

      return `rgba(255, 0, 0, ${opacity})`;
  };

  return (
      <div style={{ height: `${displayHeight}px`, width: `${maxDisplayWidth}px`, background: 'lightgray', position: 'relative' }}>
          {occurrences.map((position, index) => {
              const relativePosition = (position / textLength) * displayHeight;

              const row = Math.floor(position / dotsPerRow);
              const col = position % dotsPerRow;

              return (
                  <div
                      key={index}
                      style={{
                          height: `${dotSize}px`,
                          width: `${dotSize}px`,
                          background: getColor(position),
                          borderRadius: '50%',
                          position: 'absolute',
                          top: `${row * (dotSize + 1)}px`,
                          left: `${col * (dotSize + 1)}px`
                      }}
                  ></div>
              );
          })}
      </div>
  );
}

export default TextBlock;
