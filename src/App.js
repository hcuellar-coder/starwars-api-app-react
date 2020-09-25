import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CharacterTable from './components/CharacterTable';
import TablePagination from './components/TablePagination';
import Spinner from './components/Spinner';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [paginationCount, setPaginationCount] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true)
  const [characterTable, setCharacterTable] = useState([]);
  const [page, setPage] = useState(() => {
    if (localStorage.getItem('page')) {
      return (parseInt(localStorage.getItem('page')));
    } else {
      return 1;
    }
  });

  function handlePagination(characterCount) {
    let pages = Math.ceil(characterCount / 10);
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
      if (localStorage.getItem('searchPage' + page)) {
        setLoading(false);
        setPaginationCount(localStorage.getItem('searchPaginationCount'));
        setCharacterTable(JSON.parse(localStorage.getItem('searchPage' + page)));
      } else {
        if (page > 1) {
          createSearchTable(searchInput, page);
        }
      }
    } else {
      if (localStorage.getItem('page' + page)) {
        setLoading(false);
        setPaginationCount(localStorage.getItem('paginationCount'));
        setCharacterTable(JSON.parse(localStorage.getItem('page' + page)));
      } else {
        createCharacterTable(page);
      }
    }
  }

  function handleSearchButton(character) {
    setSearchInput(character);
    setLoading(true);
    setCharacterTable([]);
    setPage(1);

    if (localStorage.getItem('searching') === 'true') {
      let searchCount = localStorage.getItem('searchPaginationCount');
      for (let i = 1; i <= searchCount; i++) {
        localStorage.removeItem('searchPage' + i, []);
      }
    }
    localStorage.setItem('searching', true);
    localStorage.setItem('searchInput', character);

    createSearchTable(character, 1);
  }

  function handleClearButton() {
    setSearchInput('');
    setPage(1);
    setCharacterTable(JSON.parse(localStorage.getItem('page' + 1)));
    setPaginationCount(localStorage.getItem('paginationCount'));

    let searchCount = localStorage.getItem('searchPaginationCount');
    for (let i = 1; i <= searchCount; i++) {
      localStorage.removeItem('searchPage' + i, []);
    }
    localStorage.setItem('searching', false);
    localStorage.setItem('searchInput', '');
    localStorage.removeItem('searchPaginationCount', '');
    localStorage.removeItem('page');
  }

  const getCharacters = async (page) => {
    return await axios
      .get('https://swapi.dev/api/people/?page=' + page)
      .then((results) => {
        return results.data;
      })
      .catch((err) => console.log('Error', err));
  }

  const getSpecies = async (element) => {
    if (!element) {
      element = 'https://swapi.dev/api/species/1/';
    }

    return await axios
      .get(element)
      .then((result) => {
        return result.data;
      })
      .catch((err) => console.log('Error', err));
  }

  const getHomeworld = async (element) => {
    return await axios
      .get(element)
      .then((results) => {
        return results.data;
      })
      .catch((err) => console.log('Error', err));
  }

  const searchCharacter = async (element, page) => {
    let search = 'https://swapi.dev/api/people/?search=' + element + '&page=' + page;
    return await axios
      .get(search)
      .then((results) => {
        return results.data;
      })
      .catch((err) => console.log('Error', err));
  }

  function createCharacterTable(page) {
    localStorage.setItem('searching', false);
    getCharacters(page).then(async characters => {
      await fetchSpeciesandHomeWorld(characters);
      return characters.count;
    }).then((count) => {
      handlePagination(count);
      setLoading(false);
    })
  }

  function createSearchTable(character, page) {
    searchCharacter(character, page).then(async characters => {
      await fetchSpeciesandHomeWorld(characters);
      return characters.count;
    }).then((count) => {
      handlePagination(count);
      setLoading(false);
    })
  }

  async function fetchSpeciesandHomeWorld(characters) {
    for (const element of characters.results) {
      await getHomeworld(element.homeworld.toString()).then(async newHomeworld => {
        await getSpecies(element.species.toString()).then(async newSpecies => {
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

  useEffect(() => {
    setLoading(true);
    setCharacterTable([]);
    if (localStorage.getItem('page' + 1)) {
      setLoading(false);
      setPaginationCount(localStorage.getItem('paginationCount'));
      setCharacterTable(JSON.parse(localStorage.getItem('page' + 1)));
    } else {
      createCharacterTable(1);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem('searching') === 'true') {
      localStorage.setItem('searchPage' + page, JSON.stringify(characterTable));
    } else {
      localStorage.setItem('page' + page, JSON.stringify(characterTable));
    }
  }, [characterTable, page])

  const UserInterface = () => (
    <div>
      <SearchBar
        handleSearchButton={handleSearchButton}
        handleClearButton={handleClearButton}
        searchInput={searchInput} />
      <br />
      <TablePagination
        paginationCount={paginationCount}
        handleNewPage={handleNewPage}
        activePage={page} />
      <CharacterTable
        characterTable={characterTable} />
    </div>
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