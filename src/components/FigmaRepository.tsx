import React, { useMemo, useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";

type FigmaRepositoryRow = {
  projectId: string;
  projectName: string;
  description: string;
  projectLead: string;
  figmaDesign: string;
};

const PER_PAGE = 10;

const sampleRows: FigmaRepositoryRow[] = Array.from({ length: 48 }).map(
  (_, i) => ({
    projectId: String(1 + i).padStart(5, "0"),
    projectName: "RealState",
    description: "Project description details",
    projectLead: "Arjun Rana",
    figmaDesign: "figma-design-link",
  })
);

const FigmaRepository: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return sampleRows;
    const q = query.toLowerCase();
    return sampleRows.filter((r) =>
      [
        r.projectId,
        r.projectName,
        r.description,
        r.projectLead,
        r.figmaDesign,
      ].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, p)));

  return (
    <div className="space-y-5 max-w-full overflow-x-hidden">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-extrabold text-[#0F172A]">
          P5 DIGITAL SOLUTIONS - DESIGNER
        </h1>
      </div>

      {/* Search */}
      <div className="relative w-full md:max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search Here"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {/* Table scroller */}
        <div className="relative w-full overflow-x-auto">
          <table className="min-w-[1000px] md:min-w-[1200px] divide-y divide-gray-100">
            <thead className="bg-[#F8FAFF] sticky top-0 z-10">
              <tr>
                <Th>Project ID</Th>
                <Th>Project Name</Th>
                <Th>Description</Th>
                <Th>Project Lead</Th>
                <Th>Figma Design</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageData.map((r, idx) => (
                <tr
                  key={r.projectId}
                  className={idx % 2 ? "bg-[#F6FAFF]" : undefined}
                >
                  <Td>{r.projectId}</Td>
                  <Td>{r.projectName}</Td>
                  <Td>
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                      title="View Description"
                      aria-label={`View description for project ${r.projectId}`}
                      onClick={() =>
                        alert(`View description for project ${r.projectId}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Td>
                  <Td>{r.projectLead}</Td>
                  <Td>
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                      title="View Figma Design"
                      aria-label={`View Figma design for project ${r.projectId}`}
                      onClick={() =>
                        alert(`View Figma design for project ${r.projectId}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-100">
          <button
            className="p-2 rounded-md hover:bg-gray-50 text-gray-600 disabled:opacity-40"
            onClick={() => go(page - 1)}
            disabled={page === 1}
            title="Previous page"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => go(p)}
                className={`w-8 h-8 rounded-full text-sm ${
                  p === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                title={`Go to page ${p}`}
                aria-label={`Go to page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
          <button
            className="p-2 rounded-md hover:bg-gray-50 text-gray-600 disabled:opacity-40"
            onClick={() => go(page + 1)}
            disabled={page === pageCount}
            title="Next page"
            aria-label="Go to next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <th
    className={`px-6 py-3 text-left text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap ${
      className || ""
    }`}
  >
    {children}
  </th>
);

const Td: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <td
    className={`px-6 py-3 text-sm text-[#111827] whitespace-nowrap ${
      className || ""
    }`}
  >
    {children}
  </td>
);

export default FigmaRepository;
