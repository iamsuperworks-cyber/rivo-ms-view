import { useState, forwardRef, useImperativeHandle } from "react";
import { ChevronRight, Lock, AlertTriangle, Phone, Clock, Check, Bell, PhoneCall, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Lead, CallAttempt, QualificationData } from "@/types/leads";

export interface QualificationTabRef {
  getQualificationData: () => QualificationData;
  openSectionsForValidation: (missingFields: string[]) => void;
}

interface QualificationTabProps {
  lead: Lead;
  isReadOnly?: boolean;
  validationErrors?: string[];
}

/** Map lead source to a contact person (e.g. referring agent) */
function getSourceContact(lead: Lead): { name: string; role: string; phone: string } | null {
  if (lead.source.toLowerCase().includes("partner") || lead.source.toLowerCase().includes("agent") || lead.source.toLowerCase().includes("freelance")) {
    return { name: lead.agent, role: "Referring Agent", phone: "+971 50 000 0000" };
  }
  return null;
}

// Fields that belong to each section for auto-opening
const PROPERTY_FIELDS = ["mortgagePurpose", "propertyStatus", "timeline", "estimatedValue"];
const BORROWER_FIELDS = ["residencyStatus", "employmentType", "yearsInCurrentRole"];
const FINANCIAL_FIELDS = ["monthlyIncome"];

export const QualificationTab = forwardRef<QualificationTabRef, QualificationTabProps>(
  function QualificationTab({ lead, isReadOnly = false, validationErrors = [] }, ref) {
  const [callAttempts, setCallAttempts] = useState<CallAttempt[]>([
    { id: "1", timestamp: "06 Apr 2026, 10:30 AM", outcome: "Not Reached", note: "Phone rang, no answer" },
  ]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logOutcome, setLogOutcome] = useState<CallAttempt["outcome"] | "">("");
  const [logNote, setLogNote] = useState("");
  const [logDuration, setLogDuration] = useState("");
  const [logLanguage, setLogLanguage] = useState("");
  const [logReminderDate, setLogReminderDate] = useState<Date | undefined>();
  const [logReminderTime, setLogReminderTime] = useState("09:00");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    calls: true,
    property: true,
    borrower: false,
    financial: false,
    notes: true,
  });
  const [qualification, setQualification] = useState<QualificationData>({
    mortgagePurpose: "", emirate: "", propertyType: "", propertyStatus: "",
    propertyReadiness: "", developerProject: "", specificProject: "", estimatedValue: "",
    propertyLocation: "", firstProperty: "", paymentAssistance: "",
    timeline: "", downPaymentReady: "", financingPreference: "",
    fullName: "", borrowerEmail: "", dateOfBirth: "", nationality: "",
    residencyStatus: "", visaType: "", visaExpiry: "", employmentType: "",
    currentEmployer: "", jobTitle: "", yearsInCurrentRole: "", totalYearsInUAE: "",
    maritalStatus: "", applicationType: "",
    monthlyIncome: "", additionalIncome: "", existingHomeLoanEMI: "",
    carLoanEMI: "", personalLoanEMI: "", creditCardObligations: "",
    otherLiabilities: "", aecbCreditScore: "", creditIssues: "",
    downPaymentSource: "",
    callNotes: "",
  });

  const hasConnectedCall = callAttempts.some((a) => a.outcome === "Connected");
  const failedAttempts = callAttempts.filter((a) => a.outcome !== "Connected").length;

  useImperativeHandle(ref, () => ({
    getQualificationData: () => qualification,
    openSectionsForValidation: (missingFields: string[]) => {
      setOpenSections((prev) => {
        const next = { ...prev };
        if (missingFields.some((f) => PROPERTY_FIELDS.includes(f))) next.property = true;
        if (missingFields.some((f) => BORROWER_FIELDS.includes(f))) next.borrower = true;
        if (missingFields.some((f) => FINANCIAL_FIELDS.includes(f))) next.financial = true;
        return next;
      });
    },
  }));

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogCall = () => {
    if (!logOutcome) return;
    const newAttempt: CallAttempt = {
      id: String(callAttempts.length + 1),
      timestamp: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      outcome: logOutcome,
      note: logNote,
      duration: logOutcome === "Connected" ? logDuration : undefined,
      language: logOutcome === "Connected" ? logLanguage : undefined,
      reminderDate: logOutcome !== "Connected" && logReminderDate
        ? `${format(logReminderDate, "dd MMM yyyy")}, ${logReminderTime}`
        : undefined,
    };
    setCallAttempts([...callAttempts, newAttempt]);
    setShowLogForm(false);
    setLogOutcome("");
    setLogNote("");
    setLogDuration("");
    setLogLanguage("");
    setLogReminderDate(undefined);
    setLogReminderTime("09:00");
  };

  const updateField = (field: keyof QualificationData, value: string) => {
    if (isReadOnly) return;
    setQualification((prev) => ({ ...prev, [field]: value }));
  };

  const hasError = (field: string) => validationErrors.includes(field);

  const outcomes: CallAttempt["outcome"][] = ["Connected", "Not Reached", "No Answer", "Wrong Number"];

  return (
    <div className="p-4 space-y-0">
      {/* Section 1 — Call Attempts */}
      <CollapsibleSection
        label="Call Attempts"
        badge={String(callAttempts.length)}
        open={openSections.calls}
        onToggle={() => toggleSection("calls")}
      >
        <div className="space-y-2 mb-3">
          {callAttempts.map((attempt) => (
            <div key={attempt.id}>
              <div className="p-3 rounded-md border border-border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>{attempt.timestamp}</span>
                    {attempt.outcome === "Connected" && (
                      <>
                        <span>—</span>
                        <span className="text-rivo-success font-medium">Reached & Connected</span>
                        {attempt.duration && <span>({attempt.duration} min)</span>}
                        <Check className="w-3 h-3 text-rivo-success" />
                      </>
                    )}
                  </div>
                  {attempt.outcome !== "Connected" && (
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                      attempt.outcome === "Wrong Number"
                        ? "bg-rivo-danger-bg text-rivo-danger"
                        : "bg-rivo-warning-bg text-rivo-warning"
                    )}>
                      {attempt.outcome}
                    </span>
                  )}
                </div>
                {attempt.language && (
                  <p className="text-[10px] text-muted-foreground mb-1">Language: {attempt.language}</p>
                )}
                {attempt.note && <p className="text-xs text-muted-foreground italic">&ldquo;{attempt.note}&rdquo;</p>}
                {attempt.reminderDate && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-rivo-purple">
                    <Bell className="w-3 h-3" />
                    <span>Retry reminder: {attempt.reminderDate}</span>
                  </div>
                )}
              </div>
              {/* Wrong Number — contact source banner */}
              {attempt.outcome === "Wrong Number" && getSourceContact(lead) && (
                <div className="mt-1.5 p-2.5 rounded-md border border-rivo-warning/30 bg-rivo-warning-bg text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rivo-warning">
                    <PhoneCall className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      Wrong number — contact <strong>{getSourceContact(lead)!.name}</strong> ({getSourceContact(lead)!.role})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/${getSourceContact(lead)!.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${getSourceContact(lead)!.name}, I'm trying to reach a lead (${lead.name}) but the number appears to be wrong. Could you please verify?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-rivo-success/10 text-rivo-success hover:bg-rivo-success/20 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Message
                    </a>
                    <a
                      href={`tel:${getSourceContact(lead)!.phone}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-rivo-warning/10 text-rivo-warning hover:bg-rivo-warning/20 transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      Call
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {failedAttempts >= 5 && !hasConnectedCall && (
          <div className="p-3 rounded-md bg-rivo-warning-bg text-rivo-warning text-xs flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>5+ failed attempts. Consider moving to <strong>Nurture</strong> or <strong>Decline</strong>.</span>
          </div>
        )}

        {!isReadOnly && (
          <>
            {!showLogForm ? (
              <button
                onClick={() => setShowLogForm(true)}
                className="w-full py-2 text-sm font-medium rounded-md border border-rivo-purple text-rivo-purple hover:bg-rivo-purple-light transition-colors"
              >
                Log Call Attempt
              </button>
            ) : (
              <div className="border border-border rounded-md p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {outcomes.map((o) => (
                    <button
                      key={o}
                      onClick={() => setLogOutcome(o)}
                      className={cn(
                        "px-3 py-2 text-xs font-medium rounded-md border transition-colors",
                        logOutcome === o
                          ? "border-rivo-purple bg-rivo-purple-light text-rivo-purple"
                          : "border-input text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                {/* Connected: duration + language */}
                {logOutcome === "Connected" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">Duration (min)</label>
                      <input
                        type="number"
                        min="1"
                        placeholder="e.g. 12"
                        value={logDuration}
                        onChange={(e) => setLogDuration(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">Language</label>
                      <select
                        value={logLanguage}
                        onChange={(e) => setLogLanguage(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select...</option>
                        {["English", "Arabic", "Hindi", "Urdu", "Tagalog", "French", "Other"].map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Wrong Number: show source contact */}
                {logOutcome === "Wrong Number" && getSourceContact(lead) && (
                  <div className="p-2.5 rounded-md border border-rivo-warning/30 bg-rivo-warning-bg text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-rivo-warning">
                      <PhoneCall className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Contact <strong>{getSourceContact(lead)!.name}</strong> to verify number</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`https://wa.me/${getSourceContact(lead)!.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${getSourceContact(lead)!.name}, I'm trying to reach a lead (${lead.name}) but the number appears to be wrong. Could you please verify?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-rivo-success/10 text-rivo-success hover:bg-rivo-success/20 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Message
                      </a>
                      <a
                        href={`tel:${getSourceContact(lead)!.phone}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-rivo-warning/10 text-rivo-warning hover:bg-rivo-warning/20 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </a>
                    </div>
                  </div>
                )}

                {/* Not connected: reminder */}
                {logOutcome && logOutcome !== "Connected" && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <Bell className="w-3 h-3" />
                      Set Retry Reminder
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className={cn(
                            "w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-left focus:outline-none focus:ring-2 focus:ring-ring",
                            !logReminderDate && "text-muted-foreground"
                          )}>
                            {logReminderDate ? format(logReminderDate, "dd MMM yyyy") : "Pick date"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={logReminderDate}
                            onSelect={setLogReminderDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <input
                        type="time"
                        value={logReminderTime}
                        onChange={(e) => setLogReminderTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Quick note..."
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleLogCall}
                    disabled={!logOutcome}
                    className="flex-1 py-2 text-xs font-medium rounded-md bg-rivo-purple text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setShowLogForm(false); setLogOutcome(""); setLogNote(""); setLogDuration(""); setLogLanguage(""); setLogReminderDate(undefined); setLogReminderTime("09:00"); }}
                    className="flex-1 py-2 text-xs font-medium rounded-md border border-input text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </CollapsibleSection>

      {/* Locked Banner */}
      {!hasConnectedCall && (
        <div className="mx-0 my-3 p-3 rounded-md bg-muted text-muted-foreground text-xs flex items-center gap-2">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>Log a connected call to unlock the qualification form</span>
        </div>
      )}

      {/* Section 2 — Borrower Profile */}
      <CollapsibleSection
        label="Borrower Profile"
        open={openSections.borrower}
        onToggle={() => toggleSection("borrower")}
        locked={!hasConnectedCall}
      >
        <div className="grid grid-cols-2 gap-3">
          {/* Row 1 */}
          <InputField label="Full Name" value={qualification.fullName} onChange={(v) => updateField("fullName", v)} disabled={isReadOnly} />
          <InputField label="Email" value={qualification.borrowerEmail} onChange={(v) => updateField("borrowerEmail", v)} disabled={isReadOnly} />

          {/* Row 2 */}
          <InputField label="Date of Birth" value={qualification.dateOfBirth} onChange={(v) => updateField("dateOfBirth", v)} placeholder="DD/MM/YYYY" disabled={isReadOnly} />
          <SelectField label="Nationality" value={qualification.nationality} onChange={(v) => updateField("nationality", v)} options={["UAE National", "GCC National", "Indian", "Pakistani", "Filipino", "British", "Other"]} disabled={isReadOnly} />

          {/* Row 3 */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Residency Status</label>
            <div className={cn("flex gap-2", hasError("residencyStatus") && "ring-2 ring-destructive rounded-full")}>
              {["UAE Resident", "Non-Resident"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateField("residencyStatus", opt)}
                  disabled={isReadOnly}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-full border transition-colors",
                    qualification.residencyStatus === opt
                      ? "border-rivo-purple bg-rivo-purple-light text-rivo-purple"
                      : "border-input text-muted-foreground hover:bg-muted",
                    isReadOnly && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <SelectField label="Employment Type" value={qualification.employmentType} onChange={(v) => updateField("employmentType", v)} options={["Salaried — Private", "Salaried — Government", "Self-Employed", "Business Owner", "Freelancer", "Retired"]} error={hasError("employmentType")} disabled={isReadOnly} />

          {/* Conditional: Visa fields when NOT UAE/GCC National */}
          {qualification.nationality !== "" && qualification.nationality !== "UAE National" && qualification.nationality !== "GCC National" && (
            <>
              <SelectField label="Visa Type" value={qualification.visaType} onChange={(v) => updateField("visaType", v)} options={["Employment Visa", "Investor Visa", "Golden Visa", "Freelance", "Green Visa", "Family Visa", "Visit Visa", "Other"]} disabled={isReadOnly} />
              <InputField label="Visa Expiry" value={qualification.visaExpiry} onChange={(v) => updateField("visaExpiry", v)} placeholder="MM/YYYY" disabled={isReadOnly} />
            </>
          )}

          {/* Row 4 */}
          <InputField label="Current Employer" value={qualification.currentEmployer} onChange={(v) => updateField("currentEmployer", v)} disabled={isReadOnly} />
          <InputField label="Job Title" value={qualification.jobTitle} onChange={(v) => updateField("jobTitle", v)} disabled={isReadOnly} />

          {/* Row 5 */}
          <InputField label="Years in Current Role" value={qualification.yearsInCurrentRole} onChange={(v) => updateField("yearsInCurrentRole", v)} type="number" error={hasError("yearsInCurrentRole")} disabled={isReadOnly} />
          <InputField label="Total Years in UAE" value={qualification.totalYearsInUAE} onChange={(v) => updateField("totalYearsInUAE", v)} type="number" disabled={isReadOnly} />

          {/* Row 6 — Marital Status */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Marital Status</label>
            <div className="flex gap-2">
              {["Single", "Married", "Divorced", "Widowed"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateField("maritalStatus", opt)}
                  disabled={isReadOnly}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-full border transition-colors",
                    qualification.maritalStatus === opt
                      ? "border-rivo-purple bg-rivo-purple-light text-rivo-purple"
                      : "border-input text-muted-foreground hover:bg-muted",
                    isReadOnly && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Row 7 — Application Type */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Application Type</label>
            <div className="flex gap-2">
              {["Individual", "Joint"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateField("applicationType", opt)}
                  disabled={isReadOnly}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-full border transition-colors",
                    qualification.applicationType === opt
                      ? "border-rivo-purple bg-rivo-purple-light text-rivo-purple"
                      : "border-input text-muted-foreground hover:bg-muted",
                    isReadOnly && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
            {qualification.applicationType === "Joint" && (
              <p className="text-[10px] text-muted-foreground mt-1.5">Co-applicant details will be captured at the Atom stage</p>
            )}
          </div>
        </div>

        {/* Risk banners */}
        {qualification.visaType === "Visit Visa" && (
          <div className="mt-3 p-3 rounded-md bg-rivo-danger-bg text-rivo-danger text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Visit Visa — Instant Disqualifier. No UAE bank will approve a mortgage for visit visa holders.</span>
          </div>
        )}
        {qualification.yearsInCurrentRole && Number(qualification.yearsInCurrentRole) < 1 && (
          <div className="mt-3 p-3 rounded-md bg-rivo-warning-bg text-rivo-warning text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Less than 6 months in current role — most banks will not proceed. Consider Nurture until the 6-month mark.</span>
          </div>
        )}
        {qualification.employmentType === "Self-Employed" && (
          <div className="mt-3 p-3 rounded-md bg-rivo-warning-bg text-rivo-warning text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Self-employed — most banks require 2 years of audited financials.</span>
          </div>
        )}
        {qualification.residencyStatus === "Non-Resident" && (
          <div className="mt-3 p-3 rounded-md bg-rivo-warning-bg text-rivo-warning text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Non-resident — LTV cap applies (50–60%). Limited bank options.</span>
          </div>
        )}
      </CollapsibleSection>

      {/* Section 3 — Property Intent */}
      <CollapsibleSection
        label="Property Intent"
        badge="Key Section"
        badgeVariant="purple"
        open={openSections.property}
        onToggle={() => toggleSection("property")}
        locked={!hasConnectedCall}
      >
        <div className="grid grid-cols-2 gap-3">
          <SelectField label="Mortgage Purpose" value={qualification.mortgagePurpose} onChange={(v) => updateField("mortgagePurpose", v)} options={["Purchase", "Refinance", "Equity Release", "Buy-to-Let"]} error={hasError("mortgagePurpose")} disabled={isReadOnly} />
          <SelectField label="Emirate" value={qualification.emirate} onChange={(v) => updateField("emirate", v)} options={["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "RAK", "Fujairah", "UAQ"]} disabled={isReadOnly} />
          <SelectField label="Property Type" value={qualification.propertyType} onChange={(v) => updateField("propertyType", v)} options={["Apartment", "Villa", "Townhouse", "Penthouse", "Land"]} disabled={isReadOnly} />
          <SelectField label="Property Status" value={qualification.propertyStatus} onChange={(v) => updateField("propertyStatus", v)} options={["Ready", "Off-Plan", "Under Construction"]} error={hasError("propertyStatus")} disabled={isReadOnly} />
          <SelectField label="Property Readiness" value={qualification.propertyReadiness} onChange={(v) => updateField("propertyReadiness", v)} options={["Immediate", "Within 6 months", "6-12 months", "12+ months"]} disabled={isReadOnly} />
          <InputField label="Developer/Project" value={qualification.developerProject} onChange={(v) => updateField("developerProject", v)} disabled={isReadOnly} />
          <InputField label="Specific Project" value={qualification.specificProject} onChange={(v) => updateField("specificProject", v)} disabled={isReadOnly} />
          <InputField label="Est. Value (AED)" value={qualification.estimatedValue} onChange={(v) => updateField("estimatedValue", v)} error={hasError("estimatedValue")} disabled={isReadOnly} />
          <InputField label="Property Location" value={qualification.propertyLocation} onChange={(v) => updateField("propertyLocation", v)} disabled={isReadOnly} />
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">First Property?</label>
            <div className="flex gap-2">
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateField("firstProperty", opt)}
                  disabled={isReadOnly}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-md border transition-colors",
                    qualification.firstProperty === opt
                      ? "border-rivo-purple bg-rivo-purple-light text-rivo-purple"
                      : "border-input text-muted-foreground hover:bg-muted",
                    isReadOnly && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <SelectField label="Timeline" value={qualification.timeline} onChange={(v) => updateField("timeline", v)} options={["Immediate", "1-3 months", "3-6 months", "6+ months"]} error={hasError("timeline")} disabled={isReadOnly} />
          <SelectField label="Financing Preference" value={qualification.financingPreference} onChange={(v) => updateField("financingPreference", v)} options={["Conventional", "Islamic", "No Preference"]} disabled={isReadOnly} />
          {/* Down Payment Ready — smart single question */}
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Down Payment Ready?</label>
            <div className="flex gap-2">
              {["Yes", "Partially", "No"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { updateField("downPaymentReady", opt); if (opt === "Yes") updateField("paymentAssistance", ""); }}
                  disabled={isReadOnly}
                  className={cn(
                    "flex-1 py-2 text-xs font-medium rounded-full border transition-colors",
                    qualification.downPaymentReady === opt
                      ? "border-rivo-purple bg-rivo-purple-light text-rivo-purple"
                      : "border-input text-muted-foreground hover:bg-muted",
                    isReadOnly && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {(qualification.downPaymentReady === "Partially" || qualification.downPaymentReady === "No") && (
            <InputField label="How much assistance needed? (AED)" value={qualification.paymentAssistance} onChange={(v) => updateField("paymentAssistance", v)} placeholder="e.g. 200,000" disabled={isReadOnly} />
          )}
        </div>
      </CollapsibleSection>

      {/* Section 4 — Financial Snapshot */}
      <CollapsibleSection
        label="Financial Snapshot"
        open={openSections.financial}
        onToggle={() => toggleSection("financial")}
        locked={!hasConnectedCall}
      >
        <p className="text-[10px] text-muted-foreground italic mb-3">Verbal / self-reported — no calculations, just what the lead says on the call.</p>
        <div className="grid grid-cols-2 gap-3">
          <InputField label="Monthly Income (AED)" value={qualification.monthlyIncome} onChange={(v) => updateField("monthlyIncome", v)} error={hasError("monthlyIncome")} disabled={isReadOnly} />
          <InputField label="Additional Income (AED)" value={qualification.additionalIncome} onChange={(v) => updateField("additionalIncome", v)} disabled={isReadOnly} />
          <InputField label="Existing Home Loan EMI" value={qualification.existingHomeLoanEMI} onChange={(v) => updateField("existingHomeLoanEMI", v)} disabled={isReadOnly} />
          <InputField label="Car Loan EMI" value={qualification.carLoanEMI} onChange={(v) => updateField("carLoanEMI", v)} disabled={isReadOnly} />
          <InputField label="Personal Loan EMI" value={qualification.personalLoanEMI} onChange={(v) => updateField("personalLoanEMI", v)} disabled={isReadOnly} />
          <InputField label="Credit Card Obligations" value={qualification.creditCardObligations} onChange={(v) => updateField("creditCardObligations", v)} disabled={isReadOnly} />
          <InputField label="Other Liabilities" value={qualification.otherLiabilities} onChange={(v) => updateField("otherLiabilities", v)} disabled={isReadOnly} />
          <SelectField label="AECB Credit Score (if known)" value={qualification.aecbCreditScore} onChange={(v) => updateField("aecbCreditScore", v)} options={["Don't know", "Below 600", "600–650", "650–700", "700–750", "750+"]} disabled={isReadOnly} />
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">Any Credit Issues?</label>
            <div className="flex flex-wrap gap-2">
              {["No issues", "Late payments", "Defaults", "Bounced cheques", "Prefer not to say"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateField("creditIssues", opt)}
                  disabled={isReadOnly}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors",
                    qualification.creditIssues === opt
                      ? "border-rivo-purple bg-rivo-purple-light text-rivo-purple"
                      : "border-input text-muted-foreground hover:bg-muted",
                    isReadOnly && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <SelectField label="Source of Down Payment" value={qualification.downPaymentSource} onChange={(v) => updateField("downPaymentSource", v)} options={["Personal savings", "Family assistance", "Property sale proceeds", "End-of-service gratuity", "Other"]} disabled={isReadOnly} />
        </div>

        {qualification.aecbCreditScore === "Below 600" && (
          <div className="mt-3 p-3 rounded-md bg-rivo-danger-bg text-rivo-danger text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Credit score below 600 — most banks will decline this application</span>
          </div>
        )}
        {(qualification.creditIssues === "Defaults" || qualification.creditIssues === "Bounced cheques") && (
          <div className="mt-3 p-3 rounded-md bg-rivo-danger-bg text-rivo-danger text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{qualification.creditIssues} — high risk, may require specialist lender</span>
          </div>
        )}
      </CollapsibleSection>

      {/* Section 5 — Call Notes */}
      <CollapsibleSection
        label="Call Notes"
        open={openSections.notes}
        onToggle={() => toggleSection("notes")}
      >
        <textarea
          value={qualification.callNotes}
          onChange={(e) => updateField("callNotes", e.target.value)}
          placeholder="Add notes from the call..."
          rows={4}
          disabled={isReadOnly}
          className={cn(
            "w-full px-3 py-2 text-sm rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none",
            isReadOnly && "opacity-60 cursor-not-allowed"
          )}
        />
      </CollapsibleSection>
    </div>
  );
});

/* --- Sub-components --- */

function CollapsibleSection({
  label, badge, badgeVariant, open, onToggle, locked, children,
}: {
  label: string;
  badge?: string;
  badgeVariant?: "purple" | "default";
  open: boolean;
  onToggle: () => void;
  locked?: boolean;
  children: React.ReactNode;
}) {
  if (locked) return null;

  return (
    <div className="border-b border-border py-3">
      <button onClick={onToggle} className="w-full flex items-center justify-between group">
        <div className="flex items-center gap-2">
          <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-90")} />
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        {badge && (
          <span className={cn(
            "text-[10px] font-medium px-2 py-0.5 rounded-full",
            badgeVariant === "purple"
              ? "bg-rivo-purple-light text-rivo-purple"
              : "bg-muted text-muted-foreground"
          )}>
            {badge}
          </span>
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, error, disabled }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; error?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <label className={cn("block text-[11px] font-medium mb-1", error ? "text-destructive" : "text-muted-foreground")}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-md border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          error ? "border-destructive" : "border-input",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", error, disabled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; error?: boolean; disabled?: boolean;
}) {
  return (
    <div>
      <label className={cn("block text-[11px] font-medium mb-1", error ? "text-destructive" : "text-muted-foreground")}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 text-sm rounded-md border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          error ? "border-destructive" : "border-input",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      />
    </div>
  );
}
