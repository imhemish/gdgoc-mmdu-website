import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddTeamModal from "./AddTeamModal";
import { Pencil, Trash2, Loader2, Quote } from "lucide-react";
import Image from "next/image";

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  batch: string;
  image: string;
  quote: string;
}

const Team = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get("/api/team");
      setTeamMembers(response.data.teams);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleSubmit = async (formData: any) => {
    setIsLoading(true);

    try {
      if (editingMember) {
        // Update existing member
        const response = await axios.put(
          `/api/team?id=${editingMember._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Team member updated successfully!");
          setEditingMember(null);
        }
      } else {
        // Add new member
        const response = await axios.post("/api/team", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          toast.success("Team member added successfully!");
        }
      }

      setIsModalOpen(false);
      fetchTeamMembers();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/team?id=${id}`);

      if (response.status === 200) {
        toast.success("Team member deleted successfully!");
        fetchTeamMembers();
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Team Members</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Add Team Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="bg-neutral-900 rounded-lg overflow-hidden shadow-lg relative group"
            >
              <div className="aspect-w-16 aspect-h-12 w-full relative h-64">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Action buttons overlay */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors"
                  disabled={isDeleting}
                >
                  <Pencil className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
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
                  {member.name}
                </h3>
                <p className="text-neutral-400 mb-1">{member.position}</p>
                <p className="text-neutral-500 text-sm mb-2">{member.batch}</p>

                {/* Quote section */}
                {member.quote && (
                  <div className="flex items-start text-neutral-400 text-sm italic">
                    <Quote className="w-4 h-4 mr-2 text-neutral-600 flex-shrink-0" />
                    <p>
                      {member.quote.split(" ").slice(0, 4).join(" ") +
                        (member.quote.split(" ").length > 4 ? "..." : "...")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <AddTeamModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          editingMember={editingMember}
        />
      </div>
    </div>
  );
};

export default Team;
