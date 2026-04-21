import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SigningDocument {
  id: string;
  name: string;
  bank: string;
  dateReceived: string;
  signatureCount: number;
}

interface SigningModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (signedIds: string[]) => void;
  documents: SigningDocument[];
  bankName: string;
  onGoHome: () => void;
  onContinueSigning: () => void;
  hasPendingOtherBanks: boolean;
}

type DocStatus = "pending" | "signed";

const PLACEHOLDER_PARAGRAPHS = [
  'This Mortgage Agreement ("Agreement") is entered into as of the date set forth below, by and between the Lender identified herein and the Borrower(s) named below. This Agreement sets forth the terms and conditions under which the Lender agrees to provide a mortgage loan to the Borrower for the purchase of the property described herein.',
  "The Borrower agrees to repay the principal amount of the loan together with interest at the rate specified in the attached schedule. Payments shall be made in equal monthly instalments over the term of the loan, commencing on the first day of the month following the disbursement of funds.",
  "The Borrower acknowledges that the property described in Schedule A shall serve as collateral for this loan. In the event of default, the Lender reserves the right to initiate foreclosure proceedings in accordance with applicable law.",
  "The Borrower represents and warrants that all information provided in connection with this loan application is true, complete, and accurate. Any material misrepresentation may result in the immediate acceleration of the loan balance.",
  "This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the property is located. Any disputes arising under this Agreement shall be resolved through binding arbitration.",
  "The Borrower agrees to maintain adequate insurance coverage on the property for the duration of the loan term. Proof of insurance must be provided to the Lender annually and upon request.",
];

const SigningModal = ({
  open,
  onClose,
  onComplete,
  documents,
  bankName,
  onGoHome,
  onContinueSigning,
  hasPendingOtherBanks,
}: SigningModalProps) => {
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [docStatuses, setDocStatuses] = useState<Record<string, DocStatus>>({});
  const [allComplete, setAllComplete] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveDocIndex(0);
      const statuses: Record<string, DocStatus> = {};
      documents.forEach((d) => {
        statuses[d.id] = "pending";
      });
      setDocStatuses(statuses);
      setAllComplete(false);
      setAdvancing(false);
    }
  }, [open, bankName]);

  const activeDoc = documents[activeDocIndex];
  const signedCount = Object.values(docStatuses).filter((s) => s === "signed").length;
  const progressPct = documents.length > 0 ? (signedCount / documents.length) * 100 : 0;

  const handleClose = () => {
    const signedIds = documents.filter((d) => docStatuses[d.id] === "signed").map((d) => d.id);
    if (signedIds.length > 0) onComplete(signedIds);
    onClose();
  };

  const handleDocumentClick = () => {
    if (!activeDoc || advancing || docStatuses[activeDoc.id] === "signed") return;
    const updatedStatuses = { ...docStatuses, [activeDoc.id]: "signed" as DocStatus };
    setDocStatuses(updatedStatuses);
    setAdvancing(true);
    const allSigned = documents.every((d) => updatedStatuses[d.id] === "signed");
    setTimeout(() => {
      setAdvancing(false);
      if (allSigned) {
        setAllComplete(true);
        onComplete(documents.map((d) => d.id));
      } else {
        const nextIndex = documents.findIndex((d, i) => i !== activeDocIndex && updatedStatuses[d.id] !== "signed");
        if (nextIndex !== -1) setActiveDocIndex(nextIndex);
      }
    }, 1200);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div
        className="relative z-10 bg-card rounded-lg shadow-xl flex flex-col overflow-hidden"
        style={{ width: 1180, height: 680 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 border-b border-border shrink-0" style={{ height: 48 }}>
          <p className="font-heading text-sm font-semibold text-foreground">{bankName} — Documents to Sign</p>
          <div className="flex items-center gap-4">
            <span className="font-body text-xs text-muted-foreground">
              {signedCount} of {documents.length} signed
            </span>
            <Progress value={progressPct} className="w-28 h-2" />
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0">
          {/* Left panel — Document list */}
          <div className="shrink-0 bg-secondary border-r border-border flex flex-col" style={{ width: 200 }}>
            <div className="px-4 pt-4 pb-2">
              <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                Documents
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-2">
              {documents.map((doc, idx) => {
                const status = docStatuses[doc.id] || "pending";
                const isActive = idx === activeDocIndex;
                const isSigned = status === "signed";
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      if (!advancing) setActiveDocIndex(idx);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-sm flex items-start gap-2.5 transition-colors ${
                      isActive
                        ? "bg-primary/10 border-l-2 border-primary"
                        : "border-l-2 border-transparent hover:bg-muted"
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                        isSigned ? "bg-primary" : "border border-border"
                      }`}
                    >
                      {isSigned && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`font-body text-xs leading-tight ${isSigned ? "text-primary font-medium" : "text-foreground"}`}
                        style={{ fontWeight: 500 }}
                      >
                        {doc.name}
                      </p>
                      <p
                        className={`font-body mt-0.5 ${isSigned ? "text-primary" : "text-muted-foreground"}`}
                        style={{ fontSize: 10 }}
                      >
                        {isSigned ? "Signed" : "Pending"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center panel */}
          <div className="flex-1 flex flex-col min-h-0">
            {!allComplete ? (
              <>
                {activeDoc && (
                  <div
                    className="flex items-center justify-between px-5 border-b border-border bg-secondary shrink-0"
                    style={{ height: 44 }}
                  >
                    <p className="font-body text-xs text-foreground font-medium">{activeDoc.name}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      {activeDoc.bank} · {activeDoc.dateReceived}
                    </p>
                  </div>
                )}
                <div className="flex-1 overflow-y-scroll p-6 bg-muted/30">
                  <div
                    className="bg-card rounded-lg border border-border p-8 max-w-2xl mx-auto relative"
                    style={{ cursor: advancing || docStatuses[activeDoc?.id] === "signed" ? "default" : "pointer" }}
                    onClick={handleDocumentClick}
                  >
                    <h3 className="font-heading text-base font-bold text-foreground mb-4">{activeDoc?.name}</h3>
                    {PLACEHOLDER_PARAGRAPHS.map((p, i) => (
                      <p key={i} className="font-body text-xs text-foreground/80 leading-relaxed mb-3">
                        {p}
                      </p>
                    ))}
                    {!advancing && activeDoc && docStatuses[activeDoc.id] !== "signed" && (
                      <p className="font-body text-[10px] text-muted-foreground text-center mt-6">
                        Click anywhere on the document to sign
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Completion state */
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-7 w-7 text-primary-foreground" />
                </div>
                {hasPendingOtherBanks ? (
                  <>
                    <h2 className="font-heading text-xl font-bold text-foreground">All {bankName} documents signed</h2>
                    <p className="font-body text-sm text-muted-foreground text-center max-w-md">
                      You have pending documents with other banks. Head back to continue signing.
                    </p>
                    <button
                      onClick={onContinueSigning}
                      className="mt-4 w-full max-w-xs font-body text-[11px] font-semibold cursor-pointer rounded-sm px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Continue Signing
                    </button>
                    <button
                      onClick={onGoHome}
                      className="w-full max-w-xs font-body text-[11px] font-semibold cursor-pointer rounded-sm px-6 py-2.5 border border-border text-foreground hover:bg-muted transition-colors"
                    >
                      Go Home
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-heading text-xl font-bold text-foreground">All documents signed</h2>
                    <p className="font-body text-sm text-muted-foreground text-center max-w-md">
                      You've signed all your documents. They are saved in the Signed tab.
                    </p>
                    <button
                      onClick={onGoHome}
                      className="mt-4 w-full max-w-xs font-body text-[11px] font-semibold cursor-pointer rounded-sm px-6 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Go Home
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigningModal;
