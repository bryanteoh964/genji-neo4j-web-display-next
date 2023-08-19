function TextBlock({ text, searchTerm, data }) {
    const maxDisplayWidth = 800;
    const maxDisplayHeight = 300;
    const dotSize = 5;
    const minOpacity = 0.5;  // Minimum opacity for a single occurrence

    const textLength = 10000;  // Use text length
    const occurrences = data[searchTerm] || [];

    const maxDotsInWidth = Math.floor(maxDisplayWidth / dotSize);
    const maxDotsInHeight = Math.floor(maxDisplayHeight / dotSize);

    // Normalize the positions to fit within the max dimensions
    const normalizePosition = (position) => {
        const normalizedRow = Math.floor(position / maxDotsInWidth) % maxDotsInHeight;
        const normalizedCol = position % maxDotsInWidth;
        return { row: normalizedRow, col: normalizedCol };
    };

    // Frequency map for overlapping dots
    const frequencyMap = {};

    occurrences.forEach((position) => {
        const { row, col } = normalizePosition(position);
        const key = `${row}-${col}`;
        frequencyMap[key] = (frequencyMap[key] || 0) + 1;
    });

    const getColor = (count) => {
        let opacity = Math.min(count / 10, 1);
        opacity = Math.max(opacity, minOpacity);
        return `rgba(255, 0, 0, ${opacity})`;
    };

    return (
        <div style={{ 
            height: `${maxDisplayHeight}px`, 
            width: `${maxDisplayWidth}px`, 
            background: 'lightgray', 
            position: 'relative' 
        }}>
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
                            top: `${row * dotSize}px`,
                            left: `${col * dotSize}px`
                        }}
                    ></div>
                );
            })}
        </div>
    );
}

export default TextBlock;
