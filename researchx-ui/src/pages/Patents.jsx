import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Search,
  Filter,
  Eye,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000/patents";

const initialForm = {
  patent_title: "",
  abstract: "",
  assignee: "",
  filing_date: "",
  patent_classification: "",
  technology_domain: "",
  citation_count: 0,
  country: "",
  status: "Pending",
};

function Patents() {
  // =====================================================
  // STATE
  // =====================================================

  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [editingPatent, setEditingPatent] = useState(null);
  const [selectedPatent, setSelectedPatent] = useState(null);

  const [form, setForm] = useState(initialForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Search and filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  // =====================================================
  // LOAD PATENTS
  // =====================================================

  const loadPatents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL + "/");

      setPatents(response.data);
    } catch (err) {
      console.error("GET PATENTS ERROR:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load patents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatents();
  }, []);

  // =====================================================
  // FORM INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "citation_count"
          ? Number(value)
          : value,
    }));
  };

  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {
    setError("");
    setSuccess("");

    setEditingPatent(null);
    setForm(initialForm);

    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (patent) => {
    setError("");
    setSuccess("");

    setEditingPatent(patent);

    setForm({
      patent_title: patent.patent_title || "",
      abstract: patent.abstract || "",
      assignee: patent.assignee || "",
      filing_date: patent.filing_date || "",
      patent_classification:
        patent.patent_classification || "",
      technology_domain:
        patent.technology_domain || "",
      citation_count:
        Number(patent.citation_count || 0),
      country: patent.country || "",
      status: patent.status || "Pending",
    });

    setShowForm(true);
  };

  // =====================================================
  // VIEW PATENT DETAILS
  // =====================================================

  const openDetails = (patent) => {
    setSelectedPatent(patent);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setSelectedPatent(null);
    setShowDetails(false);
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSuccess("");

      if (editingPatent) {
        await axios.put(
          API_URL + "/" + editingPatent.id,
          form
        );

        setSuccess(
          "Patent updated successfully."
        );
      } else {
        await axios.post(
          API_URL + "/",
          form
        );

        setSuccess(
          "Patent added successfully."
        );
      }

      setForm(initialForm);
      setEditingPatent(null);
      setShowForm(false);

      await loadPatents();
    } catch (err) {
      console.error("SAVE PATENT ERROR:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to save patent."
      );
    }
  };

  // =====================================================
  // DELETE PATENT
  // =====================================================

  const handleDelete = async (patent) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${patent.patent_title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await axios.delete(
        API_URL + "/" + patent.id
      );

      setSuccess(
        "Patent deleted successfully."
      );

      if (
        selectedPatent &&
        selectedPatent.id === patent.id
      ) {
        closeDetails();
      }

      await loadPatents();
    } catch (err) {
      console.error("DELETE PATENT ERROR:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to delete patent."
      );
    }
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingPatent(null);
    setForm(initialForm);
  };

  // =====================================================
  // FILTER VALUES
  // =====================================================

  const domains = [
    "All",
    ...new Set(
      patents
        .map((patent) => patent.technology_domain)
        .filter(Boolean)
    ),
  ];

  const countries = [
    "All",
    ...new Set(
      patents
        .map((patent) => patent.country)
        .filter(Boolean)
    ),
  ];

  const statuses = [
    "All",
    ...new Set(
      patents
        .map((patent) => patent.status)
        .filter(Boolean)
    ),
  ];

  // =====================================================
  // FILTER PATENTS
  // =====================================================

  const filteredPatents = patents.filter((patent) => {
    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      searchText === "" ||
      patent.patent_title
        ?.toLowerCase()
        .includes(searchText) ||
      patent.abstract
        ?.toLowerCase()
        .includes(searchText) ||
      patent.assignee
        ?.toLowerCase()
        .includes(searchText) ||
      patent.technology_domain
        ?.toLowerCase()
        .includes(searchText) ||
      patent.patent_classification
        ?.toLowerCase()
        .includes(searchText) ||
      patent.country
        ?.toLowerCase()
        .includes(searchText) ||
      patent.status
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      patent.status === statusFilter;

    const matchesDomain =
      domainFilter === "All" ||
      patent.technology_domain === domainFilter;

    const matchesCountry =
      countryFilter === "All" ||
      patent.country === countryFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDomain &&
      matchesCountry
    );
  });

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDomainFilter("All");
    setCountryFilter("All");
  };

  const filtersActive =
    search !== "" ||
    statusFilter !== "All" ||
    domainFilter !== "All" ||
    countryFilter !== "All";

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalPatents = patents.length;

  const grantedPatents = patents.filter(
    (patent) => patent.status === "Granted"
  ).length;

  const pendingPatents = patents.filter(
    (patent) => patent.status === "Pending"
  ).length;

  const publishedPatents = patents.filter(
    (patent) => patent.status === "Published"
  ).length;

  const totalCitations = patents.reduce(
    (total, patent) =>
      total + Number(patent.citation_count || 0),
    0
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 overflow-auto p-8">

        <Header
          title="Patents"
          subtitle="Manage and explore research patents."
        />

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mt-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
            {success}
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================== */}

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Total Patents
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {totalPatents}
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Granted
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {grantedPatents}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-500/20 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingPatents}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Published
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-400">
              {publishedPatents}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Total Citations
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {totalCitations}
            </p>
          </div>

        </div>

        {/* =================================================
            PATENT REPOSITORY
        ================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">

          {/* HEADER */}

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Patent Repository
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Showing {filteredPatents.length} of{" "}
                {patents.length} patents
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={loadPatents}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-slate-300 transition hover:border-cyan-400 hover:text-white"
              >
                Refresh
              </button>

              <button
                type="button"
                onClick={openAddForm}
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
              >
                <Plus size={18} />
                Add Patent
              </button>

            </div>

          </div>

          {/* =================================================
              SEARCH + FILTERS
          ================================================== */}

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12">

            {/* SEARCH */}

            <div className="relative lg:col-span-5">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search patents, assignee, domain..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
              />

            </div>

            {/* STATUS */}

            <div className="lg:col-span-2">

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >

                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    Status: {status}
                  </option>
                ))}

              </select>

            </div>

            {/* DOMAIN */}

            <div className="lg:col-span-2">

              <select
                value={domainFilter}
                onChange={(event) =>
                  setDomainFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
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

            {/* COUNTRY */}

            <div className="lg:col-span-2">

              <select
                value={countryFilter}
                onChange={(event) =>
                  setCountryFilter(event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
              >

                {countries.map((country) => (
                  <option
                    key={country}
                    value={country}
                  >
                    Country: {country}
                  </option>
                ))}

              </select>

            </div>

            {/* CLEAR */}

            <div className="lg:col-span-1">

              <button
                type="button"
                onClick={clearFilters}
                disabled={!filtersActive}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 transition ${
                  filtersActive
                    ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    : "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-600"
                }`}
              >
                <X size={18} />
                Clear
              </button>

            </div>

          </div>

          {/* FILTER INFO */}

          {filtersActive && (
            <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">

              <Filter size={16} />

              <span>
                Filters active —{" "}
                {filteredPatents.length} matching patent
                {filteredPatents.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>
          )}

          {/* =================================================
              TABLE
          ================================================== */}

          {loading ? (

            <div className="py-12 text-center text-cyan-400">
              Loading patents...
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-slate-800">

                  <tr>

                    <th className="px-4 py-4 text-left text-slate-300">
                      #
                    </th>

                    <th className="px-4 py-4 text-left text-slate-300">
                      Patent
                    </th>

                    <th className="px-4 py-4 text-left text-slate-300">
                      Domain
                    </th>

                    <th className="px-4 py-4 text-left text-slate-300">
                      Country
                    </th>

                    <th className="px-4 py-4 text-left text-slate-300">
                      Status
                    </th>

                    <th className="px-4 py-4 text-left text-slate-300">
                      Citations
                    </th>

                    <th className="px-4 py-4 text-left text-slate-300">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredPatents.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="py-12 text-center"
                      >

                        <Search
                          size={40}
                          className="mx-auto mb-3 text-slate-600"
                        />

                        <p className="text-lg text-slate-300">
                          No patents found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or
                          filters.
                        </p>

                        {filtersActive && (
                          <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-400"
                          >
                            Clear Filters
                          </button>
                        )}

                      </td>

                    </tr>

                  ) : (

                    filteredPatents.map(
                      (patent, index) => (

                        <tr
                          key={patent.id}
                          className="border-b border-slate-800 transition hover:bg-slate-800"
                        >

                          <td className="px-4 py-4 text-slate-500">
                            {index + 1}
                          </td>

                          <td className="max-w-[300px] px-4 py-4 font-medium text-white">
                            {patent.patent_title}
                          </td>

                          <td className="px-4 py-4 text-cyan-300">
                            {patent.technology_domain}
                          </td>

                          <td className="px-4 py-4 text-slate-300">
                            {patent.country}
                          </td>

                          <td className="px-4 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-sm font-medium ${
                                patent.status ===
                                "Granted"
                                  ? "bg-green-500/20 text-green-400"
                                  : patent.status ===
                                    "Pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {patent.status}
                            </span>

                          </td>

                          <td className="px-4 py-4">

                            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300">
                              {patent.citation_count}
                            </span>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-4 py-4">

                            <div className="flex flex-wrap items-center gap-2">

                              {/* VIEW */}

                              <button
                                type="button"
                                onClick={() =>
                                  openDetails(patent)
                                }
                                className="flex items-center gap-2 rounded-lg bg-cyan-500/10 px-3 py-2 text-cyan-400 transition hover:bg-cyan-500/20"
                              >
                                <Eye size={16} />
                                View
                              </button>

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  openEditForm(patent)
                                }
                                className="flex items-center gap-2 rounded-lg bg-blue-500/10 px-3 py-2 text-blue-400 transition hover:bg-blue-500/20"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(patent)
                                }
                                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-red-400 transition hover:bg-red-500/20"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

      {/* ===================================================
          VIEW PATENT DETAILS MODAL
      ==================================================== */}

      {showDetails && selectedPatent && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeDetails}
        >

          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* DETAILS HEADER */}

            <div className="flex items-start justify-between border-b border-slate-700 p-6">

              <div className="pr-5">

                <p className="mb-2 text-sm font-medium text-cyan-400">
                  Patent #{selectedPatent.id}
                </p>

                <h2 className="text-2xl font-bold text-white">
                  {selectedPatent.patent_title}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="text-slate-400 transition hover:text-white"
              >
                <X size={24} />
              </button>

            </div>

            {/* DETAILS BODY */}

            <div className="space-y-6 p-6">

              {/* ABSTRACT */}

              <div>

                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cyan-400">
                  Abstract
                </h3>

                <p className="rounded-xl border border-slate-700 bg-slate-800 p-4 leading-7 text-slate-300">
                  {selectedPatent.abstract ||
                    "No abstract available."}
                </p>

              </div>

              {/* INFORMATION GRID */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                  <p className="text-sm text-slate-500">
                    Assignee
                  </p>

                  <p className="mt-1 font-medium text-white">
                    {selectedPatent.assignee ||
                      "Not available"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                  <p className="text-sm text-slate-500">
                    Filing Date
                  </p>

                  <p className="mt-1 font-medium text-white">
                    {selectedPatent.filing_date ||
                      "Not available"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                  <p className="text-sm text-slate-500">
                    Patent Classification
                  </p>

                  <p className="mt-1 font-medium text-white">
                    {selectedPatent.patent_classification ||
                      "Not available"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                  <p className="text-sm text-slate-500">
                    Technology Domain
                  </p>

                  <p className="mt-1 font-medium text-cyan-300">
                    {selectedPatent.technology_domain ||
                      "Not available"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                  <p className="text-sm text-slate-500">
                    Country
                  </p>

                  <p className="mt-1 font-medium text-white">
                    {selectedPatent.country ||
                      "Not available"}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                  <p className="text-sm text-slate-500">
                    Citation Count
                  </p>

                  <p className="mt-1 font-medium text-cyan-400">
                    {selectedPatent.citation_count || 0}
                  </p>

                </div>

              </div>

              {/* STATUS */}

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

                <p className="mb-2 text-sm text-slate-500">
                  Status
                </p>

                <span
                  className={`inline-block rounded-full px-4 py-2 text-sm font-medium ${
                    selectedPatent.status ===
                    "Granted"
                      ? "bg-green-500/20 text-green-400"
                      : selectedPatent.status ===
                        "Pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {selectedPatent.status}
                </span>

              </div>

            </div>

            {/* DETAILS FOOTER */}

            <div className="flex justify-end border-t border-slate-700 p-6">

              <button
                type="button"
                onClick={closeDetails}
                className="rounded-xl bg-slate-800 px-6 py-3 text-slate-300 transition hover:bg-slate-700 hover:text-white"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ===================================================
          ADD / EDIT MODAL
      ==================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900">

            {/* FORM HEADER */}

            <div className="flex items-center justify-between border-b border-slate-700 p-6">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {editingPatent
                    ? "Edit Patent"
                    : "Add New Patent"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {editingPatent
                    ? "Update patent information."
                    : "Enter the new patent information."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeForm}
                className="text-slate-400 hover:text-white"
              >
                <X size={22} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Patent Title
                </label>

                <input
                  type="text"
                  name="patent_title"
                  value={form.patent_title}
                  onChange={handleChange}
                  required
                  placeholder="Enter patent title"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

              </div>

              {/* ABSTRACT */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Abstract
                </label>

                <textarea
                  name="abstract"
                  value={form.abstract}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter patent abstract"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* ASSIGNEE */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Assignee
                  </label>

                  <input
                    type="text"
                    name="assignee"
                    value={form.assignee}
                    onChange={handleChange}
                    required
                    placeholder="Enter assignee"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

                {/* FILING DATE */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Filing Date
                  </label>

                  <input
                    type="date"
                    name="filing_date"
                    value={form.filing_date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

                {/* CLASSIFICATION */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Patent Classification
                  </label>

                  <input
                    type="text"
                    name="patent_classification"
                    value={form.patent_classification}
                    onChange={handleChange}
                    required
                    placeholder="Example: G06N"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

                {/* DOMAIN */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Technology Domain
                  </label>

                  <input
                    type="text"
                    name="technology_domain"
                    value={form.technology_domain}
                    onChange={handleChange}
                    required
                    placeholder="Example: Artificial Intelligence"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

                {/* COUNTRY */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    placeholder="Example: India"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

                {/* CITATIONS */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Citation Count
                  </label>

                  <input
                    type="number"
                    name="citation_count"
                    value={form.citation_count}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />

                </div>

                {/* STATUS */}

                <div>

                  <label className="mb-2 block text-sm text-slate-300">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Granted">
                      Granted
                    </option>

                    <option value="Published">
                      Published
                    </option>

                  </select>

                </div>

              </div>

              {/* FORM BUTTONS */}

              <div className="flex justify-end gap-3 border-t border-slate-700 pt-5">

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl bg-slate-800 px-5 py-3 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
                >
                  {editingPatent
                    ? "Update Patent"
                    : "Save Patent"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Patents;