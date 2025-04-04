import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Layout from "./components/custom/Layout"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Auth from "./pages/Auth"
import CreatePost from "./pages/CreatePost"
import { useAuthStore } from "./store/store"
import { useEffect } from "react"
import EditPost from "./pages/EditPost"
import ViewPost from "./pages/ViewPost"

export default function App() {
  const { checkUserSession } = useAuthStore();
  useEffect(()=>{
    checkUserSession();
  },[checkUserSession])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/write" element={<CreatePost/>} />
        <Route path="/edit/:id" element={<EditPost/>} />
        <Route path="/view/:id" element={<ViewPost/>} />
        </Route>
      </Routes>
    </Router>
  )
}