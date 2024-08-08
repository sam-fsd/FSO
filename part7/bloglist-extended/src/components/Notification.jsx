import { useSelector } from 'react-redux'
import Alert from '@mui/material/Alert'

const Notification = ({ type }) => {
  const notification = useSelector((state) => state.notification)

  if (notification === null) {
    return null
  }

  return <Alert severity={type}>{notification}</Alert>
}

export default Notification
