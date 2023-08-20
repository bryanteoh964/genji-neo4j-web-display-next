function TextBlock({ text, searchTerm, data }) {
    const maxDisplayWidth = 800;
    const maxDisplayHeight = 300;
    const dotSize = 5;
    const minOpacity = 0.5;
    const grayRowHeight = 10;  // Adjust this as needed
    const whiteRowHeight = 5;  // Adjust this as needed
    const totalRowHeight = grayRowHeight + whiteRowHeight;

    const textLength = 1000;
    const occurrences = data[searchTerm] || [];

    const maxDotsInWidth = Math.floor(maxDisplayWidth / dotSize);
    const maxDotsInHeight = Math.floor(maxDisplayHeight / totalRowHeight);

    const normalizePosition = (position) => {
        const normalizedRow = Math.floor(position / maxDotsInWidth) % maxDotsInHeight;
        const normalizedCol = position % maxDotsInWidth;
        return { row: normalizedRow, col: normalizedCol };
    };

    const frequencyMap = {};
    occurrences.forEach((position) => {
        const { row, col } = normalizePosition(position);
        const key = `${row}-${col}`;
        frequencyMap[key] = (frequencyMap[key] || 0) + 1;
    });

    const getColor = (count) => {
        let opacity = Math.min(1, minOpacity + Math.log(count + 1) / 10);
        return `rgba(255, 0, 0, ${opacity})`;
    };

    const numRows = Math.floor(maxDisplayHeight / totalRowHeight);
    const centeringOffset = (grayRowHeight - dotSize) / 2;

    return (
        <div style={{ 
            height: `${maxDisplayHeight}px`, 
            width: `${maxDisplayWidth}px`, 
            position: 'relative' 
        }}>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
                <div key={rowIndex}
                    style={{
                        height: `${grayRowHeight}px`,
                        width: `${maxDisplayWidth}px`,
                        background: 'lightgray',
                        position: 'absolute',
                        top: `${rowIndex * totalRowHeight}px`,
                    }}
                />
            ))}
            {Object.keys(frequencyMap).map((key, index) => {
                const [row, col] = key.split('-').map(Number);
                const count = frequencyMap[key];
                return (
                    <div
                        key={index}
                        style={{
                            height: `${dotSize}px`,
                            width: `${dotSize}px`,
                            background: getColor(count),
                            borderRadius: '50%',
                            position: 'absolute',
                            top: `${row * totalRowHeight + centeringOffset}px`,
                            left: `${col * dotSize}px`
                        }}
                    ></div>
                );
            })}
        </div>
    );
}

export default TextBlock;
