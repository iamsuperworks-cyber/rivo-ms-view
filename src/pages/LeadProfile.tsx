import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RivoLayout } from "@/components/RivoLayout";
import { ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────
interface LeadFields {
  // Personal
  fullName: string;
  nationality: string;
  phone: string;
  // Employment
  employer: string;
  monthlySalary: string;
  employmentType: string;
  // Property intent
  propertyType: string;
  emirate: string;
  budget: string;
  // Financials
  dbr: string;
  ltv: string;
  existingLoans: string;
}

interface LeadMeta {
  source: string;
  sourceCls: string;
  status: string;
  statusCls: string;
  fields: LeadFields;
}

// ── Empty template ─────────────────────────────────────────────────────────────
const EMPTY_FIELDS: LeadFields = {
  fullName: "",
  nationality: "",
  phone: "",
  employer: "",
  monthlySalary: "",
  employmentType: "",
  propertyType: "",
  emirate: "",
  budget: "",
  dbr: "",
  ltv: "",
  existingLoans: "",
};

// ── Sample data per lead ───────────────────────────────────────────────────────
const LEAD_DATA: Record<string, LeadMeta> = {
  "Maria Lopez": {
    source: "Al Futtaim",
    sourceCls: "bg-[#E1F5EE] text-[#085041]",
    status: "Qualified",
    statusCls: "bg-[#EAF3DE] text-[#27500A]",
    fields: {
      fullName: "Maria Lopez",
      nationality: "Spanish",
      phone: "+971 56 937 0011",
      employer: "Emaar Properties",
      monthlySalary: "45000",
      employmentType: "Full-time",
      propertyType: "Villa",
      emirate: "Dubai",
      budget: "3200000",
      dbr: "38",
      ltv: "75",
      existingLoans: "None",
    },
  },
  "Deepa Menon": {
    source: "Google Ads",
    sourceCls: "bg-[#E8F0FE] text-[#1A56DB]",
    status: "In progress",
    statusCls: "bg-[#EEEDFE] text-[#3C3489]",
    fields: {
      fullName: "Deepa Menon",
      nationality: "Indian",
      phone: "+971 52 441 6677",
      employer: "",
      monthlySalary: "",
      employmentType: "",
      propertyType: "Apartment",
      emirate: "Abu Dhabi",
      budget: "2000000",
      dbr: "",
      ltv: "",
      existingLoans: "",
    },
  },
  "Tony Liu": {
    source: "Meta Ads",
    sourceCls: "bg-[#EDE9FB] text-[#5B21B6]",
    status: "Presented",
    statusCls: "bg-[#E1F5EE] text-[#085041]",
    fields: {
      fullName: "Tony Liu",
      nationality: "Chinese",
      phone: "+971 50 246 2244",
      employer: "DIFC Financial",
      monthlySalary: "38000",
      employmentType: "Full-time",
      propertyType: "Apartment",
      emirate: "Dubai",
      budget: "1900000",
      dbr: "42",
      ltv: "80",
      existingLoans: "Car loan",
    },
  },
  "Hassan Ali": {
    source: "Direct",
    sourceCls: "bg-[#F1EFE8] text-[#444441]",
    status: "In progress",
    statusCls: "bg-[#EEEDFE] text-[#3C3489]",
    fields: {
      fullName: "Hassan Ali",
      nationality: "Emirati",
      phone: "+971 50 113 8899",
      employer: "ADNOC",
      monthlySalary: "62000",
      employmentType: "Full-time",
      propertyType: "Villa",
      emirate: "Dubai",
      budget: "4000000",
      dbr: "",
      ltv: "",
      existingLoans: "",
    },
  },
  "Raj Patel": {
    source: "Emaar",
    sourceCls: "bg-[#FEF3E2] text-[#92400E]",
    status: "Not contacted",
    statusCls: "bg-[#FAEEDA] text-[#633806]",
    fields: {
      fullName: "Raj Patel",
      nationality: "Indian",
      phone: "+971 55 222 3344",
      employer: "Tech Mahindra",
      monthlySalary: "28000",
      employmentType: "Full-time",
      propertyType: "Apartment",
      emirate: "Dubai",
      budget: "1500000",
      dbr: "",
      ltv: "",
      existingLoans: "",
    },
  },
  "Aisha Khan": {
    source: "Google Ads",
    sourceCls: "bg-[#E8F0FE] text-[#1A56DB]",
    status: "Not contacted",
    statusCls: "bg-[#FAEEDA] text-[#633806]",
    fields: {
      fullName: "Aisha Khan",
      nationality: "",
      phone: "+971 56 888 1122",
      employer: "",
      monthlySalary: "",
      employmentType: "",
      propertyType: "",
      emirate: "Dubai",
      budget: "3000000",
      dbr: "",
      ltv: "",
      existingLoans: "",
    },
  },
};

// ── Enum options ───────────────────────────────────────────────────────────────
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Self-employed", "Contract", "Business owner"];
const PROPERTY_TYPES = ["Villa", "Apartment", "Townhouse", "Penthouse", "Residential"];
const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Umm Al Quwain", "Fujairah"];

// ── Field component ────────────────────────────────────────────────────────────
const Field = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <div className="relative flex items-center">
      {prefix && <span className="absolute left-3 text-xs text-muted-foreground pointer-events-none">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Not provided"
        className={cn(
          "w-full text-sm border border-border rounded-md bg-card text-foreground py-2 placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-ring transition-shadow",
          prefix ? "pl-11" : "pl-3",
          suffix ? "pr-10" : "pr-3",
        )}
      />
      {suffix && <span className="absolute right-3 text-xs text-muted-foreground pointer-events-none">{suffix}</span>}
    </div>
  </div>
);

// ── Select component ───────────────────────────────────────────────────────────
const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-muted-foreground">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full text-sm border border-border rounded-md bg-card px-3 py-2 focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer transition-shadow",
        value ? "text-foreground" : "text-muted-foreground/40",
      )}
    >
      <option value="">Not provided</option>
      {options.map((o) => (
        <option key={o} value={o} className="text-foreground">
          {o}
        </option>
      ))}
    </select>
  </div>
);

// ── Section wrapper ────────────────────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="px-6 py-5 border-b border-border last:border-0">
    <h2 className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────────
const LeadProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leadName = decodeURIComponent(id || "Unknown");

  const leadMeta = LEAD_DATA[leadName];
  const originalFields = leadMeta?.fields ?? EMPTY_FIELDS;
  const [fields, setFields] = useState<LeadFields>(originalFields);

  const update = (key: keyof LeadFields, value: string) => setFields((prev) => ({ ...prev, [key]: value }));

  // Completeness
  const { pct, label, barColor } = useMemo(() => {
    const values = Object.values(fields);
    const filled = values.filter((v) => v && v.trim() !== "").length;
    const total = values.length;
    const pct = Math.round((filled / total) * 100);
    const label = pct === 100 ? "Complete" : pct >= 50 ? "Partial" : "Minimal";
    const barColor = pct === 100 ? "bg-[#639922]" : pct >= 50 ? "bg-[#888780]" : "bg-[#EF9F27]";
    return { pct, label, barColor };
  }, [fields]);

  // Dirty detection
  const isDirty = useMemo(() => JSON.stringify(fields) !== JSON.stringify(originalFields), [fields, originalFields]);

  const handleSave = () => {
    // TODO: persist to backend
    console.log("Saving profile:", fields);
  };

  const handleCancel = () => setFields(originalFields);

  return (
    <RivoLayout>
      <div className="bg-card rounded-lg border border-border min-h-[calc(100vh-7rem)] flex flex-col">
        {/* Breadcrumb */}
        <div className="px-6 pt-6 flex items-center gap-1.5 text-sm">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Leads
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground font-medium">{leadName}</span>
        </div>

        {/* Header — name + pills + completeness */}
        <div className="px-6 pt-4 pb-5 border-b border-border">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">{leadName}</h1>
            {leadMeta && (
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap",
                    leadMeta.sourceCls,
                  )}
                >
                  {leadMeta.source}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap",
                    leadMeta.statusCls,
                  )}
                >
                  {leadMeta.status}
                </span>
              </div>
            )}
          </div>

          {/* Completeness bar */}
          <div className="flex items-center gap-3 mt-4 max-w-md">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-300", barColor)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs font-medium text-foreground tabular-nums">{pct}%</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </div>
        </div>

        {/* Form sections */}
        <div className="flex-1 overflow-y-auto">
          <Section title="Personal">
            <Field label="Full name" value={fields.fullName} onChange={(v) => update("fullName", v)} />
            <Field label="Nationality" value={fields.nationality} onChange={(v) => update("nationality", v)} />
            <Field label="Phone" value={fields.phone} onChange={(v) => update("phone", v)} type="tel" />
          </Section>

          <Section title="Employment">
            <Field label="Employer" value={fields.employer} onChange={(v) => update("employer", v)} />
            <Field
              label="Monthly salary"
              value={fields.monthlySalary}
              onChange={(v) => update("monthlySalary", v)}
              prefix="AED"
            />
            <SelectField
              label="Employment type"
              value={fields.employmentType}
              onChange={(v) => update("employmentType", v)}
              options={EMPLOYMENT_TYPES}
            />
          </Section>

          <Section title="Property intent">
            <SelectField
              label="Property type"
              value={fields.propertyType}
              onChange={(v) => update("propertyType", v)}
              options={PROPERTY_TYPES}
            />
            <SelectField
              label="Emirate"
              value={fields.emirate}
              onChange={(v) => update("emirate", v)}
              options={EMIRATES}
            />
            <Field label="Budget" value={fields.budget} onChange={(v) => update("budget", v)} prefix="AED" />
          </Section>

          <Section title="Financials">
            <Field label="DBR" value={fields.dbr} onChange={(v) => update("dbr", v)} suffix="%" />
            <Field label="LTV" value={fields.ltv} onChange={(v) => update("ltv", v)} suffix="%" />
            <Field label="Existing loans" value={fields.existingLoans} onChange={(v) => update("existingLoans", v)} />
          </Section>
        </div>

        {/* Sticky footer */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between gap-2 bg-card">
          <div className="text-xs text-muted-foreground">{isDirty ? "Unsaved changes" : "All changes saved"}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={!isDirty}
              className="px-4 py-2 rounded-md border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="px-4 py-2 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </RivoLayout>
  );
};

export default LeadProfile;
