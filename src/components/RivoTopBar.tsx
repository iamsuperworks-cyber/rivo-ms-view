import { Menu, Bell } from "lucide-react";
import { useSidebarState } from "./RivoLayout";

export function RivoTopBar() {
  const { toggle } = useSidebarState();
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-20">
      <button
        onClick={toggle}
        className="p-2 rounded-md hover:bg-muted text-muted-foreground"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3">
        {/* Bell */}
        <button className="relative p-2 rounded-md hover:bg-muted text-muted-foreground">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-rivo-danger text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
            29
          </span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-rivo-purple text-primary-foreground text-xs font-semibold flex items-center justify-center">
            AN
          </div>
          <span className="text-sm font-medium text-foreground">Anam Riaz</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
            <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </header>
  );
}
