"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { editPost, getPost } from "../../../api";
import { toast } from "react-hot-toast";

const EditPostPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        setTitle(response.data.title);
        setContent(response.data.content);
        setExistingImage(response.data.image_url);
      } catch {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("file", image);

      await editPost(id, formData);

      toast.success("Post updated successfully");
      router.push(`/post/${id}`);
    } catch {
      toast.error("Failed to update post");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 pt-24">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded h-40"
        />

        <div>
          <label htmlFor="image-upload" className="block font-medium border w-fit py-1 px-2 rounded">Upload New Image</label>
          <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="mt-2 hidden" />
          {preview ? (
            <img src={preview} alt="Preview" className="mt-2 w-60 rounded" />
          ) : existingImage ? (
            <img
              src={process.env.SERVER_URL + existingImage}
              alt="Current Image"
              className="mt-2 w-60 rounded"
            />
          ) : null}
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
