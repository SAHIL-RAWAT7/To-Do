import { useEffect, useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await api.post("/todos", { task: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
      toast.success("Task added successfully!");
    } catch (error) {
      console.log("Error adding todo:", error);
      toast.error("Failed to add task.");
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
      toast.error("Failed to fetch tasks.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.task);
  };

  const saveEdit = async (id) => {
    try {
      const response = await api.patch(`/todos/${id}`, {
        task: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
      toast.info("Task updated!");
    } catch (error) {
      console.log("Error updating todo:", error);
      toast.error("Failed to update task.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.warn("Task deleted!");
    } catch (error) {
      console.log("Error deleting todo:", error);
      toast.error("Failed to delete task.");
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await api.patch(`/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
      toast.success(
        todo.completed ? "Task marked incomplete!" : "Task completed!"
      );
    } catch (error) {
      console.log("Error toggling todo:", error);
      toast.error("Failed to update task status.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center tracking-wide">
          My Task Manager
        </h1>

        <form
          onSubmit={addTodo}
          className="flex items-center gap-3 shadow-md border border-gray-300 p-3 rounded-lg bg-gray-50"
        >
          <input
            className="flex-1 outline-none px-4 py-2 text-gray-700 placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-blue-300 transition duration-200"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter a new task..."
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-200 shadow hover:shadow-lg"
          >
            Add
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {todos.length === 0 ? (
            <div className="text-center text-gray-500 italic">
              No tasks yet. Add one!
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo._id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {editingTodo === todo._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition duration-200"
                    >
                      <MdOutlineDone />
                    </button>
                    <button
                      onClick={() => setEditingTodo(null)}
                      className="p-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition duration-200"
                    >
                      <IoClose />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTodo(todo._id)}
                        className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                          todo.completed
                            ? "bg-green-500 border-green-500"
                            : "border-gray-400 hover:border-blue-500"
                        } border-2`}
                      >
                        {todo.completed && (
                          <MdOutlineDone className="text-white text-lg" />
                        )}
                      </button>
                      <span
                        className={`text-gray-800 font-medium transition-colors duration-200 ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.task}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(todo)}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-100 transition duration-200"
                      >
                        <MdModeEditOutline />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-100 transition duration-200"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default App;
