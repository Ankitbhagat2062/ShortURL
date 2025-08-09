import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userId: null,
  email: null,
  islogedin : false,
  visitHistory:null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
   login(state){
      state.islogedin = true ;
    },
   logout(state){
      state.islogedin = false ;
    },
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    clearUser(state) {
      state.userId = null;
      state.email = null;
    },
    setVisitHistory(state ,action){
      state.visitHistory = action.payload.visitHistory;
    }
  },
})

export const { login, logout, setUser ,clearUser ,setVisitHistory} = userSlice.actions
export default userSlice.reducer
