import { LayoutDashboard, Users, UserCheck, Briefcase, MessageCircle, Building2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebarState } from "./RivoLayout";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path?: string;
}

const workspaceItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Leads", icon: Users, path: "/" },
  { label: "Applicants", icon: UserCheck, path: "/applicants" },
];

const toolboxItems: NavItem[] = [
  { label: "WhatsApp", icon: MessageCircle },
  { label: "Bank Products", icon: Building2 },
  { label: "Templates", icon: FileText },
];

export function RivoSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed } = useSidebarState();

  const renderItem = (item: NavItem, isActive: boolean) => (
    <button
      key={item.label}
      onClick={() => item.path && navigate(item.path)}
      title={collapsed ? item.label : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        collapsed && "justify-center px-0",
        isActive
          ? "bg-rivo-purple-light text-rivo-purple font-medium"
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      <item.icon className="w-[18px] h-[18px] shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </button>
  );

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0 z-30 transition-[width] duration-200",
        collapsed ? "w-[64px] min-w-[64px]" : "w-[220px] min-w-[220px]"
      )}
    >
      {/* Logo */}
      <div className={cn("h-14 flex items-center gap-2", collapsed ? "justify-center px-0" : "px-5")}>
        <div className="w-7 h-7 rounded bg-rivo-purple flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" />
          </svg>
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-foreground tracking-tight">
            Rivo<sup className="text-[8px] ml-0.5">™</sup>
          </span>
        )}
      </div>

      {/* Workspace */}
      <div className="mt-4 px-3">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
            Workspace
          </p>
        )}
        <nav className="space-y-0.5">
          {workspaceItems.map((item) =>
            renderItem(item, item.path ? location.pathname === item.path : false)
          )}
        </nav>
      </div>

      {/* Toolbox */}
      <div className="mt-6 px-3">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-2">
            Toolbox
          </p>
        )}
        <nav className="space-y-0.5">{toolboxItems.map((item) => renderItem(item, false))}</nav>
      </div>
    </aside>
  );
}
