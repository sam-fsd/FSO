const Country = ({ countries }) => {
  if (countries.length === 1) {
    const country = countries[0];
    const languages = [];
    Object.entries(country.languages).forEach(([key, value]) => {
      languages.push(<li key={key}>{value}</li>);
    });
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
        <strong>languages</strong>
        <br />
        <ul>{languages.map((language) => language)}</ul>
        <img
          className="flagImage"
          src={country.flags.png}
          alt={country.flags.alt}
        />
      </div>
    );
  } else if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 0 && countries.length <= 10) {
    return countries.map((country) => (
      <p key={country.ccn3}>
        {country.name.common}
        <button onClick={() => showViewFn(country)}>show</button>
      </p>
    ));
  }
  const languages = [];
  Object.entries(country.languages).forEach(([key, value]) => {
    languages.push(<li key={key}>{value}</li>);
  });
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital[0]}</p>
      <p>area {country.area}</p>
      <strong>languages</strong>
      <br />
      <ul>{languages.map((language) => language)}</ul>
      <img
        className="flagImage"
        src={country.flags.png}
        alt={country.flags.alt}
      />
    </div>
  );
};

export default Country;
