import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Todo from "./components/Todo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Header />
        <main className="flex-fill">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Todo />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer autoClose={1500} />
      </Router>
    </div>
  );
}

export default App;
