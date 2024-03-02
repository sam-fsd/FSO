const Form = ({
  addInfo,
  newName,
  handleNameInput,
  newNumber,
  handleNumberInput,
}) => {
  return (
    <form onSubmit={addInfo}>
      <div>
        name: <input value={newName} onChange={handleNameInput} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberInput} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export { Form };
