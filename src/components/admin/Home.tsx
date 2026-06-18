import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Pencil, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import AddCarouselModal from "./AddCarouselModal";

interface Carousel {
  _id: string;
  title: string;
  image: string;
  black: boolean;
  createdAt: string;
}

const CarouselManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCarousels = async () => {
    try {
      const response = await axios.get("/api/carousel");
      setCarousels(response.data.carousels);
    } catch (error) {
      console.error("Error fetching carousels:", error);
      toast.error("Failed to load carousels");
    }
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);

    try {
      if (editingCarousel) {
        // Update existing carousel
        const response = await axios.put(
          `/api/carousel?id=${editingCarousel._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Carousel updated successfully!");
          setEditingCarousel(null);
        }
      } else {
        // Add new carousel
        const response = await axios.post("/api/carousel", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success("Carousel added successfully!");
        }
      }

      setIsModalOpen(false);
      fetchCarousels();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (carousel: Carousel) => {
    setEditingCarousel(carousel);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm("Are you sure you want to delete this carousel item?")
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/carousel?id=${id}`);

      if (response.status === 200) {
        toast.success("Carousel item deleted successfully!");
        fetchCarousels();
      }
    } catch (error) {
      console.error("Error deleting carousel item:", error);
      toast.error("Failed to delete carousel item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCarousel(null);
  };

  const openModal = () => {
    if (carousels.length >= 5) {
      toast.error("You have reached the maximum limit of carousel items");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Manage Carousel</h1>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Add New Carousel Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carousels.map((carousel) => (
            <div
              key={carousel._id}
              className={`bg-neutral-900 rounded-lg overflow-hidden shadow-lg relative group ${
                carousel.black ? "bg-black" : "bg-neutral-900"
              }`}
            >
              <div className="aspect-w-16 aspect-h-9 w-full relative h-48">
                <Image
                  src={carousel.image}
                  alt={carousel.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Action buttons overlay */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(carousel)}
                  className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
                  disabled={isDeleting}
                >
                  <Pencil className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(carousel._id)}
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
                  {carousel.title}
                </h3>
                <p className="text-neutral-400 text-xs">
                  {new Date(carousel.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <AddCarouselModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          editingCarousel={editingCarousel}
        />
      </div>
    </div>
  );
};

export default CarouselManagement;
