import { useState } from "react";
import type { Lead } from "@/types/leads";
import { cn } from "@/lib/utils";

interface DetailsTabProps {
  lead: Lead;
}

export function DetailsTab({ lead }: DetailsTabProps) {
  const [loanPurpose, setLoanPurpose] = useState<"Purchase" | "Refinance">("Purchase");
  const [propertyIdentified, setPropertyIdentified] = useState<string>("Still searching");

  return (
    <div className="p-4 space-y-4">
      <FieldDisplay label="Name" value={lead.name} />
      <FieldDisplay label="Phone" value={lead.phone} />
      <FieldDisplay label="Email" value={lead.email} />

      {/* Loan Purpose */}
      <div>
        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
          Loan Purpose <span className="text-destructive">*</span>
        </label>
        <SegmentedToggle
          options={["Purchase", "Refinance"]}
          value={loanPurpose}
          onChange={(v) => setLoanPurpose(v as "Purchase" | "Refinance")}
        />
      </div>

      {/* Property Identified — only when Purchase */}
      {loanPurpose === "Purchase" && (
        <div>
          <label className="block text-[11px] font-medium text-muted-foreground mb-1">
            Property Identified? <span className="text-destructive">*</span>
          </label>
          <SegmentedToggle
            options={["Yes, I have a property", "Still searching"]}
            value={propertyIdentified}
            onChange={setPropertyIdentified}
          />
        </div>
      )}

      {/* Monthly Income */}
      <div>
        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
          Monthly Income (AED) <span className="text-destructive">*</span>
        </label>
        <div className="flex rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring">
          <span className="inline-flex items-center px-3 text-xs font-medium text-muted-foreground bg-muted border-r border-input">
            AED
          </span>
          <input
            type="number"
            placeholder="e.g. 25000"
            className="flex-1 px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Expected Loan Amount */}
      <div>
        <label className="block text-[11px] font-medium text-muted-foreground mb-1">
          Expected Loan Amount (AED) <span className="text-destructive">*</span>
        </label>
        <div className="flex rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring">
          <span className="inline-flex items-center px-3 text-xs font-medium text-muted-foreground bg-muted border-r border-input">
            AED
          </span>
          <input
            type="number"
            placeholder="e.g. 1500000"
            className="flex-1 px-3 py-2 text-sm bg-card text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Source: {lead.source}</p>
    </div>
  );
}

/* ── Reusable sub-components ── */

function FieldDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-muted-foreground mb-1">{label}</label>
      <input
        type="text"
        defaultValue={value}
        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function SegmentedToggle({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex rounded-md border border-input overflow-hidden">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "flex-1 px-3 py-2 text-xs font-medium transition-colors",
            value === opt
              ? "bg-foreground text-card"
              : "bg-card text-muted-foreground hover:bg-muted"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
