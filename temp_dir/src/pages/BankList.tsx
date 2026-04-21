import { Building2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BankItem {
  name: string;
  currentStage: string;
  stageStatus: "completed" | "current" | "upcoming";
}

const banks: BankItem[] = [
  { name: "Nordea", currentStage: "Draft", stageStatus: "current" },
  { name: "SEB", currentStage: "Under review", stageStatus: "current" },
  { name: "Swedbank", currentStage: "Submitted to credit", stageStatus: "current" },
  { name: "Luminor", currentStage: "Credit queries", stageStatus: "current" },
];

const stagePillClass = (status: BankItem["stageStatus"]): string => {
  switch (status) {
    case "completed":
      return "bg-primary/10 text-primary";
    case "current":
      return "bg-accent text-accent-foreground";
    case "upcoming":
      return "bg-muted text-muted-foreground";
  }
};

const BankList = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">

      {/* Header */}
      <div className="max-w-6xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
          Bank List
        </h1>
        <p className="font-body text-secondary-foreground text-base leading-relaxed max-w-xl mb-6">
          Track the status of your application with each bank.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left: Bank list */}
        <div className="flex-1 min-w-0">
          <p className="font-heading text-xs tracking-widest uppercase text-text-tertiary mb-5">
            Your Banks
          </p>

          <div>
            {banks.map((bank, i) => (
              <div
                key={bank.name}
                className={`${i > 0 ? "border-t border-border/50" : ""}`}
              >
                <button
                  onClick={() => navigate("/track", { state: { bankName: bank.name } })}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer rounded-sm hover:bg-muted/50 transition-colors px-2 -mx-2"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-surface-elevated flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h2 className="font-heading text-lg md:text-xl font-semibold text-foreground tracking-tight">
                      {bank.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${stagePillClass(bank.stageStatus)}`}
                    >
                      {bank.currentStage}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Context panel */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-8 flex flex-col gap-6 lg:sticky lg:top-14 lg:self-start">
          {/* Info card */}
          <div className="bg-card border border-border rounded-lg px-6 py-5">
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Select a bank from the list to view the detailed status
              of your mortgage application.
            </p>
          </div>

          {/* Support */}
          <div className="border-t border-border pt-6">
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Need help? Contact your mortgage specialist for guidance
              on your application status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankList;
