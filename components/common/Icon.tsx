import React from 'react';

interface IconProps {
    name: string;
    className?: string;
    fab?: boolean; // for font-awesome brands
}

const Icon: React.FC<IconProps> = ({ name, className = '', fab = false }) => {
    const prefix = fab ? 'fab' : 'fas';
    return <i className={`${prefix} fa-${name} ${className}`} aria-hidden="true"></i>;
};

export default Icon;