import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function Layout() {
  return (
    <main className="min-h-screen max-w-6xl mx-auto bg-amber-400">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  )
}
