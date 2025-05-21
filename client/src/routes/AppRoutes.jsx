import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import Tasks from "../pages/Tasks";
import Events from "../pages/Events";
import Todo from "../pages/Todo";
import NotFound from "../pages/NotFound";
import Layout from "../components/Layout"; // We'll create this soon

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="events" element={<Events />} />
          <Route path="todo" element={<Todo />} />
        </Route>

        {/* Fallback for non-existent routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
