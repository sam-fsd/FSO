const Input = ({ inputName, onChange, value, type, id }) => {
  return (
    <div>
      {inputName}
      <input type={type} value={value} onChange={onChange} id={id} />
    </div>
  );
};

export default Input;
