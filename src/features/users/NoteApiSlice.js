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
            invalidatesTags: [
                { type: 'Note', id: "LIST" }
            ]
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
                body : { ...data}
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
        
    })
});

export const { useCreateNoteMutation, useDeleteNoteMutation , useGetAllNoteUserMutation , useGetAllnoteQuery  } = noteApislice;
// returns the query result object
export const selectNotesResult = noteApislice.endpoints.getAllNoteUser.select()

// creates memoized selector
const selectNotesData = createSelector(
    selectNotesResult,
    notesResult => notesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
    // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState)
