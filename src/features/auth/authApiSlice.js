import { apiSlice } from "../../app/api/apiSlice";
import { logOut , setCredentials} from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: (username) => ({
                url: '/logout',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    //verify queryFulfilled 
                    //const { data } = await queryFulfilled
                    //console.log(cookie clear)
                    //console.log(data)
                    dispatch(logOut())
                    //clear out everything in apiSlice
                    setTimeout(() => {
                        dispatch(apiSlice.util.resetApiState())
                    }, 1000)
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/refresh',
                method: 'GET',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled  }) {  //dispatch , queryFulfiled is useState() property
                try {
                    const { data } = await queryFulfilled
                    //console.log(data)
                    const { accessToken } = data
                    dispatch(setCredentials({ accessToken }))
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        signin: builder.mutation({
            query: (credential) => ({
                url: '/register',
                method : 'POST',
                body: {...credential}
            })
        }),
    })
})

export const {
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
    useSigninMutation
} = authApiSlice