import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Layout from "./components/custom/Layout"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        </Route>
      </Routes>
    </Router>
  )
}