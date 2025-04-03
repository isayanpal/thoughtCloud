import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/store";


export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const {logout} = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate("/auth")
  };
  
  return (
    <nav className="flex flex-row justify-between items-center cursor-pointer text-black">
      <div>
        <h1 className="text-2xl font-bold">ThoughtCloud</h1>
      </div>
      <div>
        {token ? (
        <Button variant={"destructive"} onClick={handleLogout}>Logout</Button>
        ) : (
          <Link to="/auth">
          <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
