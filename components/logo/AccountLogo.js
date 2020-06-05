import React from 'react';
import PropTypes from 'prop-types';

const AccountLogo = ({ className = 'logo' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 119 15.1"
            className={className}
            aria-labelledby="logo__title"
        >
            <g>
                <path d="M23.9,7.1c0,2.5-1.8,3.6-4.3,3.6h-1.3v3.8h-2.1V3.6h3.2C22.2,3.6,23.9,4.7,23.9,7.1z M21.7,7.1c0-1.4-0.8-1.9-2.3-1.9h-1.1v4h1.1C20.8,9.1,21.7,8.7,21.7,7.1z" />
                <path d="M30.1,6.1L29.7,8c-0.2-0.1-0.5-0.1-0.7-0.1c-1,0-1.5,0.7-1.8,2.1v4.4h-2V6.2h1.7l0.2,1.6c0.4-1.2,1.2-1.9,2.2-1.9C29.5,5.9,29.8,6,30.1,6.1z" />
                <path d="M38.3,10.3c0,2.6-1.5,4.4-3.9,4.4c-2.5,0-3.9-1.7-3.9-4.4c0-2.6,1.5-4.4,3.9-4.4S38.3,7.6,38.3,10.3z M32.6,10.3c0,2,0.6,2.9,1.8,2.9c1.2,0,1.8-0.9,1.8-2.9s-0.6-2.9-1.8-2.9S32.6,8.3,32.6,10.3L32.6,10.3z" />
                <path d="M44.7,14.1c-0.6,0.4-1.3,0.6-2.1,0.6c-1.6,0-2.5-0.9-2.5-2.7V7.6h-1.3V6.2h1.3V4.3l2-0.2v2.1H44l-0.2,1.4h-1.7V12c0,0.8,0.3,1.1,0.9,1.1c0.4,0,0.7-0.1,1-0.3L44.7,14.1z" />
                <path d="M52.5,10.3c0,2.6-1.5,4.4-3.9,4.4c-2.5,0-3.9-1.7-3.9-4.4c0-2.6,1.5-4.4,3.9-4.4S52.5,7.6,52.5,10.3z M46.8,10.3c0,2,0.6,2.9,1.8,2.9c1.2,0,1.8-0.9,1.8-2.9s-0.6-2.9-1.8-2.9S46.8,8.3,46.8,10.3z" />
                <path d="M60.9,8.5v6h-2V8.8c0-1-0.4-1.3-1-1.3c-0.7,0-1.3,0.5-1.7,1.3v5.8h-2V6.2h1.7L56,7.2c0.6-0.8,1.5-1.3,2.5-1.3C60,5.9,60.9,6.9,60.9,8.5z" />
                <path d="M68.6,12H65l-0.7,2.5h-2.2l3.4-10.9h2.6l3.4,10.9h-2.2L68.6,12z M68.2,10.4l-1.4-5.2l-1.4,5.2H68.2z" />
                <path d="M78.7,6.9l-0.9,1.2c-0.5-0.4-1.1-0.6-1.7-0.6c-1.2,0-1.9,0.9-1.9,2.8s0.7,2.7,1.9,2.7c0.6,0,1.1-0.2,1.7-0.6l0.9,1.3c-0.8,0.6-1.7,1-2.7,1c-2.4,0-3.9-1.7-3.9-4.3s1.5-4.5,3.9-4.5C77,5.9,78,6.2,78.7,6.9z" />
                <path d="M86,6.9l-0.9,1.2c-0.5-0.4-1.1-0.6-1.7-0.6c-1.2,0-1.9,0.9-1.9,2.8s0.7,2.7,1.9,2.7c0.6,0,1.1-0.2,1.7-0.6l0.9,1.3c-0.8,0.6-1.7,1-2.7,1c-2.4,0-3.9-1.7-3.9-4.3s1.5-4.5,3.9-4.5C84.3,5.9,85.2,6.2,86,6.9z" />
                <path d="M94.5,10.3c0,2.6-1.5,4.4-3.9,4.4c-2.5,0-3.9-1.7-3.9-4.4c0-2.6,1.5-4.4,3.9-4.4S94.5,7.6,94.5,10.3z M88.8,10.3c0,2,0.6,2.9,1.8,2.9s1.8-0.9,1.8-2.9s-0.6-2.9-1.8-2.9C89.4,7.5,88.8,8.3,88.8,10.3L88.8,10.3z" />
                <path d="M102.7,14.5h-1.7l-0.1-1.2c-0.6,0.9-1.4,1.4-2.5,1.4c-1.5,0-2.3-1-2.3-2.6v-6h2v5.7c0,1,0.3,1.3,1,1.3c0.7,0,1.3-0.5,1.7-1.2V6.2h2L102.7,14.5z" />
                <path d="M111.5,8.5v6h-2V8.8c0-1-0.4-1.3-1-1.3c-0.7,0-1.3,0.5-1.7,1.3v5.8h-2V6.2h1.7l0.2,1.1c0.6-0.8,1.5-1.3,2.5-1.3C110.7,5.9,111.5,6.9,111.5,8.5z" />
                <path d="M118.6,14.1c-0.6,0.4-1.3,0.6-2.1,0.6c-1.6,0-2.5-0.9-2.5-2.7V7.6h-1.3V6.2h1.3V4.3l2-0.2v2.1h1.9l-0.2,1.4H116V12c0,0.8,0.3,1.1,0.9,1.1c0.4,0,0.7-0.1,1-0.3L118.6,14.1z" />
            </g>
            <g>
                <path d="M6.5,3.5c2.7,0,5,2.2,5,5s-2.2,5-5,5s-5-2.2-5-5S3.8,3.5,6.5,3.5 M6.5,2C2.9,2,0,4.9,0,8.5S2.9,15,6.5,15S13,12.1,13,8.5S10.1,2,6.5,2z" />
                <path d="M6.5,5.4c-0.9,0-1.7,0.8-1.7,1.7c0,0.9,0.8,1.7,1.7,1.7s1.7-0.8,1.7-1.7C8.2,6.2,7.4,5.4,6.5,5.4z" />
                <path d="M3.1,11.1c0-1.2,2.1-1.7,3.6-1.7s3.2,0.7,3.2,1.7c0,0-0.9,1.7-3.2,1.7C4.1,12.8,3.1,11.1,3.1,11.1z" />
            </g>
            <title id="logo__title">ProtonAccount</title>
        </svg>
    );
};

AccountLogo.propTypes = {
    className: PropTypes.string
};

export default AccountLogo;
