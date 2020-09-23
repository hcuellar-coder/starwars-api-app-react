import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function SearchBar(props) {
    const [input, setInput] = useState('');
    const [disable, setDisable] = useState(true);

    function handleChange(event) {
        event.preventDefault();
        setInput(event.target.value);
        console.log(input.length);
    }

    function handleSearchClick() {
        if (input.length !== 0) {
            setDisable(false);
            props.handleSearchBar(input);
        }
    }

    function handleClearClick() {
        setDisable(true);
        props.handleClearButton();
    }

    useEffect(() => {
        if (props.searchInput !== null) {
            console.log(props.searchInput);
            setInput(props.searchInput);
        }
    }, [props.searchInput])

    return (
        <div id="search-bar-div">
            <Form.Label id="search-label">Search for Star Wars Character</Form.Label>
            <Form.Control required id="search-bar" onChange={handleChange} value={input}></Form.Control>
            <div id="buttons-div">
                <Button id="search-button" onClick={handleSearchClick}>Search</Button>
                <Button disabled={disable} id="clear-button" onClick={handleClearClick}>Clear</Button>
            </div>
        </div>
    )
}

export default SearchBar;