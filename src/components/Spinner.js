import React from 'react';
import spinner from '../spinner/imperial-spinner.gif'

//480 x 360

function Spinner() {
    return (
        <div id="loading-spinner-div">
            <img id="loading-spinner" src={spinner} alt="Loading..." />
        </div>
    );
}

export default Spinner;