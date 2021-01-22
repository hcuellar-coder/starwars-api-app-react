import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CharacterTable from './components/CharacterTable';
import TablePagination from './components/TablePagination';
import { fetchHomeworld } from './components/APIComponents/fetchHomeworld';
import { searchForCharacter } from './components/APIComponents/searchForCharacter';
import { fetchCharacters } from './components/APIComponents/fetchCharacters';
import { fetchSpecies } from './components/APIComponents/fetchSpecies';
import Spinner from './components/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [characterTable, setCharacterTable] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchFailed, setSearchFailed] = useState(false);
  const [loading, setLoading] = useState(true)
  const [paginationCount, setPaginationCount] = useState(0);
  const [page, setPage] = useState(() => {
    if (localStorage.getItem('page')) {
      return (parseInt(localStorage.getItem('page')));
    } else {
      return 1;
    }
  });

  useEffect(() => {
    if (localStorage.getItem('searching') === 'true') {

      if (JSON.parse(localStorage.getItem(`searchPage${page}`)) !== undefined
        && JSON.parse(localStorage.getItem(`searchPage${page}`)).length > 0) {
        setLoading(false);
        setSearchInput(localStorage.getItem('searchInput'));
        setPaginationCount(localStorage.getItem('searchPaginationCount'));
        setCharacterTable(JSON.parse(localStorage.getItem(`searchPage${page}`)));
      }
      else {
        setSearchInput(localStorage.getItem('searchInput'));
        setLoading(false);
        setSearchFailed(true);
      }
    } else {
      if (localStorage.getItem(`page${page}`)) {
        setLoading(false);
        setPaginationCount(localStorage.getItem('paginationCount'));
        setCharacterTable(JSON.parse(localStorage.getItem(`page${page}`)));
      } else {
        createCharacterTable(1);
      }
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem('searching') === 'true') {
      localStorage.setItem(`searchPage${page}`, JSON.stringify(characterTable));
    } else {
      localStorage.setItem(`page${page}`, JSON.stringify(characterTable));
    }
  }, [characterTable, page])

  function handlePagination(characterCount) {
    let pages = Math.ceil(characterCount / 10);
    if (pages < 1) {
      setSearchFailed(true);
    }
    setPaginationCount(pages);
    if (localStorage.getItem('searching') === 'true') {
      localStorage.setItem('searchPaginationCount', pages);
    } else {
      localStorage.setItem('paginationCount', pages);
    }
  }

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

  function handleSearchButton(character) {
    setSearchInput(character);
    setSearchFailed(false);
    setLoading(true);
    setCharacterTable([]);
    setPage(1);

    if (localStorage.getItem('searching') === 'true') {
      let searchCount = localStorage.getItem('searchPaginationCount');
      for (let i = 1; i <= searchCount; i++) {
        localStorage.removeItem(`searchPage${i}`, []);
      }
    }
    localStorage.setItem('page', 1);
    localStorage.setItem('searching', true);
    localStorage.setItem('searchInput', character);

    createSearchCharacterTable(character, 1);
  }

  function handleClearButton() {
    setSearchInput('');
    setSearchFailed(false);
    setPage(1);
    setCharacterTable(JSON.parse(localStorage.getItem(`page${1}`)));
    setPaginationCount(localStorage.getItem('paginationCount'));

    let searchCount = localStorage.getItem('searchPaginationCount');
    for (let i = 1; i <= searchCount; i++) {
      localStorage.removeItem(`searchPage${i}`, []);
    }

    localStorage.setItem('searching', false);
    localStorage.setItem('searchInput', '');
    localStorage.removeItem('searchPaginationCount', '');
    localStorage.setItem('page', 1);
  }

  function createCharacterTable(page) {
    localStorage.setItem('searching', false);
    fetchCharacters(page).then(async characters => {
      await fetchSpeciesandHomeWorld(characters);
      return characters.count;
    }).then((count) => {
      handlePagination(count);
      setLoading(false);
    })
  }

  function createSearchCharacterTable(character, page) {
    searchForCharacter(character, page).then(async characters => {
      await fetchSpeciesandHomeWorld(characters);
      return characters.count;
    }).then((count) => {
      handlePagination(count);
      setLoading(false);
    })
  }

  async function fetchSpeciesandHomeWorld(characters) {
    for (const element of characters.results) {
      await fetchHomeworld(element.homeworld.toString().slice(21)).then(async newHomeworld => {
        await fetchSpecies(element.species.toString().slice(21)).then(async newSpecies => {
          setCharacterTable(characterTable => [...characterTable, {
            name: element.name,
            birth_year: element.birth_year,
            height: element.height,
            mass: element.mass,
            homeworld: newHomeworld.name,
            species: newSpecies.name
          }]);
        });
      });
    }
  }

  const Table = () => (
    <center>
      <TablePagination
        paginationCount={paginationCount}
        handleNewPage={handleNewPage}
        activePage={page} />
      <CharacterTable
        characterTable={characterTable} />
    </center>
  )

  const UserInterface = () => (
    <center>
      <SearchBar
        handleSearchButton={handleSearchButton}
        handleClearButton={handleClearButton}
        searchInput={searchInput} />
      <br />
      {searchFailed ?
        <div id="search-failed-div">
          Find a character the search did not. Hmm. -Yoda
        </div> :
        <Table />
      }
    </center>
  )

  return (
    <div id="app-div">
      <Header />
      {loading ? <Spinner /> :
        <UserInterface />
      }
    </div>
  );
}

export default App;