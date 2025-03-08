"use client"

import Link from "next/link";
import useAuthStore from "../store/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/")
  }

  const handleCreate = () => {
    router.push("/create")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const handleRegister = () => {
    router.push("/register")
  }

  return (
    <nav className="bg-gray-800 p-4 absolute w-full text-white flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Blogi
      </Link>
      <div>
        {user ? (
          <>
            <button
              className="bg-red-500 px-4 py-1 rounded mr-2"
              onClick={handleLogout}
            >
              Logout
            </button>
            <button
              className="bg-blue-500 px-4 py-1 rounded"
              onClick={handleCreate}
            >
              Create Post
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-green-500 px-4 py-1 rounded mr-2"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="bg-yellow-500 px-4 py-1 rounded"
              onClick={handleRegister}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
