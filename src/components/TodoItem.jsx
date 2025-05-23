import { useEffect, useState } from "react";

const TodoItem = ({ todo, onToggle, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };

  useEffect(() => {
  setEditText(todo.text);
}, [todo.text]);


  const formattedCreatedAt = todo.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(todo.createdAt))
    : "";

  return (
    <li className={`list-group-item d-flex justify-content-between align-items-center border rounded mb-2 shadow-sm ${todo.completed ? "text-muted bg-light" : "text-dark bg-white"}`}>
      {isEditing ? (
        <div className="d-flex flex-column gap-2 w-100">
          <input
            className="form-control"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success" onClick={handleEdit}>
                Save
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(todo.text);
                }}
              >
                Cancel
              </button>
            </div>
        </div>
      ) : (
        <>
        <div className="d-flex flex-column">
          <span
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
            
          </span>
          <small className="text-muted">{formattedCreatedAt}</small>
          </div>
          <div>
            <button
              className={`btn btn-sm me-2 ${
                todo.completed ? "btn-outline-success" : "btn-outline-warning"
              }`}
              onClick={() => onToggle(todo._id)}
            >
              {todo.completed ? "✓" : "○"}
            </button>
            <button
              className="btn btn-sm btn-outline-info me-2"
              onClick={() => {
    setEditText(todo.text);
    setIsEditing(true);
  }}
              data-toggle="tooltip" data-placement="bottom" title="Edit"
            >
              ✎
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onRemove(todo._id)}
              data-toggle="tooltip" data-placement="top" title="Remove"
            >
              🗑
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem;
