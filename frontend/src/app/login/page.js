"use client"

import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { useRouter } from "next/navigation";

export default function Login() {
  const { user, login } = useAuthStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("")
      await login(username, password);
      router.push("/")
    }
    catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-blue-500 text-white px-3 py-2 rounded">
            Login
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
