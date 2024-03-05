import { useEffect, useState } from 'react';
import { Persons } from './components/Persons';
import { Filter } from './components/Filter';
import { Form } from './components/Form';
import phonebookService from './services/phonebook';
import {
  SuccessNotification,
  ErrorNotification,
} from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [filteredPersons, setFilteredPersons] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    phonebookService.getAll().then((allPersons) => {
      setPersons(allPersons);
    });
  }, []);

  const addInfo = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const existingContact = persons.filter(
      (person) => person.name === newPerson.name
    )[0];

    if (existingContact) {
      const message = `${existingContact.name} is already added to phonebook, replace the old number with a new one?`;
      if (window.confirm(message)) {
        phonebookService
          .update(existingContact.id, newPerson)
          .then((updatedUser) => {
            const personsCopy = JSON.parse(JSON.stringify(persons));
            setPersons(
              personsCopy.map((person) => {
                if (person.name === updatedUser.name) {
                  person.number = updatedUser.number;
                  return person;
                } else {
                  return person;
                }
              })
            );
            setNewName('');
            setNewNumber('');
          });
      }
    } else {
      phonebookService.add(newPerson).then((addedPerson) => {
        setSuccessMessage(`Added ${addedPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2500);
        setPersons(persons.concat(addedPerson));
        setNewName('');
        setNewNumber('');
      });
    }
  };

  const deleteContact = ({ name, id }) => {
    const message = `Delete ${name} ?`;
    if (window.confirm(message)) {
      phonebookService
        .remove(id)
        .then((deletedPerson) => {
          setPersons(
            persons.filter((person) => person.id !== deletedPerson.id)
          );
        })
        .catch((error) => {
          setErrorMessage(
            `Informatin of ${name} has already been removed from server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 2500);
        });
    }
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
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
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
        : persons.map((person) => (
            <Persons
              key={person.id}
              person={person}
              deletePerson={() => deleteContact(person)}
            />
          ))}
    </div>
  );
};

export default App;
