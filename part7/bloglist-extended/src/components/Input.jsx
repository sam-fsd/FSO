import { TextField } from '@mui/material'

const Input = ({ inputName, onChange, value, type, id, testid }) => {
  return (
    <div>
      <TextField
        label={inputName}
        type={type}
        value={value}
        onChange={onChange}
        id={id}
        data-testid={testid}
      />
    </div>
  )
}

export default Input
