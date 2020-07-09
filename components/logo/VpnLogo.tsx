import React from 'react';

interface Props {
    className?: string;
}
const VpnLogo = ({ className = 'logo' }: Props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 89.6 15.1"
            className={className}
            aria-labelledby="logo__title"
        >
            <g>
                <path d="M19.7,3.7h-3v11.1h1.9v-3.9h1.1c1.1,0.1,2.2-0.2,3.1-0.9s1.3-1.7,1.3-2.8C24.1,5,22.5,3.7,19.7,3.7z M18.6,5.3h1.1c1.6,0,2.4,0.6,2.4,2c0.1,0.6-0.2,1.2-0.6,1.6c-0.5,0.3-1.2,0.5-1.8,0.4h-1.1V5.3z" />
                <path d="M29.4,6c-0.9,0-1.6,0.5-2,1.2l-0.1-1h-1.6v8.6h1.8V10c0.3-1.5,0.8-2.1,1.7-2.1c0.2,0,0.4,0,0.7,0.1l0.2,0.1l0.3-1.8h-0.2C29.9,6.1,29.6,6,29.4,6z" />
                <path d="M34.7,6c-1.1,0-2.2,0.4-2.9,1.3c-1.3,1.9-1.3,4.5,0,6.5c1.5,1.6,3.9,1.7,5.5,0.2c0.1-0.1,0.2-0.1,0.2-0.2c1.3-1.9,1.3-4.5,0-6.5C36.8,6.5,35.8,6,34.7,6z M34.7,13.4c-1.3,0-1.9-0.9-1.9-2.9c-0.1-0.8,0.1-1.6,0.5-2.2c0.3-0.5,0.8-0.7,1.4-0.7c0.5,0,1.1,0.2,1.4,0.7c0.4,0.7,0.6,1.5,0.5,2.2C36.6,12.5,36,13.4,34.7,13.4z" />
                <path d="M44.1,13.1c-0.3,0.2-0.6,0.3-1,0.3c-0.5,0-0.8-0.2-0.8-1V7.7h1.8l0.2-1.5h-2v-2l-1.7,0.2v1.8h-1.4v1.5h1.4v4.7c0,0.7,0.2,1.4,0.6,1.9c0.5,0.5,1.1,0.7,1.8,0.7s1.4-0.2,1.9-0.6l0.2-0.1L44.4,13L44.1,13.1z" />
                <path d="M49.2,6c-1.1,0-2.2,0.4-2.9,1.3c-1.3,1.9-1.3,4.5,0,6.5c1.5,1.6,3.9,1.7,5.5,0.2c0.1-0.1,0.2-0.1,0.2-0.2c1.3-1.9,1.3-4.5,0-6.5C51.3,6.5,50.3,6,49.2,6z M49.2,13.4c-1.3,0-1.9-0.9-1.9-2.9c-0.1-0.8,0.1-1.6,0.5-2.2c0.3-0.5,0.8-0.7,1.4-0.7c0.5,0,1.1,0.2,1.4,0.7c0.4,0.7,0.6,1.5,0.5,2.2C51.1,12.5,50.4,13.4,49.2,13.4z" />
                <path d="M59,6c-0.5,0-1.1,0.1-1.5,0.4c-0.3,0.2-0.6,0.4-0.8,0.6l-0.1-0.9H55v8.6h1.9V8.9C57.5,8,58,7.6,58.8,7.6c0.6,0,1.1,0.2,1.1,1.4v5.9h1.9V8.7c0-0.7-0.2-1.4-0.7-2C60.4,6.3,59.7,6,59,6z" />
                <path d="M67.1,12.3l-2.5-8.5h-2l3.6,11.1H68l3.5-11.1h-1.9L67.1,12.3z" />
                <path d="M75.7,3.7h-3v11.1h1.9v-3.9h1.1c1.1,0.1,2.2-0.2,3.1-0.9s1.3-1.7,1.3-2.8C80.1,5,78.5,3.7,75.7,3.7z M74.6,5.3h1.1c1.6,0,2.4,0.6,2.4,2c0.1,0.6-0.2,1.2-0.6,1.6c-0.5,0.3-1.2,0.5-1.8,0.4h-1.1V5.3z" />
                <path d="M87.8,3.7v6c0,0.7,0,1.5,0.1,2.1L84,3.7h-2.3v11.1h1.8V9.7c0-1.3-0.1-2.3-0.1-3l3.9,8.1h2.3V3.7H87.8z" />
            </g>
            <g>
                <path d="M12.5,2.9c0-0.8-0.7-1.5-1.5-1.5S9.5,2.1,9.5,2.9l0,0l0,0L2.8,5.1C2.3,4.4,1.4,4.2,0.7,4.7s-0.9,1.4-0.4,2.1l0,0C0.6,7.2,1,7.5,1.6,7.5c0.1,0,0.3-0.1,0.4-0.1l4.4,5.5c-0.3,0.8,0,1.7,0.8,2l0,0c0.8,0.3,1.7,0,2-0.8c0.3-0.6,0.1-1.3-0.4-1.7l2.3-8C11.9,4.4,12.5,3.7,12.5,2.9L12.5,2.9z M7.8,11.9c-0.2,0-0.5,0.1-0.7,0.2L2.8,6.7C3,6.5,3,6.3,3,6.1L9.8,4C9.9,4.1,10,4.1,10,4.2L7.8,11.9L7.8,11.9L7.8,11.9z" />
            </g>
            <title id="logo__title">ProtonVPN</title>
        </svg>
    );
};

export default VpnLogo;