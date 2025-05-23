import TodoItem from "./TodoItem";

const TodoList = ({ todos, onToggle, onRemove, onEdit, onClear }) => {
  return (
    <section>
      <ul className="list-group">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={() => onToggle(todo._id)}
            onRemove={() => onRemove(todo._id)}
            onEdit={(newText) => onEdit(todo._id, newText)}
          />
        ))}
      </ul>
      {todos.length > 1 && (
        <div className="text-center">
          <button className="btn btn-danger mt-2" onClick={onClear}>
            Clear all
          </button>
        </div>
      )}
    </section>
  );
};

export default TodoList;
