import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import { TodoDateTime } from "./TodoDateTime";

const Todo = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("time-desc");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const getFilteredAndSortedTodos = () => {
    let filtered = [...todos];

    if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    } else if (filter === "incomplete") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "today") {
      const today = new Date().toLocaleDateString();
      filtered = filtered.filter((todo) => todo.createdAt?.startsWith(today));
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

  const addTodo = (text) => {
    if (text) {
      const trimmed = text;
      const isDuplicate = todos.some(
        (todo) =>
          todo.text.trim().toLowerCase() === trimmed.trim().toLowerCase()
      );
      if (isDuplicate) {
        toast.error("Todo already exists!");
        return;
      }

      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(now);
      const todo = {
        text: trimmed,
        completed: false,
        createdAt: formattedDate,
      };

      setTodos([...todos, todo]);
      toast.success("Todo added!");
    }
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = [...todos];
    const removedText = newTodos[index].text;
    newTodos.splice(index, 1);
    setTodos(newTodos);
    toast.warn(`Removed: "${removedText}"`);
  };

  const editTodo = (index, newText) => {
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

    const newTodos = [...todos];
    newTodos[index].text = trimmed;
    setTodos(newTodos);
    toast.info("Todo updated.");
  };

  const clearTodos = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all todos?"
    );
    if (confirmClear) {
      setTodos([]);
      toast.success("Todos cleared!");
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
              style={{ maxWidth: "200px" }}
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
              style={{ maxWidth: "200px" }}
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
