"use client"

import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useRouter } from "next/navigation";
import { createPost } from "../api";

export default function CreatePost() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null)

  
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and content are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("file", image);

    try {
      setError("")
      await createPost(formData);
      router.push("/");
    } catch {
      setError("Failed to create post");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Post</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <label htmlFor="image-upload" className="block font-medium border w-fit py-1 px-2 rounded">Upload Image</label>
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="mt-2 hidden" />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-60 rounded" />
          )}
          <button type="submit" className="w-full bg-blue-500 text-white px-3 py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
