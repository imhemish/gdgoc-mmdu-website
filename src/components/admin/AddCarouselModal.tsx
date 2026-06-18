import React, { useState, useEffect, useCallback } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

const AddCarouselModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editingCarousel,
}: any) => {
  const [formData, setFormData] = useState({
    title: "",
    black: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState(false);

  // Reset form helper
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      black: false,
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
    if (editingCarousel) {
      setFormData({
        title: editingCarousel.title || "", // Ensure string
        black: editingCarousel.black || false, // Ensure boolean
      });
      setImagePreview(editingCarousel.image || "");
      setImageError(false);
    } else {
      resetForm();
    }
  }, [editingCarousel, resetForm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value || "", // Ensure string for text inputs
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCarousel && !imageFile) {
      setImageError(true);
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("title", formData.title);
    submitFormData.append("black", formData.black.toString());
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
            {editingCarousel ? "Edit Carousel Item" : "Add New Carousel Item"}
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
                  required={!editingCarousel}
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
              value={formData.title || ""} // Ensure string
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              required
              maxLength={100}
              placeholder="Enter carousel item title"
            />
          </div>

          {/* Theme Toggle */}
          {/* <div className="flex items-center">
            <input
              type="checkbox"
              id="black"
              name="black"
              checked={formData.black || false} // Ensure boolean
              onChange={handleInputChange}
              className="mr-2 text-white bg-black border-gray-300 rounded focus:ring-gray-500"
            />
            <label htmlFor="black" className="text-sm text-gray-300">
              Dark Theme Background
            </label>
          </div> */}

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
                {editingCarousel ? "Updating..." : "Adding..."}
              </span>
            ) : editingCarousel ? (
              "Update Carousel Item"
            ) : (
              "Add Carousel Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCarouselModal;
