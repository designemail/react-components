import React from 'react';
import PropTypes from 'prop-types';

const ProtonLogo = ({ className = 'fill-currentColor' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-labelledby="protonLogo__title"
            height="17"
            width="70"
        >
            <path d="M23.43 7.5c0 .93-.215 1.644-.715 2-.428.358-1.071.5-2 .5h-1.5V5.144h1.5c1.858 0 2.715.786 2.715 2.358zm.928-3.214c-.928-.643-2.214-1-3.857-1h-3.643v13.43h2.286V11.93H20.5c1.643 0 2.857-.358 3.786-1 1-.786 1.5-1.93 1.5-3.43.071-1.356-.429-2.5-1.429-3.214M32.002 6.072c-.643 0-1.215.214-1.643.572-.286.214-.572.571-.786.928l-.143-1.286h-2v10.358h2.214v-6c.143-.572.715-2.429 2.072-2.429.286 0 .5.071.786.071l.285.072.429-2.214-.214-.072c-.286.072-.643 0-1 0M38.002 14.787c-1.572 0-2.286-1.143-2.286-3.5 0-1.215.214-2.143.643-2.715.357-.571.929-.786 1.714-.786.786 0 1.286.286 1.643.786.429.572.643 1.5.643 2.715-.071 2.357-.786 3.5-2.357 3.5zm0-8.93c-1.429 0-2.643.572-3.429 1.5-.786.93-1.214 2.287-1.214 3.93 0 1.643.428 2.928 1.214 3.928s2 1.5 3.429 1.5c1.429 0 2.643-.571 3.429-1.5.785-.928 1.214-2.285 1.214-3.928 0-1.643-.429-2.93-1.214-3.93-.786-1-2-1.5-3.43-1.5M49.217 14.358c-.429.286-.786.429-1.143.429-.572 0-.929-.214-.929-1.215V7.93h2.215l.285-1.785h-2.571v-2.5l-2.215.214v2.214h-1.571v1.786h1.571V13.5c0 2 1.072 3.143 2.93 3.143.928 0 1.713-.286 2.356-.714l.215-.143-.929-1.643-.214.214M55.146 14.787c-1.572 0-2.286-1.143-2.286-3.5 0-1.215.214-2.143.643-2.715.357-.571.928-.786 1.714-.786.786 0 1.286.286 1.643.786.429.572.643 1.5.643 2.715-.072 2.357-.786 3.5-2.357 3.5zm0-8.93c-1.43 0-2.643.572-3.43 1.5-.785.93-1.214 2.287-1.214 3.93 0 1.643.43 2.928 1.215 3.928.786 1 2 1.5 3.429 1.5 1.428 0 2.643-.571 3.428-1.5.786-.928 1.215-2.285 1.215-3.928 0-1.643-.429-2.93-1.215-3.93-.785-1-2-1.5-3.428-1.5M66.86 6.072a4.168 4.168 0 00-2.928 1.214l-.072-1h-1.928v10.358h2.214V9.358c.357-.5 1.143-1.429 2.214-1.429.929 0 1.286.357 1.286 1.429v7.286h2.215V9.287c0-1-.215-1.786-.643-2.286-.572-.643-1.358-.929-2.358-.929" />
            <g>
                <path d="M5.929 14.144c-.286 0-.786-.072-1.357-.5C4 13.215 0 10.358 0 10.358v5.643c0 .214 0 .643.643.643h10.643c.643 0 .643-.5.643-.643v-5.643s-4 2.857-4.571 3.286c-.643.428-1.143.5-1.43.5z" />
                <path d="M5.929 0S0-.143 0 5.286V8.93c0 .429.071.429 1.143 1.286 3.429 2.5 4 3.072 4.786 3.072.786 0 1.357-.572 4.786-3.072 1.143-.786 1.143-.857 1.143-1.286V5.286C11.929-.143 5.928 0 5.928 0zm3.429 7.644H2.572V5.358C2.572 2.643 5.786 2.5 6 2.5c.215 0 3.429.143 3.429 2.858v2.286z" />
            </g>
            <title id="protonLogo__title">Proton</title>
        </svg>
    );
};

ProtonLogo.propTypes = {
    className: PropTypes.string
};

export default ProtonLogo;