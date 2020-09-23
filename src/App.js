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
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true)
  const [characterTable, setCharacterTable] = useState([]);


  function handleCharacterCount(characterCount) {
    console.log('handleCharacterCount')
    let pages = Math.ceil(characterCount / 10);
    setPaginationCount(pages);
    if (localStorage.getItem('searching') === 'true') {
      localStorage.setItem('searchPaginationCount', pages);
    } else {
      localStorage.setItem('paginationCount', pages);
    }
  }

  function handlePage(page) {
    console.log('handlePage')
    setPage(page);
  }

  function handleSearchBar(character) {
    setSearchInput(character);
    console.log('handleSearchBar')
    if (localStorage.getItem('searching') === 'true') {
      let searchCount = localStorage.getItem('searchPaginationCount');
      for (let i = 1; i <= searchCount; i++) {
        localStorage.removeItem('searchPage' + i, []);
      }
    }
    localStorage.setItem('searching', true);
    localStorage.setItem('searchInput', character);
    setLoading(true);
    setCharacterTable([]);
    setPage(1);
    // createSearchCharacterTable(character, 1);
  }

  function handleClearButton() {
    setSearchInput('');
    console.log('handleClearButton')
    let searchCount = localStorage.getItem('searchPaginationCount');
    localStorage.setItem('searching', false);
    localStorage.setItem('searchInput', '');
    localStorage.removeItem('searchPaginationCount', '');
    for (let i = 1; i <= searchCount; i++) {
      localStorage.removeItem('searchPage' + i, []);
    }
    // setPage(1);
    setCharacterTable(JSON.parse(localStorage.getItem('page' + 1)));
    setPaginationCount(localStorage.getItem('paginationCount'));
  }

  const getCharacters = async (page) => {
    console.log('getCharacters')
    return await axios
      .get('http://swapi.dev/api/people/?page=' + page)
      .then((results) => {
        return results.data;
      })
      .catch((err) => console.log('Error', err));
  }

  const getSpecies = async (element) => {
    console.log('getSpecies')
    if (!element) {
      element = 'http://swapi.dev/api/species/1/';
    }

    return await axios
      .get(element)
      .then((result) => {
        return result.data;
      })
      .catch((err) => console.log('Error', err));
  }

  const getHomeworld = async (element) => {
    console.log('getHomeworld')
    return await axios
      .get(element)
      .then((results) => {
        return results.data;
      })
      .catch((err) => console.log('Error', err));
  }

  const searchCharacter = async (element, page) => {
    console.log('searchCharacter')
    let search = 'https://swapi.dev/api/people/?search=' + element + '&page=' + page;
    return await axios
      .get(search)
      .then((results) => {
        return results.data;
      })
      .catch((err) => console.log('Error', err));
  }

  function createCharacterTable(page) {
    console.log('createCharacterTable')
    localStorage.setItem('searching', false);
    getCharacters(page).then(async characters => {
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
      return characters.count;
    }).then((count) => {
      handleCharacterCount(count);
      console.log(count);
      setLoading(false);
    })
  }

  function createSearchCharacterTable(character, page) {
    console.log('createSearchCharacterTable')
    searchCharacter(character, page).then(async characters => {
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
      return characters.count;
    }).then((count) => {
      handleCharacterCount(count);
      console.log(count);
      setLoading(false);
    })
  }

  useEffect(() => {
    if (searchInput !== '') {
      createSearchCharacterTable(searchInput, 1);
    }
  }, [searchInput])

  useEffect(() => {
    console.log('page = ', page);

    setLoading(true);
    setCharacterTable([]);
    if (localStorage.getItem('searching') === 'true') {
      if (localStorage.getItem('searchPage' + page)) {
        setLoading(false);
        setPaginationCount(localStorage.getItem('searchPaginationCount'));
        setCharacterTable(JSON.parse(localStorage.getItem('searchPage' + page)));
      } else {
        if (page > 1) {
          createSearchCharacterTable(searchInput, page);
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
  }, [page])

  useEffect(() => {
    console.log('useEffect(characterTable)')
    if (localStorage.getItem('searching') === 'true') {
      console.log('searchPage' + page);
      localStorage.setItem('searchPage' + page, JSON.stringify(characterTable));
    } else {
      localStorage.setItem('page' + page, JSON.stringify(characterTable));
    }
  }, [characterTable])

  const Table = () => (
    <div>
      <TablePagination paginationCount={paginationCount} handlePage={handlePage} activePage={page} />
      <CharacterTable characterTable={characterTable} />
    </div>
  )

  return (
    <div id="app-div">
      <Header />
      <SearchBar handleSearchBar={handleSearchBar} handleClearButton={handleClearButton} searchInput={searchInput} />
      <br />
      {loading ? <Spinner /> :
        <Table />
      }
    </div>
  );
}

export default App;