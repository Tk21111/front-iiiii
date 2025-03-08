import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: 'auth',
    initialState: { user : null , token: null , aka : null , image : null , roles : null},
    reducers: {
        setCredentials: (state, action) => {
            const { user , accessToken , image ,aka ,roles } = action.payload
            if (user) {
                state.user = user
            } 
            if (accessToken){
                state.token = accessToken
            }
            if (aka){
                state.aka = aka
            }
            if (image){
                state.image = image
            }
            if (roles){
                state.roles = roles
            }
            
        },
        logOut: (state, action) => {
            state.user = null
            state.token = null
            state.image = null
            state.aka = null
            state.roles = null
        }
    },
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentImage = (state) => state.auth.image
export const selectCurrentAka= (state) => state.auth.aka
export const selectCurrentRoles= (state) => state.auth.roles