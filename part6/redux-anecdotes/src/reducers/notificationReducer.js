import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    nofify: (state, action) => action.payload,
    clear: (state) => '',
  },
});

export const { nofify, clear } = notificationSlice.actions;

export const setNotification = (content, seconds) => {
  return async (dispatch) => {
    dispatch(nofify(content));
    setTimeout(() => {
      dispatch(clear());
    }, 1000 * seconds);
  };
};

export default notificationSlice.reducer;
