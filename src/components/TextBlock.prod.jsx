function TextBlock({ searchTerms, data, textLength }) {
    const maxDisplayWidth = 800;
    const maxDisplayHeight = 300;
    const dotSize = 5;
    const minOpacity = 0.5;
    const grayRowHeight = 10;
    const whiteRowHeight = 5;
    const totalRowHeight = grayRowHeight + whiteRowHeight;
    const colors = ["255, 0, 0", "0, 128, 128", "0, 0, 255", "128, 0, 128", "255, 165, 0"];

    const maxDotsInWidth = Math.floor(maxDisplayWidth / dotSize);
    const maxDotsInHeight = Math.floor(maxDisplayHeight / totalRowHeight);
    const centeringOffset = (grayRowHeight - dotSize) / 2;

    const frequencyMap = {};
    const colorMap = {};

    let maxPosition = 0;
    for (let term in data) {
        const occurrences = data[term] || [];
        for (let position of occurrences) {
            if (position > maxPosition) {
                maxPosition = position;
            }
        }
    }
    const getColor = (count, color) => {
        let opacity = Math.min(1, minOpacity + Math.log(count + 1) / 10);
        return `rgba(${color}, ${opacity})`;
    };

    searchTerms.forEach((term, index) => {
        const occurrences = data[term] || [];
        const color = colors[index % colors.length];

        occurrences.forEach((position) => {
            const normalizedPosition = Math.floor((position / maxPosition) * (maxDotsInWidth * maxDotsInHeight));
            const normalizedRow = Math.floor(normalizedPosition / maxDotsInWidth) % maxDotsInHeight;
            const normalizedCol = normalizedPosition % maxDotsInWidth;
            const key = `${normalizedRow}-${normalizedCol}`;

            frequencyMap[key] = (frequencyMap[key] || 0) + 1;
            colorMap[key] = color;
        });
    });

    return (
        <div style={{ 
            height: `${maxDisplayHeight}px`, 
            width: `${maxDisplayWidth}px`, 
            position: 'relative' 
        }}>
            {Array.from({ length: maxDotsInHeight }).map((_, rowIndex) => (
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
                const color = colorMap[key];
                return (
                    <div
                        key={index}
                        style={{
                            height: `${dotSize}px`,
                            width: `${dotSize}px`,
                            background: getColor(count, color),
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

