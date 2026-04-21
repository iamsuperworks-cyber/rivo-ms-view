import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { NURTURE_REASONS } from "@/types/leads";

interface NurtureFlowProps {
  onBack: () => void;
  onConfirm: () => void;
}

export function NurtureFlow({ onBack, onConfirm }: NurtureFlowProps) {
  const [reason, setReason] = useState("");
  const [reEngagementDate, setReEngagementDate] = useState("");
  const [preferredContact, setPreferredContact] = useState("WhatsApp");
  const [notes, setNotes] = useState("");

  const isValid = reason && reEngagementDate;

  const contactOptions = ["WhatsApp", "Phone", "Email"];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <button onClick={onBack} className="p-1 rounded hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-foreground">Move to Nurture</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Reason */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Reason *</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select reason...</option>
            {NURTURE_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Re-Engagement Date *</label>
          <input
            type="date"
            value={reEngagementDate}
            onChange={(e) => setReEngagementDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Contact preference */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Preferred Contact</label>
          <div className="flex gap-2">
            {contactOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setPreferredContact(opt)}
                className={`flex-1 py-2 text-xs font-medium rounded-md border transition-colors ${
                  preferredContact === opt
                    ? "border-rivo-info bg-rivo-info-bg text-rivo-info"
                    : "border-input text-muted-foreground hover:bg-muted"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Additional notes..."
            className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onConfirm}
          disabled={!isValid}
          className="w-full py-2.5 text-sm font-medium rounded-md bg-rivo-info text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Move to Nurture
        </button>
      </div>
    </div>
  );
}
