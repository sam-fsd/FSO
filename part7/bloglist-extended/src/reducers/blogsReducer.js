import { createSlice } from '@reduxjs/toolkit'

const blogsReducer = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    initalizeBlogs: (state, action) => {
      return action.payload
    },
    createBlog: (state, action) => {
      state.push(action.payload)
    },
    updateBlogs: (state, action) => {
      return action.payload
    },
  },
})

export const { initalizeBlogs, createBlog, updateBlogs } = blogsReducer.actions

export default blogsReducer.reducer
