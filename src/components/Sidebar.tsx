import React from "react";
import {
  Home,
  FolderOpen,
  Briefcase,
  Users,
  LogOut,
  Receipt,
  UserCheck,
  Building,
  FileText,
  Monitor,
  Server,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // current user role

  // Define which roles can see which items
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, roles: ["admin"] },
    { id: "Clients", label: "Clients", icon: Briefcase, roles: ["admin"] },
    {
      id: "projects",
      label: "Projects",
      icon: FolderOpen,
      roles: ["admin", "project_lead"],
    },
    {
      id: "projectLead",
      label: "Project Lead",
      icon: UserCheck,
      roles: ["project lead"],
    },
    {
      id: "working",
      label: "Working",
      icon: Building,
      roles: ["designer"],
    },
    {
      id: "figmaRepository",
      label: "Figma Repository",
      icon: FileText,
      roles: ["designer"],
    },
    {
      id: "frontend",
      label: "Frontend",
      icon: Monitor,
      roles: ["frontend"],
    },
    {
      id: "backend",
      label: "Backend",
      icon: Server,
      roles: ["backend"],
    },
    { id: "staff", label: "Staff", icon: Users, roles: ["admin"] },
    {
      id: "accounts",
      label: "Accounts",
      icon: Receipt,
      roles: ["accounts"],
    },
  ];

  // Filter items based on the logged-in role
  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(role || "")
  );

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login", { replace: true });
      window.location.reload();
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          P5
        </h1>
        <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          DIGITAL SOLUTIONS
        </h2>
        <p className="text-sm text-blue-600 mt-1">We Deliver Your Dreams</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === `/${item.id}`;
            return (
              <li key={item.id}>
                <Link
                  to={`/${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-left text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
