import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { user : null , token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { user , accessToken } = action.payload
            console.log(action.payload)
            console.log(accessToken)
            console.log(user)
            if (user) {
                state.user = user
            } 
            if (accessToken){
                state.token = accessToken
            }
            
        },
        logOut: (state, action) => {
            state.user = null
            state.token = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentUser = (state) => state.auth.user