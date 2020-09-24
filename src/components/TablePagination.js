import React, { useState, useEffect } from 'react';
import { Pagination } from 'react-bootstrap';

function TablePagination(props) {
    const [active, setActive] = useState(1);
    let pages = [];

    function handleClick(page) {
        setActive(page);
        props.handleNewPage(page);
    }

    useEffect(() => {
        setActive(props.activePage);
    }, [props.activePage])

    for (let number = 1; number <= props.paginationCount; number++) {
        pages.push(
            <Pagination.Item key={number} active={number === active} onClick={() => { handleClick(number) }}>
                {number}
            </Pagination.Item>
        );
    }

    return (
        <div id="table-pagination">
            <Pagination >
                {pages}
            </Pagination>
        </div>
    )
}


export default TablePagination;