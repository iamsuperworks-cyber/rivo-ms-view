import { useState } from "react";
import { X, ExternalLink, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplicantData } from "@/types/applicants";
import { ApplicantDetailsTab } from "./ApplicantDetailsTab";
import { WhatsAppTab } from "@/components/drawer/WhatsAppTab";

type DrawerTab = "Details" | "Documents" | "WhatsApp" | "Activity";

interface ApplicantDrawerProps {
  applicant: ApplicantData;
  onClose: () => void;
  onSave: (data: ApplicantData) => void;
}

export function ApplicantDrawer({ applicant, onClose, onSave }: ApplicantDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("Details");
  const [data, setData] = useState<ApplicantData>(applicant);

  const tabs: DrawerTab[] = ["Details", "Documents", "WhatsApp", "Activity"];

  const statusBadge: Record<string, { bg: string; text: string }> = {
    "In Process": { bg: "bg-rivo-success-bg", text: "text-rivo-success" },
    Declined: { bg: "bg-rivo-danger-bg", text: "text-rivo-danger" },
    "Not Proceeding": { bg: "bg-muted", text: "text-muted-foreground" },
  };
  const badge = statusBadge[data.status] ?? statusBadge["In Process"];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-[40%] bg-card border-l border-border z-50 flex flex-col animate-slide-in-right shadow-lg">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {data.firstName} {data.lastName}
              </h2>
              <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", badge.bg, badge.text)}>
                {data.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-rivo-purple text-rivo-purple hover:bg-rivo-purple-light transition-colors">
                <ExternalLink className="w-3 h-3" />
                Send Portal Link
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {data.phoneCountryCode} {data.phone}
            <span className="mx-1">|</span>
            {data.source}{data.campaign ? ` — ${data.campaign}` : ""}
            <span className="mx-1">|</span>
            {data.assignedMS}
          </p>

          {/* SLA */}
          <div className="mt-1.5 text-xs">
            <span className="text-muted-foreground">First Contact SLA: </span>
            {data.slaStatus === "completed" && (
              <span className="text-rivo-success font-medium inline-flex items-center gap-1">
                <Check className="w-3 h-3" /> Completed
              </span>
            )}
            {data.slaStatus === "remaining" && (
              <span className="text-rivo-warning font-medium inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {data.slaRemainingDays}d {data.slaRemainingHours}h remaining
              </span>
            )}
            {data.slaStatus === "none" && (
              <span className="text-muted-foreground italic">No SLA configured</span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex mt-4 rounded-md border border-input overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 px-3 py-2 text-xs font-medium transition-colors",
                  activeTab === tab
                    ? "bg-foreground text-card"
                    : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "Details" && (
            <ApplicantDetailsTab data={data} onChange={setData} />
          )}
          {activeTab === "Documents" && (
            <div className="p-4 text-sm text-muted-foreground">Documents tab — no changes.</div>
          )}
          {activeTab === "WhatsApp" && <WhatsAppTab />}
          {activeTab === "Activity" && (
            <div className="p-4 text-sm text-muted-foreground">Activity tab — no changes.</div>
          )}
        </div>

        {/* Sticky Footer — only on Details */}
        {activeTab === "Details" && (
          <div className="border-t border-border p-4 bg-card space-y-2">
            <button
              onClick={() => onSave(data)}
              className="w-full py-2.5 text-sm font-medium rounded-md bg-rivo-purple text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
            <button className="w-full py-2.5 text-sm font-medium rounded-md border border-input text-foreground hover:bg-muted transition-colors">
              Create Case
            </button>
          </div>
        )}
      </div>
    </>
  );
}
