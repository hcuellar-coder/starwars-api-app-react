import React from 'react';
import { Table } from 'react-bootstrap';

function CharacterTable(props) {

    return (
        <div id="character-table">
            <Table hover striped>
                <thead id="character-table-header">
                    <tr>
                        <th className="cell-name">Name</th>
                        <th className="cell-birthday">D.o.B</th>
                        <th className="cell-height">Height</th>
                        <th className="cell-mass">Mass</th>
                        <th className="cell-homeworld">Homeworld</th>
                        <th className="cell-species">Species</th>
                    </tr>
                </thead>
                <tbody id="character-table-body">
                    {props.characterTable.map((character, index) => (
                        <tr key={index}>
                            <td>{character.name}</td>
                            <td>{character.birth_year}</td>
                            <td>{character.height}</td>
                            <td>{character.mass}</td>
                            <td>{character.homeworld}</td>
                            <td>{character.species}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default CharacterTable;