"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

const AddPostModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingPost,
}: any) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);

  // Reset form helper
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      description: "",
      tags: "",
    });
    setImageFile(null);
    setImagePreview("");
    setImageError(false);
  }, []);

  // Handle modal close
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  // Populate form when editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        description: editingPost.description,
        tags: editingPost.tags.join(","),
      });
      setImagePreview(editingPost.image);
      setImageError(false);
    } else {
      resetForm();
    }
  }, [editingPost, resetForm]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImageError(false);

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setImageError(true);
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setImageError(true);
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!editingPost && !imageFile) {
      setImageError(true);
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("title", formData.title);
    submitFormData.append("description", formData.description);
    submitFormData.append("tags", formData.tags);
    if (imageFile) {
      submitFormData.append("image", imageFile);
    }

    try {
      await onSubmit(submitFormData);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 z-50 animate-fade-in">
      <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {editingPost ? "Edit Post" : "Add New Post"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-48 rounded-lg overflow-hidden bg-neutral-800 flex items-center justify-center relative">
              {imagePreview ? (
                imagePreview.startsWith("data:") ? (
                  // For newly selected images (data URLs)
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 384px) 100vw"
                  />
                ) : (
                  // For existing Cloudinary images
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 384px) 100vw"
                    onError={() => setImageError(true)}
                  />
                )
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors">
                  Choose Image
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingPost}
                />
              </label>
              {imageError && (
                <p className="text-red-500 text-sm">
                  Please select a valid image file (max 5MB)
                </p>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
              maxLength={100}
              placeholder="Enter post title"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
              maxLength={500}
              rows={4}
              placeholder="Enter post description"
            />
            <p className="text-xs text-neutral-500 mt-1 text-right">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
              placeholder="Enter tags (e.g., technology, design)"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || imageError}
            className={`w-full py-2 px-4 rounded-lg transition-colors ${
              isLoading || imageError
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {editingPost ? "Updating..." : "Adding..."}
              </span>
            ) : editingPost ? (
              "Update Post"
            ) : (
              "Add Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPostModal;
