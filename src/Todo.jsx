import { useState } from "react";
import {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "./Api";

const Todo = () => {
  const [lineThrough, setLineThrough] = useState(true);

  const { isLoading, isError, data: getTodos } = useGetTodosQuery();
  const [addTodo] = useAddTodoMutation();
  const [Delete] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();

  const handleClick = async (e) => {
    e.preventDefault();
    const post = {
      id: getTodos.length + 1,
      title: e.target.newTodo.value,
      completed: false,
    };
    await addTodo(post);
    e.target.newTodo.value = "";
  };

  const handleDelete = async (id) => {
    await Delete(id);
  };

  const handleUpdate = async (id, completed) => {
    setLineThrough(!lineThrough);
    const todo = getTodos.find((todo) => todo.id === id);
    await updateTodo({
      ...todo,
      completed: !completed,
    });
  };
  if (isLoading) return <div className="text-center mt-4">Loading...</div>;
  if (isError)
    return <div className="text-center mt-4">Error fetching todos.</div>;
  return (
    <div>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16">
        <div className="px-4 py-2">
          <h1 className="text-gray-800 text-center font-bold text-2xl uppercase">
            To-Do List
          </h1>
        </div>
        <form
          className="w-full max-w-sm mx-auto px-4 py-2"
          onSubmit={handleClick}
        >
          <div className="flex items-center border-b-2 border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              name="newTodo"
              placeholder="Add a task"
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
            >
              Add
            </button>
          </div>
        </form>
        <ul className="divide-y divide-gray-200 px-4">
          {getTodos.map((todo) => (
            <li key={todo.id} className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id={`todo-${todo.id}`}
                    name={`todo-${todo.id}`}
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    checked={todo.completed}
                    onChange={() => handleUpdate(todo.id, todo.completed)}
                  />
                  <label className="ml-3 block text-gray-900">
                    <span
                      className={`${
                        todo.completed ? "line-through" : ""
                      } text-lg font-medium"`}
                    >
                      {todo.title}
                    </span>
                  </label>
                </div>
                <button
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => handleDelete(todo.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
