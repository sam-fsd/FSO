import axios from 'axios';
import { useEffect, useState } from 'react';
import { Persons } from './components/Persons';
import { Filter } from './components/Filter';
import { Form } from './components/Form';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filteredPersons, setFilteredPersons] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data);
    });
  }, []);

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
    setFilteredPersons(filteredPersons); // Update entire filteredPersons state with filtered data
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
