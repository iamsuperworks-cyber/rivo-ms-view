import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { RivoLayout } from "@/components/RivoLayout";
import { ApplicantDrawer } from "@/components/applicant/ApplicantDrawer";
import type { ApplicantData, ApplicantStatus } from "@/types/applicants";
import { SAMPLE_APPLICANTS } from "@/types/applicants";
import { cn } from "@/lib/utils";

type FilterTab = "In Process" | "Declined" | "Not Proceeding" | "All";

const Applicants = () => {
  const [filter, setFilter] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantData | null>(null);

  const filtered = useMemo(() => {
    return SAMPLE_APPLICANTS.filter((a) => {
      const matchesFilter = filter === "All" || a.status === filter;
      const matchesSearch = `${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const statusBadge: Record<string, { bg: string; text: string }> = {
    "In Process": { bg: "#EAF3DE", text: "#3B6D11" },
    Declined: { bg: "#FCEBEB", text: "#A32D2D" },
    "Not Proceeding": { bg: "#F1EFE8", text: "#444441" },
  };

  return (
    <RivoLayout>
      <div className="bg-card rounded-lg border border-border min-h-[calc(100vh-7rem)] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0">
          <h1 className="text-2xl font-bold text-foreground">Applicants</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage mortgage applicants and their eligibility</p>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-4 flex items-center gap-4 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex rounded-md border border-input overflow-hidden">
            {(["In Process", "Declined", "Not Proceeding", "All"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  filter === tab
                    ? "bg-foreground text-card"
                    : "bg-card text-muted-foreground hover:bg-muted"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 px-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Source", "Status", "Assigned MS", "Created"].map((col) => (
                  <th key={col} className="text-left py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const badge = statusBadge[a.status] ?? statusBadge["In Process"];
                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedApplicant(a)}
                    className="border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/30"
                  >
                    <td className="py-3 text-sm font-medium text-foreground">{a.firstName} {a.lastName}</td>
                    <td className="py-3 text-sm text-muted-foreground">{a.source}</td>
                    <td className="py-3">
                      <span
                        style={{ backgroundColor: badge.bg, color: badge.text, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}
                        className="inline-flex items-center"
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{a.assignedMS}</td>
                    <td className="py-3 text-sm text-muted-foreground">{a.createdAt}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                    No applicants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} applicants</span>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-muted rounded"><ChevronLeft className="w-4 h-4" /></button>
            <span>1 / 1</span>
            <button className="p-1 hover:bg-muted rounded"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {selectedApplicant && (
        <ApplicantDrawer
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onSave={(updated) => {
            console.log("Saved applicant:", updated);
            setSelectedApplicant(null);
          }}
        />
      )}
    </RivoLayout>
  );
};

export default Applicants;
