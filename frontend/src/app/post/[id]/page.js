"use client"

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPost, deletePost } from "../../api";
import { toast } from "react-hot-toast";
import {  } from "next/image"
import useAuthStore from "../../store/authStore"

const PostPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        setPost(response.data);
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(id)
      toast.success("Post deleted successfully");
      router.push("/");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 pt-24">
      {post && (
        <>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-2">by {post.author.username} - {new Date(post.created_at + "Z").toLocaleDateString()} (last updated - {new Date(post.updated_at + "Z").toLocaleTimeString()})</p>
          <p className="text-gray-800">{post.content}</p>
          {post.image_url && (
            <img src={process.env.SERVER_URL + post.image_url} alt={post.title} className="w-60 rounded-lg mt-2" />
          )}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => router.push(`/post/edit/${id}`)}
              className={`bg-blue-500 text-white px-4 py-2 rounded ` + (post.author.username === useAuthStore.getState().getUser() ? 'block' : 'hidden')}
            >
              Edit Post
            </button>
            <button
              onClick={handleDelete}
              className={`bg-red-500 text-white px-4 py-2 rounded ` + (post.author.username === useAuthStore.getState().getUser() ? 'block' : 'hidden')}
            >
              Delete Post
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PostPage;
