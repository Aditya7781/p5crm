import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Printer,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type AccountsRow = {
  clientId: string;
  clientName: string;
  cPhone: string;
  cEmail: string;
  gstNo: string;
  valueInclGst: string;
  invoiceNo: string | number;
  invoiceDate: string;
  generateBill: "One Time" | "Monthly";
  billingType: "Monthly" | "One Time";
  advPayment: string;
  awsBill: string;
  paymentDate: string;
  filingDate: string;
  accountNo: string;
};

const PER_PAGE = 10;

const sampleRows: AccountsRow[] = Array.from({ length: 48 }).map((_, i) => ({
  clientId: String(1 + i).padStart(5, "0"),
  clientName: i % 2 ? "Mahes" : "Raju Babu",
  cPhone: "9867456734",
  cEmail: "Rosie@gma..",
  gstNo: "DSER234S3",
  valueInclGst: "₹ 100000",
  invoiceNo: 1232,
  invoiceDate: "29/12/2023",
  generateBill: i % 3 === 0 ? "One Time" : "Monthly",
  billingType: "Monthly",
  advPayment: "₹ 100000",
  awsBill: "₹ 100000",
  paymentDate: "29/12/2023",
  filingDate: "29/12/2023",
  accountNo: "83242423424234",
}));

const Accounts: React.FC = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return sampleRows;
    const q = query.toLowerCase();
    return sampleRows.filter((r) =>
      [
        r.clientId,
        r.clientName,
        r.cPhone,
        r.cEmail,
        r.gstNo,
        r.valueInclGst,
        r.invoiceNo.toString(),
        r.invoiceDate,
        r.generateBill,
        r.billingType,
        r.advPayment,
        r.awsBill,
        r.paymentDate,
        r.filingDate,
        r.accountNo,
      ].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, p)));

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg md:text-2xl font-extrabold text-[#0F172A]">
            P5 DIGITAL SOLUTIONS - ACCOUNTS
          </h1>

          <button
            type="button"
            onClick={() => alert("Add Details")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2563EB] text-white shadow-lg hover:bg-[#1D4ED8] transition"
            title="Add Details"
          >
            <Plus className="w-4 h-4" />
            Add Details
          </button>
        </div>

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
      </div>

      {/* Scrollable Table Container */}
      <div
        className="flex-1 overflow-auto bg-white border border-gray-200 rounded-xl shadow-sm mx-6 mt-4 mb-16"
        style={{
          maxHeight: "calc(100vh - 220px)",
        }}
      >
        <table className="w-full border-collapse text-sm text-[#111827]">
          <thead className="bg-[#F8FAFF] sticky top-0 z-10">
            <tr>
              <Th>Client ID</Th>
              <Th>Client Name</Th>
              <Th>C Phone</Th>
              <Th>C Email</Th>
              <Th>GST No.</Th>
              <Th>Value incl. GST</Th>
              <Th>Invoice No.</Th>
              <Th>Invoice Date</Th>
              <Th>Generate Bill</Th>
              <Th>Billing Type</Th>
              <Th>Adv Payment</Th>
              <Th>AWS Bill</Th>
              <Th>Payment Date</Th>
              <Th>Filing Date</Th>
              <Th>Account No.</Th>
              <Th className="text-right pr-6">Action</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageData.map((r, idx) => (
              <tr
                key={r.clientId}
                className={`${
                  idx % 2 ? "bg-[#F6FAFF]" : ""
                } hover:bg-gray-50 transition`}
              >
                <Td>{r.clientId}</Td>
                <Td>{r.clientName}</Td>
                <Td>{r.cPhone}</Td>
                <Td>{r.cEmail}</Td>
                <Td>{r.gstNo}</Td>
                <Td>{r.valueInclGst}</Td>
                <Td>{r.invoiceNo}</Td>
                <Td>{r.invoiceDate}</Td>
                <Td>{r.generateBill}</Td>
                <Td>{r.billingType}</Td>
                <Td>{r.advPayment}</Td>
                <Td>{r.awsBill}</Td>
                <Td>{r.paymentDate}</Td>
                <Td>{r.filingDate}</Td>
                <Td>{r.accountNo}</Td>
                <Td className="text-right pr-6">
                  <ActionButtons
                    onPrint={() => window.print()}
                    onEdit={() => alert(`Edit ${r.clientId}`)}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Fixed Pagination */}
      <div className="fixed bottom-6 right-8 z-40 flex items-center justify-end gap-2 bg-white border border-gray-200 shadow-md rounded-full px-3 py-2">
        <button
          className="p-2 rounded-md hover:bg-gray-50 text-gray-600 disabled:opacity-40"
          onClick={() => go(page - 1)}
          disabled={page === 1}
          aria-label="Previous"
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
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const Th: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <th
    className={`px-2 py-2 text-left text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap ${
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
    className={`px-2 py-2 text-sm text-[#111827] whitespace-nowrap ${
      className || ""
    }`}
    style={{ minWidth: "max-content" }}
  >
    {children}
  </td>
);

const ActionButtons: React.FC<{ onPrint: () => void; onEdit: () => void }> = ({
  onPrint,
  onEdit,
}) => (
  <div className="flex items-center gap-2 justify-end">
    <button
      onClick={onPrint}
      className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
      title="Print"
    >
      <Printer className="w-4 h-4" />
    </button>
    <button
      onClick={onEdit}
      className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
      title="Edit"
    >
      <Pencil className="w-4 h-4" />
    </button>
  </div>
);

export default Accounts;
