import { useNavigate } from "react-router-dom";
import { Phone, Mail, ChevronLeft, ChevronRight, ChevronRight as ChevronRightSmall, Building2, FileText, PenLine, Clock, Check } from "lucide-react";
import { useWelcomeState, WELCOME_STATE_LABELS, WelcomeState } from "@/contexts/WelcomeStateContext";

const ALL_STATES: WelcomeState[] = [1, 2, 3, 4, 5, 6, 7, 8];

const bankList = [
  { name: "Nordea", stage: "Pre-approved" },
  { name: "SEB", stage: "Under review" },
  { name: "Swedbank", stage: "Submitted to credit" },
  { name: "Luminor", stage: "Draft" },
];

const stagePillStyle = (stage: string): React.CSSProperties => {
  switch (stage) {
    case "Pre-approved":
      return { background: "#16A34A", color: "#fff", fontWeight: 600 };
    case "Under review":
      return { background: "#EA580C", color: "#fff", fontWeight: 600 };
    case "Submitted to credit":
      return { background: "#2563EB", color: "#fff", fontWeight: 600 };
    case "Draft":
      return { background: "#6B7280", color: "#fff", fontWeight: 600 };
    default:
      return { background: "#6B7280", color: "#fff", fontWeight: 600 };
  }
};

/* ─── Destination Chip ─── */
interface ChipProps {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  route: string;
}

const DestinationChip = ({ icon: Icon, label, sublabel, route }: ChipProps) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(route)}
      className="w-full flex items-center gap-3 hover:opacity-90 transition-opacity text-left"
      style={{ background: "#D97706", borderRadius: "8px", padding: "14px 16px" }}
    >
      <div className="shrink-0 rounded-md flex items-center justify-center" style={{ height: "30px", width: "30px", background: "rgba(255,255,255,0.2)" }}>
        <Icon className="h-4 w-4" style={{ stroke: "#fff" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: "#fff" }}>{label}</p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.8)" }}>{sublabel}</p>
      </div>
      <ChevronRightSmall style={{ height: "22px", width: "22px", stroke: "#fff" }} />
    </button>
  );
};

/* ─── Action Banner ─── */
interface ActionBannerProps {
  timestamp: string;
  body: string;
  chips: ChipProps[];
}

const ActionBanner = ({ timestamp, body, chips }: ActionBannerProps) => (
  <div className="overflow-hidden" style={{ background: "#FEF3E2", border: "1px solid #F5A623", borderTop: "4px solid #D97706", borderRadius: "10px", padding: "24px" }}>
    <div className="flex items-center justify-between mb-2">
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "26px", fontWeight: 600, color: "#92400E", letterSpacing: "-0.3px" }}>Action needed</span>
      <span className="text-[11px]" style={{ color: "#854F0B", opacity: 0.7 }}>{timestamp}</span>
    </div>
    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#78350F", lineHeight: 1.5, marginBottom: "16px" }}>{body}</p>
    <div className="flex flex-col" style={{ gap: "8px" }}>
      {chips.map((chip) => (
        <DestinationChip key={chip.label} {...chip} />
      ))}
    </div>
  </div>
);

/* ─── Waiting Message ─── */
const WaitingMessage = ({ title, subtext }: { title: string; subtext: string }) => (
  <div className="text-center" style={{ background: "#E6F4F7", border: "2px solid #0F4C5C", borderRadius: "10px", padding: "28px 24px" }}>
    <div className="mx-auto mb-3 rounded-full flex items-center justify-center" style={{ height: "52px", width: "52px", background: "#0F4C5C" }}>
      <Clock className="h-5 w-5" style={{ stroke: "#fff" }} />
    </div>
    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 600, color: "#0F4C5C", letterSpacing: "-0.3px" }}>{title}</p>
    <p className="mt-1.5 max-w-md mx-auto" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#164E63", lineHeight: 1.6 }}>{subtext}</p>
  </div>
);

/* ─── Completed Message ─── */
const CompletedMessage = ({ title, subtext }: { title: string; subtext: string }) => (
  <div className="text-center" style={{ background: "#ECFDF5", border: "2px solid #059669", borderRadius: "10px", padding: "28px 24px" }}>
    <div className="mx-auto mb-3 rounded-full flex items-center justify-center" style={{ height: "52px", width: "52px", background: "#059669" }}>
      <Check className="h-5 w-5" style={{ stroke: "#fff" }} />
    </div>
    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 600, color: "#064E3B", letterSpacing: "-0.3px" }}>{title}</p>
    <p className="mt-1.5 max-w-md mx-auto" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#065F46", lineHeight: 1.5 }}>{subtext}</p>
  </div>
);

/* ─── Bank List Section (unchanged) ─── */
const BankListSection = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Your applications
      </h3>
      <div>
        {bankList.map((bank, i) => (
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
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs"
                  style={stagePillStyle(bank.stage)}
                >
                  {bank.stage}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const WelcomeHome = () => {
  const navigate = useNavigate();
  const { welcomeState, setWelcomeState } = useWelcomeState();

  const currentIdx = ALL_STATES.indexOf(welcomeState);
  const prev = () => setWelcomeState(ALL_STATES[(currentIdx - 1 + ALL_STATES.length) % ALL_STATES.length]);
  const next = () => setWelcomeState(ALL_STATES[(currentIdx + 1) % ALL_STATES.length]);

  const docsChip: ChipProps = { icon: FileText, label: "Documents", sublabel: "9 remaining to upload", route: "/upload" };
  const docsChip1: ChipProps = { icon: FileText, label: "Documents", sublabel: "1 new document requested", route: "/upload" };
  const signChip: ChipProps = { icon: PenLine, label: "Sign", sublabel: "2 forms pending signature", route: "/sign" };

  const renderLeftContent = () => {
    switch (welcomeState) {
      case 1:
        return (
          <ActionBanner
            timestamp="Updated just now"
            body="You have documents waiting to be uploaded."
            chips={[docsChip]}
          />
        );
      case 2:
        return (
          <WaitingMessage
            title="Your documents have been received"
            subtext="Our team is reviewing your documents and preparing your bank application forms. We'll notify you when they're ready to sign."
          />
        );
      case 3:
        return (
          <ActionBanner
            timestamp="Updated just now"
            body="You have bank forms ready for your signature."
            chips={[signChip]}
          />
        );
      case 4:
        return <BankListSection />;
      case 5:
        return (
          <>
            <ActionBanner
              timestamp="Updated just now"
              body="A new document has been requested."
              chips={[docsChip1]}
            />
            <BankListSection />
          </>
        );
      case 6:
        return (
          <>
            <ActionBanner
              timestamp="Updated just now"
              body="You have bank forms ready for your signature."
              chips={[signChip]}
            />
            <BankListSection />
          </>
        );
      case 7:
        return (
          <>
            <ActionBanner
              timestamp="Updated just now"
              body="You have actions waiting in the following areas."
              chips={[docsChip1, signChip]}
            />
            <BankListSection />
          </>
        );
      case 8:
        return (
          <CompletedMessage
            title="Your mortgage application is complete"
            subtext="Congratulations — your property transfer has been completed. Thank you for choosing Rivo to guide you through your mortgage journey."
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">
      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left side */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
              Welcome back, Martin
            </h1>
            {/* State switcher */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={prev}
                className="h-6 w-6 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted/60 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs text-muted-foreground font-medium min-w-[90px] text-center">
                {WELCOME_STATE_LABELS[welcomeState]}
              </span>
              <button
                onClick={next}
                className="h-6 w-6 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted/60 transition-colors"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {renderLeftContent()}
          </div>
        </div>

        {/* Right side */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-8 flex flex-col gap-6 lg:sticky lg:top-14 lg:self-start">
          {/* Application details card */}
          <div className="bg-card border border-border rounded-lg px-6 py-5">
            <p className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Application details
            </p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-body text-muted-foreground text-xs mb-0.5">Property</dt>
                <dd className="font-body text-foreground">Palm Jumeirah, Dubai</dd>
              </div>
              <div>
                <dt className="font-body text-muted-foreground text-xs mb-0.5">Loan amount</dt>
                <dd className="font-body text-foreground">AED 1,412,000</dd>
              </div>
              <div>
                <dt className="font-body text-muted-foreground text-xs mb-0.5">Reference</dt>
                <dd className="font-body text-foreground">RIV-2024-0047</dd>
              </div>
            </dl>
          </div>

          {/* Support */}
          <div className="border-t border-border pt-6">
            <p className="font-body text-muted-foreground text-sm leading-relaxed mb-3">
              Need help? Contact your mortgage specialist.
            </p>
            <div className="space-y-1.5 text-sm">
              <a
                href="tel:+971501234567"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                +971 50 123 4567
              </a>
              <a
                href="mailto:support@rivo.ae"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                support@rivo.ae
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHome;
