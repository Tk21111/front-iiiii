import { apiSlice } from "../../app/api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    // Compare dates first
    const dateComparison = new Date(b.date) - new Date(a.date);
    if (dateComparison !== 0) {
        return dateComparison; // Use date comparison if dates are different
    }
    // If dates are the same, compare by __v
    return b.__v - a.__v;
},

});

const initialState = postAdapter.getInitialState();

export const postApislice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: () => "/post",
      transformResponse: (responseData) => {
        const loadedPost = responseData.map((post) => {
          post.id = post._id;
          return post;
        });
        return postAdapter.setAll(initialState, loadedPost);
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
      query: (data) => {
        return {
          url: "/post",
          method: "POST",
          credentials: "include", // Correcting 'credentials' spelling
          body: data.formDataPost, // Using data directly if it’s a FormData object
        };
      },
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
           url : '/post',
           method : 'PATCH',
           body : data          
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Post', id: arg.id }
        ]
    }),
    

    savePost : builder.mutation({
      query : (data) =>({
        url : '/post/save',
        method : 'PATCH',
        body : data
      }),
      invalidatesTags: (result, error, arg) => [
          { type: 'Post', id: arg.id }
      ]
    }),
    getSavePost: builder.query({
      query: () => "/post/save"

    }),

    deletePost : builder.mutation({
      query: (data) => ({ //same
          url: '/post',
          method: 'DELETE',
          body : {
              ...data
          }
      }),
      invalidatesTags: (result, error, arg) => [
          { type: 'Post', id: arg.id }
      ]
   }),
  }),
});

export const {
  useCreateCommentMutation,
  useCreatePostMutation,
  useGetCommentMutation,
  useGetPostQuery, 
  useSetLikeMutation,
  useSavePostMutation,
  useDeletePostMutation,
  useGetSavePostQuery,
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
