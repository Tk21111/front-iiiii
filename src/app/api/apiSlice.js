import { createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { setCredentials , logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl : process.env.REACT_APP_API //'https://iiiii-is-backend.onrender.com' // 'http://localhost:3500/'
    ,credentials : 'include', //set back http-only secure cookie every time
    prepareHeaders : (headers , {getState}) =>{
        const token = getState().auth.token
        if (token){
            headers.set("authorization" , `Bearer ${token}`)
        }
        return headers
    }
})

//access token expire
const baseQueryWithReauth = async (args , api , extraOptions) => {
    let result = await baseQuery(args , api , extraOptions)

    if (result?.error?.originalStatus === 403){
        console.log('sending refresh token')
        //send refresh token to get new access token

        const refreshResult = await baseQuery('/refresh' ,api ,extraOptions)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const user = api.getstate().auth.user
            //store the new token 
            api.dispatch(setCredentials({...refreshResult.data , user}))
            // rety the original query with new access token

            result =await baseQuery(args , api , extraOptions)
        } else {
            api.dispatch(logOut())
            //log out literly
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery : baseQueryWithReauth,
    tagTypes: ['Note', 'Loca', 'Post' , 'How'],
    endpoints : builder => ({}) //use extend api , to know what belong to what
})
