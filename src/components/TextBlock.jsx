function TextBlock({ text, searchTerm, data }) {
  const maxDisplayWidth = 800;  // Desired maximum width of the display area
  const maxDisplayHeight = 30;  // Desired maximum height of the display area
  const dotSize = 5;  // Diameter of each dot

  const occurrences = data[searchTerm] || [];
  const textLength = 10000;

  const dotsPerRow = Math.floor(maxDisplayWidth / (dotSize + 1));
  const totalRows = Math.ceil(textLength / dotsPerRow);
  const potentialHeight = totalRows * (dotSize + 1);
  const displayHeight = Math.min(potentialHeight, maxDisplayHeight);

  const getColor = (position) => {
      // Count overlaps by filtering occurrences within a close range
      const closeOccurrences = occurrences.filter(
          pos => Math.abs(pos - position) < (textLength / displayHeight) * dotSize
      ).length;
      const opacity = Math.min(closeOccurrences / 5, 1);  // Adjust divisor for desired brightness scaling
      return `rgba(255, 0, 0, ${opacity})`;
  };

  return (
      <div style={{ height: `${displayHeight}px`, width: `${maxDisplayWidth}px`, position: 'relative' }}>
          {occurrences.map((position, index) => {
              const relativePosition = (position / textLength) * displayHeight;

              // Calculate row and col based on the position in the text
              const row = Math.floor(position / dotsPerRow);
              const col = position % dotsPerRow;

              return (
                  <div
                      key={index}
                      style={{
                          height: `${dotSize}px`,
                          width: `${dotSize}px`,
                          background: getColor(position),
                          borderRadius: '50%',  // Makes the shape a circle
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
