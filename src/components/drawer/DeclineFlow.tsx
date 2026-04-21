import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DECLINE_CATEGORIES, DECLINE_MORE_REASONS, DECLINE_SUB_REASONS } from "@/types/leads";

interface DeclineFlowProps {
  onBack: () => void;
  onConfirm: () => void;
}

export function DeclineFlow({ onBack, onConfirm }: DeclineFlowProps) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [subReason, setSubReason] = useState("");
  const [notes, setNotes] = useState("");
  const [showMore, setShowMore] = useState(false);

  const subReasons = DECLINE_SUB_REASONS[category] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="p-1 rounded hover:bg-muted text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {step === 1 && (
            <button onClick={onBack} className="p-1 rounded hover:bg-muted text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="text-lg font-bold text-foreground">Decline Lead</h2>
        </div>
        <p className="text-xs text-muted-foreground">Step {step} of 3</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 1 && (
          <div className="space-y-2">
            {DECLINE_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setCategory(cat.label); setStep(2); }}
                className="w-full flex items-center justify-between p-3 rounded-md border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}

            <button
              onClick={() => setShowMore(!showMore)}
              className="w-full text-left text-xs text-muted-foreground hover:text-foreground py-2 transition-colors"
            >
              {showMore ? "Hide" : "More reasons"}
            </button>

            {showMore && (
              <div className="space-y-1">
                {DECLINE_MORE_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => { setCategory(reason); setSubReason(reason); setStep(3); }}
                    className="w-full text-left p-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            {subReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => { setSubReason(reason); setStep(3); }}
                className="w-full flex items-center justify-between p-3 rounded-md border border-border text-sm text-foreground hover:bg-muted transition-colors"
              >
                <span>{reason}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="p-3 rounded-md bg-muted">
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium text-foreground">{category}</p>
              {subReason && subReason !== category && (
                <>
                  <p className="text-xs text-muted-foreground mt-2 mb-1">Sub-reason</p>
                  <p className="text-sm font-medium text-foreground">{subReason}</p>
                </>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">Notes (min. 50 characters)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Explain the decline reason..."
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className={cn("text-[10px] mt-1", notes.length < 50 ? "text-rivo-danger" : "text-muted-foreground")}>
                {notes.length}/50 characters minimum
              </p>
            </div>

            <button
              onClick={onConfirm}
              disabled={notes.length < 50}
              className="w-full py-2.5 text-sm font-medium rounded-md bg-rivo-danger text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              Confirm Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
