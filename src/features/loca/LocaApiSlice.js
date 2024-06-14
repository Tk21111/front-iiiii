import { apiSlice } from "../../app/api/apiSlice";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "../auth/authSlice";


export const locaApislice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllloca: builder.query({
            query: () => '/location/all',
        }),
        getAllUserloca: builder.mutation({
            query: (data) => ({
                url: '/location/',
                method: 'PATCH',
                body : { ...data}
            })
        }),
        createloca : builder.mutation({
            query: (data) => ({ //same
                url: '/location/create',
                method: 'POST',
                body : { ...data}
            }),
        }),
        updateloca : builder.mutation({
            query: (data) => ({ //same
                url: '/location/update',
                method: 'PATCH',
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
