import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

export function LeadProfilePanel({ open, onClose }: LeadProfilePanelProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "w-1/2 h-full bg-card border-l border-border shadow-xl flex flex-col",
        )}
      >
        <header className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Lead profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto" />
      </aside>
    </div>
  );
}