"use client"

import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useRouter } from "next/navigation";

export default function Register() {
  const { user, register } = useAuthStore();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setError("")
      await register(username, password);
      router.push("/")
    }
    catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
            Register
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
