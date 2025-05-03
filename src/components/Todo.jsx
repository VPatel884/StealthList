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

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    if (text) {
      const isDuplicate = todos.some((todo) => todo.text === text);
      if (isDuplicate) {
        toast.error("Todo already exists!");
        return;
      }

      setTodos([...todos, { text, completed: false }]);
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
      (todo, i) => todo.text === trimmed && i !== index
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
        <TodoList
          todos={todos}
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
