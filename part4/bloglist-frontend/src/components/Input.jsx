const Input = ({ inputName, onChange, value, type, id, testid }) => {
  return (
    <div>
      {inputName}
      <input
        type={type}
        value={value}
        onChange={onChange}
        id={id}
        data-testid={testid}
      />
    </div>
  );
};

export default Input;
