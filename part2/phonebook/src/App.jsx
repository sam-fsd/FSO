import { useState } from 'react';
import { Persons } from './components/Persons';
import { Filter } from './components/Filter';
import { Form } from './components/Form';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filteredPersons, setFilteredPersons] = useState(null);

  const addInfo = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    for (let i = 0; i < persons.length; i += 1) {
      const name = persons[i].name;
      if (name === newPerson.name) {
        alert(`${name} is already added to phonebook`);
        return;
      }
    }
    setPersons(persons.concat(newPerson));
    setNewName('');
    setNewNumber('');
  };
  const handleNameInput = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberInput = (event) => {
    setNewNumber(event.target.value);
  };
  const search = (event) => {
    const val = event.target.value.toLowerCase(); // Convert to lowercase for case-insensitive search
    setSearchValue(val);
    // Update filteredPersons directly within the function
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(val)
    );
    setFilteredPersons(filteredPersons); // Update entire persons state with filtered data
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchValue={searchValue} handleSearch={search} />
      <h2>add a new</h2>
      <Form
        addInfo={addInfo}
        newName={newName}
        handleNameInput={handleNameInput}
        newNumber={newNumber}
        handleNumberInput={handleNumberInput}
      />
      <h2>Numbers</h2>
      {filteredPersons
        ? filteredPersons.map((person) => (
            <Persons key={person.id} person={person} />
          ))
        : persons.map((person) => <Persons key={person.id} person={person} />)}
    </div>
  );
};

export default App;
