import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter ,createSelector} from "@reduxjs/toolkit";

const locasAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.user === b.user) ? 0 : a.user ? 1 : -1
})

const initialState = locasAdapter.getInitialState()

export const locaApislice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPost: builder.query({
            query: () => '/post',
            transformResponse : responseData => {
                const loadedLoca = responseData.map(loca => {
                    loca.id = loca._id
                    return loca
                });
                return locasAdapter.setAll(initialState , loadedLoca)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Loca', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Post', id }))
                    ]
                } else return [{ type: 'Post', id: 'LIST' }]
            }
        }),
        getComment : builder.mutation({
            query: (data) => ({
                url : '/post/comment',
                method : 'PATCH',
                credential : 'include',
                body : {...data}
            }),
        }),
        creatPost : builder.mutation({
            query: (data) => ({
                 //same
                url: '/post/create',
                method: 'POST',
                credential : 'include',
                body : data.formData,
            }),
            invalidatesTags: [
                { type: 'Post', id: "LIST" }
            ]
        }),
        createComment : builder.mutation({
            query: (data) => ({
                 //same
                url: '/post/comment',
                method: 'POST',
                credential : 'include',
                body : data.formData,
            })
        }),
        
        
    })
});

export const { useCreatPostMutation , useCreateCommentMutation , useGetCommentMutation , useGetPostQuery} = locaApislice;
// returns the query result object
export const selectLocasResult = locaApislice.endpoints.getAllloca.select()

// creates memoized selector
const selectLocasData = createSelector(
    selectLocasResult,
    LocasResult => LocasResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllLocas,
    selectById: selectLocaById,
    selectIds: selectLocaIds
    // Pass in a selector that returns the Locas slice of state
} = locasAdapter.getSelectors(state => selectLocasData(state) ?? initialState)
