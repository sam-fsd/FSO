import { useEffect, useState } from 'react';
import Country from './components/Country';
import axios from 'axios';

function App() {
  const [value, setValue] = useState('');
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const BASE_URL = 'https://studies.cs.helsinki.fi/restcountries/api/';

  useEffect(() => {
    axios.get(`${BASE_URL}all`).then((response) => {
      setCountries(response.data);
    });
  }, []);
  const handleChange = (e) => {
    const val = e.target.value.toLowerCase();
    setValue(val);

    const filteredResults = countries.filter((country) =>
      country.name.common.toLowerCase().includes(val)
    );
    setFilteredCountries(filteredResults);
  };

  const showView = (country) => {
    console.log(country);
    return <p>From the showView function</p>;
  };

  const showCountry = (showViewFn) => {
    if (filteredCountries.length === 1) {
      return <Country country={filteredCountries[0]} />;
    } else if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (filteredCountries.length > 0 && filteredCountries.length <= 10) {
      return filteredCountries.map((country) => (
        <p key={country.ccn3}>
          {country.name.common}
          <button onClick={() => showViewFn(country)}>show</button>
        </p>
      ));
    } else return <p></p>;
  };
  return (
    <div>
      <form>
        find countries <input value={value} onChange={handleChange} />
      </form>
      {showCountry(showView)}
    </div>
  );
}

export default App;
