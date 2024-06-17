import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const myApi = createApi({
  reducerPath: "myApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://666043565425580055b310ce.mockapi.io/",
  }),
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => "crud-myself",
      providesTags: ["Todo"],
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: "crud-myself",
        method: "POST",
        body: todo,
      }),
      invalidatesTags: ["Todo"],
      async onQueryStarted(todo, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData("getTodos", undefined, (draft) => {
            draft.push(todo);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `crud-myself/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData("getTodos", undefined, (draft) => {
            return draft.filter((todo) => todo.id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...todo }) => ({
        url: `crud-myself/${id}`,
        method: "PUT",
        body: todo,
      }),
      invalidatesTags: ["Todo"],
      async onQueryStarted({ id, ...todo }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          myApi.util.updateQueryData("getTodos", undefined, (draft) => {
            const index = draft.findIndex((t) => t.id === id);
            if (index !== -1) {
              draft[index] = { ...draft[index], ...todo };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} = myApi;
