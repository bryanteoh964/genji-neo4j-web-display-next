import React from 'react';

const FormatText = ({ text, className }) => {
    const parseText = (text) => {
        const str = String(text || '');
        const list = [];
        let curIndex = 0;

        const lines = str.split('\n');

        return lines.map((line, lineIndex) => {
            const lineList = [];
            curIndex = 0;

            // pattern for italic, bold, bolditalic
            const pattern = /(\[.*?\]\(.*?\)|\*\*\*.*?\*\*\*|\*\*.*?\*\*|_.*?_|\*.*?\*)/g;
            
            let match = pattern.exec(line);
            while (match !== null) {
                // plain text part before the first pattern appears
                if (match.index > curIndex) {
                    lineList.push({ type: 'plain', text: line.slice(curIndex, match.index) });
                }
                
                // middle part
                const formatText = match[0];

                if (formatText.indexOf('[') === 0 && formatText.includes('](')) {
                    const linkMatch = formatText.match(/\[(.*?)\]\((.*?)\)/);
                    if (linkMatch) {
                        lineList.push({ 
                            type: 'link', 
                            text: linkMatch[1],  // url title
                            url: linkMatch[2]    // url
                        });
                    }
                } else if (formatText.indexOf('***') === 0 && formatText.lastIndexOf('***') === formatText.length - 3) {
                    lineList.push({ type: 'bolditalic', text: formatText.slice(3, -3) });
                } else if (formatText.indexOf('**') === 0 && formatText.lastIndexOf('**') === formatText.length - 2) {
                    lineList.push({ type: 'bold', text: formatText.slice(2, -2) });
                } else if ((formatText.indexOf('_') === 0 && formatText.lastIndexOf('_') === formatText.length - 1) ||
                          (formatText.indexOf('*') === 0 && formatText.lastIndexOf('*') === formatText.length - 1)) {
                    lineList.push({ type: 'italic', text: formatText.slice(1, -1) });
                } else {
                    lineList.push({ type: 'plain', text: formatText });
                }
                
                curIndex = match.index + match[0].length;
                match = pattern.exec(line);
            }

            // the rest part after the last patterned text
            if (curIndex < line.length) {
                lineList.push({ type: 'plain', text: line.slice(curIndex) });
            }

            return {
                type: 'line',
                content: lineList,
                isLastLine: lineIndex === lines.length - 1
            };
        });
    };

    if (!text) {
        return null;
    }

    const paragraphClassName = className ? `${className} mb-4` : "mb-4";

    return (
        <div className={paragraphClassName}>
            <p>
                {parseText(text).map((line, lineIndex) => (
                    <React.Fragment key={lineIndex}>
                        {line.content.map((item, index) => {
                            switch (item.type) {
                                case 'bold':
                                    return <strong key={index} className="font-bold">{item.text}</strong>;
                                case 'italic':
                                    return <em key={index} className="italic">{item.text}</em>;
                                case 'bolditalic':
                                    return <strong key={index} className="font-bold italic">{item.text}</strong>;
                                case 'link':
                                    return (
                                        <a 
                                            key={index} 
                                            href={item.url}
                                            className="text-blue-600 hover:text-blue-800 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.text}
                                        </a>
                                    );
                                default:
                                    return <span key={index}>{item.text}</span>;
                            }
                        })}
                        {!line.isLastLine && <br />}
                    </React.Fragment>
                ))}
            </p>
        </div>
    );
};

const FormatContent = ({ content, className }) => {
    if (!content) {
        return null;
    }

    try {
        // format each paragraph and combine them
        const paragraphs = String(content)
            .split(/\\n/)
            .map(p => p.trim())
            .filter(p => p.length > 0);

        const containerClassName = className ? `${className} space-y-4` : "space-y-4";

        return (
            <div className={containerClassName}>
                {paragraphs.map((paragraph, index) => (
                    <FormatText key={index} text={paragraph} className={className} />
                ))}
            </div>
        );
    } catch (error) {
        console.error('Error formatting content:', error);
        return <div>Error formatting content</div>;
    }
};

export default FormatContent;