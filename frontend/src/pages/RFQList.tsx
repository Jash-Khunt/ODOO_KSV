import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageHeader,
  ButtonPrimary,
  Table,
  Th,
  Td,
  StatusBadge,
  TextInput,
  FilterTabs,
} from "../components/ui";
import { useAuth } from "../auth/AuthContext";
import { api } from "../api/client";
import type { RFQ } from "../types";

const TABS = ["All", "Active", "Closed"];

const RFQList = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const role = user!.role;
  const isVendor = role === "vendor";
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .rfqs(token)
      .then((rows) => {
        setRfqs(rows);
        setLoadError("");
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Unable to load RFQs."))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = useMemo(() => {
    return rfqs
      .filter((r) => (tab === "All" ? true : r.status === tab))
      .filter((r) => {
        const s = q.trim().toLowerCase();
        if (!s) return true;
        return [r.id, r.title, r.category].join(" ").toLowerCase().includes(s);
      });
  }, [tab, q, rfqs]);

  return (
    <div>
      <PageHeader
        title="RFQs"
        subtitle={
          isVendor
            ? "Request for Quotations assigned to you"
            : "Request for Quotations — create, publish and track"
        }
        action={
          role === "officer" && (
            <ButtonPrimary onClick={() => navigate("/rfqs/new")}>+ Create RFQ</ButtonPrimary>
          )
        }
      />

      <div className="mb-4 max-w-[420px]">
        <TextInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search RFQ ID, title, or category..."
        />
      </div>

      <FilterTabs tabs={TABS} active={tab} onChange={setTab} />

      {loading && (
        <p className="font-body text-[14px] text-ink-faint mb-3">Loading RFQs...</p>
      )}
      {loadError && (
        <p className="font-body text-[14px] text-[#c4313b] mb-3">{loadError}</p>
      )}

      <Table
        head={
          <>
            <Th>RFQ ID</Th>
            <Th>Title</Th>
            <Th>Category</Th>
            <Th>Deadline</Th>
            <Th>Vendors</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </>
        }
      >
        {filtered.map((r) => (
          <tr key={r.id}>
            <Td>{r.id}</Td>
            <Td>{r.title}</Td>
            <Td>{r.category}</Td>
            <Td>{r.deadline}</Td>
            <Td>{isVendor ? "—" : `${r.vendorIds.length} assigned`}</Td>
            <Td><StatusBadge status={r.status} /></Td>
            <Td>
              <button
                onClick={() =>
                  navigate(isVendor ? "/quotations/submit" : "/quotations/compare", {
                    state: { rfqId: r.id },
                  })
                }
                className="text-primary cursor-pointer font-body"
              >
                {isVendor ? "Submit Quote" : "View Quotes"}
              </button>
            </Td>
          </tr>
        ))}
        {!loading && filtered.length === 0 && (
          <tr>
            <td colSpan={7} className="font-body text-[15px] text-ink-soft px-4 py-6 border-t border-hairline-soft text-center">
              {rfqs.length === 0 
                ? (isVendor ? "No RFQs assigned to you yet." : "No RFQs found.")
                : "No RFQs match your filters."}
            </td>
          </tr>
        )}
      </Table>

      <p className="font-body text-[14px] text-ink-faint mt-4">
        {isVendor
          ? `Showing ${filtered.length} assigned RFQ(s).`
          : `Showing ${filtered.length} of ${rfqs.length} RFQ(s).`}
      </p>
    </div>
  );
};

export default RFQList;
