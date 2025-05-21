import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // To highlight the active link
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav style={{ width: "200px", background: "#eee", padding: "1rem" }}>
        <h3>Evently</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <Link
              to="/"
              style={{ fontWeight: isActive("/") ? "bold" : "normal" }}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/calendar"
              style={{ fontWeight: isActive("/calendar") ? "bold" : "normal" }}
            >
              Calendar
            </Link>
          </li>
          <li>
            <Link
              to="/tasks"
              style={{ fontWeight: isActive("/tasks") ? "bold" : "normal" }}
            >
              Tasks
            </Link>
          </li>
          <li>
            <Link
              to="/events"
              style={{ fontWeight: isActive("/events") ? "bold" : "normal" }}
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/todo"
              style={{ fontWeight: isActive("/todo") ? "bold" : "normal" }}
            >
              To-do
            </Link>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "2rem",
            padding: "0.5rem",
            width: "100%",
            background: "#f44336",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}

