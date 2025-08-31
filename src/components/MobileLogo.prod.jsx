'use client';

import { useState, useEffect } from 'react';
import LogoSVG from '../../public/images/genji_logo.svg';

const MobileLogo = ({ className }) => {
    const [logoSize, setLogoSize] = useState({ width: 220, height: 60 });

    useEffect(() => {
        const updateLogoSize = () => {
            const width = window.innerWidth;
            if (width <= 360) {
                setLogoSize({ width: 170, height: 45 });
            } else if (width <= 480) {
                setLogoSize({ width: 200, height: 55 });
            } else {
                setLogoSize({ width: 220, height: 60 });
            }
        };

        updateLogoSize();
        window.addEventListener('resize', updateLogoSize);
        return () => window.removeEventListener('resize', updateLogoSize);
    }, []);

    return (
        <div className={className} style={{
            width: `${logoSize.width}px`,
            height: `${logoSize.height}px`,
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
        }}>
            <LogoSVG 
                style={{
                    width: `${logoSize.width}px`,
                    height: `${logoSize.height}px`,
                    maxWidth: `${logoSize.width}px`,
                    maxHeight: `${logoSize.height}px`,
                    objectFit: 'contain',
                    display: 'block'
                }}
                width={logoSize.width.toString()}
                height={logoSize.height.toString()}
                viewBox="40 0 200 70"
                preserveAspectRatio="xMinYMid meet"
            />
        </div>
    );
};

export default MobileLogo;
