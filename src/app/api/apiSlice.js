import { createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { setCredentials , logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl : process.env.REACT_APP_API //'https://iiiii-is-backend.onrender.com' // 'http://localhost:3500/'
    ,credentials : 'include', //set back http-only secure cookie every time
    prepareHeaders : (headers , {getState}) =>{

        //in authSlice
        const token = getState().auth.token
        if (token){
            headers.set("authorization" , `Bearer ${token}`)
        }
        return headers
    }
})

//access token expire

//arg is builder base on what we write
//api is an api
const baseQueryWithReauth = async (args, api, extraOptions) => {

    //it actully send refresh before every time api call
    let result = await baseQuery(args, api, extraOptions);

    //console.log(result)
    if (result?.error?.originalStatus === 403) {
        console.log('sending refresh token');

        // Retrieve the refresh token from localStorage
        const refreshToken = localStorage.getItem('login');
        if (!refreshToken) {
            console.error('No refresh token found, logging out');
            api.dispatch(logOut());
            return result;
        }

        // Send refresh token to get a new access token
        const refreshResult = await baseQuery(
            { url: '/refresh', method: 'POST', body: { refreshToken } },
            api,
            extraOptions
        );

        console.log(refreshResult);

        if (refreshResult?.data) {
            const user = api.getState().auth.user;

            // Store the new token
            api.dispatch(setCredentials({ ...refreshResult.data, user }));

            // Retry the original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
            console.log('Logout triggered due to failed refresh');
        }
    }

    return result;
};


export const apiSlice = createApi({
    baseQuery : baseQueryWithReauth,
    tagTypes: ['Note', 'Loca', 'Post' , 'How'],
    endpoints : builder => ({}) //use extend api , to know what belong to what
})
