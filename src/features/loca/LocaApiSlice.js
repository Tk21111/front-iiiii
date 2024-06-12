import { apiSlice } from "../../app/api/apiSlice";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../auth/authSlice";


export const locaApislice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllloca: builder.query({
            query: () => '/location/all',
        }),
        createloca : builder.mutation({
            query: (data) => ({ //same
                url: '/location/create',
                method: 'POST',
                body : { ...data}
            }),
        }),
        deleteloca : builder.mutation({
            query: (data) => ({ //same
                url: '/location/delete',
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
