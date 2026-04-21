import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApplicantData } from "@/types/applicants";

interface ApplicantDetailsTabProps {
  data: ApplicantData;
  onChange: (data: ApplicantData) => void;
}

// --- Reusable field components ---

function SectionHeading({ label, subtitle, tag }: { label: string; subtitle?: string; tag?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</h3>
        {tag && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-rivo-purple-light text-rivo-purple">
            {tag}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] text-muted-foreground italic">{subtitle}</p>}
      <div className="border-b border-border mt-2" />
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, required, disabled, type = "text", locked, helperText }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  required?: boolean; disabled?: boolean; type?: string; locked?: boolean; helperText?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
        {label}{required && " *"}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || locked}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
            (disabled || locked) && "opacity-60 cursor-not-allowed bg-muted"
          )}
        />
        {locked && <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />}
      </div>
      {helperText && <p className="text-[10px] text-muted-foreground mt-1">{helperText}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, required, disabled, placeholder = "Select..." }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
  required?: boolean; disabled?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
        {label}{required && " *"}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SegmentedToggle({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
        {label}{required && " *"}
      </label>
      <div className="flex rounded-md border border-input overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt}
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
    </div>
  );
}

// --- Credit Issues multi-select ---
function CreditIssuesField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const options = ["No issues", "Late payments", "Defaults", "Bounced cheques", "Prefer not to say"];

  const toggle = (opt: string) => {
    if (opt === "No issues") {
      onChange(["No issues"]);
    } else {
      const without = value.filter((v) => v !== "No issues");
      if (without.includes(opt)) {
        onChange(without.filter((v) => v !== opt));
      } else {
        onChange([...without, opt]);
      }
    }
  };

  return (
    <div className="col-span-2">
      <label className="block text-[11px] font-medium text-muted-foreground mb-1">Any Credit Issues?</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
              value.includes(opt)
                ? "border-rivo-purple bg-rivo-purple-light text-rivo-purple"
                : "border-input text-muted-foreground hover:bg-muted"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Eligibility Section ---
function EligibilitySection({ data }: { data: ApplicantData }) {
  const salary = parseFloat(data.monthlyIncome) || 0;
  const additional = parseFloat(data.additionalIncome) || 0;
  const totalIncome = salary + additional;

  const totalLiabilities =
    (parseFloat(data.existingHomeLoanEMI) || 0) +
    (parseFloat(data.carLoanEMI) || 0) +
    (parseFloat(data.personalLoanEMI) || 0) +
    (parseFloat(data.creditCardObligations) || 0) +
    (parseFloat(data.otherLiabilities) || 0);

  const loanAmount = parseFloat(data.loanAmount) || 0;
  const propertyValue = parseFloat(data.propertyValue) || parseFloat(data.estimatedValue) || 0;

  const tenureMonths = ((parseInt(data.tenureYears) || 0) * 12) + (parseInt(data.tenureMonths) || 0);
  const estimatedEMI = tenureMonths > 0 ? (loanAmount * 0.045 / 12 * Math.pow(1 + 0.045 / 12, tenureMonths)) / (Math.pow(1 + 0.045 / 12, tenureMonths) - 1) : 0;
  const dbr = totalIncome > 0 ? ((totalLiabilities + estimatedEMI) / totalIncome) * 100 : 0;
  const maxLoan = totalIncome > 0 ? (totalIncome * 0.5 - totalLiabilities) * tenureMonths / (1 + 0.045 / 12 * tenureMonths) : 0;
  const ltv = propertyValue > 0 ? (loanAmount / propertyValue) * 100 : 0;

  const dbrOk = dbr <= 50;
  const ltvOk = ltv <= 80;

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard label="DBR (50% MAX)" value={`${dbr.toFixed(1)}%`} ok={dbrOk} />
      <MetricCard label="MAX LOAN" value={`AED ${maxLoan > 0 ? Math.round(maxLoan).toLocaleString() : "0"}`} ok={true} />
      <MetricCard label="LTV (80% MAX)" value={`${ltv.toFixed(2)}%`} ok={ltvOk} />
    </div>
  );
}

function MetricCard({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className={cn(
      "rounded-md border p-4 text-center",
      ok ? "border-rivo-success bg-rivo-success-bg" : "border-rivo-danger bg-rivo-danger-bg"
    )}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-lg font-bold", ok ? "text-rivo-success" : "text-rivo-danger")}>{value}</p>
    </div>
  );
}

// --- Main Component ---
export function ApplicantDetailsTab({ data, onChange }: ApplicantDetailsTabProps) {
  const update = <K extends keyof ApplicantData>(field: K, value: ApplicantData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const nationalities = ["UAE National", "GCC National", "Indian", "Pakistani", "Filipino", "British", "American", "Canadian", "Australian", "Other"];

  return (
    <div className="p-4 space-y-6">
      {/* Section 1 — Borrower Profile */}
      <section>
        <SectionHeading label="Borrower Profile" />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="First Name" value={data.firstName} onChange={(v) => update("firstName", v)} required />
          <TextField label="Last Name" value={data.lastName} onChange={(v) => update("lastName", v)} required />
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Phone *</label>
            <div className="flex gap-2">
              <select
                value={data.phoneCountryCode}
                onChange={(e) => update("phoneCountryCode", e.target.value)}
                className="w-24 px-2 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="+971">+971</option>
                <option value="+966">+966</option>
                <option value="+44">+44</option>
                <option value="+1">+1</option>
                <option value="+91">+91</option>
              </select>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <TextField label="Email" value={data.email} onChange={(v) => update("email", v)} required />
          <TextField label="Date of Birth" value={data.dateOfBirth} onChange={(v) => update("dateOfBirth", v)} placeholder="DD/MM/YYYY" required />
          <SelectField label="Nationality" value={data.nationality} onChange={(v) => update("nationality", v)} options={nationalities} required />
          <SegmentedToggle label="Residency Status" value={data.borrowerResidencyStatus || data.residency} onChange={(v) => { update("borrowerResidencyStatus", v); update("residency", v); }} options={["UAE Resident", "Non-Resident"]} required />
          <SelectField label="Employment Type" value={data.borrowerEmploymentType || data.employment} onChange={(v) => { update("borrowerEmploymentType", v); update("employment", v); }} options={["Salaried — Private", "Salaried — Government", "Self-Employed", "Business Owner", "Freelancer", "Retired"]} required />
          <TextField label="Current Employer" value={data.borrowerCurrentEmployer} onChange={(v) => update("borrowerCurrentEmployer", v)} />
          <TextField label="Job Title" value={data.borrowerJobTitle} onChange={(v) => update("borrowerJobTitle", v)} />
          <TextField label="Years in Current Role" value={data.borrowerYearsInRole} onChange={(v) => update("borrowerYearsInRole", v)} type="number" required />
          <TextField label="Total Years in UAE" value={data.borrowerTotalYearsUAE} onChange={(v) => update("borrowerTotalYearsUAE", v)} type="number" />
          <SegmentedToggle label="Marital Status" value={data.borrowerMaritalStatus} onChange={(v) => update("borrowerMaritalStatus", v)} options={["Single", "Married", "Divorced", "Widowed"]} />
          <SegmentedToggle label="Application Type" value={data.applicationType} onChange={(v) => update("applicationType", v as "Individual" | "Joint")} options={["Individual", "Joint"]} required />
          <div>
            <TextField label="Source" value={data.source} onChange={() => {}} locked helperText="Source is locked after conversion." />
          </div>
        </div>
      </section>

      {/* Section 2 — Property Intent */}
      <section>
        <SectionHeading label="Property Intent" tag="Key Section" />
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Mortgage Purpose" value={data.mortgagePurpose} onChange={(v) => update("mortgagePurpose", v)} options={["Purchase", "Refinance", "Equity Release", "Buy-to-Let"]} required />
          <SelectField label="Property Category" value={data.propertyCategory} onChange={(v) => update("propertyCategory", v)} options={["Residential", "Commercial"]} />
          <SelectField label="Property Type" value={data.propertyType} onChange={(v) => update("propertyType", v)} options={["Apartment", "Villa", "Townhouse", "Penthouse", "Land"]} required />
          <SelectField label="Property Status" value={data.propertyStatus} onChange={(v) => update("propertyStatus", v)} options={["Ready", "Off-Plan"]} required />
          <SelectField label="Property Readiness" value={data.propertyReadiness} onChange={(v) => update("propertyReadiness", v)} options={["Immediate", "Within 6 months", "6-12 months", "12+ months"]} />
          <SelectField label="Emirate" value={data.emirate} onChange={(v) => update("emirate", v)} options={["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"]} required />
          <TextField label="Property Location" value={data.propertyLocation} onChange={(v) => update("propertyLocation", v)} />
          <TextField label="Developer / Project" value={data.developerProject} onChange={(v) => update("developerProject", v)} />
          <TextField label="Specific Project" value={data.specificProject} onChange={(v) => update("specificProject", v)} />
          <TextField label="Property Value (AED)" value={data.propertyValue || data.estimatedValue} onChange={(v) => { update("propertyValue", v); update("estimatedValue", v); }} type="number" required />
          <SelectField label="Transaction Type" value={data.propertyTransaction} onChange={(v) => update("propertyTransaction", v)} options={["Primary Purchase", "Secondary Purchase", "Refinance", "Equity Release"]} />
          <SegmentedToggle label="First Property?" value={data.firstProperty} onChange={(v) => { update("firstProperty", v); update("propertyFirstProperty", v); }} options={["Yes", "No"]} required />
          <SelectField label="Timeline" value={data.timeline} onChange={(v) => update("timeline", v)} options={["Immediate", "1-3 months", "3-6 months", "6+ months"]} required />
          <SelectField label="Financing Preference" value={data.financingPreference} onChange={(v) => update("financingPreference", v)} options={["Conventional", "Islamic", "No Preference"]} />
          <SegmentedToggle label="Down Payment Ready?" value={data.downPaymentReady} onChange={(v) => update("downPaymentReady", v)} options={["Yes", "Partially", "No"]} required />
        </div>
      </section>

      {/* Section 3 — Financial Snapshot */}
      <section>
        <SectionHeading label="Financial Snapshot" subtitle="Self-reported at qualification — verify against documents before submitting to bank." />

        {/* Income */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <TextField label="Monthly Salary (AED)" value={data.monthlyIncome} onChange={(v) => update("monthlyIncome", v)} type="number" required />
          <TextField label="Additional Income (AED)" value={data.additionalIncome} onChange={(v) => update("additionalIncome", v)} type="number" placeholder="Rental income, bonuses, etc." />
        </div>

        {/* Liabilities */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <TextField label="Home Loan EMI (AED)" value={data.existingHomeLoanEMI} onChange={(v) => update("existingHomeLoanEMI", v)} type="number" />
          <TextField label="Car Loan EMI (AED)" value={data.carLoanEMI} onChange={(v) => update("carLoanEMI", v)} type="number" />
          <TextField label="Personal Loan EMI (AED)" value={data.personalLoanEMI} onChange={(v) => update("personalLoanEMI", v)} type="number" />
          <TextField label="Credit Card Obligations (AED)" value={data.creditCardObligations} onChange={(v) => update("creditCardObligations", v)} type="number" />
          <TextField label="Other Liabilities (AED)" value={data.otherLiabilities} onChange={(v) => update("otherLiabilities", v)} type="number" />
        </div>

        {/* Credit */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <SelectField label="AECB Credit Score (if known)" value={data.aecbCreditScore} onChange={(v) => update("aecbCreditScore", v)} options={["Don't know", "Below 600", "600–650", "650–700", "700–750", "750+"]} />
          <SelectField label="Source of Down Payment" value={data.sourceOfDownPayment} onChange={(v) => update("sourceOfDownPayment", v)} options={["Personal savings", "Family assistance", "Property sale proceeds", "End-of-service gratuity", "Other"]} />
        </div>

        {/* Credit Issues */}
        <div className="grid grid-cols-2 gap-3">
          <CreditIssuesField value={data.creditIssues} onChange={(v) => update("creditIssues", v)} />
        </div>
      </section>

      {/* Section 4 — Loan Details */}
      <section>
        <SectionHeading label="Loan Details" />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Loan Amount (AED)" value={data.loanAmount} onChange={(v) => update("loanAmount", v)} type="number" required />
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Tenure</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <select
                  value={data.tenureYears}
                  onChange={(e) => update("tenureYears", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">yrs</option>
                  {Array.from({ length: 26 }, (_, i) => (
                    <option key={i} value={String(i)}>{i} yrs</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  value={data.tenureMonths}
                  onChange={(e) => update("tenureMonths", e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">mo</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={String(i)}>{i} mo</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Eligibility */}
      <section>
        <SectionHeading label="Eligibility" />
        <EligibilitySection data={data} />
      </section>
    </div>
  );
}
