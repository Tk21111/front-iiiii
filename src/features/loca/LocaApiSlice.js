import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter ,createSelector} from "@reduxjs/toolkit";

const locasAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.user === b.user) ? 0 : a.user ? 1 : -1
})

const initialState = locasAdapter.getInitialState()

export const locaApislice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllloca: builder.query({
            query: () => '/location/all',
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
                        ...result.ids.map(id => ({ type: 'Loca', id }))
                    ]
                } else return [{ type: 'Loca', id: 'LIST' }]
            }
        }),
        getAllUserloca: builder.query({
            query: () => '/location/',
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
                        ...result.ids.map(id => ({ type: 'Loca', id }))
                    ]
                } else return [{ type: 'Loca', id: 'LIST' }]
            }
        }),
        createloca : builder.mutation({
            query: (data) => ({
                url: '/location/create',
                method: 'POST',
                credential : 'include',
                body : data.formData,
            }),
            invalidatesTags: [
                { type: 'Loca', id: "LIST" }
            ]
        }),
        donateloca : builder.mutation({
            query: (data) => ({
                 //same
                url: '/location/donate',
                method: 'POST',
                credential : 'include',
                body : {...data},
            })
        }),
        updateloca : builder.mutation({
            query: (data) => ({ //same
                url: '/location/update',
                method: 'PATCH',
                body : { ...data}
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Loca', id: arg.id }
            ]
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
            invalidatesTags: (result, error, arg) => [
                { type: 'Loca', id: arg.id }
            ]
         }),
        
    })
});

export const { useCreatelocaMutation, useDeletelocaMutation , useGetAlllocaQuery , useGetAllUserlocaQuery , useDonatelocaMutation} = locaApislice;
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
