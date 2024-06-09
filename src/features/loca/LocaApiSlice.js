import { apiSlice } from "../../app/api/apiSlice";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../auth/authSlice";


export const locaApislice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllloca: builder.query({
            query: () => '/loca/all',
        }),
        createloca : builder.mutation({
            query: (data) => ({ //same
                url: '/loca/create',
                method: 'POST',
                credential : 'include',
                body : { ...data}
            }),
        }),
        deleteloca : builder.mutation({
            query: (data) => ({ //same
                url: '/loca/delete',
                method: 'DELETE',
                credential : 'include',
                body : {
                    ...data
                }
            }),
         }),
        
    })
});

export const { useCreatelocaMutation, useDeletelocaMutation , useGetAlllocaQuery } = locaApislice;
