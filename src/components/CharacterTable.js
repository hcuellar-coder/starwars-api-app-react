import React from 'react';
import { Table } from 'react-bootstrap';

function CharacterTable(props) {
    return (
        <div id="character-table">
            <Table id="table" hover striped>
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
                            <td className="cell-name">{character.name}</td>
                            <td className="cell-birthday">{character.birth_year}</td>
                            <td className="cell-height">{character.height}</td>
                            <td className="cell-mass">{character.mass}</td>
                            <td className="cell-homeworld">{character.homeworld}</td>
                            <td className="cell-species">{character.species}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default CharacterTable;