import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddPostModal from "./AddPostModal";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";

interface Post {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  createdAt: string;
}

const PostManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/post");
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);

    try {
      if (editingPost) {
        // Update existing post
        const response = await axios.put(
          `/api/post?id=${editingPost._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Post updated successfully!");
          setEditingPost(null);
        }
      } else {
        // Add new post
        const response = await axios.post("/api/post", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success("Post added successfully!");
        }
      }

      setIsModalOpen(false);
      fetchPosts();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/post?id=${id}`);

      if (response.status === 200) {
        toast.success("Post deleted successfully!");
        fetchPosts();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };
  const openModal = () => {
    if (posts.length >= 3) {
      toast.error("You have reached the maximum limit of posts");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Manage Post</h1>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Add New Post
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-neutral-900 rounded-lg overflow-hidden shadow-lg relative group"
            >
              <div className="aspect-w-16 aspect-h-9 w-full relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Action buttons overlay */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
                  disabled={isDeleting}
                >
                  <Pencil className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="p-2 bg-red-700 rounded-full hover:bg-red-800 transition-colors"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {post.title}
                </h3>
                <p className="text-neutral-400 mb-2 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-neutral-500 text-xs">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <AddPostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          editingPost={editingPost}
        />
      </div>
    </div>
  );
};

export default PostManagement;
