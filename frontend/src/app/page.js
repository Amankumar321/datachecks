"use client"

import { useState, useEffect } from "react";
import useAuthStore from "./store/authStore";
import { useRouter } from "next/navigation";
import { getPosts } from "./api";
import PostCard from "./components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-24">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
        {user && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            onClick={() => router.push("/create")}
          >
            Create Post
          </button>
        )}
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
