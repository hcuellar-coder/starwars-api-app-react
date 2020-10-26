import React from 'react';
import CharacterTable from './components/CharacterTable';
import TablePagination from './components/TablePagination';

function Table(props) {

    function handleNewPage(page) {
        setPage(page);
        localStorage.setItem('page', page);

        setLoading(true);
        setCharacterTable([]);
        if (localStorage.getItem('searching') === 'true') {
            if (localStorage.getItem(`searchPage${page}`)) {
                setLoading(false);
                setPaginationCount(localStorage.getItem('searchPaginationCount'));
                setCharacterTable(JSON.parse(localStorage.getItem(`searchPage${page}`)));
            } else {
                createSearchCharacterTable(searchInput, page);
            }
        } else {
            if (localStorage.getItem(`page${page}`)) {
                setLoading(false);
                setPaginationCount(localStorage.getItem('paginationCount'));
                setCharacterTable(JSON.parse(localStorage.getItem(`page${page}`)));
            } else {
                createCharacterTable(page);
            }
        }
    }



    return (
        <center>
            <TablePagination
                paginationCount={paginationCount}
                handleNewPage={handleNewPage}
                activePage={page} />
            <CharacterTable
                characterTable={characterTable} />
        </center>
    )
}

export default Table;