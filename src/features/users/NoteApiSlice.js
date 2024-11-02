
import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter ,createSelector} from "@reduxjs/toolkit";

const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.count === b.count) ? 0 : a.count ? 1 : -1
})


const initialState = notesAdapter.getInitialState()

export const noteApislice = apiSlice.injectEndpoints({ 
    endpoints: builder => ({
        getAllnote: builder.query({
            query: () => '/note/all',
            transformResponse : responseData => {
                const loadedNotes = responseData.map(note => {
                    note.id = note._id
                    return note
                });
                return notesAdapter.setAll(initialState , loadedNotes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST' }]
            }
        }),
        
        
        getAllNoteUser: builder.mutation({ //username didn't get use the func intent is not working
            query: (data) => ({
                url: '/note/',
                method: 'PATCH',
                validiteStatus : (response , result) => {
                    return response.status === 200 && ! result.isError
                },
                body : {...data}
                
            }),
            transformResponse : responseData => {
                const loadedNotes = responseData.map(note => {
                    note.id = note._id
                    return note
                });
                return notesAdapter.setAll(initialState , loadedNotes)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Note', id }))
                    ]
                } else return [{ type: 'Note', id: 'LIST' }]
            }
           
        }),
        createNote : builder.mutation({
            query: (data) => ({ //same
                url: '/note/create',
                method: 'POST',
                credential : 'include',
                body : data.formData,
            }),
            invalidatesTags: [
                { type: 'Note', id: "LIST" }
            ]
        }),
        updateNote: builder.mutation({
            query: (data) => ({
                url: '/note/update',
                method: 'PATCH',
                body: {
                    ...data,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: '/user/update',
                method: 'PATCH',
                body: data.formData
            })
        }),

        getUser: builder.mutation({
            query: (data) => ({
                url: '/user/get',
                method: 'PATCH',
                body: {...data}
            })
        }),
        getOrg: builder.query({
            query: () => ({
                url : '/user/get/org',
                method : 'GET'
            })
        }),
        getNoti: builder.query({
            query: () => ({
                url: '/user/noti',
                method: 'GET',

            })
        }),
        setNoti: builder.mutation({
            query: (data) => ({
                url: '/user/noti',
                method: 'PATCH',
                body: {...data},

            })
        }),
        deleteNote : builder.mutation({
            query: (data) => ({ //same
                url: '/note/delete',
                method: 'DELETE',
                credential : 'include',
                body : {
                    ...data
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Note', id: arg.id }
            ]
         }),
         getHow : builder.query({
            query : () => ({
                url : '/how',
                method : 'GET',
            })
         }),
         setHow : builder.mutation({
            query : (data) => ({
                url : '/how/create',
                method : 'POST',
                credential : 'includes',
                body : data.formData,

            })
         }),
         updateHow : builder.mutation({
            query : (data) => ({
                url : '/how/update',
                method : 'PATCH',
                credential : 'includes',
                body : {
                    ...data
                },
            })

         })
            
    })
});


export const { useUpdateNoteMutation , useCreateNoteMutation, useDeleteNoteMutation , useGetAllNoteUserMutation , useGetAllnoteQuery , useGetOrgQuery , useUpdateUserMutation , useGetUserMutation , useGetNotiQuery , useSetNotiMutation , useGetHowQuery , useSetHowMutation , useUpdateHowMutation} = noteApislice;
// returns the query result object
export const selectNotesResult = noteApislice.endpoints.getAllNoteUser.select()

// creates memoized selector
const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
// not working for some reason
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
    // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)
