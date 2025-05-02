import { useState } from "react";

const TodoItem = ({ todo, onToggle, onRemove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {isEditing ? (
        <>
          <input
            className="form-control me-2"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button className="btn btn-sm btn-success me-2" onClick={handleEdit}>
            Save
          </button>
        </>
      ) : (
        <>
          <span
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
          </span>
          <div>
            <button
              className={`btn btn-sm me-2 ${
                todo.completed ? "btn-success" : "btn-warning"
              }`}
              onClick={onToggle}
            >
              {todo.completed ? "Complete" : "Incomplete"}
            </button>
            <button
              className="btn btn-sm btn-info me-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button className="btn btn-sm btn-danger" onClick={onRemove}>
              Remove
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem;
