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
  const [loading, setLoading] = useState(true)
  const [characterTable, setCharacterTable] = useState([]);
  // const [searching, setSearching] = useState(false);


  function handleCharacterCount(characterCount) {
    let pages = Math.ceil(characterCount / 10);
    setPaginationCount(pages);
    // console.log('searching =', searching);
    if (localStorage.getItem('searching') === 'true') {
      // console.log('in Searching pages');
      localStorage.setItem('searchPaginationCount', pages);
    } else {
      // console.log('not in Searching pages');
      localStorage.setItem('paginationCount', pages);
    }
  }

  function handlePage(page) {
    localStorage.setItem('pageLastOn', page);
    setPage(page);
  }

  function handleSearchBar(character) {
    setPage(1);
    localStorage.setItem('searching', true);
    localStorage.setItem('searchInput', character);
    setLoading(true);
    setCharacterTable([]);
    createSearchCharacterTable(character, 1);
  }

  function handleClearButton() {
    let searchCount = localStorage.getItem('searchPaginationCount');
    localStorage.setItem('searching', false);
    localStorage.setItem('searchInput', ' ');
    localStorage.removeItem('searchPaginationCount', '');
    for (let i = 1; i <= searchCount; i++) {
      localStorage.removeItem('searchPage' + i, []);
    }
    setPage(1);
    setCharacterTable(JSON.parse(localStorage.getItem('page' + 1)));
    setPaginationCount(localStorage.getItem('paginationCount'));
  }

  const getCharacters = async (page) => {
    return await axios
      .get('http://swapi.dev/api/people/?page=' + page)
      .then((results) => {
        handleCharacterCount(results.data.count);
        return results.data.results;
      })
      .catch((err) => console.log('Error', err));
  }

  const getSpecies = async (element) => {
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
        // console.log(results.data);
        handleCharacterCount(results.data.count);
        return results.data.results;
      })
      .catch((err) => console.log('Error', err));
  }

  function createCharacterTable(page) {
    localStorage.setItem('searching', false);
    getCharacters(page).then(async characters => {
      for (const element of characters) {
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
      setLoading(false);
    })
  }

  function createSearchCharacterTable(character, page) {
    searchCharacter(character, page).then(async characters => {
      for (const element of characters) {
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
      setLoading(false);
    })
  }

  useEffect(() => {
    setLoading(true);
    setCharacterTable([]);
    if (localStorage.getItem('searching') === 'true') {
      if (localStorage.getItem('searchPage' + page)) {
        // console.log('searching page');
        setLoading(false);
        setPaginationCount(localStorage.getItem('searchPaginationCount'));
        setCharacterTable(JSON.parse(localStorage.getItem('searchPage' + page)));
      } else {
        createSearchCharacterTable(localStorage.getItem('searchInput'), page);
      }
    } else {
      if (localStorage.getItem('page' + page)) {
        setLoading(false);
        setPaginationCount(localStorage.getItem('paginationCount'));
        setCharacterTable(JSON.parse(localStorage.getItem('page' + page)));
      } else {
        // console.log('creating Table');
        createCharacterTable(page)
      }
    }
  }, [page])

  useEffect(() => {
    // console.log(localStorage.getItem('searching'));
    if (localStorage.getItem('searching') === 'true') {
      localStorage.setItem('searchPage' + page, JSON.stringify(characterTable));
    } else {
      // console.log('dont know why but this is happening');
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
      <SearchBar handleSearchBar={handleSearchBar} handleClearButton={handleClearButton} searchInput={localStorage.getItem('searchInput')} />
      <br />
      {loading ? <Spinner /> :
        <Table />
      }
    </div>
  );
}

export default App;


// setCharacterTable(characterTable => [...characterTable, {
//   name: element.name,
//   birth_year: element.birth_year,
//   height: element.height,
//   mass: element.mass,
//   homeworld: newHomeworld.name,
//   species: newSpecies.name
// }]);


// async function getChars() {
//   await createCharacterTable(page).then(async (result) => { console.log(await result); })

//   //localStorage()
// }
// getChars().then(async () => {
//   console.log('this is happening');
//   // 
// });


// const getCharacters = async (page) => {
//   return await axios
//     .get('http://swapi.dev/api/people/?page=' + page)
//     .then((results) => {
//       handleCharacterCount(results.data.count);
//       return results.data.results;
//     })
//     .catch((err) => console.log('Error', err));
// }


// function createCharacterTable(page) {
//   getCharacters(page).then(async characters => {
//     for (const element of characters) {
//       await getHomeworld(element.homeworld.toString()).then(async newHomeworld => {
//         await getSpecies(element.species.toString()).then(async newSpecies => {
//           setCharacterTable(characterTable => [...characterTable, {
//             name: element.name,
//             birth_year: element.birth_year,
//             height: element.height,
//             mass: element.mass,
//             homeworld: newHomeworld.name,
//             species: newSpecies.name
//           }]);
//         });
//       });
//     }
//     setLoading(false);
//   })
// }