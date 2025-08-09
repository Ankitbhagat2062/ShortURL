import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/User/UserSlice'

export default configureStore({
  reducer: {
    user: userReducer,
  },
})
