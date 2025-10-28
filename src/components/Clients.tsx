import React, { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";

interface Client {
  id: number;
  clientId: string;
  name: string;
  phone: string;
  email: string;
  gstPercent: string; // e.g., "10 %"
  billingType: "Monthly" | "Annually" | "One time";
  billingStatus: "Active" | "Inactive";
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      clientId: "00001",
      name: "Raju Babu",
      phone: "9867456734",
      email: "Rosie@gma..",
      gstPercent: "10 %",
      billingType: "Monthly",
      billingStatus: "Active",
    },
    {
      id: 2,
      clientId: "00002",
      name: "Mahes",
      phone: "9867456734",
      email: "Rosie@gma..",
      gstPercent: "10 %",
      billingType: "Annually",
      billingStatus: "Active",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredClients = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.clientId.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [clients, searchTerm]);

  const getBillingStatusClass = (status: Client["billingStatus"]) =>
    status === "Active" ? "text-green-600" : "text-gray-600";

  const openAddModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = (data: Omit<Client, "id">) => {
    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id ? { ...data, id: editingClient.id } : c
        )
      );
    } else {
      const nextId = Math.max(0, ...clients.map((c) => c.id)) + 1;
      setClients((prev) => [...prev, { ...data, id: nextId }]);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        </div>
        <div className="flex items-center space-x-3">
          <input
            id="startDate"
            type="date"
            value={startDate}
            title="Start Date"
            placeholder="Start Date"
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            id="endDate"
            type="date"
            value={endDate}
            title="End Date"
            placeholder="End Date"
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            title="Add new client"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            aria-hidden="true"
          />
          <input
            id="clientSearch"
            type="text"
            placeholder="Search clients..."
            title="Search clients"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  C Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  C Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GST
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openEditModal(c)}
                  title="Click to edit client"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {c.clientId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {c.gstPercent}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {c.billingType}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${getBillingStatusClass(
                      c.billingStatus
                    )}`}
                  >
                    {c.billingStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 text-gray-600">
        <button
          className="px-2 py-1 rounded hover:bg-gray-100"
          title="Previous page"
        >
          ❮
        </button>
        {[1, 2, 3, 4, 5].map((p) => (
          <button
            key={p}
            title={`Go to page ${p}`}
            className={`w-8 h-8 rounded-full ${
              p === 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          className="px-2 py-1 rounded hover:bg-gray-100"
          title="Next page"
        >
          ❯
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ClientModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={editingClient}
        />
      )}
    </div>
  );
};

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Client, "id">) => void;
  initialData: Client | null;
}

const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [clientId, setClientId] = useState(initialData?.clientId ?? "");
  const [name, setName] = useState(initialData?.name ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [gstPercent, setGstPercent] = useState(
    initialData?.gstPercent ?? "10 %"
  );
  const [billingType, setBillingType] = useState<Client["billingType"]>(
    initialData?.billingType ?? "Monthly"
  );
  const [billingStatus, setBillingStatus] = useState<Client["billingStatus"]>(
    initialData?.billingStatus ?? "Active"
  );

  const isValid =
    clientId &&
    name &&
    phone &&
    email &&
    gstPercent &&
    billingType &&
    billingStatus;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {initialData ? "Edit Client" : "Add Client"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-100"
              title="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client ID */}
              <div>
                <label
                  htmlFor="clientId"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Client ID
                </label>
                <input
                  id="clientId"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Enter client ID"
                  title="Client ID"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Client Name */}
              <div>
                <label
                  htmlFor="clientName"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Client Name
                </label>
                <input
                  id="clientName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter client name"
                  title="Client Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="clientPhone"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Client Phone
                </label>
                <input
                  id="clientPhone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  title="Client Phone"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="clientEmail"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Client Email
                </label>
                <input
                  id="clientEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter client email"
                  title="Client Email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* GST */}
              <div>
                <label
                  htmlFor="gstPercent"
                  className="block text-sm text-gray-600 mb-1"
                >
                  GST
                </label>
                <input
                  id="gstPercent"
                  value={gstPercent}
                  onChange={(e) => setGstPercent(e.target.value)}
                  placeholder="Enter GST (e.g., 10%)"
                  title="GST Percent"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Billing Type */}
              <div>
                <label
                  htmlFor="billingType"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Billing Type
                </label>
                <select
                  id="billingType"
                  value={billingType}
                  onChange={(e) =>
                    setBillingType(e.target.value as Client["billingType"])
                  }
                  title="Billing Type"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Annually">Annually</option>
                  <option value="One time">One time</option>
                </select>
              </div>

              {/* Billing Status */}
              <div>
                <label
                  htmlFor="billingStatus"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Billing Status
                </label>
                <select
                  id="billingStatus"
                  value={billingStatus}
                  onChange={(e) =>
                    setBillingStatus(e.target.value as Client["billingStatus"])
                  }
                  title="Billing Status"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              title="Cancel and close modal"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                isValid &&
                onSubmit({
                  clientId,
                  name,
                  phone,
                  email,
                  gstPercent,
                  billingType,
                  billingStatus,
                })
              }
              disabled={!isValid}
              className={`px-4 py-2 rounded-lg text-white ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
              title={isValid ? "Save client details" : "Fill all fields first"}
            >
              {initialData ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
