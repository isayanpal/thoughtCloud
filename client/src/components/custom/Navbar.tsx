import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/store";
import {  DoorOpen, Home, PenLine } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { logout, user } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      isDropdownOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      avatarRef.current &&
      !avatarRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);


  return (
    <nav className="flex flex-row justify-between items-center cursor-pointer text-black border-b border-gray-300 py-3 px-4 sm:px-6 lg:px-8">
      <div>
        <Link to="/">
          <div className="flex items-center space-x-2">
            <PenLine className="h-6 w-6" />
            <span className="font-bold text-xl">ThoughtCloud</span>
          </div>
        </Link>
      </div>
      <div>
        {token ? (
          <div className="relative">
            <button
              ref={avatarRef}
              onClick={toggleDropdown}
              className="focus:outline-none"
            >
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarFallback>{user?.username.slice(0,1).toUpperCase()}</AvatarFallback>
              </Avatar>
            </button>

            <div
              ref={dropdownRef}
              className={cn(
                "absolute top-10 right-0 z-10 w-32 rounded-md shadow-md bg-white border border-gray-200",
                isDropdownOpen ? "block" : "hidden"
              )}
            >
              <div className="py-2 flex flex-col items-center justify-center">
                <Link
                  to={"/"}
                  className="block px-4 py-2 text-sm text-gray-700"
                  onClick={() => setIsDropdownOpen(false)} 
                >
                  <Button variant={"outline"} className="cursor-pointer">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
                <Link
                  to={"/write"}
                  className="block px-4 py-2 text-sm text-gray-700"
                  onClick={() => setIsDropdownOpen(false)} 
                >
                  <Button variant={"outline"} className="cursor-pointer">
                    <PenLine className="h-4 w-4 mr-2" />
                    Write
                  </Button>
                </Link>
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white cursor-pointer "
                >
                  <DoorOpen className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
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