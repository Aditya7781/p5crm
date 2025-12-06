import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Search, Eye, ChevronLeft, ChevronRight, Plus } from "lucide-react";

type WorkingRow = {
  _id: string;
  projectID: string;
  projectName: string;
  description: string;
  projectLead: string;
  createdOn: string;
  deadline: string;
  status: string;
  figmaLink: string;
};

const API = import.meta.env.VITE_API_BASE_URL;

const PER_PAGE = 10;

const Working: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<WorkingRow[]>([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    projectID: "",
    projectName: "",
    description: "",
    projectLead: "",
    deadline: "",
    status: "",
    figmaLink: "",
  });

  // Fetch Working List
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/v1/designer/working`, {
        withCredentials: true,
      });

      const formatted = (res.data?.data || []).map((p: any) => ({
        _id: p._id,
        projectID: p.projectID ?? "-",
        projectName: p.projectName ?? "-",
        description: p.description ?? "-",
        projectLead: p.projectLead ?? "N/A",
        createdOn: p.createdOn
          ? new Date(p.createdOn).toLocaleDateString("en-IN")
          : "-",
        deadline: p.deadline
          ? new Date(p.deadline).toLocaleDateString("en-IN")
          : "-",
        status: p.status ?? "not started",
        figmaLink: p.figmaLink ?? "",
      }));

      setRows(formatted);
    } catch (error) {
      console.error("Axios GET Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // SEARCH
  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      [r.projectID, r.projectName, r.description, r.projectLead, r.status].some(
        (v) => String(v).toLowerCase().includes(q)
      )
    );
  }, [query, rows]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, p)));

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in progress":
        return "text-blue-600";
      case "not started":
        return "text-gray-600";
      case "on hold":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // FORM CHANGE
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SAVE
  const handleSave = async () => {
    try {
      await axios.post(`${API}/api/v1/designer/working`, formData, {
        withCredentials: true,
      });

      setShowModal(false);
      fetchProjects();
    } catch (err) {
      console.error("POST Error:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-5 max-w-full overflow-x-hidden">
      {/* HEADER + ADD BUTTON */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-extrabold text-[#0F172A]">
          P5 DIGITAL SOLUTIONS - PROJECT LIST
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Add Details
        </button>
      </div>

      {/* SEARCH */}
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

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="relative w-full overflow-x-auto">
          <table className="min-w-[1200px] md:min-w-[1400px] divide-y divide-gray-100">
            <thead className="bg-[#F8FAFF] sticky top-0 z-10">
              <tr>
                <Th>Project ID</Th>
                <Th>Project Name</Th>
                <Th>SOW</Th>
                <Th>Project Lead</Th>
                <Th>Created On</Th>
                <Th>Deadline</Th>
                <Th>Status</Th>
                <Th>Figma</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {pageData.map((r, idx) => (
                <tr key={r._id} className={idx % 2 ? "bg-[#F6FAFF]" : ""}>
                  <Td>{r.projectID}</Td>
                  <Td>{r.projectName}</Td>

                  {/* SOW */}
                  <Td>
                    <button
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => window.open(r.description, "_blank")}
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
                    {r.figmaLink ? (
                      <button
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white hover:bg-purple-600"
                        onClick={() => window.open(r.figmaLink, "_blank")}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      "-"
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageCount={pageCount} go={go} />
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[550px]">
            <h2 className="text-lg font-semibold mb-4">Add Working Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="projectID"
                value={formData.projectID}
                onChange={handleChange}
                placeholder="Project ID"
                className="p-2 border rounded"
              />

              <input
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Project Name"
                className="p-2 border rounded"
              />

              <input
                name="projectLead"
                value={formData.projectLead}
                onChange={handleChange}
                placeholder="Project Lead"
                className="p-2 border rounded"
              />

              <input
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                type="date"
                className="p-2 border rounded"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="p-2 border rounded"
              >
                <option value="">Select Status</option>
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <input
                name="figmaLink"
                value={formData.figmaLink}
                onChange={handleChange}
                placeholder="Figma Link"
                className="p-2 border rounded"
              />
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="SOW / Description"
              className="p-2 border rounded w-full h-28 mt-3"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------ COMPONENTS ------------------ */

const Pagination = ({
  page,
  pageCount,
  go,
}: {
  page: number;
  pageCount: number;
  go: (p: number) => void;
}) => (
  <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-100">
    <button
      className="p-2 rounded-md hover:bg-gray-50 text-gray-600 disabled:opacity-40"
      onClick={() => go(page - 1)}
      disabled={page === 1}
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
        >
          {p}
        </button>
      );
    })}

    <button
      className="p-2 rounded-md hover:bg-gray-50 text-gray-600 disabled:opacity-40"
      onClick={() => go(page + 1)}
      disabled={page === pageCount}
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

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

export default Working;
