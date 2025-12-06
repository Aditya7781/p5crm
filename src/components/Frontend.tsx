import React, { useEffect, useMemo, useState } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import axios from "axios";

type ApiRepoItem = {
  label: string;
  link: string;
};

type FrontendRow = {
  _id: string;
  projectID: string;
  projectName: string;
  status: string;
  deadline: string | null;
  createdOn: string;
  figmaLink: string;
  sowFileLink: string;
  pushToP5Repo: boolean;
  awsDetails?: { id: string; pass: string };
  apiRepository?: ApiRepoItem[];
};

const API = import.meta.env.VITE_API_BASE_URL;

const PER_PAGE = 10;

const Frontend: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [projects, setProjects] = useState<FrontendRow[]>([]);
  const [loading, setLoading] = useState(true);

  // FORM MODAL STATE
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    projectID: "",
    projectName: "",
    status: "Ongoing",
    deadline: "",
    figmaLink: "",
    sowFileLink: "",
    pushToP5Repo: false,
    awsId: "",
    awsPass: "",
    apiRepository: [] as ApiRepoItem[],
  });

  // Form change handler
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle PushToRepo boolean
  const handleBooleanChange = () => {
    setForm((prev) => ({ ...prev, pushToP5Repo: !prev.pushToP5Repo }));
  };

  // API Repo list update
  const updateApiItem = (
    index: number,
    field: "label" | "link",
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.apiRepository];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, apiRepository: updated };
    });
  };

  const addApiField = () => {
    setForm((prev) => ({
      ...prev,
      apiRepository: [...prev.apiRepository, { label: "", link: "" }],
    }));
  };

  // SAVE FRONTEND DETAILS
  const handleSave = async () => {
    if (!form.projectID.trim() || !form.projectName.trim()) {
      alert("Project ID and Project Name are required");
      return;
    }

    try {
      await axios.post(
        `${API}/api/v1/pl/details/${form.projectID}`,
        {
          projectName: form.projectName,
          status: form.status,
          deadline: form.deadline,
          figmaLink: form.figmaLink,
          sowFileLink: form.sowFileLink,
          pushToP5Repo: form.pushToP5Repo,
          awsId: form.awsId,
          awsPass: form.awsPass,
          apiRepository: form.apiRepository,
        },
        { withCredentials: true }
      );

      // update locally
      setProjects((prev) => [
        ...prev,
        {
          _id: crypto.randomUUID(),
          projectID: form.projectID,
          projectName: form.projectName,
          status: form.status,
          deadline: form.deadline,
          createdOn: new Date().toISOString(),
          figmaLink: form.figmaLink,
          sowFileLink: form.sowFileLink,
          pushToP5Repo: form.pushToP5Repo,
          awsDetails: { id: form.awsId, pass: form.awsPass },
          apiRepository: form.apiRepository,
        },
      ]);

      setShowForm(false);
    } catch (err) {
      console.error("Failed to save frontend data:", err);
    }
  };

  // Fetch Frontend Data
  useEffect(() => {
    const fetchFrontend = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API}/api/v1/pl/projects`, {
          withCredentials: true,
        });
        setProjects(data.data || []);
      } catch (err) {
        console.error("Failed to fetch frontend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFrontend();
  }, []);

  // Search
  const filtered = useMemo(() => {
    if (!query.trim()) return projects;
    const q = query.toLowerCase();
    return projects.filter((r) =>
      [r.projectID, r.projectName, r.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query, projects]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, p)));

  // Toggle Repo
  const handleRepoToggle = async (projectID: string, current: boolean) => {
    try {
      await axios.post(
        `${API}/api/v1/frontend/details/${projectID}`,
        { pushToP5Repo: !current },
        { withCredentials: true }
      );

      setProjects((prev) =>
        prev.map((p) =>
          p.projectID === projectID ? { ...p, pushToP5Repo: !current } : p
        )
      );
    } catch (err) {
      console.error("Failed to toggle repo:", err);
    }
  };

  // Status badge colors
  const getStatusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case "completed":
        return `${base} bg-green-100 text-green-800`;
      case "pending":
      case "in progress":
      case "ongoing":
        return `${base} bg-orange-100 text-orange-800`;
      default:
        return `${base} bg-blue-100 text-blue-800`;
    }
  };

  return (
    <div className="space-y-5 max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg md:text-2xl font-extrabold text-[#0F172A]">
          P5 DIGITAL SOLUTIONS - FRONTEND TEAM
        </h1>

        {/* ADD DETAILS BUTTON */}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add Details
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
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-blue-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="relative w-full overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : pageData.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No projects found.
            </div>
          ) : (
            <table className="min-w-[1400px] divide-y divide-gray-100">
              <thead className="bg-[#F8FAFF] sticky top-0 z-10">
                <tr>
                  <Th>Project ID</Th>
                  <Th>Project Name</Th>
                  <Th>SOW</Th>
                  <Th>Created On</Th>
                  <Th>Deadline</Th>
                  <Th>Figma</Th>
                  <Th>Status</Th>
                  <Th>Push to P5 Repo</Th>
                  <Th>API Repo</Th>
                  <Th>AWS Details</Th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-gray-50">
                {pageData.map((r, idx) => (
                  <tr key={r._id} className={idx % 2 ? "bg-[#F6FAFF]" : ""}>
                    <Td>{r.projectID}</Td>
                    <Td>{r.projectName}</Td>

                    {/* SOW */}
                    <Td>
                      {r.sowFileLink ? (
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full"
                          onClick={() => window.open(r.sowFileLink, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        "-"
                      )}
                    </Td>

                    <Td>{new Date(r.createdOn).toLocaleDateString()}</Td>

                    <Td>
                      {r.deadline
                        ? new Date(r.deadline).toLocaleDateString()
                        : "-"}
                    </Td>

                    {/* FIGMA */}
                    <Td>
                      {r.figmaLink ? (
                        <button
                          type="button"
                          className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full"
                          onClick={() => window.open(r.figmaLink, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        "-"
                      )}
                    </Td>

                    <Td>
                      <span className={getStatusBadge(r.status)}>
                        {r.status || "-"}
                      </span>
                    </Td>

                    {/* REPO TOGGLE */}
                    <Td>
                      <button
                        type="button"
                        className={`px-3 py-1 rounded-md text-sm ${
                          r.pushToP5Repo
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        onClick={() =>
                          handleRepoToggle(r.projectID, r.pushToP5Repo)
                        }
                      >
                        {r.pushToP5Repo ? "Yes" : "No"}
                      </button>
                    </Td>

                    {/* API Repo */}
                    <Td>
                      {r.apiRepository?.length ? (
                        <button
                          className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-800 text-sm"
                          onClick={() =>
                            alert(
                              r.apiRepository
                                .map(
                                  (x, i) =>
                                    `API #${i + 1}\nLabel: ${x.label}\nLink: ${
                                      x.link
                                    }`
                                )
                                .join("\n\n")
                            )
                          }
                        >
                          {r.apiRepository.length} Files
                        </button>
                      ) : (
                        "-"
                      )}
                    </Td>

                    {/* AWS Details */}
                    <Td>
                      {r.awsDetails?.id ? (
                        <button
                          className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full"
                          onClick={() =>
                            alert(
                              `AWS ID: ${r.awsDetails?.id}\nPassword: ${r.awsDetails?.pass}`
                            )
                          }
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
          )}
        </div>

        {/* PAGINATION */}
        <div className="fixed bottom-6 right-8 flex items-center gap-2 bg-white border shadow-md rounded-full px-3 py-2">
          <button
            className="p-2 rounded-md hover:bg-gray-50"
            onClick={() => go(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[...Array(Math.min(5, pageCount))].map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => go(p)}
                className={`w-8 h-8 rounded-full text-sm ${
                  p === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            className="p-2 rounded-md hover:bg-gray-50"
            onClick={() => go(page + 1)}
            disabled={page === pageCount}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ADD DETAILS MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Add Frontend Details</h2>

            {/* FORM INPUTS */}
            <div className="grid grid-cols-2 gap-4">
              <LabeledInput
                label="Project ID"
                name="projectID"
                value={form.projectID}
                onChange={handleFormChange}
              />
              <LabeledInput
                label="Project Name"
                name="projectName"
                value={form.projectName}
                onChange={handleFormChange}
              />
              <LabeledInput
                label="Status"
                name="status"
                value={form.status}
                onChange={handleFormChange}
              />
              <LabeledInput
                label="Deadline"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleFormChange}
              />
              <LabeledInput
                label="Figma Link"
                name="figmaLink"
                value={form.figmaLink}
                onChange={handleFormChange}
              />
              <LabeledInput
                label="SOW File Link"
                name="sowFileLink"
                value={form.sowFileLink}
                onChange={handleFormChange}
              />
              <LabeledInput
                label="AWS ID"
                name="awsId"
                value={form.awsId}
                onChange={handleFormChange}
              />
              <LabeledInput
                label="AWS Password"
                name="awsPass"
                value={form.awsPass}
                onChange={handleFormChange}
              />
            </div>

            {/* BOOLEAN */}
            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="push"
                checked={form.pushToP5Repo}
                onChange={handleBooleanChange}
              />
              <label htmlFor="push">Push to P5 Repo</label>
            </div>

            {/* API REPOSITORY */}
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">API Repository</h3>
                <button
                  type="button"
                  className="text-blue-600"
                  onClick={addApiField}
                >
                  + Add API Entry
                </button>
              </div>

              {form.apiRepository.map((api, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 mb-2">
                  <LabeledInput
                    label="Label"
                    value={api.label}
                    onChange={(e) =>
                      updateApiItem(idx, "label", e.target.value)
                    }
                  />
                  <LabeledInput
                    label="Link"
                    value={api.link}
                    onChange={(e) => updateApiItem(idx, "link", e.target.value)}
                  />
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={handleSave}
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

/* SMALL COMPONENTS */
const Th: React.FC<React.PropsWithChildren> = ({ children }) => (
  <th className="px-6 py-3 text-left text-[12px] font-semibold text-gray-600 uppercase whitespace-nowrap">
    {children}
  </th>
);

const Td: React.FC<React.PropsWithChildren> = ({ children }) => (
  <td className="px-6 py-3 text-sm text-[#111827] whitespace-nowrap">
    {children}
  </td>
);

interface LabeledProps {
  label: string;
  name?: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LabeledInput: React.FC<LabeledProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="border rounded-lg px-3 py-2"
    />
  </div>
);

export default Frontend;
