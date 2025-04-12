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

            // First capture links with potential formatting inside them
            const linkPattern = /\[(.*?)\]\((.*?)\)/g;
            const otherPattern = /(\*\*\*.*?\*\*\*|\*\*.*?\*\*|_.*?_|\*.*?\*)/g;
            
            let replacedLine = line;
            const linkMatches = [];
            
            // First process all links and store them
            let linkMatch = linkPattern.exec(line);
            while (linkMatch !== null) {
                const fullMatch = linkMatch[0];
                const linkText = linkMatch[1];
                const url = linkMatch[2];
                
                // Store link information
                linkMatches.push({
                    fullMatch,
                    linkText,
                    url,
                    startIndex: linkMatch.index,
                    endIndex: linkMatch.index + fullMatch.length
                });
                
                linkMatch = linkPattern.exec(line);
            }
            
            // Sort links by their position in text
            linkMatches.sort((a, b) => a.startIndex - b.startIndex);
            
            // Process the line with links and other formatting
            if (linkMatches.length > 0) {
                let lastIndex = 0;
                
                for (const link of linkMatches) {
                    // Add plain text before the link
                    if (link.startIndex > lastIndex) {
                        lineList.push({ type: 'plain', text: line.slice(lastIndex, link.startIndex) });
                    }
                    
                    // Process the link text for formatting
                    const formattedLinkText = [];
                    let currentIndex = 0;
                    
                    // Check for formatting within link text
                    let formatMatch = otherPattern.exec(link.linkText);
                    while (formatMatch !== null) {
                        // Add plain text before formatted part
                        if (formatMatch.index > currentIndex) {
                            formattedLinkText.push({ 
                                type: 'plain', 
                                text: link.linkText.slice(currentIndex, formatMatch.index) 
                            });
                        }
                        
                        const formatText = formatMatch[0];
                        
                        if (formatText.indexOf('***') === 0 && formatText.lastIndexOf('***') === formatText.length - 3) {
                            formattedLinkText.push({ type: 'bolditalic', text: formatText.slice(3, -3) });
                        } else if (formatText.indexOf('**') === 0 && formatText.lastIndexOf('**') === formatText.length - 2) {
                            formattedLinkText.push({ type: 'bold', text: formatText.slice(2, -2) });
                        } else if ((formatText.indexOf('_') === 0 && formatText.lastIndexOf('_') === formatText.length - 1) ||
                                  (formatText.indexOf('*') === 0 && formatText.lastIndexOf('*') === formatText.length - 1)) {
                            formattedLinkText.push({ type: 'italic', text: formatText.slice(1, -1) });
                        } else {
                            formattedLinkText.push({ type: 'plain', text: formatText });
                        }
                        
                        currentIndex = formatMatch.index + formatMatch[0].length;
                        formatMatch = otherPattern.exec(link.linkText);
                    }
                    
                    // Add remaining plain text in link
                    if (currentIndex < link.linkText.length) {
                        formattedLinkText.push({ 
                            type: 'plain', 
                            text: link.linkText.slice(currentIndex) 
                        });
                    }
                    
                    // If no formatting found, keep simple link
                    if (formattedLinkText.length === 0) {
                        lineList.push({ 
                            type: 'link', 
                            text: link.linkText,
                            url: link.url
                        });
                    } else {
                        // Add link with formatting
                        lineList.push({ 
                            type: 'formattedLink', 
                            content: formattedLinkText.length > 0 ? formattedLinkText : [{ type: 'plain', text: link.linkText }],
                            url: link.url
                        });
                    }
                    
                    lastIndex = link.endIndex;
                }
                
                // Add remaining text after the last link
                if (lastIndex < line.length) {
                    // Process regular formatting in the remaining text
                    let remainingText = line.slice(lastIndex);
                    let match = otherPattern.exec(remainingText);
                    let remainingLastIndex = 0;
                    
                    while (match !== null) {
                        if (match.index > remainingLastIndex) {
                            lineList.push({ type: 'plain', text: remainingText.slice(remainingLastIndex, match.index) });
                        }
                        
                        const formatText = match[0];
                        
                        if (formatText.indexOf('***') === 0 && formatText.lastIndexOf('***') === formatText.length - 3) {
                            lineList.push({ type: 'bolditalic', text: formatText.slice(3, -3) });
                        } else if (formatText.indexOf('**') === 0 && formatText.lastIndexOf('**') === formatText.length - 2) {
                            lineList.push({ type: 'bold', text: formatText.slice(2, -2) });
                        } else if ((formatText.indexOf('_') === 0 && formatText.lastIndexOf('_') === formatText.length - 1) ||
                                  (formatText.indexOf('*') === 0 && formatText.lastIndexOf('*') === formatText.length - 1)) {
                            lineList.push({ type: 'italic', text: formatText.slice(1, -1) });
                        } else {
                            lineList.push({ type: 'plain', text: formatText });
                        }
                        
                        remainingLastIndex = match.index + match[0].length;
                        match = otherPattern.exec(remainingText);
                    }
                    
                    if (remainingLastIndex < remainingText.length) {
                        lineList.push({ type: 'plain', text: remainingText.slice(remainingLastIndex) });
                    }
                }
            } else {
                // If no links, process as before
                let match = otherPattern.exec(line);
                while (match !== null) {
                    if (match.index > curIndex) {
                        lineList.push({ type: 'plain', text: line.slice(curIndex, match.index) });
                    }
                    
                    const formatText = match[0];
                    
                    if (formatText.indexOf('***') === 0 && formatText.lastIndexOf('***') === formatText.length - 3) {
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
                    match = otherPattern.exec(line);
                }
                
                if (curIndex < line.length) {
                    lineList.push({ type: 'plain', text: line.slice(curIndex) });
                }
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
                                case 'formattedLink':
                                    return (
                                        <a 
                                            key={index} 
                                            href={item.url}
                                            className="text-blue-600 hover:text-blue-800 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.content.map((formatItem, formatIndex) => {
                                                switch (formatItem.type) {
                                                    case 'bold':
                                                        return <strong key={formatIndex} className="font-bold">{formatItem.text}</strong>;
                                                    case 'italic':
                                                        return <em key={formatIndex} className="italic">{formatItem.text}</em>;
                                                    case 'bolditalic':
                                                        return <strong key={formatIndex} className="font-bold italic">{formatItem.text}</strong>;
                                                    default:
                                                        return <span key={formatIndex}>{formatItem.text}</span>;
                                                }
                                            })}
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