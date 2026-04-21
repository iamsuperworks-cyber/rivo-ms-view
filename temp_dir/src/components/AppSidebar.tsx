import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  PenLine,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/contexts/UploadContext";
import { useWelcomeState } from "@/contexts/WelcomeStateContext";

interface NavItem {
  label: string;
  icon: React.ElementType;
  paths: string[];
  route: string;
  dotKey?: "documents" | "sign";
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, paths: ["/"], route: "/" },
  { label: "Documents", icon: FileText, paths: ["/upload"], route: "/upload", dotKey: "documents" },
  
  { label: "Sign", icon: PenLine, paths: ["/sign"], route: "/sign", dotKey: "sign" },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasUploaded } = useUpload();
  const { showDocsDot, showSignDot } = useWelcomeState();

  const isActive = (paths: string[]) => paths.some((p) => location.pathname === p);

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col bg-card z-40"
      style={{ width: 220, borderRight: "0.5px solid hsl(var(--border))" }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <span className="font-heading text-lg font-bold tracking-tight text-foreground">
          Rivo{" "}
          <span className="text-primary">Portal</span>
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active = isActive(item.paths);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className={cn(
                "relative flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-body transition-colors text-left",
                active
                  ? "bg-primary/8 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/60"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
              )}
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
              {item.dotKey === "documents" && hasUploaded && showDocsDot && (
                <span className="ml-auto h-2 w-2 rounded-full bg-amber-500" />
              )}
              {item.dotKey === "sign" && hasUploaded && showSignDot && (
                <span className="ml-auto h-2 w-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AppSidebar;
