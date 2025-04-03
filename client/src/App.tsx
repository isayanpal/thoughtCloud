import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Layout from "./components/custom/Layout"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Auth from "./pages/Auth"

export default function App() {
  const token = localStorage.getItem("token");
  console.log("Token from localStorage: ",token);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/auth" element={<Auth/>} />
        </Route>
      </Routes>
    </Router>
  )
}