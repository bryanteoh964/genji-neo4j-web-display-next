// turn italic, bold, bolditalic text in database from markdown to html component
import React from 'react';

const FormatText = ({ text }) => {
    const parseText = (text) => {

        const str = String(text || '');
        const list = [];
        let curIndex = 0;

        // pattern for italic, bold, bolditalic
        const pattern = /(\[.*?\]\(.*?\)|\*\*\*.*?\*\*\*|\*\*.*?\*\*|_.*?_|\*.*?\*)/g;
        
        let match = pattern.exec(str);
        while (match !== null) {
            // plain text part before the first pattern appears
            if (match.index > curIndex) {
                list.push({ type: 'plain', text: str.slice(curIndex, match.index) });
            }
            
            // middle part
            const formatText = match[0];

            if (formatText.indexOf('[') === 0 && formatText.includes('](')) {
                const linkMatch = formatText.match(/\[(.*?)\]\((.*?)\)/);
                if (linkMatch) {
                    list.push({ 
                        type: 'link', 
                        text: linkMatch[1],  // url title
                        url: linkMatch[2]    // url
                    });
                }
            } else if (formatText.indexOf('***') === 0 && formatText.lastIndexOf('***') === formatText.length - 3) {
                list.push({ type: 'bolditalic', text: formatText.slice(3, -3) });
            } else if (formatText.indexOf('**') === 0 && formatText.lastIndexOf('**') === formatText.length - 2) {
                list.push({ type: 'bold', text: formatText.slice(2, -2) });
            } else if ((formatText.indexOf('_') === 0 && formatText.lastIndexOf('_') === formatText.length - 1) ||
                      (formatText.indexOf('*') === 0 && formatText.lastIndexOf('*') === formatText.length - 1)) {
                list.push({ type: 'italic', text: formatText.slice(1, -1) });
            } else {
                list.push({ type: 'plain', text: formatText });
            }
            
            curIndex = match.index + match[0].length;
            match = pattern.exec(str);
        }

        // the rest part after the last patterned text
        if (curIndex < str.length) {
            list.push({ type: 'plain', text: str.slice(curIndex) });
        }

        return list;
    };

    if (!text) {
        return null;
    }

    return (
        <p className="mb-4">
            {parseText(text).map((list, index) => {
                switch (list.type) {
                    case 'bold':
                        return <strong key={index} className="font-bold">{list.text}</strong>;
                    case 'italic':
                        return <em key={index} className="italic">{list.text}</em>;
                    case 'bolditalic':
                        return <strong key={index} className="font-bold italic">{list.text}</strong>;
                    case 'link':
                        return (
                            <a 
                                key={index} 
                                href={list.url}
                                className="text-blue-600 hover:text-blue-800 underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {list.text}
                            </a>
                        );
                    default:
                        return <span key={index}>{list.text}</span>;
                }
            })}
        </p>
    );
};

const FormatContent = ({ content }) => {
    if (!content) {
        return null;
    }

    try {
        // format each paragraph and combine them
        const paragraphs = String(content)
            .split(/\\n/)
            .map(p => p.trim())
            .filter(p => p.length > 0);

        return (
            <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                    <FormatText key={index} text={paragraph} />
                ))}
            </div>
        );
    } catch (error) {
        console.error('Error formatting content:', error);
        return <div>Error formatting content</div>;
    }
};

export default FormatContent;