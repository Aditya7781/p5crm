import React, { useMemo, useState } from "react";
import {
  Search,
  Eye,
  Plus,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type BackendRow = {
  projectId: string;
  project: string;
  description: string;
  projectLead: string;
  createdOn: string;
  deadline: string;
  status: "In Process" | "Completed";
  figmaFile: string;
  pushToP5Repository: boolean;
  apiRepository: string;
  awsDetails: string;
};

const PER_PAGE = 10;

const sampleRows: BackendRow[] = Array.from({ length: 48 }).map((_, i) => ({
  projectId: String(1 + i).padStart(5, "0"),
  project: "RealState",
  description: "Project description details",
  projectLead: "Anju Rani",
  createdOn: "29/12/2023, 20:04:11",
  deadline: "29/12/2023, 20:04:11",
  status: i % 2 === 0 ? "In Process" : "Completed",
  figmaFile: "figma-file-link",
  pushToP5Repository: true,
  apiRepository: "api-repo-link",
  awsDetails: `ID: ${Math.random()
    .toString(36)
    .substr(2, 12)
    .toUpperCase()}, PASS: ${Math.random()
    .toString(36)
    .substr(2, 8)
    .toUpperCase()}`,
}));

const Backend: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return sampleRows;
    const q = query.toLowerCase();
    return sampleRows.filter((r) =>
      [
        r.projectId,
        r.project,
        r.description,
        r.projectLead,
        r.createdOn,
        r.deadline,
        r.status,
        r.figmaFile,
        r.apiRepository,
        r.awsDetails,
      ].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, p)));

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600";
      case "In Process":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-5 max-w-full overflow-x-hidden">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-extrabold text-[#0F172A]">
          P5 DIGITAL SOLUTIONS - BACKEND
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
          <table className="min-w-[1400px] md:min-w-[1600px] divide-y divide-gray-100">
            <thead className="bg-[#F8FAFF] sticky top-0 z-10">
              <tr>
                <Th>Project ID</Th>
                <Th>Project</Th>
                <Th>Description</Th>
                <Th>Project Lead</Th>
                <Th>Created On</Th>
                <Th>Deadline</Th>
                <Th>Status</Th>
                <Th>Figma File</Th>
                <Th>Push to P5 Repository</Th>
                <Th>API Repository</Th>
                <Th>AWS Details</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageData.map((r, idx) => (
                <tr
                  key={r.projectId}
                  className={idx % 2 ? "bg-[#F6FAFF]" : undefined}
                >
                  <Td>{r.projectId}</Td>
                  <Td>{r.project}</Td>
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
                  <Td>{r.createdOn}</Td>
                  <Td>{r.deadline}</Td>
                  <Td>
                    <span
                      className={`text-sm font-medium ${getStatusStyle(
                        r.status
                      )}`}
                    >
                      {r.status}
                    </span>
                  </Td>
                  <Td>
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                      title="View Figma File"
                      aria-label={`View Figma file for project ${r.projectId}`}
                      onClick={() =>
                        alert(`View Figma file for project ${r.projectId}`)
                      }
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Td>
                  <Td>
                    <span className="text-sm text-gray-700">Yes</span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                        title="Add to API Repository"
                        aria-label={`Add project ${r.projectId} to API repository`}
                        onClick={() =>
                          alert(`Add project ${r.projectId} to API repository`)
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                        title="Edit API Repository"
                        aria-label={`Edit API repository for project ${r.projectId}`}
                        onClick={() =>
                          alert(
                            `Edit API repository for project ${r.projectId}`
                          )
                        }
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-sm text-gray-700 max-w-[200px] truncate">
                      {r.awsDetails}
                    </span>
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

export default Backend;
