"use client";
import React, { useState } from "react";
import {
  Home,
  Settings,
  Users,
  Mail,
  Menu,
  X,
  Bell,
  LogOut,
  CheckCircle,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Team from "@/components/admin/Team";
import Sidebar from "@/components/admin/Sidebar";
import Table from "@/components/contact/Table";
import PostManagement from "@/components/admin/Home";
import InstagramManagement from "@/components/admin/InstagramManagement";
import CarouselManagement from "@/components/admin/Home";

const Admin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();

  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "team", label: "Team", icon: <Users size={20} /> },
    { id: "event", label: "Events", icon: <Bell size={20} /> },
    { id: "instagram", label: "Instagram", icon: <Instagram size={20} /> },
    { id: "contact", label: "Contact", icon: <Mail size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const contentMap = {
    home: <CarouselManagement />,
    team: <Team />,
    event: <div className="p-6 text-gray-200">Messages Content</div>,
    contact: <Table />,
    instagram: <InstagramManagement />,
    settings: <div className="p-6 text-gray-200">Settings Content</div>,
  };

  const handleLogout = async () => {
    // Add your logout logic here
    const response = await axios.get("/api/user/logout");
    if (response.data.success) {
      toast.success("Logout successful", {
        duration: 3000,
        icon: <CheckCircle size={20} />,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      router.push("/admin/login");
    }
  };

  return (
    <div className="flex h-screen bg-neutral-600">
      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-neutral-900 p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-white">
              {menuItems.find((item) => item.id === activeTab)?.label}
            </h1>
          </div>
        </header>

        {/* Content Area */}
        <div className="container mx-auto px-4 py-6">
          <div className="p-6">
            {contentMap[activeTab as keyof typeof contentMap]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
