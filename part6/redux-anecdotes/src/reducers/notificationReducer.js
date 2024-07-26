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
export default notificationSlice.reducer;
