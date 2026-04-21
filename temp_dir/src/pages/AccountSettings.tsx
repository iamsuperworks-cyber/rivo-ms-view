import { useState } from "react";
import { ArrowLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Screen = "main" | "kyc" | { type: "bank"; bankIndex: number };

interface BankEntry {
  name: string;
  stage: string;
  stageClass: string;
  documentCount: number;
}

const banks: BankEntry[] = [
  { name: "Emirates Investment Bank", stage: "Rejected", stageClass: "bg-destructive/10 text-destructive", documentCount: 1 },
  { name: "Ajman Bank", stage: "Pre-approved", stageClass: "bg-primary/10 text-primary", documentCount: 6 },
  { name: "Abu Dhabi Islamic Bank", stage: "Valuation Initiated", stageClass: "bg-accent text-accent-foreground", documentCount: 0 },
  { name: "Abu Dhabi Commercial Bank", stage: "Under Review", stageClass: "bg-muted text-muted-foreground", documentCount: 0 },
];

const kycDocuments = [
  "Passport",
  "Emirates ID (front)",
  "Emirates ID (back)",
  "Visa",
  "Salary Certificate",
  "Payslips (6 months)",
  "Personal Bank Statements (6 months)",
];

const bankForms = [
  "Application form",
  "Salary assignment letter",
  "Direct debit authorisation",
  "Liability letter",
  "Insurance consent form",
  "Formal offer letter",
];

const AccountSettings = () => {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("main");

  if (screen === "kyc") {
    return (
      <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">
        <div className="max-w-6xl mb-8">
          <button
            onClick={() => setScreen("main")}
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="max-w-6xl">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
            KYC Documents
          </h1>
          <p className="font-body text-secondary-foreground text-base leading-relaxed max-w-xl mb-6">
            These documents were uploaded as part of your application.
          </p>
        </div>

        <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
          <div className="flex-1 min-w-0">
            <div>
              {kycDocuments.map((doc, i) => (
                <div
                  key={doc}
                  className={`flex items-center justify-between py-4 px-2 -mx-2 rounded-sm hover:bg-muted/50 transition-colors ${i > 0 ? "border-t border-border/50" : ""}`}
                >
                  <span className="font-body text-sm text-foreground">{doc}</span>
                  <Button variant="outline" size="sm" disabled>
                    View
                  </Button>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-muted-foreground mt-4">
              Deletion available in 83 days
            </p>
          </div>

          <div className="lg:w-80 xl:w-96 mt-10 lg:mt-0 flex flex-col gap-8 lg:sticky lg:top-14 lg:self-start">
            <Button variant="destructive" className="w-full" disabled>
              Delete
            </Button>

            <div className="bg-surface-elevated rounded-sm px-6 py-5">
              <p className="font-body text-accent-foreground text-sm leading-relaxed">
                Deletion is permanent and cannot be undone. This will remove all KYC documents from your account.
              </p>
            </div>

            <p className="font-body text-text-tertiary text-sm leading-relaxed" />
          </div>
        </div>
      </div>
    );
  }

  if (typeof screen === "object" && screen.type === "bank") {
    const bank = banks[screen.bankIndex];
    return (
      <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">
        <div className="max-w-6xl mb-8">
          <button
            onClick={() => setScreen("main")}
            className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <div className="max-w-6xl">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
              {bank.name}
            </h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${bank.stageClass}`}>
              {bank.stage}
            </span>
          </div>
          <p className="font-body text-secondary-foreground text-base leading-relaxed max-w-xl mb-6">
            Bank forms associated with this application.
          </p>
        </div>

        <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
          <div className="flex-1 min-w-0">
            <div>
              {bankForms.map((form, i) => (
                <div
                  key={form}
                  className={`flex items-center justify-between py-4 px-2 -mx-2 rounded-sm hover:bg-muted/50 transition-colors ${i > 0 ? "border-t border-border/50" : ""}`}
                >
                  <span className="font-body text-sm text-foreground">{form}</span>
                  <Button variant="outline" size="sm" disabled>
                    View
                  </Button>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-muted-foreground mt-4">
              Case in progress — deletion available once your mortgage case is concluded.
            </p>
          </div>

          <div className="lg:w-80 xl:w-96 mt-10 lg:mt-0 flex flex-col gap-8 lg:sticky lg:top-14 lg:self-start">
            <Button variant="destructive" className="w-full" disabled>
              Delete
            </Button>

            <div className="bg-surface-elevated rounded-sm px-6 py-5">
              <p className="font-body text-accent-foreground text-sm leading-relaxed">
                Deletion is permanent and cannot be undone. Deleted forms may need to be re-uploaded if your case is still active.
              </p>
            </div>

            <p className="font-body text-text-tertiary text-sm leading-relaxed" />
          </div>
        </div>
      </div>
    );
  }

  // Main screen
  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">
      <div className="max-w-6xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
          My Profile
        </h1>
        <p className="font-body text-secondary-foreground text-base leading-relaxed max-w-xl mb-8">
          Your personal information and data privacy settings.
        </p>
      </div>

      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        <div className="flex-1 min-w-0 space-y-10">
          {/* Personal Information */}
          <section>
            <p className="font-heading text-xs tracking-widest uppercase text-text-tertiary mb-5">
              Personal Information
            </p>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase">Full Name</label>
                <Input value="Abhishek Singh" readOnly className="bg-muted text-muted-foreground cursor-default" />
              </div>
              <div className="space-y-1.5">
                <label className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase">Email</label>
                <Input value="abhisheksinghpro007@gmail.com" readOnly className="bg-muted text-muted-foreground cursor-default" />
              </div>
              <div className="space-y-1.5">
                <label className="font-body text-xs font-medium text-muted-foreground tracking-wide uppercase">Phone</label>
                <Input value="+918218698610" readOnly className="bg-muted text-muted-foreground cursor-default" />
              </div>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-3">
              You can't edit this information yet. Feature coming soon.
            </p>
          </section>

          {/* Data & Privacy */}
          <section>
            <p className="font-heading text-xs tracking-widest uppercase text-text-tertiary mb-5">
              Data & Privacy
            </p>

            {/* Warning banner */}
            <div className="flex items-start gap-3 rounded-sm border border-warning-border bg-warning px-5 py-4 mb-6">
              <AlertTriangle className="h-4 w-4 text-warning-icon mt-0.5 shrink-0" />
              <p className="font-body text-sm text-warning-foreground leading-relaxed">
                Document deletion is permanent and cannot be undone. Deleted documents may need to be re-uploaded if your application is still in progress.
              </p>
            </div>

            {/* KYC Documents */}
            <div className="mb-6">
              <p className="font-heading text-sm font-semibold text-foreground mb-2">KYC Documents</p>
              <button
                onClick={() => setScreen("kyc")}
                className="w-full py-4 px-2 -mx-2 rounded-sm hover:bg-muted/50 transition-colors cursor-pointer border-t border-border/50 flex-row flex items-center justify-between text-left"
              >
                <div>
                  <span className="font-body text-sm text-foreground px-0 mx-0">KYC Documents</span>
                  <p className="font-body text-xs text-muted-foreground mt-0.5 mx-0 px-0">Deletion available in 83 days</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </div>

            {/* Bank Forms */}
            <div>
              <p className="font-heading text-sm font-semibold text-foreground mb-2">Bank Forms</p>
              {banks.map((bank, i) => (
                <button
                  key={bank.name}
                  onClick={() => setScreen({ type: "bank", bankIndex: i })}
                  className={`w-full flex items-center justify-between py-4 px-2 -mx-2 rounded-sm hover:bg-muted/50 transition-colors cursor-pointer ${i >= 0 ? "border-t border-border/50" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-body text-sm text-foreground">{bank.name}</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold shrink-0 ${bank.stageClass}`}>
                      {bank.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-body text-xs text-muted-foreground">
                      {bank.documentCount} {bank.documentCount === 1 ? "document" : "documents"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right side - empty */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-8" />
      </div>
    </div>
  );
};

export default AccountSettings;
