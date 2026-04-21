import { ArrowLeft, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

type StageStatus = "completed" | "current" | "upcoming";

interface Stage {
  name: string;
  date?: string;
  status: StageStatus;
  whatsHappening: string;
  action?: string;
}

const stages: Stage[] = [
  { name: "Credit queries", date: "23/02", status: "completed", whatsHappening: "What happened during this stage.", action: "Action needed from client (if any)." },
  { name: "Submitted to credit", date: "17/02", status: "completed", whatsHappening: "What happened during this stage.", action: "Action needed from client (if any)." },
  { name: "Docs ready to send", date: "17/02", status: "completed", whatsHappening: "What happened during this stage.", action: "Action needed from client (if any)." },
  { name: "Under review", date: "17/02", status: "completed", whatsHappening: "What happened during this stage.", action: "Action needed from client (if any)." },
  { name: "Draft", date: "17/02", status: "current", whatsHappening: "What's happening at this stage.", action: "Action needed from client (if any)." },
  { name: "Submitted to bank", status: "upcoming", whatsHappening: "What happens during this stage." },
  { name: "Pre-approved", status: "upcoming", whatsHappening: "What happens during this stage." },
  { name: "Valuation", status: "upcoming", whatsHappening: "What happens during this stage." },
  { name: "FOL", status: "upcoming", whatsHappening: "What happens during this stage." },
  { name: "FOL signed", status: "upcoming", whatsHappening: "What happens during this stage." },
  { name: "Final documents", status: "upcoming", whatsHappening: "What happens during this stage." },
  { name: "Approved", status: "upcoming", whatsHappening: "What happens during this stage." },
  { name: "Disbursed", status: "upcoming", whatsHappening: "What happens during this stage." },
  { name: "Property transferred", status: "upcoming", whatsHappening: "What happens during this stage." },
];

const statusPillClass = (status: StageStatus): string => {
  switch (status) {
    case "completed":
      return "bg-primary/10 text-primary";
    case "current":
      return "bg-primary text-primary-foreground";
    case "upcoming":
      return "bg-muted text-muted-foreground";
  }
};

const statusLabel = (status: StageStatus): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "current":
      return "Current";
    case "upcoming":
      return "Upcoming";
  }
};

const ApplicationTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bankName = (location.state as { bankName?: string })?.bankName ?? "Bank";
  const currentStage = stages.find((s) => s.status === "current");
  const currentIndex = stages.findIndex((s) => s.status === "current");
  const completedCount = stages.filter((s) => s.status === "completed").length;
  const stepNumber = currentIndex + 1;
  const totalSteps = stages.length;
  const progressPercent = Math.round(((completedCount) / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">
      {/* Back button */}
      <div className="max-w-6xl mb-8">
        <button
          onClick={() => navigate("/banks")}
          className="flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mb-3">
        <nav className="flex items-center gap-1.5 font-body text-xs">
          <span className="text-muted-foreground">Applications</span>
          <span className="text-muted-foreground">›</span>
          <span className="text-foreground/70 font-medium">{bankName}</span>
        </nav>
      </div>

      {/* Header */}
      <div className="max-w-6xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
          My Application
        </h1>
        <p className="font-body text-secondary-foreground text-base leading-relaxed max-w-xl mb-6">
          Track the progress of your mortgage application across every stage.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left: Timeline checklist */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            {stages.map((stage, i) => {
              const isLast = i === stages.length - 1;
              const isCompleted = stage.status === "completed";
              const isCurrent = stage.status === "current";
              const isUpcoming = stage.status === "upcoming";
              // Line color: green up to and including current, grey after
              const lineIsGreen = i < currentIndex;

              return (
                <div key={i} className="flex items-start gap-4 relative">
                  {/* Timeline column */}
                  <div className="flex flex-col items-center relative" style={{ width: 24 }}>
                    {/* Dot */}
                    <div
                      className={`relative z-10 flex items-center justify-center rounded-full shrink-0 ${
                        isCompleted || isCurrent
                          ? "w-6 h-6 bg-primary"
                          : "w-6 h-6 border-2 border-muted-foreground/40 bg-background"
                      }`}
                    >
                      {isCompleted && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
                      {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />}
                    </div>
                    {/* Connecting line */}
                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 min-h-[24px] ${
                          lineIsGreen ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 min-w-0 flex items-center justify-between gap-3 ${isLast ? "pb-0" : "pb-5"}`}>
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span
                        className={`font-heading text-base md:text-lg tracking-tight ${
                          isUpcoming ? "text-muted-foreground font-normal" : "text-foreground font-semibold"
                        }`}
                      >
                        {stage.name}
                      </span>
                      {stage.date && (isCompleted || isCurrent) && (
                        <span className="font-body text-sm text-muted-foreground shrink-0">
                          {stage.date}
                        </span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${statusPillClass(stage.status)}`}
                    >
                      {statusLabel(stage.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Context panel */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-8 flex flex-col gap-6 lg:sticky lg:top-14 lg:self-start">
          {/* Progress & current stage card */}
          <div className="bg-card border border-border rounded-lg px-6 py-5">
            <p className="font-heading text-lg font-semibold text-foreground tracking-tight">
              Step {stepNumber} of {totalSteps}
            </p>
            <p className="font-body text-sm text-muted-foreground mt-1 mb-3">
              {progressPercent}% through your application
            </p>
            <Progress value={progressPercent} className="h-2 rounded-full" />

            <Separator className="my-4" />

            <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Current Stage
            </p>
            {currentStage && (
              <>
                <h3 className="font-heading text-xl font-semibold text-foreground tracking-tight mb-3">
                  {currentStage.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {currentStage.whatsHappening}
                </p>
                {currentStage.action && (
                  <p className="font-body text-sm text-primary leading-relaxed mt-1">
                    {currentStage.action}
                  </p>
                )}
              </>
            )}
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

export default ApplicationTracking;
