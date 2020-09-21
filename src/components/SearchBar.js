import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function SearchBar(props) {
    const [input, setInput] = useState('');

    function handleChange(event) {
        event.preventDefault();
        setInput(event.target.value);
    }

    function handleSearchClick() {
        console.log('search happening');
        props.handleSearchBar(input);
    }

    function handleClearClick() {
        console.log('clear happening');
        props.handleClearButton();
    }

    useEffect(() => {

        if (props.searchInput) {
            // console.log('SearchInput =', props.searchInput);
            setInput(props.searchInput);
        }

    }, [props.searchInput])

    return (
        <div id="search-bar-div">
            <Form.Label id="search-label">Search for Star Wars Character</Form.Label>
            <Form.Control id="search-bar" onChange={handleChange} value={input}></Form.Control>
            <div id="buttons-div">
                <Button id="search-button" onClick={handleSearchClick}>Search</Button>
                <Button id="clear-button" onClick={handleClearClick}>Clear</Button>
            </div>
        </div>
    )
}

export default SearchBar;