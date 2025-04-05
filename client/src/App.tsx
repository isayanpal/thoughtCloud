import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Layout from "./components/custom/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import CreatePost from "./pages/CreatePost";
import { useAuthStore } from "./store/store";
import { useEffect } from "react";
import EditPost from "./pages/EditPost";
import ViewPost from "./pages/ViewPost";

export default function App() {
  const { checkUserSession } = useAuthStore();
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);
  const token = localStorage.getItem("token");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/auth"
            element={!token ? <Auth /> : <Navigate to={"/dashboard"} />}
          />
          <Route
            path="/write"
            element={token ? <CreatePost /> : <Navigate to={"/auth"} />}
          />
          <Route
            path="/edit/:id"
            element={token ? <EditPost /> : <Navigate to={"/auth"} />}
          />
          <Route path="/view/:id" element={<ViewPost />} />
        </Route>
      </Routes>
    </Router>
  );
}
