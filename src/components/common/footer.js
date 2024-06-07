import React, { useState } from 'react';

function getDate() {
    return new Date().getFullYear();
}

function Footer() {
    const [currentDate] = useState(getDate());

    return (
        <footer className='footer flex h-20 justify-center items-center text-white bg-gray-700'>
            <p>© {currentDate} Fair Bet. All rights reserved.</p>
        </footer>
    );
}

export default Footer;