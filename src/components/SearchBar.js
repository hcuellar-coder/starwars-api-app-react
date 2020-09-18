import React from 'react';
import { Form, Button } from 'react-bootstrap';

function SearchBar() {

    return (
        <div id="search-bar-div">
            <Form.Label id="search-label">Search for Star Wars Character</Form.Label>
            <Form.Control id="search-bar"></Form.Control>
            <Button id="search-button">Search</Button>
        </div>
    )
}

export default SearchBar;