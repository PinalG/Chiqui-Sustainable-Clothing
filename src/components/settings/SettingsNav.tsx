
import React from "react";
import { NavLink } from "react-router-dom";
import { UserRound, Bell, Shield, Eye, FileText } from "lucide-react";

const SettingsNav = () => {
  const navItems = [
    {
      title: "Account",
      icon: <UserRound className="mr-2 h-4 w-4" />,
      href: "/settings"
    },
    {
      title: "Privacy",
      icon: <Eye className="mr-2 h-4 w-4" />,
      href: "/settings/privacy"
    },
    {
      title: "Security",
      icon: <Shield className="mr-2 h-4 w-4" />,
      href: "/settings/security"
    },
    {
      title: "Notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
      href: "/settings/notifications"
    },
    {
      title: "Terms & Policies",
      icon: <FileText className="mr-2 h-4 w-4" />,
      href: "/settings/terms"
    }
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md ${
              isActive
                ? "bg-soft-pink text-white font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          {item.icon}
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
};

export default SettingsNav;
