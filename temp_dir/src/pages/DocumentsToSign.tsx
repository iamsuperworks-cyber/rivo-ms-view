import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SigningModal from "@/components/SigningModal";

interface FormItem {
  id: string;
  name: string;
  bank: string;
  dateReceived: string;
  signed: boolean;
  dateSigned?: string;
  signatureCount: number;
}

const initialForms: FormItem[] = [
  { id: "1", name: "Mortgage Agreement", bank: "Nordea", dateReceived: "2 Apr 2026", signed: false, signatureCount: 2 },
  {
    id: "2",
    name: "Direct Debit Mandate",
    bank: "Nordea",
    dateReceived: "2 Apr 2026",
    signed: false,
    signatureCount: 1,
  },
  {
    id: "3",
    name: "Insurance Consent Form",
    bank: "Nordea",
    dateReceived: "3 Apr 2026",
    signed: false,
    signatureCount: 1,
  },
  { id: "4", name: "Loan Offer Letter", bank: "SEB", dateReceived: "1 Apr 2026", signed: false, signatureCount: 2 },
  {
    id: "5",
    name: "Property Valuation Acknowledgement",
    bank: "SEB",
    dateReceived: "1 Apr 2026",
    signed: false,
    signatureCount: 1,
  },
  {
    id: "6",
    name: "Credit Agreement",
    bank: "Swedbank",
    dateReceived: "31 Mar 2026",
    signed: false,
    signatureCount: 1,
  },
];

const groupByBank = (forms: FormItem[]) => {
  const groups: Record<string, FormItem[]> = {};
  forms.forEach((f) => {
    if (!groups[f.bank]) groups[f.bank] = [];
    groups[f.bank].push(f);
  });
  return groups;
};

const DocumentsToSign = () => {
  const [forms, setForms] = useState<FormItem[]>(initialForms);
  const [signingBank, setSigningBank] = useState<string | null>(null);

  const navigate = useNavigate();

  const pendingForms = forms.filter((f) => !f.signed);
  const signedForms = forms.filter((f) => f.signed);
  const pendingGroups = groupByBank(pendingForms);
  const signedGroups = groupByBank(signedForms);

  const handleReviewBank = (bank: string) => {
    setSigningBank(bank);
  };

  const bankDocsForModal = signingBank ? forms.filter((f) => f.bank === signingBank && !f.signed) : [];

  const hasPendingOtherBanks = signingBank ? forms.some((f) => f.bank !== signingBank && !f.signed) : false;

  const handleModalComplete = (signedIds: string[]) => {
    setForms((prev) =>
      prev.map((f) =>
        signedIds.includes(f.id)
          ? {
              ...f,
              signed: true,
              dateSigned: new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            }
          : f,
      ),
    );
  };

  const handleContinueSigning = () => {
    const nextBank = Object.keys(groupByBank(forms.filter((f) => !f.signed))).find((b) => b !== signingBank);
    if (nextBank) setSigningBank(nextBank);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">
      {/* Header */}
      <div className="max-w-6xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
          Documents to Sign
        </h1>
        <p className="font-body text-secondary-foreground text-base leading-relaxed max-w-xl mb-6">
          Review and sign your bank forms. Signed documents are stored in your history.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left: Tabs */}
        <div className="flex-1 min-w-0">
          <Tabs defaultValue="pending">
            <TabsList className="bg-transparent p-0 h-auto gap-8 mb-6">
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground font-heading text-sm tracking-wide uppercase px-0 py-1 rounded-none border-b-2 data-[state=active]:border-primary data-[state=inactive]:border-transparent"
              >
                Pending
                <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0 h-5 min-w-[1.25rem] justify-center">
                  {pendingForms.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="signed"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground font-heading text-sm tracking-wide uppercase px-0 py-1 rounded-none border-b-2 data-[state=active]:border-primary data-[state=inactive]:border-transparent"
              >
                Signed
              </TabsTrigger>
            </TabsList>

            {/* Pending Tab */}
            <TabsContent value="pending">
              {pendingForms.length === 0 ? (
                <div className="py-12">
                  <p className="font-body text-muted-foreground text-sm">
                    No pending documents. All signed documents are in the Signed tab.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(pendingGroups).map(([bank, bankForms], groupIdx) => (
                    <section
                      key={bank}
                      className="px-4 py-3 -mx-4 rounded-sm"
                      style={{ backgroundColor: groupIdx % 2 === 0 ? "#FFFFFF" : "#F7F6F4" }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p
                          className="font-body uppercase tracking-widest"
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "rgb(26, 26, 26)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {bank}
                        </p>
                        <button
                          onClick={() => handleReviewBank(bank)}
                          className="font-body text-[12px] font-semibold cursor-pointer shrink-0 rounded-sm px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1.5"
                          style={{ width: "83.25px", height: "30px" }}
                        >
                          <Eye className="h-3 w-3" />
                          Review
                        </button>
                      </div>
                      <div>
                        {bankForms.map((form, idx) => (
                          <div
                            key={form.id}
                            className={`py-3 ${idx < bankForms.length - 1 ? "border-b border-border/40" : ""}`}
                          >
                            <p className="font-body text-foreground text-sm" style={{ fontWeight: 500 }}>
                              {form.name}
                            </p>
                            <p className="font-body text-muted-foreground text-xs mt-0.5">
                              Received {form.dateReceived}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Signed Tab */}
            <TabsContent value="signed">
              {signedForms.length === 0 ? (
                <div className="py-12">
                  <p className="font-body text-muted-foreground text-sm">
                    No signed documents yet. Documents you sign will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(signedGroups).map(([bank, bankForms], groupIdx) => (
                    <section
                      key={bank}
                      className="px-4 py-3 -mx-4 rounded-sm"
                      style={{ backgroundColor: groupIdx % 2 === 0 ? "#FFFFFF" : "#F7F6F4" }}
                    >
                      <p
                        className="font-body uppercase tracking-widest"
                        style={{ fontSize: "16px", fontWeight: 600, color: "rgb(26, 26, 26)", letterSpacing: "0.05em" }}
                      >
                        {bank}
                      </p>
                      <div>
                        {bankForms.map((form, idx) => (
                          <div
                            key={form.id}
                            className={`py-3 flex items-center justify-between gap-4 ${
                              idx < bankForms.length - 1 ? "border-b border-border/40" : ""
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-foreground text-sm" style={{ fontWeight: 500 }}>
                                {form.name}
                              </p>
                              <p className="font-body text-muted-foreground text-xs mt-0.5">Signed {form.dateSigned}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className="inline-flex items-center rounded-full text-white"
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 500,
                                  backgroundColor: "#1D9E75",
                                  padding: "4px 12px",
                                  borderRadius: "20px",
                                }}
                              >
                                Signed
                              </span>
                              <button
                                className="font-body text-[12px] font-semibold cursor-pointer rounded-sm px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center gap-1.5"
                                style={{ width: "83.25px", height: "30px" }}
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </button>
                              <button
                                className="font-body text-[12px] font-semibold cursor-pointer rounded-sm px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                                style={{ height: "30px" }}
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Context panel */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-8 flex flex-col gap-6 lg:sticky lg:top-14 lg:self-start">
          <div className="bg-card border border-border rounded-lg px-6 py-5">
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Clicking Review opens the document for you to read. You will sign inside the document — nothing is signed
              automatically.
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="font-body text-muted-foreground text-sm leading-relaxed">
              Need help? Contact your mortgage specialist.
            </p>
          </div>
        </div>
      </div>

      {/* Signing Modal */}
      <SigningModal
        open={!!signingBank}
        onClose={() => setSigningBank(null)}
        onComplete={handleModalComplete}
        documents={bankDocsForModal}
        bankName={signingBank || ""}
        onGoHome={() => {
          setSigningBank(null);
          navigate("/");
        }}
        onContinueSigning={handleContinueSigning}
        hasPendingOtherBanks={hasPendingOtherBanks}
      />
    </div>
  );
};

export default DocumentsToSign;
