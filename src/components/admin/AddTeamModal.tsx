"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X, Upload, Loader2, Quote } from "lucide-react";
import Image from "next/image";

const AddTeamModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingMember,
}: any) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    batch: "2024-2028",
    quote: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Reset form helper
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      position: "",
      batch: "2024-2028",
      quote: "",
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
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        position: editingMember.position,
        batch: editingMember.batch,
        quote: editingMember.quote,
      });
      setImagePreview(editingMember.image);
      setImageError(false);
    } else {
      resetForm();
    }
  }, [editingMember, resetForm]);

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

    if (!editingMember && !imageFile) {
      setImageError(true);
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("position", formData.position);
    submitFormData.append("batch", formData.batch);
    submitFormData.append("quote", formData.quote);
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

  const batches = ["2024-2028", "2023-2027", "2022-2026"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 z-50 animate-fade-in">
      <div className="bg-neutral-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {editingMember ? "Edit Team Member" : "Add Team Member"}
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
            <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-800 flex items-center justify-center relative">
              {imagePreview ? (
                imagePreview.startsWith("data:") ? (
                  // For newly selected images (data URLs)
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  // For existing Cloudinary images
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    sizes="128px"
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
                  required={!editingMember}
                />
              </label>
              {imageError && (
                <p className="text-red-500 text-sm">
                  Please select a valid image file (max 5MB)
                </p>
              )}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
              maxLength={50}
              placeholder="Enter member name"
            />
          </div>

          {/* Position Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Position
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
              maxLength={100}
              placeholder="Enter position"
            />
          </div>

          {/* Custom Dropdown for Batch */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Batch
            </label>
            <div
              className="px-4 py-2 bg-black border border-gray-700 rounded-lg text-white cursor-pointer hover:bg-neutral-800 transition-colors"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
              {formData.batch}
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-neutral-900 border border-gray-700 rounded-lg shadow-lg">
                {batches.map((batch) => (
                  <div
                    key={batch}
                    className="px-4 py-2 hover:bg-neutral-800 cursor-pointer text-white first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        batch,
                      }));
                      setIsDropdownOpen(false);
                    }}
                  >
                    {batch}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quote Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <Quote className="w-4 h-4 mr-2 text-neutral-500" />
              Quote
            </label>
            <textarea
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
              maxLength={200}
              rows={3}
              placeholder="Enter a memorable quote from the team member"
            />
            <p className="text-xs text-neutral-500 mt-1 text-right">
              {formData.quote.length}/200 characters
            </p>
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
                {editingMember ? "Updating..." : "Adding..."}
              </span>
            ) : editingMember ? (
              "Update Member"
            ) : (
              "Add Member"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTeamModal;
