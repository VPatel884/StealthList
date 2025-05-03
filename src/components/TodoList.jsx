import TodoItem from "./TodoItem";

const TodoList = ({ todos, onToggle, onRemove, onEdit, onClear }) => {
  return (
    <section>
      <ul className="list-group">
        {todos.map((todo, index) => (
          <TodoItem
            key={index}
            todo={todo}
            onToggle={() => onToggle(index)}
            onRemove={() => onRemove(index)}
            onEdit={(newText) => onEdit(index, newText)}
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
