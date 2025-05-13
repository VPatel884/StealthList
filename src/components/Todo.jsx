import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import { TodoDateTime } from "./TodoDateTime";
import API from "../api";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("time-desc");

  const fetchTodos = async () => {
    try {
      const res = await API.get("/");
      setTodos(res.data);
    } catch (err) {
      toast.error("Failed to fetch todos",err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const getFilteredAndSortedTodos = () => {
    let filtered = [...todos];

    if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    } else if (filter === "incomplete") {
      filtered = filtered.filter((todo) => !todo.completed);
    }

    switch (sort) {
      case "time-asc":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "time-desc":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "alpha":
        filtered.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case "completed":
        filtered.sort((a, b) => b.completed - a.completed);
        break;
      case "incomplete":
        filtered.sort((a, b) => a.completed - b.completed);
        break;
    }

    return filtered;
  };

  const addTodo = async (text) => {
    if (!text) return;

    const trimmed = text.trim();
    const isDuplicate = todos.some(
      (todo) => todo.text.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      toast.error("Todo already exists!");
      return;
    }

    try {
      const res = await API.post("/", { text: trimmed });
      setTodos([...todos, res.data]);
      toast.success("Todo added!");
    } catch (err) {
      toast.error("Failed to add todo.",err);
    }
  };

  const toggleTodo = async (index) => {
    const todo = todos[index];
    try {
      const res = await API.put(`/${todo._id}`, {
        completed: !todo.completed,
      });
      const updated = [...todos];
      updated[index] = res.data;
      setTodos(updated);
    } catch (err) {
      toast.error("Failed to toggle todo.",err);
    }
  };

  const removeTodo = async (index) => {
    const todo = todos[index];
    try {
      await API.delete(`/${todo._id}`);
      setTodos(todos.filter((_, i) => i !== index));
      toast.warn(`Removed: "${todo.text}"`);
    } catch (err) {
      toast.error("Failed to delete todo.",err);
    }
  };

  const editTodo = async (index, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) {
      toast.error("Todo cannot be empty.");
      return;
    }

    const isDuplicate = todos.some(
      (todo, i) =>
        todo.text.trim().toLowerCase() === trimmed.toLowerCase() && i !== index
    );
    if (isDuplicate) {
      toast.error("Another todo with this text already exists!");
      return;
    }

    const todo = todos[index];
    try {
      const res = await API.put(`/${todo._id}`, {
        text: trimmed,
      });
      const updated = [...todos];
      updated[index] = res.data;
      setTodos(updated);
      toast.info("Todo updated.");
    } catch (err) {
      toast.error("Failed to update todo.",err);
    }
  };

  const clearTodos = async () => {
    const confirmClear = window.confirm("Are you sure you want to clear all todos?");
    if (!confirmClear) return;

    try {
      await API.delete("/all");
      setTodos([]);
      toast.success("Todos cleared!");
    } catch (err) {
      toast.error("Failed to clear todos.",err);
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="w-100" style={{ maxWidth: "600px" }}>
        <h2 className="text-center mb-4">Todo List</h2>

        <TodoDateTime />
        <TodoInput onAdd={addTodo} />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={{ maxWidth: "200px" }}>
            <label className="form-label fw-semibold">Sort by</label>
            <select
              className="form-select me-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="time-desc">Newest First</option>
              <option value="time-asc">Oldest First</option>
              <option value="alpha">A-Z</option>
              <option value="completed">Completed First</option>
              <option value="incomplete">Incomplete First</option>
            </select>
          </div>

          <div style={{ maxWidth: "200px" }}>
            <label className="form-label fw-semibold">Filter by</label>
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        <TodoList
          todos={getFilteredAndSortedTodos()}
          onToggle={toggleTodo}
          onRemove={removeTodo}
          onEdit={editTodo}
          onClear={clearTodos}
        />
      </div>
    </div>
  );
};

export default Todo;
