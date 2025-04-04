import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Layout from "./components/custom/Layout"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Auth from "./pages/Auth"
import CreatePost from "./pages/CreatePost"
import { useAuthStore } from "./store/store"
import { useEffect } from "react"

export default function App() {
  const { checkUserSession } = useAuthStore();
  useEffect(()=>{
    checkUserSession();
  },[])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/write" element={<CreatePost/>} />
        </Route>
      </Routes>
    </Router>
  )
}