"use client";
import React from "react";
import {
  Home,
  Settings,
  Users,
  Bell,
  Menu,
  X,
  LogOut,
  CheckCircle,
  ReceiptText,
  Mail,
  Instagram,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab }: any) => {
  const router = useRouter();

  const menuItems = [
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "team", label: "Team", icon: <Users size={20} /> },
    { id: "event", label: "Events", icon: <Bell size={20} /> },
    { id: "instagram", label: "Instagram", icon: <Instagram size={20} /> },
    { id: "contact", label: "Contact", icon: <Mail size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
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
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-neutral-900 transition-all duration-300 relative flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-center text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Items */}
      <nav className="mt-4 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full p-4 flex items-center gap-4 transition-colors ${
              activeTab === item.id
                ? "bg-neutral-800 text-white"
                : "text-gray-400 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            {item.icon}
            {isOpen && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full p-4 flex items-center gap-4 text-gray-400 hover:bg-neutral-800 hover:text-white transition-colors border-t border-neutral-800"
      >
        <LogOut size={20} />
        {isOpen && <span className="text-sm font-medium">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
