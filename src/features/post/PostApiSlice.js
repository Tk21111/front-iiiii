import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => (a.user === b.user ? 0 : a.user ? 1 : -1),
});

const initialState = postAdapter.getInitialState();

export const postApislice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: () => "/post",
      transformResponse: (responseData) => {
        const loadedLoca = responseData.map((loca) => {
          loca.id = loca._id;
          return loca;
        });
        return postAdapter.setAll(initialState, loadedLoca);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Post", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Post", id })),
          ];
        } else return [{ type: "Post", id: "LIST" }];
      },
    }),
    getComment: builder.mutation({
      query: (data) => ({
        url: "/post/comment",
        method: "PATCH",
        credentials: "include",
        body: { ...data },
      }),
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: "/post",
        method: "POST",
        credentials: "include", // Note: it should be 'credentials' instead of 'credential'
        body: data.formData, // Use data directly if it’s a FormData object
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    createComment: builder.mutation({
      query: (data) => ({
        //same
        url: "/post/comment",
        method: "POST",
        credentials: "include",
        body: data.formData,
      }),
    }),

    setLike : builder.mutation({
        query : (data) =>  ({
           url : '/post/like',
           method : 'POST',
           body : data          
        })
    })
  }),
});

export const {
  useCreateCommentMutation,
  useCreatePostMutation,
  useGetCommentMutation,
  useGetPostQuery, 
  useSetLikeMutation,
} = postApislice;
// returns the query result object
export const selectpostsResult = postApislice.endpoints.getPost.select();

// creates memoized selector
const selectpostsData = createSelector(
  selectpostsResult,
  (postsResult) => postsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllposts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postAdapter.getSelectors((state) => selectpostsData(state) ?? initialState);
