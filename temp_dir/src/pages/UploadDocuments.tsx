import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Eye, X, Upload, RefreshCw, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUpload } from "@/contexts/UploadContext";

type DocStatus = "not_uploaded" | "uploaded" | "wrong" | "error";

interface SubField {
  label: string;
  status: DocStatus;
  fileName?: string;
}

interface DocItem {
  id: string;
  name: string;
  status: DocStatus;
  fileName?: string;
  subFields?: SubField[];
  errorMessage?: string;
}

interface DocCategory {
  title: string;
  docs: DocItem[];
  /** If true, uploads in this category are always treated as wrong documents */
  smartValidation?: boolean;
  /** If true, each doc row gets its own upload button instead of a category-level one */
  individualUpload?: boolean;
}

const buildInitialCategories = (): DocCategory[] => [
  {
    title: "KYC Documents",
    smartValidation: true,
    docs: [
      { id: "passport", name: "Passport", status: "not_uploaded" },
      {
        id: "emirates-id",
        name: "Emirates ID",
        status: "not_uploaded",
        subFields: [
          { label: "Front", status: "not_uploaded" },
          { label: "Back", status: "not_uploaded" },
        ],
      },
      { id: "visa", name: "Visa", status: "not_uploaded" },
    ],
  },
  {
    title: "Income & Financial Documents",
    smartValidation: true,
    docs: [
      { id: "salary-cert", name: "Salary Certificate", status: "not_uploaded" },
      { id: "payslips", name: "Payslips (6 months)", status: "not_uploaded" },
      { id: "bank-statements", name: "Personal Bank Statements (6 months)", status: "not_uploaded" },
      { id: "cc-statements", name: "Credit Card Statements", status: "not_uploaded" },
      { id: "loan-statements", name: "Loan Statements", status: "not_uploaded" },
    ],
  },
  {
    title: "Additional Documents",
    individualUpload: true,
    docs: [
      { id: "edu-allowance", name: "Educational Allowance Proof", status: "not_uploaded" },
      { id: "rental-income", name: "Rental Income Proof", status: "not_uploaded" },
      { id: "ejari", name: "Ejari", status: "not_uploaded" },
      { id: "labor-card", name: "Labor Card", status: "not_uploaded" },
      { id: "labor-contract", name: "Labor Contract", status: "not_uploaded" },
      { id: "tenancy-contract", name: "Tenancy Contract", status: "not_uploaded" },
      { id: "title-deed", name: "Title Deed", status: "not_uploaded" },
      { id: "mou", name: "MOU", status: "not_uploaded" },
      { id: "payment-receipt", name: "Payment Receipt", status: "not_uploaded" },
    ],
  },
];

const UploadDocuments = () => {
  const [categories, setCategories] = useState<DocCategory[]>(buildInitialCategories);
  const [submitted, setSubmitted] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocItem | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const modalFileRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { setHasUploaded } = useUpload();

  const updateDoc = (docId: string, updater: (doc: DocItem) => DocItem) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        docs: cat.docs.map((d) => (d.id === docId ? updater(d) : d)),
      }))
    );
  };

  const findCategoryForDoc = (docId: string): DocCategory | undefined => {
    return categories.find((cat) => cat.docs.some((d) => d.id === docId));
  };

  const handleFileSelect = (docId: string, file: File) => {
    const cat = findCategoryForDoc(docId);
    if (cat?.smartValidation) {
      // Always treat as wrong document for KYC and Income & Financial
      updateDoc(docId, (d) => ({
        ...d,
        status: "wrong",
        fileName: file.name,
        errorMessage: "Wrong document — this document could not be verified for this reason.",
      }));
    } else {
      updateDoc(docId, (d) => ({ ...d, status: "uploaded", fileName: file.name, errorMessage: undefined }));
    }
    setHasUploaded(true);
  };

  const handleSubFieldUpload = (docId: string, subIndex: number, file: File) => {
    const cat = findCategoryForDoc(docId);
    if (cat?.smartValidation) {
      // For smart validation categories, mark the parent doc as wrong
      updateDoc(docId, (d) => ({
        ...d,
        status: "wrong",
        fileName: file.name,
        errorMessage: "Wrong document — this document could not be verified for this reason.",
      }));
    } else {
      updateDoc(docId, (d) => {
        const subs = [...(d.subFields || [])];
        subs[subIndex] = { ...subs[subIndex], status: "uploaded", fileName: file.name };
        const allDone = subs.every((s) => s.status === "uploaded");
        return { ...d, subFields: subs, status: allDone ? "uploaded" : d.status };
      });
    }
    setHasUploaded(true);
  };

  const triggerUpload = (refKey: string) => {
    fileInputRefs.current[refKey]?.click();
  };

  const allDocs = categories.flatMap((c) => c.docs);
  const anyUploaded = allDocs.some((d) => {
    if (d.subFields) return d.subFields.some((s) => s.status === "uploaded");
    return d.status === "uploaded" || d.status === "wrong";
  });

  const isDocUploaded = (d: DocItem) => {
    if (d.subFields) return d.subFields.every((s) => s.status === "uploaded");
    return d.status === "uploaded";
  };
  const totalDocs = allDocs.length;
  const uploadedCount = allDocs.filter(isDocUploaded).length;

  if (submitted) {
    return (
      <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">
        <div className="max-w-6xl relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-0 right-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
            Documents Submitted
          </h1>
          <p className="font-body text-secondary-foreground text-base leading-relaxed max-w-xl mb-6">
            Your documents have been received. Our team will review and get back to you shortly.
          </p>
          <Button variant="premium" onClick={() => navigate("/")}>
            Go Home
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  // Separate docs for pending vs uploaded
  const getPendingDocs = (cat: DocCategory) => {
    // Only not_uploaded docs — wrong docs are shown in the "Needs attention" section
    return cat.docs.filter((d) => d.status === "not_uploaded");
  };

  // Collect all wrong docs across all categories for the "Needs attention" card
  const allWrongDocs = categories.flatMap((cat) =>
    cat.docs.filter((d) => d.status === "wrong")
  );

  // Uploaded docs for right panel (only truly uploaded, not wrong)
  const getUploadedDocs = (cat: DocCategory) => {
    return cat.docs.filter((d) => isDocUploaded(d));
  };

  const handleCategoryUpload = (categoryTitle: string) => {
    fileInputRefs.current[`cat-${categoryTitle}`]?.click();
  };

  const handleCategoryFilesSelected = (categoryTitle: string, files: FileList) => {
    const cat = categories.find((c) => c.title === categoryTitle);
    if (!cat) return;
    const pendingSlots: { docId: string; subIndex?: number }[] = [];
    cat.docs.forEach((doc) => {
      if (doc.subFields) {
        doc.subFields.forEach((sub, si) => {
          if (sub.status === "not_uploaded") {
            pendingSlots.push({ docId: doc.id, subIndex: si });
          }
        });
      } else if (doc.status === "not_uploaded") {
        pendingSlots.push({ docId: doc.id });
      }
    });
    for (let i = 0; i < Math.min(files.length, pendingSlots.length); i++) {
      const slot = pendingSlots[i];
      if (slot.subIndex !== undefined) {
        handleSubFieldUpload(slot.docId, slot.subIndex, files[i]);
      } else {
        handleFileSelect(slot.docId, files[i]);
      }
    }
  };

  const pendingCategories = categories
    .map((cat) => ({ ...cat, docs: getPendingDocs(cat) }))
    .filter((cat) => cat.docs.length > 0);

  const uploadedCategories = categories
    .map((cat) => ({ ...cat, docs: getUploadedDocs(cat) }))
    .filter((cat) => cat.docs.length > 0);

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-12 md:py-14 lg:px-20 xl:px-28">
      {/* Header */}
      <div className="max-w-6xl">
        <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight mb-2">
          Upload Your Documents
        </h1>
        <p className="font-body text-secondary-foreground text-base leading-relaxed max-w-xl mb-6">
          Please upload the required documents below. Each document will be
          reviewed by your mortgage specialist before submission.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
        {/* Left: Document checklist */}
        <div className="flex-1 min-w-0 space-y-10">
          {/* Progress indicator */}
          <div>
            <p className="font-body text-sm text-muted-foreground mb-2">
              {uploadedCount} of {totalDocs} completed
            </p>
            <div className="h-1 w-full bg-border/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${totalDocs > 0 ? (uploadedCount / totalDocs) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Pending section */}
          {pendingCategories.length > 0 && (
            <div className="space-y-4">
             <p className="font-body text-xs tracking-wide uppercase text-muted-foreground">Pending</p>

              {/* Needs Attention section */}
              {allWrongDocs.length > 0 && (
                <div
                  style={{
                    borderLeft: '3px solid #C2410C',
                    paddingLeft: '14px',
                  }}
                >
                  <p
                    className="font-body"
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#C2410C',
                      borderBottom: '1px solid #FED7AA',
                      paddingBottom: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    Needs Attention
                  </p>
                  <div>
                    {allWrongDocs.map((doc, i) => (
                      <div
                        key={doc.id}
                        style={i < allWrongDocs.length - 1 ? { borderBottom: '0.5px solid #FED7AA', paddingBottom: '8px', marginBottom: '8px' } : {}}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <span className="font-body" style={{ fontSize: '12px', fontWeight: 500, color: '#1a1a1a' }}>
                              {doc.name}
                            </span>
                            <p className="font-body mt-0.5" style={{ fontSize: '11px', color: '#B91C1C', lineHeight: 1.4 }}>
                              Wrong document — this document could not be verified for this reason.
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <input
                              type="file"
                              className="hidden"
                              ref={(el) => { fileInputRefs.current[`wrong-${doc.id}`] = el; }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(doc.id, file);
                                e.target.value = "";
                              }}
                            />
                            <button
                              onClick={() => fileInputRefs.current[`wrong-${doc.id}`]?.click()}
                              className="font-body text-[12px] font-semibold cursor-pointer transition-colors rounded-sm inline-flex items-center justify-center gap-1.5"
                              style={{ backgroundColor: '#C2410C', color: '#fff', width: '83.26px', height: '30px' }}
                            >
                              <RefreshCw className="h-3 w-3" style={{ color: '#fff' }} />
                              Replace
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pendingCategories.map((category, catIdx) => (
                <section
                  key={category.title}
                  className="mb-5 last:mb-0 px-4 py-3 -mx-4 rounded-sm"
                  style={{ backgroundColor: catIdx % 2 === 0 ? '#FFFFFF' : '#F7F6F4' }}
                >
                  {/* Hidden file input for category-level upload */}
                  {!category.individualUpload && (
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[`cat-${category.title}`] = el; }}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) handleCategoryFilesSelected(category.title, files);
                        e.target.value = "";
                      }}
                    />
                  )}

                  {/* Category heading with Upload button inline */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body" style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      {category.title}
                    </p>
                    {!category.individualUpload && (
                      <button
                        onClick={() => handleCategoryUpload(category.title)}
                        className="font-body text-[12px] font-semibold cursor-pointer transition-colors rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-1.5"
                        style={{ width: '83.26px', height: '30px' }}
                      >
                        <Upload className="h-3 w-3" />
                        Upload
                      </button>
                    )}
                  </div>

                  {/* Document rows — only not_uploaded docs */}
                  <div>
                    {category.docs.map((doc, idx) => (
                      <div key={doc.id} className={idx < category.docs.length - 1 ? 'border-b border-border/40' : ''}>
                        {doc.status === "not_uploaded" && (
                          <div className="py-3 px-2 -mx-2">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <span className="font-body font-medium text-foreground" style={{ fontSize: '12px' }}>
                                  {doc.name}
                                </span>
                                {doc.subFields && (
                                  <div className="space-y-1 mt-1.5 pl-0 md:pl-4">
                                    {doc.subFields.map((sub, si) => (
                                      <div key={si}>
                                        <span className="font-body text-xs text-muted-foreground">{sub.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {category.individualUpload && (
                                <div className="flex-shrink-0">
                                  <input
                                    type="file"
                                    className="hidden"
                                    ref={(el) => { fileInputRefs.current[doc.id] = el; }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFileSelect(doc.id, file);
                                      e.target.value = "";
                                    }}
                                  />
                                   <button
                                    onClick={() => triggerUpload(doc.id)}
                                    className="font-body text-[12px] font-semibold cursor-pointer transition-colors rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-1.5"
                                    style={{ width: '83.26px', height: '30px' }}
                                  >
                                    <Upload className="h-3 w-3" />
                                    Upload
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Right panel: Uploaded section only */}
        <div className="lg:w-80 xl:w-96 mt-10 lg:mt-8">
          <p className="font-body text-xs tracking-wide uppercase text-muted-foreground mb-4">Uploaded</p>
          {uploadedCategories.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-6">
              {uploadedCategories.map((category) => (
                <div key={category.title}>
                  <p className="font-body mb-2" style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>
                    {category.title}
                  </p>
                  <div>
                    {category.docs.map((doc, i) => (
                      <div
                        key={doc.id}
                        className={`py-3 px-2 -mx-2 ${i < category.docs.length - 1 ? 'border-b border-border/40' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <span className="font-body font-medium text-foreground" style={{ fontSize: '12px' }}>
                              {doc.name}
                            </span>
                            {doc.fileName && (
                              <div className="flex items-center gap-1.5 mt-0.5 font-body text-xs" style={{ color: '#1D9E75' }}>
                                <Check className="h-3 w-3" />
                                <span>{doc.fileName}</span>
                              </div>
                            )}
                            {/* Show subfield filenames if applicable */}
                            {doc.subFields && doc.subFields.filter(s => s.status === "uploaded").map((sub, si) => (
                              <div key={si} className="flex items-center gap-1.5 mt-0.5 font-body text-xs" style={{ color: '#1D9E75' }}>
                                <Check className="h-3 w-3" />
                                <span>{sub.label}: {sub.fileName}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => setViewingDoc(doc)}
                              className="font-body text-[12px] font-semibold cursor-pointer transition-colors rounded-sm border border-border text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1.5"
                              style={{ width: '83.26px', height: '30px' }}
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setViewingDoc(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Modal */}
          <div
            className="relative bg-background rounded-lg shadow-xl flex flex-col"
            style={{ width: '780px', height: '680px', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="min-w-0">
                <p className="font-body truncate" style={{ fontSize: '15px', fontWeight: 600, color: '#111' }}>
                  {viewingDoc.name}
                </p>
                {viewingDoc.fileName && (
                  <p className="font-body truncate mt-0.5" style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {viewingDoc.fileName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                {/* Hidden file input for modal replace */}
                <input
                  type="file"
                  className="hidden"
                  ref={modalFileRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && viewingDoc) {
                      updateDoc(viewingDoc.id, (d) => ({ ...d, fileName: file.name }));
                      setViewingDoc((prev) => prev ? { ...prev, fileName: file.name } : null);
                    }
                    if (e.target) e.target.value = "";
                  }}
                />
                <button
                  onClick={() => modalFileRef.current?.click()}
                  className="font-body text-[12px] font-semibold cursor-pointer transition-colors rounded-sm inline-flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground"
                  style={{ border: '0.5px solid #d1d5db', backgroundColor: 'transparent', width: '83.26px', height: '30px' }}
                >
                  <RefreshCw className="h-3 w-3" />
                  Replace
                </button>
                <button
                  onClick={() => setViewingDoc(null)}
                  className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">
              <div
                className="w-full rounded-md flex flex-col items-center justify-center"
                style={{ backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', minHeight: '340px' }}
              >
                <FileText className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="font-body text-muted-foreground" style={{ fontSize: '13px' }}>
                  Document preview
                </p>
                {viewingDoc.fileName && (
                  <p className="font-body mt-1" style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {viewingDoc.fileName}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocuments;
