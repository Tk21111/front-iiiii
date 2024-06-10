import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter } from "@reduxjs/toolkit";

const noteAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.timeOut.localeCompare(a.timeOut)
})

const initialState = noteAdapter.getInitialState()

export const noteApislice = apiSlice.injectEndpoints({ 
    endpoints: builder => ({
        getAllnote: builder.query({
            query: () => '/note/all',
        }),
        getAllNoteUser: builder.mutation({ //username didn't get use the func intent is not working
            query: (data) => ({
                url: '/note/',
                method: 'PATCH',
                credential: 'include',
                body : {...data}
                
            }),
        }),
        createNote : builder.mutation({
            query: (data) => ({ //same
                url: '/note/create',
                method: 'POST',
                credential : 'include',
                body : { ...data}
            }),
            invalidatesTags : ['Todos']
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
            invalidatesTags : ['Todos']
         }),
        
    })
});

export const { useCreateNoteMutation, useDeleteNoteMutation , useGetAllNoteUserMutation , useGetAllnoteQuery  } = noteApislice;
