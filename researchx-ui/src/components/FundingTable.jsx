import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Landmark,
  Search,
  Filter,
  X,
  Plus,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Calendar,
  Building2,
  IndianRupee,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/funding";

const emptyForm = {
  title: "",
  organization: "",
  description: "",
  eligibility: "",
  funding_amount: "",
  deadline: "",
  research_domain: "",
};

export default function FundingTable() {
  const [funding, setFunding] = useState([]);

  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [selectedFunding, setSelectedFunding] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  // =========================================================
  // FETCH FUNDING
  // =========================================================

  const fetchFunding = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/`);

      setFunding(response.data);
    } catch (err) {
      console.error("Funding API error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load funding opportunities."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunding();
  }, []);

  // =========================================================
  // FUNDING AMOUNT PARSER
  // =========================================================

  const parseFundingAmount = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    const text = String(value)
      .trim()
      .toLowerCase();

    if (text.includes("cr")) {
      const number = parseFloat(
        text.replace(/[^0-9.]/g, "")
      );

      return Number.isNaN(number)
        ? 0
        : number * 10000000;
    }

    if (
      text.includes("lakh") ||
      text.includes("lac")
    ) {
      const number = parseFloat(
        text.replace(/[^0-9.]/g, "")
      );

      return Number.isNaN(number)
        ? 0
        : number * 100000;
    }

    const number = parseFloat(
      text.replace(/[^0-9.]/g, "")
    );

    return Number.isNaN(number) ? 0 : number;
  };

  // =========================================================
  // DOMAINS
  // =========================================================

  const domains = useMemo(() => {
    return [
      "All",
      ...new Set(
        funding
          .map((item) => item.research_domain)
          .filter(Boolean)
      ),
    ];
  }, [funding]);

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredFunding = useMemo(() => {
    return funding.filter((item) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        item.title
          ?.toLowerCase()
          .includes(searchText) ||
        item.organization
          ?.toLowerCase()
          .includes(searchText) ||
        item.research_domain
          ?.toLowerCase()
          .includes(searchText) ||
        item.description
          ?.toLowerCase()
          .includes(searchText) ||
        String(item.funding_amount ?? "")
          .toLowerCase()
          .includes(searchText);

      const matchesDomain =
        domainFilter === "All" ||
        item.research_domain === domainFilter;

      return matchesSearch && matchesDomain;
    });
  }, [funding, search, domainFilter]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalPrograms = funding.length;

  const organizations = new Set(
    funding
      .map((item) => item.organization)
      .filter(Boolean)
  ).size;

  const totalFunding = funding.reduce(
    (sum, item) =>
      sum +
      parseFundingAmount(item.funding_amount),
    0
  );

  // =========================================================
  // FORM HANDLING
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setShowDetails(false);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      organization: item.organization || "",
      description: item.description || "",
      eligibility: item.eligibility || "",
      funding_amount: item.funding_amount || "",
      deadline: item.deadline || "",
      research_domain: item.research_domain || "",
    });

    setShowForm(true);
    setShowDetails(false);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // =========================================================
  // ADD / EDIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        title: form.title.trim(),
        organization: form.organization.trim(),
        description: form.description.trim(),
        eligibility: form.eligibility.trim(),
        funding_amount: form.funding_amount.trim(),
        deadline: form.deadline,
        research_domain: form.research_domain.trim(),
      };

      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          payload
        );
      } else {
        await axios.post(
          `${API_URL}/`,
          payload
        );
      }

      closeForm();

      await fetchFunding();

    } catch (err) {
      console.error("Save funding error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to save funding opportunity."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this funding opportunity?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await axios.delete(
        `${API_URL}/${id}`
      );

      await fetchFunding();

    } catch (err) {
      console.error("Delete funding error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to delete funding opportunity."
      );
    }
  };

  // =========================================================
  // VIEW DETAILS
  // =========================================================

  const openDetails = (item) => {
    setSelectedFunding(item);
    setShowDetails(true);
    setShowForm(false);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedFunding(null);
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setDomainFilter("All");
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not specified";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="mt-8">

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-cyan-400 transition">

          <p className="text-slate-400 text-sm">
            Funding Programs
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            {totalPrograms}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-green-400 transition">

          <p className="text-slate-400 text-sm">
            Organizations
          </p>

          <p className="text-3xl font-bold text-green-400 mt-2">
            {organizations}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 hover:border-yellow-400 transition">

          <p className="text-slate-400 text-sm">
            Total Funding
          </p>

          <p className="text-3xl font-bold text-yellow-400 mt-2">
            ₹ {totalFunding.toLocaleString("en-IN")}
          </p>

        </div>

      </div>

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-6">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

          <div className="flex items-center gap-3">

            <Landmark
              className="text-green-400"
              size={30}
            />

            <div>

              <h2 className="text-2xl font-bold text-white">
                Funding Repository
              </h2>

              <p className="text-slate-400 text-sm">
                Explore and manage research funding opportunities.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={fetchFunding}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2.5 rounded-lg transition"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-4 py-2.5 rounded-lg transition"
            >
              <Plus size={18} />
              Add Funding
            </button>

          </div>

        </div>

        {/* =====================================================
            SEARCH + FILTER
        ====================================================== */}

        <div className="flex flex-col lg:flex-row gap-4 mb-6">

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search title, organization, domain..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition"
            />

          </div>

          <div className="flex items-center gap-2">

            <Filter
              size={18}
              className="text-slate-400"
            />

            <select
              value={domainFilter}
              onChange={(e) =>
                setDomainFilter(e.target.value)
              }
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              {domains.map((domain) => (
                <option
                  key={domain}
                  value={domain}
                >
                  Domain: {domain}
                </option>
              ))}
            </select>

          </div>

          {(search ||
            domainFilter !== "All") && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl px-4 py-3 hover:bg-red-500/20 transition"
            >
              <X size={18} />
              Clear
            </button>
          )}

        </div>

        {/* =====================================================
            RESULT COUNT
        ====================================================== */}

        <div className="mb-4 text-slate-400 text-sm">
          Showing {filteredFunding.length} of{" "}
          {funding.length} funding opportunities
        </div>

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div className="text-center py-12">

            <RefreshCw
              className="mx-auto text-cyan-400 animate-spin"
              size={35}
            />

            <p className="text-slate-400 mt-3">
              Loading funding opportunities...
            </p>

          </div>
        ) : (

          /* ===================================================
             TABLE
          ==================================================== */

          <div className="overflow-x-auto rounded-xl">

            <table className="w-full">

              <thead className="bg-slate-800 text-slate-300">

                <tr>

                  <th className="px-5 py-4 text-left">
                    #
                  </th>

                  <th className="px-5 py-4 text-left">
                    Funding Opportunity
                  </th>

                  <th className="px-5 py-4 text-left">
                    Organization
                  </th>

                  <th className="px-5 py-4 text-left">
                    Domain
                  </th>

                  <th className="px-5 py-4 text-left">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left">
                    Deadline
                  </th>

                  <th className="px-5 py-4 text-left">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredFunding.length > 0 ? (
                  filteredFunding.map(
                    (item, index) => {

                      const amount =
                        parseFundingAmount(
                          item.funding_amount
                        );

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-slate-800 hover:bg-slate-800/60 transition"
                        >

                          <td className="px-5 py-4 text-slate-500">
                            {index + 1}
                          </td>

                          <td className="px-5 py-4">

                            <p className="font-medium text-white">
                              {item.title}
                            </p>

                          </td>

                          <td className="px-5 py-4 text-slate-300">
                            {item.organization}
                          </td>

                          <td className="px-5 py-4">

                            <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                              {item.research_domain}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold">
                              ₹{" "}
                              {amount.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-slate-300">
                            {formatDate(item.deadline)}
                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <button
                                onClick={() =>
                                  openDetails(item)
                                }
                                title="View"
                                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                              >
                                <Eye size={17} />
                              </button>

                              <button
                                onClick={() =>
                                  openEditForm(item)
                                }
                                title="Edit"
                                className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition"
                              >
                                <Pencil size={17} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(item.id)
                                }
                                title="Delete"
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                              >
                                <Trash2 size={17} />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-12 text-slate-400"
                    >

                      <Landmark
                        className="mx-auto mb-3 text-slate-600"
                        size={40}
                      />

                      <p className="text-lg">
                        No funding opportunities found
                      </p>

                      <p className="text-sm mt-1">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center p-6 border-b border-slate-700">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {editingId
                    ? "Edit Funding Opportunity"
                    : "Add Funding Opportunity"}
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Enter the funding opportunity details.
                </p>

              </div>

              <button
                onClick={closeForm}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              <div>

                <label className="block text-slate-300 text-sm mb-2">
                  Title
                </label>

                <input
                  required
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. AI Research Grant"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-slate-300 text-sm mb-2">
                    Organization
                  </label>

                  <input
                    required
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="e.g. DST"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

                <div>

                  <label className="block text-slate-300 text-sm mb-2">
                    Research Domain
                  </label>

                  <input
                    required
                    name="research_domain"
                    value={form.research_domain}
                    onChange={handleChange}
                    placeholder="e.g. Artificial Intelligence"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

              </div>

              <div>

                <label className="block text-slate-300 text-sm mb-2">
                  Description
                </label>

                <textarea
                  required
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the funding opportunity..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

              </div>

              <div>

                <label className="block text-slate-300 text-sm mb-2">
                  Eligibility
                </label>

                <textarea
                  required
                  name="eligibility"
                  value={form.eligibility}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Who can apply?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-slate-300 text-sm mb-2">
                    Funding Amount
                  </label>

                  <input
                    required
                    name="funding_amount"
                    value={form.funding_amount}
                    onChange={handleChange}
                    placeholder="e.g. 1500000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

                <div>

                  <label className="block text-slate-300 text-sm mb-2">
                    Deadline
                  </label>

                  <input
                    required
                    type="date"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">

                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Funding"
                    : "Add Funding"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          DETAILS MODAL
      ====================================================== */}

      {showDetails && selectedFunding && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-start p-6 border-b border-slate-700">

              <div>

                <p className="text-cyan-400 text-sm font-medium">
                  Funding Opportunity #{selectedFunding.id}
                </p>

                <h2 className="text-2xl font-bold text-white mt-1">
                  {selectedFunding.title}
                </h2>

              </div>

              <button
                onClick={closeDetails}
                className="text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>

            </div>

            <div className="p-6 space-y-6">

              <div className="grid md:grid-cols-2 gap-4">

                <DetailItem
                  icon={<Building2 size={19} />}
                  label="Organization"
                  value={selectedFunding.organization}
                />

                <DetailItem
                  icon={<IndianRupee size={19} />}
                  label="Funding Amount"
                  value={selectedFunding.funding_amount}
                />

                <DetailItem
                  icon={<Calendar size={19} />}
                  label="Deadline"
                  value={formatDate(selectedFunding.deadline)}
                />

                <DetailItem
                  icon={<Landmark size={19} />}
                  label="Research Domain"
                  value={selectedFunding.research_domain}
                />

              </div>

              <div>

                <p className="text-slate-400 text-sm mb-2">
                  Description
                </p>

                <p className="text-slate-200 leading-7">
                  {selectedFunding.description}
                </p>

              </div>

              <div>

                <p className="text-slate-400 text-sm mb-2">
                  Eligibility
                </p>

                <p className="text-slate-200 leading-7">
                  {selectedFunding.eligibility}
                </p>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">

                <button
                  onClick={() =>
                    openEditForm(selectedFunding)
                  }
                  className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-4 py-2.5 rounded-lg"
                >
                  <Pencil size={17} />
                  Edit
                </button>

                <button
                  onClick={closeDetails}
                  className="px-5 py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


/* ============================================================
   DETAIL ITEM
============================================================ */

function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">

      <div className="flex items-center gap-2 text-slate-400 text-sm">
        {icon}
        {label}
      </div>

      <p className="text-white font-semibold mt-2">
        {value || "Not specified"}
      </p>

    </div>
  );
}