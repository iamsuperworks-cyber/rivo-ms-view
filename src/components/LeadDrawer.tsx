import { useState, useRef } from "react";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/leads";
import { QualificationTab, type QualificationTabRef } from "./drawer/QualificationTab";
import { DetailsTab } from "./drawer/DetailsTab";
import { WhatsAppTab } from "./drawer/WhatsAppTab";
import { DrawerFooter } from "./drawer/DrawerFooter";
import { DeclineFlow } from "./drawer/DeclineFlow";
import { NurtureFlow } from "./drawer/NurtureFlow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DrawerTab = "Details" | "Qualification" | "WhatsApp";
type DrawerView = "main" | "decline" | "nurture";

interface LeadDrawerProps {
  lead: Lead;
  onClose: () => void;
}

const REQUIRED_FIELDS = [
  { key: "mortgagePurpose", label: "Mortgage Purpose" },
  { key: "propertyStatus", label: "Property Status" },
  { key: "timeline", label: "Timeline" },
  { key: "estimatedValue", label: "Est. Property Value" },
  { key: "residencyStatus", label: "Residency Status" },
  { key: "employmentType", label: "Employment Type" },
  { key: "yearsInCurrentRole", label: "Years in Current Role" },
  { key: "monthlyIncome", label: "Monthly Income" },
] as const;

export function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("Details");
  const [view, setView] = useState<DrawerView>("main");
  const [leadStatus, setLeadStatus] = useState<string>(lead.status);
  const [isQualified, setIsQualified] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationBanner, setShowValidationBanner] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const qualificationRef = useRef<QualificationTabRef>(null);

  const tabs: DrawerTab[] = ["Details", "Qualification", "WhatsApp"];

  const handleQualify = () => {
    if (!qualificationRef.current) return;
    const data = qualificationRef.current.getQualificationData();
    const missing = REQUIRED_FIELDS.filter(({ key }) => !data[key]?.trim()).map(({ key }) => key);

    if (missing.length > 0) {
      setValidationErrors(missing);
      setShowValidationBanner(true);
      // Ensure relevant sections are open
      qualificationRef.current.openSectionsForValidation(missing);
      return;
    }

    setValidationErrors([]);
    setShowValidationBanner(false);
    setShowConfirmDialog(true);
  };

  const handleConfirmQualify = () => {
    setLeadStatus("Applicant");
    setIsQualified(true);
    setShowConfirmDialog(false);
    setValidationErrors([]);
    setShowValidationBanner(false);
  };

  if (view === "decline") {
    return (
      <DrawerShell onClose={onClose}>
        <DeclineFlow onBack={() => setView("main")} onConfirm={() => setView("main")} />
      </DrawerShell>
    );
  }

  if (view === "nurture") {
    return (
      <DrawerShell onClose={onClose}>
        <NurtureFlow onBack={() => setView("main")} onConfirm={() => setView("main")} />
      </DrawerShell>
    );
  }

  return (
    <DrawerShell onClose={onClose}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-foreground">{lead.name}</h2>
          <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            isQualified
              ? "bg-rivo-purple-light text-rivo-purple"
              : "bg-rivo-success-bg text-rivo-success"
          )}>
            {isQualified ? "Applicant" : leadStatus}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {lead.phone} <span className="mx-1">|</span> {lead.source} <span className="mx-1">|</span> {lead.agent}
        </p>

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

      {/* Validation Banner */}
      {showValidationBanner && validationErrors.length > 0 && (
        <div className="mx-4 mt-3 p-3 rounded-md bg-rivo-danger-bg text-rivo-danger text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Complete required fields before qualifying</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "Qualification" && (
          <QualificationTab
            ref={qualificationRef}
            lead={lead}
            isReadOnly={isQualified}
            validationErrors={validationErrors}
          />
        )}
        {activeTab === "Details" && <DetailsTab lead={lead} />}
        {activeTab === "WhatsApp" && <WhatsAppTab />}
      </div>

      {/* Footer — only on Qualification and not yet qualified */}
      {activeTab === "Qualification" && !isQualified && (
        <DrawerFooter
          onQualify={handleQualify}
          onDecline={() => setView("decline")}
          onNurture={() => setView("nurture")}
        />
      )}

      {/* Qualified footer */}
      {activeTab === "Qualification" && isQualified && (
        <div className="border-t border-border p-4 bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
            <span className="inline-flex items-center gap-1.5 text-rivo-purple font-medium">
              ✓ Qualified — Applicant created, Atom collection stage begins
            </span>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convert {lead.name} to an Applicant?</DialogTitle>
            <DialogDescription>
              Atom collection will begin. Qualification data will be locked and cannot be edited.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmQualify}
              className="bg-rivo-purple text-primary-foreground hover:opacity-90"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DrawerShell>
  );
}

function DrawerShell({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-screen w-[40%] bg-card border-l border-border z-50 flex flex-col animate-slide-in-right shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-muted text-muted-foreground z-10"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </>
  );
}
