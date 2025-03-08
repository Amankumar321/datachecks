"use client"

import { useRouter } from "next/navigation";

export default function PostCard({ post }) {
  const router = useRouter();

  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="text-gray-600">
        by {post.author.username} - {new Date(post.created_at + "Z").toLocaleDateString()} (last updated - {new Date(post.updated_at + "Z").toLocaleTimeString()})
      </p>
      <p className="mt-2">{post.content.substring(0, 100)}...</p>
      <button
        className="mt-2 text-blue-500"
        onClick={() => router.push(`/post/${post.id}`)}
        >
        Read more
      </button>
      {post.image_url && (
        <img src={process.env.SERVER_URL + post.image_url} alt="Post Image" className="w-60 mt-2 rounded" />
      )}
    </div>
  );
}
