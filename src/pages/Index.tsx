import { useState, useMemo, useRef, Fragment } from "react";
import { RotateCw, Send, Check, X } from "lucide-react";
import { RivoLayout } from "@/components/RivoLayout";
import { LeadProfilePanel } from "@/components/LeadProfilePanel";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────
type LeadTab = "not-contacted" | "active" | "nurture" | "declined";
type Source = "google-ads" | "meta-ads" | "al-futtaim" | "emaar" | "better-homes" | "direct";
type Status = "not-contacted" | "in-progress" | "qualified" | "presented";
type SlaLevel = "green" | "amber" | "red";

interface MineNote {
  author: string;
  text: string;
  time: string;
}
interface MineDetail {
  sla?: { text: string; level: SlaLevel };
  lastOutreach?: string;
  banks?: number;
  bankNames?: string[];
  dbr?: string;
  ltv?: string;
  waitingTime?: string;
}
interface MineLead {
  id: number;
  name: string;
  source: Source;
  status: Status;
  hasMissedCalls: boolean;
  completeness: 1 | 2 | 3;
  intent: string;
  detail: MineDetail;
  lastActivity: string;
  lastActMins: number;
  claimedMins: number;
  fromNurture?: boolean;
  notes?: MineNote[];
}
interface NurtureLead {
  id: number;
  name: string;
  source: Source;
  reason: "Disqualified" | "Lost";
  reasonNote: string;
  intent: string;
  reengageDays: number;
  previouslyPresented: number | null;
}
interface DeclinedLead {
  id: number;
  name: string;
  source: Source;
  reason: string;
  reasonNote: string;
  intent: string;
  declinedDate: string;
}

// ── Urgency sort weight ────────────────────────────────────────────────────────
const STATUS_PRIORITY: Record<Status, number> = {
  qualified: 0,
  "in-progress": 1,
  presented: 2,
  "not-contacted": 3,
};

// ── Completeness helpers ───────────────────────────────────────────────────────
const COMPLETENESS_LABEL: Record<1 | 2 | 3, string> = { 1: "Minimal", 2: "Partial", 3: "Complete" };
const COMPLETENESS_PCT: Record<1 | 2 | 3, number> = { 1: 33, 2: 66, 3: 100 };
const COMPLETENESS_COLOR: Record<1 | 2 | 3, string> = {
  1: "text-[#854F0B]",
  2: "text-[#444441]",
  3: "text-[#27500A]",
};
const COMPLETENESS_BAR: Record<1 | 2 | 3, string> = {
  1: "bg-[#EF9F27]",
  2: "bg-[#888780]",
  3: "bg-[#639922]",
};

// ── Static data ────────────────────────────────────────────────────────────────
const BASE_MINE_LEADS: MineLead[] = [
  {
    id: 10,
    name: "Maria Lopez",
    source: "al-futtaim",
    status: "qualified",
    hasMissedCalls: false,
    completeness: 3,
    intent: "AED 3.2M · Villa · Dubai",
    detail: { banks: 3, bankNames: ["ENBD", "FAB", "Mashreq"], dbr: "38%", ltv: "75%" },
    lastActivity: "3h ago",
    lastActMins: 180,
    claimedMins: 180,
    notes: [
      { author: "Maya R.", text: "Eligibility computed — ENBD, FAB, Mashreq matched", time: "10 min ago" },
      { author: "Maya R.", text: "Called client, confirmed income docs are ready", time: "2h ago" },
    ],
  },
  {
    id: 11,
    name: "Deepa Menon",
    source: "google-ads",
    status: "in-progress",
    hasMissedCalls: true,
    completeness: 1,
    intent: "AED 2.0M · Apartment · Abu Dhabi",
    detail: { lastOutreach: "Called · 1h ago" },
    lastActivity: "1h ago",
    lastActMins: 60,
    claimedMins: 150,
    fromNurture: true,
    notes: [{ author: "Maya R.", text: "Employment info not provided — client said call Thursday", time: "1h ago" }],
  },
  {
    id: 12,
    name: "Tony Liu",
    source: "meta-ads",
    status: "presented",
    hasMissedCalls: false,
    completeness: 3,
    intent: "AED 1.9M · Apartment · Dubai",
    detail: { banks: 2, bankNames: ["ENBD", "Mashreq"], waitingTime: "1h 12m" },
    lastActivity: "1h ago",
    lastActMins: 60,
    claimedMins: 60,
    notes: [
      {
        author: "Maya R.",
        text: "Presented ENBD and Mashreq options — client wants to discuss with spouse",
        time: "1h ago",
      },
    ],
  },
  {
    id: 13,
    name: "Hassan Ali",
    source: "direct",
    status: "in-progress",
    hasMissedCalls: false,
    completeness: 2,
    intent: "AED 4.0M · Villa · Dubai",
    detail: { lastOutreach: "WhatsApp · 45m ago" },
    lastActivity: "45m ago",
    lastActMins: 45,
    claimedMins: 45,
    notes: [],
  },
  {
    id: 14,
    name: "Raj Patel",
    source: "emaar",
    status: "not-contacted",
    hasMissedCalls: false,
    completeness: 3,
    intent: "AED 1.5M · Apartment · Dubai",
    detail: { sla: { text: "< 5 min", level: "red" } },
    lastActivity: "Claimed 30m ago",
    lastActMins: 30,
    claimedMins: 30,
  },
  {
    id: 15,
    name: "Aisha Khan",
    source: "google-ads",
    status: "not-contacted",
    hasMissedCalls: false,
    completeness: 1,
    intent: "AED 3.0M · Residential · Dubai",
    detail: { sla: { text: "< 5 min", level: "amber" } },
    lastActivity: "Claimed 2m ago",
    lastActMins: 2,
    claimedMins: 2,
  },
];

const NURTURE_LEADS: NurtureLead[] = [
  {
    id: 20,
    name: "James Wilson",
    source: "better-homes",
    reason: "Disqualified",
    reasonNote: "DBR too high at 58%",
    intent: "AED 5.5M · Villa · Dubai",
    reengageDays: 45,
    previouslyPresented: null,
  },
  {
    id: 21,
    name: "Layla Al Farsi",
    source: "meta-ads",
    reason: "Lost",
    reasonNote: "Chose competitor offer",
    intent: "AED 2.0M · Apartment · Abu Dhabi",
    reengageDays: 8,
    previouslyPresented: 3,
  },
  {
    id: 22,
    name: "Karim Abdallah",
    source: "al-futtaim",
    reason: "Lost",
    reasonNote: "Not ready to proceed",
    intent: "AED 3.8M · Residential · Dubai",
    reengageDays: 21,
    previouslyPresented: 2,
  },
];

const DECLINED_LEADS: DeclinedLead[] = [
  {
    id: 40,
    name: "Faris Al Marzouqi",
    source: "google-ads",
    reason: "Unreachable",
    reasonNote: "12 attempts, phone disconnected",
    intent: "AED 1.2M · Apartment · Sharjah",
    declinedDate: "10 Apr 2026",
  },
  {
    id: 41,
    name: "Priya Sharma",
    source: "meta-ads",
    reason: "Ineligible",
    reasonNote: "DBR at 71%, unlikely to change",
    intent: "AED 950K · Residential · Sharjah",
    declinedDate: "2 Apr 2026",
  },
];

// ── Source config ───────────────────────────────────────────────────────────────
const SOURCE_CLS: Record<Source, string> = {
  "google-ads": "bg-[#E8F0FE] text-[#1A56DB]",
  "meta-ads": "bg-[#EDE9FB] text-[#5B21B6]",
  "al-futtaim": "bg-[#E1F5EE] text-[#085041]",
  emaar: "bg-[#FEF3E2] text-[#92400E]",
  "better-homes": "bg-[#FCE7F3] text-[#9D174D]",
  direct: "bg-[#F1EFE8] text-[#444441]",
};
const SOURCE_LABEL: Record<Source, string> = {
  "google-ads": "Google Ads",
  "meta-ads": "Meta Ads",
  "al-futtaim": "Al Futtaim",
  emaar: "Emaar",
  "better-homes": "Better Homes",
  direct: "Direct",
};
const ALL_SOURCE_OPTIONS = [
  { value: "all", label: "All Sources" },
  { value: "google-ads", label: "Google Ads" },
  { value: "meta-ads", label: "Meta Ads" },
  { value: "al-futtaim", label: "Al Futtaim" },
  { value: "emaar", label: "Emaar" },
  { value: "better-homes", label: "Better Homes" },
  { value: "direct", label: "Direct" },
];

// ── Pill helpers ────────────────────────────────────────────────────────────────
const PILL = "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap";
const STATUS_CLS: Record<Status, string> = {
  "not-contacted": "bg-[#FAEEDA] text-[#633806]",
  "in-progress": "bg-[#EEEDFE] text-[#3C3489]",
  qualified: "bg-[#EAF3DE] text-[#27500A]",
  presented: "bg-[#E1F5EE] text-[#085041]",
};
const STATUS_LABEL: Record<Status, string> = {
  "not-contacted": "Not contacted",
  "in-progress": "In progress",
  qualified: "Qualified",
  presented: "Presented",
};
const SLA_CLS: Record<SlaLevel, string> = {
  green: "bg-[#EAF3DE] text-[#27500A]",
  amber: "bg-[#FAEEDA] text-[#633806]",
  red: "bg-[#FCEBEB] text-[#791F1F]",
};

const SourcePill = ({ source }: { source: Source }) => (
  <span className={cn(PILL, SOURCE_CLS[source])}>{SOURCE_LABEL[source]}</span>
);
const StatusPill = ({ status }: { status: Status }) => (
  <span className={cn(PILL, STATUS_CLS[status])}>{STATUS_LABEL[status]}</span>
);
const SlaPill = ({ text, level }: { text: string; level: SlaLevel }) => (
  <span className={cn(PILL, SLA_CLS[level])}>{text}</span>
);
const Empty = () => <span className="text-muted-foreground/40 text-sm">—</span>;

const IconButton = ({
  onClick,
  label,
  children,
}: {
  onClick?: (e: React.MouseEvent) => void;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.(e);
    }}
    aria-label={label}
    title={label}
    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
  >
    {children}
  </button>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const SlaCell = ({ detail }: { detail: MineDetail }) => {
  if (detail.sla) return <SlaPill text={detail.sla.text} level={detail.sla.level} />;
  return <Empty />;
};

const TH = ({ children, right }: { children: React.ReactNode; right?: boolean }) => (
  <th
    className={cn(
      "py-3 px-4 text-[11px] font-medium text-muted-foreground uppercase tracking-wide border-b border-border",
      right ? "text-right" : "text-left",
    )}
  >
    {children}
  </th>
);
const EmptyRow = ({ cols, label }: { cols: number; label: string }) => (
  <tr>
    <td colSpan={cols} className="py-16 text-center text-sm text-muted-foreground">
      {label}
    </td>
  </tr>
);

const FlagsCell = ({ lead }: { lead: MineLead }) => (
  <div className="flex items-center gap-1 flex-wrap">
    {lead.fromNurture && (
      <span className={cn(PILL, "bg-[#EEEDFE] text-[#3C3489] gap-1")}>
        <RotateCw className="w-3 h-3" />
        Nurtured
      </span>
    )}
    {lead.hasMissedCalls && <span className={cn(PILL, "bg-[#FCEBEB] text-[#791F1F]")}>Missed calls</span>}
    {!lead.fromNurture && !lead.hasMissedCalls && <Empty />}
  </div>
);

// ── Auto-resize note textarea ──────────────────────────────────────────────────
const NoteInput = () => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const resize = () => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  };
  return (
    <div className="relative mt-3">
      <textarea
        ref={ref}
        rows={1}
        onInput={resize}
        placeholder="Add a note…"
        className="w-full resize-none overflow-hidden rounded-md border border-border bg-card px-3 py-2 pb-8 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <div className="absolute bottom-2 right-2 flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (ref.current) {
              ref.current.value = "";
              resize();
            }
          }}
          className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
          title="Cancel"
        >
          <X className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-5 h-5 rounded flex items-center justify-center bg-foreground text-background"
          title="Save note"
        >
          <Check className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// ── Active expanded row ─────────────────────────────────────────────────────────
// Two changes here:
//   1. Label: "Actions" → "More actions"
//   2. Convert button text: "Convert to client" → "Convert" + whitespace-nowrap removed
//      Root cause of the horizontal scroll: "Convert to client" with nowrap forced the
//      button ~130px wide against its flex-1 allocation of ~85px, which pushed the right
//      column past its w-72 boundary, which widened the td, which widened the table.
//      "Convert" fits cleanly inside flex-1 so the right column stays at 288px and notes
//      (flex-1 min-w-0) just shrinks to compensate. Total table width unchanged.
const ActiveExpandedRow = ({ lead, onViewFull }: { lead: MineLead; onViewFull: () => void }) => {
  const canConvert = lead.status === "qualified" || lead.status === "presented";
  const hasBanks = lead.detail.bankNames && lead.detail.bankNames.length > 0;
  const notes = lead.notes ?? [];

  return (
    <tr>
      <td colSpan={8} className="p-0 border-b border-border bg-muted/20" onClick={(e) => e.stopPropagation()}>
        <div className="flex">
          {/* Left — Notes (flex-1 auto-shrinks when right column grows) */}
          <div className="flex-1 min-w-0 px-4 py-4 border-r border-border">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Notes{notes.length > 0 ? ` · ${notes.length}` : ""}
            </p>
            {notes.length > 0 ? (
              <div className="max-h-40 overflow-y-auto flex flex-col gap-2 pr-1">
                {notes.map((n, i) => (
                  <div key={i} className="pb-2 border-b border-border last:border-0 last:pb-0">
                    <span className="text-xs font-medium text-foreground">{n.author}</span>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.text}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/50 italic mb-1">No notes yet</p>
            )}
            <NoteInput />
          </div>

          {/* Right — More actions + Profile + Banks (w-72 = 288px) */}
          <div className="w-72 flex-shrink-0 px-4 py-4 flex flex-col gap-4">
            {/* More actions — three buttons in one line */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">More actions</p>
              <div className="flex gap-2">
                {canConvert && (
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1 px-2.5 py-2 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    <Check className="w-3 h-3 flex-shrink-0" />
                    Convert
                  </button>
                )}
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1 px-2.5 py-2 rounded-md border border-[#AFA9EC] text-[#3C3489] text-xs font-medium hover:bg-[#EEEDFE] transition-colors"
                >
                  <RotateCw className="w-3 h-3 flex-shrink-0" />
                  Nurture
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center px-2.5 py-2 rounded-md border border-[#F09595] text-[#791F1F] text-xs font-medium hover:bg-[#FCEBEB] transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>

            {/* Profile */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Profile</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewFull();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-border bg-card hover:border-border/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", COMPLETENESS_BAR[lead.completeness])}
                      style={{ width: `${COMPLETENESS_PCT[lead.completeness]}%` }}
                    />
                  </div>
                  <span className={cn("text-xs font-medium", COMPLETENESS_COLOR[lead.completeness])}>
                    {COMPLETENESS_LABEL[lead.completeness]}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">View full →</span>
              </button>
            </div>

            {/* Banks — only when matched */}
            {hasBanks && (
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-2">Banks</p>
                <div className="flex flex-col gap-1">
                  {lead.detail.bankNames!.map((bank) => (
                    <div
                      key={bank}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border bg-card text-xs text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#27500A] flex-shrink-0" />
                      {bank}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

// ── Not Contacted Table ──────────────────────────────────────────────────────────
const NotContactedTable = ({ leads }: { leads: MineLead[] }) => (
  <table className="w-full">
    <thead>
      <tr>
        <TH>Name</TH>
        <TH>Source</TH>
        <TH>SLA</TH>
        <TH>Flags</TH>
        <TH>Intent</TH>
        <TH>Banks</TH>
        <TH>Profile</TH>
        <TH right>Actions</TH>
      </tr>
    </thead>
    <tbody>
      {leads.length === 0 ? (
        <EmptyRow cols={8} label="No leads waiting to be contacted" />
      ) : (
        leads.map((l) => (
          <tr
            key={l.id}
            className="border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
          >
            <td className="py-3 px-4">
              <div className="font-medium text-sm text-foreground">{l.name}</div>
            </td>
            <td className="py-3 px-4">
              <SourcePill source={l.source} />
            </td>
            <td className="py-3 px-4">
              <SlaCell detail={l.detail} />
            </td>
            <td className="py-3 px-4">
              <FlagsCell lead={l} />
            </td>
            <td className="py-3 px-4">
              <span className="text-sm text-muted-foreground">{l.intent}</span>
            </td>
            <td className="py-3 px-4">
              <Empty />
            </td>
            <td className="py-3 px-4">
              <Empty />
            </td>
            <td className="py-3 px-4">
              <div className="flex items-center justify-end gap-1">
                <IconButton label={`Call ${l.name}`}>
                  <PhoneIcon />
                </IconButton>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

// ── Active Table ─────────────────────────────────────────────────────────────────
const ActiveTable = ({
  leads,
  expandedId,
  onToggle,
  onViewFull,
}: {
  leads: MineLead[];
  expandedId: number | null;
  onToggle: (id: number) => void;
  onViewFull: (id: number) => void;
}) => (
  <table className="w-full">
    <thead>
      <tr>
        <TH>Name</TH>
        <TH>Source</TH>
        <TH>Status</TH>
        <TH>Flags</TH>
        <TH>Intent</TH>
        <TH>Banks</TH>
        <TH>Profile</TH>
        <TH right>Actions</TH>
      </tr>
    </thead>
    <tbody>
      {leads.length === 0 ? (
        <EmptyRow cols={8} label="No active leads" />
      ) : (
        leads.map((l) => {
          const isOpen = expandedId === l.id;
          return (
            <Fragment key={l.id}>
              <tr
                className={cn(
                  "border-b border-border last:border-0 cursor-pointer transition-colors",
                  isOpen ? "bg-muted/40" : "hover:bg-muted/40",
                )}
                onClick={() => onToggle(l.id)}
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-sm text-foreground">{l.name}</div>
                </td>
                <td className="py-3 px-4">
                  <SourcePill source={l.source} />
                </td>
                <td className="py-3 px-4">
                  <StatusPill status={l.status} />
                </td>
                <td className="py-3 px-4">
                  <FlagsCell lead={l} />
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-muted-foreground">{l.intent}</span>
                </td>
                <td className="py-3 px-4">
                  {(l.status === "qualified" || l.status === "presented") && l.detail?.banks != null ? (
                    <span className="text-sm text-muted-foreground">{l.detail.banks} banks</span>
                  ) : (
                    <Empty />
                  )}
                </td>
                <td className="py-3 px-4">
                  <Empty />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    <IconButton label={`Call ${l.name}`}>
                      <PhoneIcon />
                    </IconButton>
                    <IconButton label={`Send client form to ${l.name}`}>
                      <Send className="w-4 h-4" />
                    </IconButton>
                  </div>
                </td>
              </tr>
              {isOpen && <ActiveExpandedRow lead={l} onViewFull={() => onViewFull(l.id)} />}
            </Fragment>
          );
        })
      )}
    </tbody>
  </table>
);

// ── Nurture Table ────────────────────────────────────────────────────────────────
const NurtureTable = ({ leads }: { leads: NurtureLead[] }) => (
  <table className="w-full">
    <thead>
      <tr>
        <TH>Name</TH>
        <TH>Source</TH>
        <TH>Reason</TH>
        <TH>Intent</TH>
        <TH>Re-engage</TH>
        <TH>Previously presented</TH>
        <TH right>Actions</TH>
      </tr>
    </thead>
    <tbody>
      {leads.map((l) => (
        <tr
          key={l.id}
          className="border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
        >
          <td className="py-3 px-4">
            <div className="font-medium text-sm text-foreground">{l.name}</div>
          </td>
          <td className="py-3 px-4">
            <SourcePill source={l.source} />
          </td>
          <td className="py-3 px-4">
            <span
              className={cn(
                PILL,
                l.reason === "Disqualified" ? "bg-[#FAEEDA] text-[#633806]" : "bg-[#FCEBEB] text-[#791F1F]",
              )}
            >
              {l.reason}
            </span>
            <div className="text-xs text-muted-foreground mt-1">{l.reasonNote}</div>
          </td>
          <td className="py-3 px-4">
            <span className="text-sm text-muted-foreground">{l.intent}</span>
          </td>
          <td className="py-3 px-4">
            <span className={cn(PILL, "bg-[#F1EFE8] text-[#444441]")}>{l.reengageDays} days</span>
          </td>
          <td className="py-3 px-4">
            {l.previouslyPresented !== null ? (
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{l.previouslyPresented}</span> banks
              </span>
            ) : (
              <span className="text-muted-foreground/40 text-sm">—</span>
            )}
          </td>
          <td className="py-3 px-4">
            <div className="flex items-center justify-end gap-1">
              <IconButton label={`Call ${l.name}`}>
                <PhoneIcon />
              </IconButton>
              <IconButton label={`Re-engage ${l.name}`}>
                <RotateCw className="w-4 h-4" />
              </IconButton>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ── Declined Table ────────────────────────────────────────────────────────────────
const DeclinedTable = ({ leads }: { leads: DeclinedLead[] }) => (
  <table className="w-full">
    <thead>
      <tr>
        <TH>Name</TH>
        <TH>Source</TH>
        <TH>Reason</TH>
        <TH>Intent</TH>
        <TH right>Declined</TH>
      </tr>
    </thead>
    <tbody>
      {leads.length === 0 ? (
        <EmptyRow cols={5} label="No declined leads" />
      ) : (
        leads.map((l) => (
          <tr
            key={l.id}
            className="border-b border-border last:border-0 hover:bg-muted/40 cursor-pointer transition-colors"
          >
            <td className="py-3 px-4">
              <div className="font-medium text-sm text-foreground">{l.name}</div>
            </td>
            <td className="py-3 px-4">
              <SourcePill source={l.source} />
            </td>
            <td className="py-3 px-4">
              <span className={cn(PILL, "bg-[#FCEBEB] text-[#791F1F]")}>{l.reason}</span>
              <div className="text-xs text-muted-foreground mt-1">{l.reasonNote}</div>
            </td>
            <td className="py-3 px-4">
              <span className="text-sm text-muted-foreground">{l.intent}</span>
            </td>
            <td className="py-3 px-4 text-right">
              <span className="text-xs text-muted-foreground">{l.declinedDate}</span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);

// ── Shared UI ────────────────────────────────────────────────────────────────────
const FilterSelect = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="px-3 py-1.5 text-xs border border-border rounded-md bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);
const SearchInput = () => (
  <input
    type="text"
    placeholder="Search name"
    className="px-3 py-1.5 text-xs border border-border rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring w-52"
  />
);
const ControlBar = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-3 flex items-center gap-2 border-b border-border flex-wrap">{children}</div>
);
const Strip = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-2 bg-muted/30 border-b border-border flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
    {children}
  </div>
);

const TABS: { key: LeadTab; label: string }[] = [
  { key: "not-contacted", label: "Not contacted" },
  { key: "active", label: "Active" },
  { key: "nurture", label: "Nurture" },
  { key: "declined", label: "Declined" },
];

// ── Main ──────────────────────────────────────────────────────────────────────────
const Index = () => {
  const [tab, setTab] = useState<LeadTab>("not-contacted");
  const [activeSort, setActiveSort] = useState("urgency");
  const [activeSource, setActiveSource] = useState("all");
  const [expandedActiveId, setExpandedActiveId] = useState<number | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const notContactedLeads = useMemo(() => BASE_MINE_LEADS.filter((l) => l.status === "not-contacted"), []);
  const allActiveLeads = useMemo(() => BASE_MINE_LEADS.filter((l) => l.status !== "not-contacted"), []);

  const filteredActive = useMemo(() => {
    let rows = allActiveLeads.slice();
    if (activeSource !== "all") rows = rows.filter((l) => l.source === activeSource);
    if (activeSort === "urgency")
      return [...rows].sort((a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status]);
    if (activeSort === "activity") return [...rows].sort((a, b) => b.lastActMins - a.lastActMins);
    if (activeSort === "claimed-old") return [...rows].sort((a, b) => b.claimedMins - a.claimedMins);
    return [...rows].sort((a, b) => a.claimedMins - b.claimedMins);
  }, [allActiveLeads, activeSort, activeSource]);

  const qualifiedCount = allActiveLeads.filter((l) => l.status === "qualified").length;
  const presentedCount = allActiveLeads.filter((l) => l.status === "presented").length;
  const nurturedCount = allActiveLeads.filter((l) => l.fromNurture).length;
  const slaAtRiskCount = notContactedLeads.filter((l) => l.detail.sla?.level === "red").length;
  const handleToggleActive = (id: number) => setExpandedActiveId((prev) => (prev === id ? null : id));

  return (
    <RivoLayout>
      <div className="bg-card rounded-lg border border-border min-h-[calc(100vh-7rem)] flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and convert incoming leads</p>
        </div>
        <div className="flex flex-col flex-1">
          <div className="px-6 py-3 flex items-center border-b border-border">
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              {TABS.map((t, i) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    i > 0 && "border-l border-border",
                    tab === t.key
                      ? "bg-foreground text-background"
                      : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {tab === "not-contacted" && (
            <>
              <ControlBar>
                <FilterSelect value="all" onChange={() => {}} options={ALL_SOURCE_OPTIONS} />
                <div className="ml-auto">
                  <SearchInput />
                </div>
              </ControlBar>
              <Strip>
                <span>
                  <span className="font-medium text-foreground">{notContactedLeads.length}</span> not contacted
                </span>
                {slaAtRiskCount > 0 && (
                  <span className="text-red-600">
                    <span className="font-medium">{slaAtRiskCount}</span> SLA at risk
                  </span>
                )}
              </Strip>
              <div className="flex-1 overflow-x-auto">
                <NotContactedTable leads={notContactedLeads} />
              </div>
            </>
          )}

          {tab === "active" && (
            <>
              <ControlBar>
                <FilterSelect value={activeSource} onChange={setActiveSource} options={ALL_SOURCE_OPTIONS} />
                <FilterSelect
                  value={activeSort}
                  onChange={setActiveSort}
                  options={[
                    { value: "urgency", label: "Most urgent" },
                    { value: "claimed-new", label: "Newest claimed" },
                    { value: "claimed-old", label: "Oldest claimed" },
                    { value: "activity", label: "Last activity" },
                  ]}
                />
                <div className="ml-auto">
                  <SearchInput />
                </div>
              </ControlBar>
              <Strip>
                <span>
                  <span className="font-medium text-foreground">{allActiveLeads.length}</span> active
                </span>
                {qualifiedCount > 0 && (
                  <span>
                    <span className="font-medium text-foreground">{qualifiedCount}</span> qualified
                  </span>
                )}
                {presentedCount > 0 && (
                  <span>
                    <span className="font-medium text-foreground">{presentedCount}</span> presented
                  </span>
                )}
                {nurturedCount > 0 && (
                  <span>
                    <span className="font-medium text-foreground">{nurturedCount}</span> from nurture
                  </span>
                )}
              </Strip>
              <div className="flex-1 overflow-x-auto">
                <ActiveTable
                  leads={filteredActive}
                  expandedId={expandedActiveId}
                  onToggle={handleToggleActive}
                  onViewFull={() => setProfileOpen(true)}
                />
              </div>
            </>
          )}

          {tab === "nurture" && (
            <>
              <ControlBar>
                <FilterSelect value="all" onChange={() => {}} options={ALL_SOURCE_OPTIONS} />
                <div className="ml-auto">
                  <SearchInput />
                </div>
              </ControlBar>
              <Strip>
                <span>
                  <span className="font-medium text-foreground">{NURTURE_LEADS.length}</span> in nurture
                </span>
              </Strip>
              <div className="flex-1 overflow-x-auto">
                <NurtureTable leads={NURTURE_LEADS} />
              </div>
            </>
          )}

          {tab === "declined" && (
            <>
              <ControlBar>
                <FilterSelect
                  value="all"
                  onChange={() => {}}
                  options={[
                    { value: "all", label: "All Reasons" },
                    { value: "unreachable", label: "Unreachable" },
                    { value: "ineligible", label: "Ineligible" },
                  ]}
                />
                <div className="ml-auto">
                  <SearchInput />
                </div>
              </ControlBar>
              <Strip>
                <span>
                  <span className="font-medium text-foreground">{DECLINED_LEADS.length}</span> declined
                </span>
              </Strip>
              <div className="flex-1 overflow-x-auto">
                <DeclinedTable leads={DECLINED_LEADS} />
              </div>
            </>
          )}
        </div>
      </div>
      <LeadProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} />
    </RivoLayout>
  );
};

export default Index;
