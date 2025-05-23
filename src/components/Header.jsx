import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-bottom">
      <nav className="container d-flex justify-content-between align-items-center py-3">
        <Link to="/" className="text-primary fw-bold fs-4 text-decoration-none">
          StealthList
        </Link>
      <div className="d-flex align-items-center">
        {user ? (
          <>
            <span className="me-3 fw-medium text-dark bg-light px-3 py-1 rounded-pill">{user.name}</span>
            <button className="btn btn-outline-primary" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-primary me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-primary" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
    </header>
  );
};

export default Header;
