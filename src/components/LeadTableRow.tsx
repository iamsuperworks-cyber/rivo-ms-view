import type { EnrichedLead } from "@/types/enrichedLeads";
import { SimpleTooltip } from "@/components/SimpleTooltip";

// --- Dot color logic ---
function getDotColor(lead: EnrichedLead): string {
  if (lead.attempts === 0) return "#9CA3AF";
  if (lead.everConnected) return "#1D9E75";
  if (
    lead.lastOutcome === "no-answer" ||
    lead.lastOutcome === "not-reached" ||
    lead.lastOutcome === "wrong-number" ||
    (lead.attempts >= 5 && !lead.everConnected)
  )
    return "#E24B4A";
  return "#9CA3AF";
}

function getDotTooltip(lead: EnrichedLead): string {
  if (lead.attempts === 0) return "No calls made yet";
  if (lead.everConnected) return "MS has spoken to this lead at least once";
  return "Calls attempted — lead not yet reached";
}

// --- Stage label logic ---
function getStageInfo(lead: EnrichedLead): [string, boolean] {
  if (lead.attempts === 0) return ["Not Contacted", false];
  if (lead.attempts >= 5 && !lead.everConnected)
    return ["5 attempts — no connection · consider nurture or decline", true];
  if (lead.lastOutcome === "wrong-number" && !lead.everConnected)
    return [`Wrong number · ${lead.attempts} ${lead.attempts === 1 ? "attempt" : "attempts"}`, true];
  if (lead.lastOutcome === "no-answer" && !lead.everConnected)
    return [`No answer · ${lead.attempts} ${lead.attempts === 1 ? "attempt" : "attempts"}`, true];
  if (lead.lastOutcome === "not-reached" && !lead.everConnected)
    return [`Not reached · ${lead.attempts} ${lead.attempts === 1 ? "attempt" : "attempts"}`, true];
  if (lead.everConnected && lead.status === "declined") return ["Connected — Declined", false];
  if (lead.everConnected && lead.nurtureReason)
    return [`Called — ${lead.nurtureReason}`, false];
  if (lead.everConnected && lead.status === "nurture") return ["Called — moved to nurture", false];
  if (lead.everConnected && lead.qualFormStatus === "draft") {
    const dur = lead.connectedDuration;
    return [dur ? `Connected ${dur} min — qualification in progress` : "Connected — qualification in progress", false];
  }
  if (lead.everConnected) {
    const dur = lead.connectedDuration;
    return [dur ? `Connected ${dur} min` : "Connected", false];
  }
  return ["", false];
}

// --- Chip logic ---
interface ChipData {
  bg: string;
  border: string;
  text: string;
  label: string;
  tooltip: string;
}

function getChip(lead: EnrichedLead): ChipData | null {
  if (!lead.everConnected && lead.retryReminder) {
    return {
      bg: "#FAEEDA", border: "#FAC775", text: "#633806",
      label: `↻ Retry ${lead.retryReminder.date} at ${lead.retryReminder.time}`,
      tooltip: "MS set a reminder to call this lead back at this time",
    };
  }
  if (lead.status === "nurture" && lead.nurtureCallbackDate && lead.nurtureCallbackUrgency === "urgent") {
    return {
      bg: "#FCEBEB", border: "#F09595", text: "#791F1F",
      label: `🕐 ${lead.nurtureCallbackDate} · Urgent`,
      tooltip: "Callback is within 7 days — call this lead now",
    };
  }
  if (lead.status === "nurture" && lead.nurtureCallbackDate && lead.nurtureCallbackUrgency === "soon") {
    return {
      bg: "#FAEEDA", border: "#FAC775", text: "#633806",
      label: `🕐 ${lead.nurtureCallbackDate} · Soon`,
      tooltip: "Callback is within 30 days",
    };
  }
  if (lead.status === "nurture" && lead.nurtureCallbackDate && !lead.nurtureCallbackUrgency) {
    return {
      bg: "#FAEEDA", border: "#FAC775", text: "#633806",
      label: `🕐 ${lead.nurtureCallbackDate}`,
      tooltip: "Scheduled callback date",
    };
  }
  if (lead.status === "declined" && lead.declineCategory) {
    const chipLabel = lead.declineSubReason
      ? `${lead.declineCategory} — ${lead.declineSubReason}`
      : lead.declineCategory;
    return {
      bg: "#FCEBEB", border: "#F09595", text: "#791F1F",
      label: chipLabel,
      tooltip: "Reason this lead was declined — open lead to see full note",
    };
  }
  if (lead.attempts >= 5 && !lead.everConnected) {
    return {
      bg: "#FCEBEB", border: "#F09595", text: "#791F1F",
      label: "Threshold — consider nurture or decline",
      tooltip: "5+ attempts with no connection — MS should take action",
    };
  }
  return null;
}

// --- Status badge mapping ---
function getStatusTooltip(lead: EnrichedLead): string {
  switch (lead.status) {
    case "new": return "Not yet contacted";
    case "active": return "MS is actively working this lead";
    case "qualified": return "Confirmed eligible — ready to convert to applicant";
    case "nurture": {
      const parts: string[] = [];
      if (lead.nurtureReason) parts.push(`Reason: ${lead.nurtureReason}`);
      if (lead.nurtureCallbackDate) parts.push(`Follow up: ${lead.nurtureCallbackDate}`);
      return parts.length > 0 ? parts.join(" · ") : "Lead asked to be contacted later";
    }
    case "declined": {
      const parts: string[] = [];
      if (lead.declineCategory) {
        const reason = lead.declineSubReason
          ? `${lead.declineCategory} — ${lead.declineSubReason}`
          : lead.declineCategory;
        parts.push(`Declined: ${reason}`);
      }
      if (lead.declineNote) {
        const truncated = lead.declineNote.length > 80
          ? lead.declineNote.slice(0, 80) + "…"
          : lead.declineNote;
        parts.push(truncated);
      }
      return parts.length > 0 ? parts.join(" · ") : "Lead is not eligible";
    }
    default: return "";
  }
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "#F1EFE8", text: "#444441", label: "Not Contacted" },
  active: { bg: "#EDE9FF", text: "#3C3489", label: "Active" },
  qualified: { bg: "#EAF3DE", text: "#3B6D11", label: "Qualified" },
  nurture: { bg: "#FAEEDA", text: "#854F0B", label: "Nurture" },
  declined: { bg: "#FCEBEB", text: "#A32D2D", label: "Declined" },
};

// --- Deal pill tooltips ---
const PILL_TOOLTIPS = {
  type: "Property type the lead wants to buy or refinance",
  location: "Emirate where the property is located",
  value: "Estimated property value discussed on the call",
  timeline: "How soon the lead wants to close the mortgage",
};

const PILL_STYLES = {
  type: { bg: "#EDE9FF", color: "#3C3489" },
  location: { bg: "#E6F1FB", color: "#0C447C" },
  value: { bg: "#EAF3DE", color: "#27500A" },
  timeline: { bg: "#FAEEDA", color: "#633806" },
};

const DSA_PILL_STYLES = {
  loanPurpose: { bg: "#EDE9FF", color: "#3C3489" },
  income: { bg: "#EAF3DE", color: "#27500A" },
  loanAmount: { bg: "#E6F1FB", color: "#0C447C" },
  property: { bg: "#FAEEDA", color: "#633806" },
};

function formatIncome(amount: number): string {
  if (amount >= 1000) return `AED ${Math.round(amount / 1000)}K`;
  return `AED ${amount}`;
}

function formatLoanAmount(amount: number): string {
  if (amount >= 1000000) {
    const m = amount / 1000000;
    return `Loan: AED ${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (amount >= 1000) return `Loan: AED ${Math.round(amount / 1000)}K`;
  return `Loan: AED ${amount}`;
}

function getDsaPills(lead: EnrichedLead): Array<{ label: string; style: { bg: string; color: string } }> {
  if (!lead.dsaForm) return [];
  const pills: Array<{ label: string; style: { bg: string; color: string } }> = [];
  if (lead.dsaForm.loanPurpose) pills.push({ label: lead.dsaForm.loanPurpose, style: DSA_PILL_STYLES.loanPurpose });
  if (lead.dsaForm.monthlyIncome) pills.push({ label: formatIncome(lead.dsaForm.monthlyIncome), style: DSA_PILL_STYLES.income });
  if (lead.dsaForm.expectedLoanAmount) pills.push({ label: formatLoanAmount(lead.dsaForm.expectedLoanAmount), style: DSA_PILL_STYLES.loanAmount });
  if (lead.dsaForm.loanPurpose === "Purchase" && lead.dsaForm.propertyIdentified) {
    pills.push({ label: lead.dsaForm.propertyIdentified === "Yes, I have a property" ? "Property found" : "Still searching", style: DSA_PILL_STYLES.property });
  }
  return pills;
}

// --- Last activity urgency ---
function getActivityUrgency(lead: EnrichedLead): string | null {
  if (lead.attempts >= 5 && !lead.everConnected) return "Action needed";
  if (lead.lastOutcome === "wrong-number") return "Blocked";
  if (lead.status === "nurture" && lead.nurtureCallbackDate) {
    const d = lead.nurtureCallbackDate.toLowerCase();
    if (d === "today" || d === "overdue") return "Call today";
  }
  return null;
}

interface LeadTableRowProps {
  lead: EnrichedLead;
  onClick: () => void;
}

export const LeadTableRow = ({ lead, onClick }: LeadTableRowProps) => {
  const dotColor = getDotColor(lead);
  const dotTooltip = getDotTooltip(lead);
  const [stageLabel, labelIncludesAttempts] = getStageInfo(lead);
  const chip = getChip(lead);
  const badge = STATUS_BADGE[lead.status] ?? STATUS_BADGE.new;
  const statusTooltip = getStatusTooltip(lead);
  const urgency = getActivityUrgency(lead);
  const showTimelinePill = lead.dealPills && lead.status !== "declined";
  const dsaPills = getDsaPills(lead);

  return (
    <tr
      onClick={onClick}
      className="border-b border-border last:border-0 cursor-pointer transition-colors"
      style={{ backgroundColor: undefined }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFE")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
    >
      {/* NAME */}
      <td className="py-3 px-0">
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm text-foreground">{lead.name}</span>
          <div className="flex items-center gap-1.5">
            <SimpleTooltip text={dotTooltip}>
              <span
                className="inline-block rounded-full shrink-0 cursor-help"
                style={{ width: 6, height: 6, backgroundColor: dotColor }}
              />
            </SimpleTooltip>
            <span className="text-xs text-muted-foreground leading-tight">{stageLabel}</span>
            {lead.attempts > 0 && !labelIncludesAttempts && (
              <SimpleTooltip text="Number of times the MS has dialled this lead">
                <span className="text-[11px] leading-tight cursor-help" style={{ color: "#BBBBBB" }}>
                  · {lead.attempts} {lead.attempts === 1 ? "attempt" : "attempts"}
                </span>
              </SimpleTooltip>
            )}
          </div>
          {chip && (
            <SimpleTooltip text={chip.tooltip}>
              <span
                className="inline-flex items-center self-start cursor-help"
                style={{
                  backgroundColor: chip.bg,
                  border: `0.5px solid ${chip.border}`,
                  color: chip.text,
                  borderRadius: 2,
                  fontSize: 11,
                  padding: "2px 8px",
                  fontWeight: 500,
                  marginTop: 4,
                  gap: 4,
                }}
              >
                {chip.label}
              </span>
            </SimpleTooltip>
          )}
        </div>
      </td>

      {/* SOURCE */}
      <td className="py-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{lead.source}</span>
          {/* DSA form pills */}
          {dsaPills.length > 0 && lead.status === "new" && (
            <div className="flex flex-wrap gap-1">
              {dsaPills.slice(0, 4).map((pill) => (
                <Pill key={pill.label} style={pill.style}>{pill.label}</Pill>
              ))}
              {dsaPills.length > 4 && (
                <Pill style={{ bg: "#F1EFE8", color: "#444441" }}>+{dsaPills.length - 4}</Pill>
              )}
            </div>
          )}
          {/* Qualification deal pills */}
          {lead.dealPills && (
            <div className="flex flex-wrap gap-1">
              <SimpleTooltip text={PILL_TOOLTIPS.type}>
                <Pill style={PILL_STYLES.type}>{lead.dealPills.type}</Pill>
              </SimpleTooltip>
              <SimpleTooltip text={PILL_TOOLTIPS.location}>
                <Pill style={PILL_STYLES.location}>{lead.dealPills.location}</Pill>
              </SimpleTooltip>
              <SimpleTooltip text={PILL_TOOLTIPS.value}>
                <Pill style={PILL_STYLES.value}>{lead.dealPills.value}</Pill>
              </SimpleTooltip>
              {showTimelinePill && (
                <SimpleTooltip text={PILL_TOOLTIPS.timeline}>
                  <Pill style={PILL_STYLES.timeline}>
                    {lead.dealPills!.timeline.toLowerCase().includes("urgent")
                      ? "< 30 days"
                      : lead.dealPills!.timeline}
                  </Pill>
                </SimpleTooltip>
              )}
            </div>
          )}
        </div>
      </td>

      {/* STATUS */}
      <td className="py-3">
        <SimpleTooltip text={statusTooltip}>
          <span
            className="cursor-help"
            style={{
              backgroundColor: badge.bg,
              color: badge.text,
              padding: "3px 10px",
              borderRadius: 2,
              fontSize: 11,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {badge.label}
          </span>
        </SimpleTooltip>
      </td>

      {/* CREATED */}
      <td className="py-3 text-sm text-muted-foreground">{lead.created}</td>

      {/* LAST ACTIVITY */}
      <td className="py-3">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{lead.lastActivity}</span>
          {urgency && (
            <span className="text-[11px] font-medium" style={{ color: "#E24B4A" }}>
              {urgency}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

// Small pill component
function Pill({
  children,
  style,
}: {
  children: React.ReactNode;
  style: { bg: string; color: string };
}) {
  return (
    <span
      className="cursor-help"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "2px 7px",
        borderRadius: 2,
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}
