import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockNotifications = [
  {
    id: 1,
    icon: CheckCircle2,
    iconColor: "text-emerald-600 bg-emerald-50",
    title: "Application Pre-approved",
    description: "Ajman Bank has pre-approved your mortgage application.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    icon: AlertTriangle,
    iconColor: "text-amber-600 bg-amber-50",
    title: "Document Expiring Soon",
    description: "Your salary certificate will expire in 15 days.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    icon: MessageSquare,
    iconColor: "text-blue-600 bg-blue-50",
    title: "New Message from Advisor",
    description: "Your mortgage advisor has sent you a message.",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    icon: Info,
    iconColor: "text-primary bg-primary/10",
    title: "Rate Update",
    description: "Interest rates have been updated for Emirates Investment Bank.",
    time: "2 days ago",
    read: true,
  },
];

const TopBar = () => {
  const navigate = useNavigate();
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [unreadCount] = useState(
    mockNotifications.filter((n) => !n.read).length
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAccount = () => {
    setAccountOpen((v) => !v);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen((v) => !v);
    setAccountOpen(false);
  };

  return (
    <div className="sticky top-0 right-0 z-40 flex items-center justify-end gap-1 px-6 py-4">
      {/* Notifications */}
      <div ref={notificationsRef} className="relative">
        <button
          onClick={toggleNotifications}
          className={cn(
            "relative flex items-center justify-center h-9 w-9 rounded-md transition-colors",
            notificationsOpen
              ? "bg-muted/60 text-foreground"
              : "text-muted-foreground hover:bg-muted/60"
          )}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500" />
          )}
        </button>
        {notificationsOpen && (
          <div className="absolute top-full right-0 mt-1 w-72 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="font-heading text-sm font-semibold text-foreground">Notifications</span>
              <button className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {mockNotifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-b-0 transition-colors",
                    !n.read && "bg-primary/[0.03]"
                  )}
                >
                  <div className={cn("p-1.5 rounded-full shrink-0 mt-0.5", n.iconColor)}>
                    <n.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.description}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1">{n.time}</p>
                  </div>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />}
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-border text-center">
              <button className="text-xs text-primary font-medium hover:underline">View all notifications</button>
            </div>
          </div>
        )}
      </div>

      {/* Account */}
      <div ref={accountRef} className="relative">
        <button
          onClick={toggleAccount}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors",
            accountOpen
              ? "bg-muted/60 text-foreground"
              : "text-muted-foreground hover:bg-muted/60"
          )}
        >
          <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold shrink-0">
            AB
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        {accountOpen && (
          <div className="absolute top-full right-0 mt-1 w-56 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Abhishek Singh</p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">abhisheksinghpro007@gmail.com</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => {
                  setAccountOpen(false);
                  navigate("/account");
                }}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                My Profile
              </button>
              <button
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-destructive hover:bg-muted/60 transition-colors"
                onClick={() => {
                  sessionStorage.removeItem("authenticated");
                  navigate("/login");
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
