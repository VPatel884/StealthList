import TodoItem from "./TodoItem";

const TodoList = ({ todos, onToggle, onRemove, onEdit }) => {
  return (
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
  );
};

export default TodoList;
