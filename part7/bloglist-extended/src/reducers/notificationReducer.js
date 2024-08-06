import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    notify: (state, action) => action.payload,
    clear: (state) => null,
  },
})

export const { notify, clear } = notificationSlice.actions

export const showNotification = (message) => {
  return async (dispatch) => {
    dispatch(notify(message))
    setTimeout(() => {
      dispatch(clear())
    }, 5000)
  }
}

export default notificationSlice.reducer
