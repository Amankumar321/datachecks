"use client";

import { useState, useEffect } from "react";
import useAuthStore from "./store/authStore";
import { useRouter } from "next/navigation";
import { getPosts } from "./api";
import PostCard from "./components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // Track current page
  const [totalPosts, setTotalPosts] = useState(0); // Track total posts for pagination
  const [search, setSearch] = useState("");
  const limit = 2; // Number of posts per page
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts(search, (page - 1) * limit, limit);
        setPosts(response.data.posts);
        setTotalPosts(response.data.total);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };
    fetchPosts();
  }, [search, page]);


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

        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p>No posts found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-lg">
            Page {page} of {Math.ceil(totalPosts / limit)}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page * limit >= totalPosts}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
