const Filter = ({ searchValue, handleSearch }) => {
  return (
    <div>
      filter shown with
      <input value={searchValue} onChange={handleSearch} />
    </div>
  );
};

export { Filter };
