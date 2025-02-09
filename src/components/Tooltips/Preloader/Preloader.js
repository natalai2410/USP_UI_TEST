import './Preloader.css';
import React from 'react';

const Preloader = () => {
    return (
        <section className="preloader">
            <div className="preloader__container">
                <span className="preloader__round"></span>
            </div>
        </section>
    );
};

export default Preloader;