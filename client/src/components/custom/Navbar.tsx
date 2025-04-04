import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/store";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="flex flex-row justify-between items-center cursor-pointer text-black">
      <div>
        <Link to="/">
          <h1 className="text-2xl font-bold">ThoughtCloud</h1>
        </Link>
      </div>
      <div>
        {token ? (
          <div className="flex flex-row gap-2">
            <Button variant={"destructive"} onClick={handleLogout}>
              Logout
            </Button>
            <Link to={"/write"}>
              <Button>Write</Button>
            </Link>
          </div>
        ) : (
          <Link to="/auth">
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
