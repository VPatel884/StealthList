import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  clearTodos,
  editTodo,
} from "../features/todo/todoSlice";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import { TodoDateTime } from "./TodoDateTime";
import { toast } from "react-toastify";

const Todo = () => {
  const dispatch = useDispatch();
  const { items: todos, loading, error } = useSelector((state) => state.todos);

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("time-desc");

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

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

  const handleAdd = (text) => {
    if (!text.trim()) return;
    const exists = todos.some((t) => t.text.trim().toLowerCase() === text.trim().toLowerCase());
    if (exists) {
      toast.error("Todo already exists!");
      return;
    }
    dispatch(addTodo(text)).unwrap().then(() => toast.success("Todo added!")).catch(toast.error);
  };

  const handleToggle = (id) => {
    const todo = todos.find((t) => t._id === id);
    if (todo) dispatch(toggleTodo(todo));
  };

  const handleEdit = (id, newText) => {
  dispatch(editTodo({ id, text: newText }))
    .unwrap()
    .then(() => toast.info("Todo updated"))
    .catch(toast.error);
};


  const handleDelete = (id) => {
    const todo = todos.find((t) => t._id === id);
    if(!todo) return;
    dispatch(deleteTodo(id)).then(() =>
      toast.warn(`Removed: "${todo.text}"`)
    );
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all todos?")) {
      dispatch(clearTodos()).then(() => toast.success("Todos cleared!"));
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card shadow border-0 p-4 w-100" style={{ maxWidth: "650px" }}>
    <h3 className="text-center mb-3">📋 Your Todo List</h3>
        <TodoDateTime />
        <TodoInput onAdd={handleAdd} />

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

        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : getFilteredAndSortedTodos().length === 0 ? (
          <div className="text-center text-muted my-4">No todos found.</div>
        ) : (
          <TodoList
            todos={getFilteredAndSortedTodos()}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onRemove={handleDelete}
            onClear={handleClear}
          />
        )}
      </div>
    </div>
  );
};

export default Todo;
