import React from 'react';

const CogniSacraLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50 0 L10 10 V60 C10 90, 50 120, 50 120 C50 120, 90 90, 90 60 V10 L50 0 Z" fill="#A51C30" />
        <text x="50" y="60" textAnchor="middle" fontFamily="serif" fontSize="24" fill="white" fontWeight="bold" letterSpacing="2">
            <tspan x="38" y="45">VE</tspan>
            <tspan x="62" y="45">RI</tspan>
            <tspan x="50" y="80">TAS</tspan>
        </text>
        <path d="M25 60 H 75" stroke="white" strokeWidth="2" />
    </svg>
);

export default CogniSacraLogo;
