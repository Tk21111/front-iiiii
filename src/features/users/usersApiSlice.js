import { apiSlice } from "../../app/api/apiSlice";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../auth/authSlice";


export const noteApislice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllnote: builder.query({
            query: () => '/note/all',
        }),
        getAllNoteUser: builder.mutation({ //username didn't get use the func intent is not working
            query: (data) => ({
                url: '/note',
                method: 'GET',
                credential: 'include',
                body : {...data}
                
            }),
        }),
        updateNote : builder.mutation({
            query: (data) => ({ //same
                url: '/note/update',
                method: 'POST',
                credential : 'include',
                body : { ...data}
            }),
        }),
        createNote : builder.mutation({
            query: (data) => ({ //same
                url: '/note/create',
                method: 'POST',
                credential : 'include',
                body : { ...data}
            }),
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
         }),
        
    })
});

export const { useCreateNoteMutation, useDeleteNoteMutation , useGetAllNoteUserMutation , useGetAllnoteQuery ,useUpdateNoteMutation } = noteApislice;
