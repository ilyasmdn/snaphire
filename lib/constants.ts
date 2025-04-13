import {
  BarChart,
  Book,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Settings,
} from "lucide-react";

export const sidebarLinks = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Plus,
    label: "New Interview",
    href: "/generate-interview",
  },
  {
    icon: MessageSquare,
    label: "My Interviews",
    href: "/interviews",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/analytics",
  },
  {
    icon: Book,
    label: "Resources",
    href: "/resources",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/settings",
  },
] as const;
