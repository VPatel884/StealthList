import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Todo from "./components/Todo";

function App() {
  return (
    <>
      <Todo />
      <ToastContainer autoClose={1500} />
    </>
  );
}

export default App;
