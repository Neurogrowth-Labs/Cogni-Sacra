import React from 'react';

interface CogniSacraLogoProps {
    className?: string;
}

const CogniSacraLogo: React.FC<CogniSacraLogoProps> = ({ className = '' }) => (
    <img
        src="/cogni-sacra.jpeg"
        alt="CogniSacra Logo"
        className={`object-contain ${className}`}
    />
);

export default CogniSacraLogo;
