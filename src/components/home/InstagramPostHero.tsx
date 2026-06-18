"use client";
import React, { useState, useEffect } from "react";
import Card from "../custom/Card";

interface Post {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

const InstagramPostHero = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/post");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="loader mb-4" />
          <p className="text-gray-700 text-xl">Loading posts...</p>
        </div>
        <style jsx>{`
          .loader {
            width: 40px;
            height: 40px;
            border: 4px solid transparent;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <h2 className="text-red-600 text-2xl font-semibold">Error</h2>
          <p className="text-gray-700 mt-2">{error}</p>
          {/* <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
            onClick={() => window.location.reload()}
          >
            Retry
          </button> */}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header */}
      <div className="w-full">
        <h1 className="p-10 text-4xl md:text-8xl font-thin text-gray-800 tracking-widest">
          INSTAGRAM
          <br />
          POSTS
        </h1>
      </div>

      {/* Posts Section */}
      <div className="flex justify-center flex-col md:flex-row md:gap-16 w-full px-10 md:px-20 md:py-20 flex-wrap mb-10">
        {posts.map((post) => (
          <Card
            key={post._id}
            title={post.title}
            description={post.description}
            tags={post.tags}
            image={post.image}
          />
        ))}
      </div>
    </div>
  );
};

export default InstagramPostHero;
