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

  function handleCharacterCount(characterCount) {
    let pages = Math.ceil(characterCount / 10);
    setPaginationCount(pages);
    localStorage.setItem('paginationCount', paginationCount);
  }

  function handlePage(page) {
    setPage(page);
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

  async function createCharacterTable(page) {
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

  useEffect(() => {
    setLoading(true);
    setCharacterTable([]);
    if (localStorage.getItem('page' + page)) {
      setLoading(false);
      setPaginationCount(localStorage.getItem('paginationCount'));
      setCharacterTable(JSON.parse(localStorage.getItem('page' + page)));
    } else {
      createCharacterTable(page)
    }
  }, [page])

  useEffect(() => {
    localStorage.setItem('page' + page, JSON.stringify(characterTable));
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
      <SearchBar />
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