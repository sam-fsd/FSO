const Input = ({ inputName, onChange, value, type }) => {
  return (
    <div>
      {inputName}
      <input type={type} value={value} onChange={onChange} />
    </div>
  );
};

export default Input;
