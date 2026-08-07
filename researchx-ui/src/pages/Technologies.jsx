import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  Search,
  RefreshCw,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Cpu,
  TrendingUp,
  Activity,
  BarChart3,
  AlertCircle,
} from "lucide-react";

const API = "http://127.0.0.1:8000/technologies";

const emptyForm = {
  technology_name: "",
  category: "",
  description: "",
  maturity_level: "",
  growth_score: "",
  adoption_rate: "",
};

export default function Technologies() {
  const [technologies, setTechnologies] = useState([]);
  const [statistics, setStatistics] = useState({
    total_technologies: 0,
    average_growth_score: 0,
    average_adoption_rate: 0,
  });

  const [categoryAnalytics, setCategoryAnalytics] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maturity, setMaturity] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);

  // =========================================================
  // LOAD DATA
  // =========================================================

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [techResponse, statsResponse, categoryResponse] =
        await Promise.all([
          axios.get(`${API}/`),
          axios.get(`${API}/statistics`),
          axios.get(`${API}/analytics/category`),
        ]);

      setTechnologies(techResponse.data);
      setStatistics(statsResponse.data);
      setCategoryAnalytics(categoryResponse.data);
    } catch (err) {
      console.error("Technology loading error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load technology data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================================================
  // FILTERS
  // =========================================================

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        technologies
          .map((technology) => technology.category)
          .filter(Boolean)
      ),
    ];
  }, [technologies]);

  const maturityLevels = useMemo(() => {
    return [
      "All",
      ...new Set(
        technologies
          .map((technology) => technology.maturity_level)
          .filter(Boolean)
      ),
    ];
  }, [technologies]);

  const filteredTechnologies = useMemo(() => {
    return technologies.filter((technology) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        technology.technology_name
          ?.toLowerCase()
          .includes(searchText) ||
        technology.category
          ?.toLowerCase()
          .includes(searchText) ||
        technology.description
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        technology.category === category;

      const matchesMaturity =
        maturity === "All" ||
        technology.maturity_level === maturity;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMaturity
      );
    });
  }, [technologies, search, category, maturity]);

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

  // =========================================================
  // ADD
  // =========================================================

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.post(`${API}/`, {
        technology_name: form.technology_name,
        category: form.category,
        description: form.description,
        maturity_level: form.maturity_level,
        growth_score: Number(form.growth_score),
        adoption_rate: Number(form.adoption_rate),
      });

      setShowAddModal(false);
      setForm(emptyForm);

      await fetchData();

      alert("Technology added successfully.");
    } catch (err) {
      console.error("Add technology error:", err);

      alert(
        err.response?.data?.detail ||
          "Unable to add technology."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // VIEW
  // =========================================================

  const handleView = async (id) => {
    try {
      const response = await axios.get(`${API}/${id}`);

      setSelectedTechnology(response.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("View technology error:", err);

      alert(
        err.response?.data?.detail ||
          "Unable to load technology details."
      );
    }
  };

  // =========================================================
  // EDIT
  // =========================================================

  const openEdit = (technology) => {
    setSelectedTechnology(technology);

    setForm({
      technology_name: technology.technology_name || "",
      category: technology.category || "",
      description: technology.description || "",
      maturity_level: technology.maturity_level || "",
      growth_score: technology.growth_score ?? "",
      adoption_rate: technology.adoption_rate ?? "",
    });

    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!selectedTechnology) return;

    try {
      setSaving(true);

      await axios.put(
        `${API}/${selectedTechnology.id}`,
        {
          technology_name: form.technology_name,
          category: form.category,
          description: form.description,
          maturity_level: form.maturity_level,
          growth_score: Number(form.growth_score),
          adoption_rate: Number(form.adoption_rate),
        }
      );

      setShowEditModal(false);
      setSelectedTechnology(null);
      setForm(emptyForm);

      await fetchData();

      alert("Technology updated successfully.");
    } catch (err) {
      console.error("Update technology error:", err);

      alert(
        err.response?.data?.detail ||
          "Unable to update technology."
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
      "Are you sure you want to delete this technology?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API}/${id}`);

      await fetchData();

      alert("Technology deleted successfully.");
    } catch (err) {
      console.error("Delete technology error:", err);

      alert(
        err.response?.data?.detail ||
          "Unable to delete technology."
      );
    }
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setMaturity("All");
  };

  const filtersActive =
    search.trim() !== "" ||
    category !== "All" ||
    maturity !== "All";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <Header
          title="Technology Intelligence"
          subtitle="Analyze emerging technologies, adoption, and growth trends."
        />

        {/* ERROR */}
        {error && (
          <div className="mt-6 bg-red-950/30 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={22} />

            <p className="text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <SummaryCard
            icon={<Cpu size={28} />}
            title="Total Technologies"
            value={statistics.total_technologies}
          />

          <SummaryCard
            icon={<TrendingUp size={28} />}
            title="Average Growth Score"
            value={statistics.average_growth_score}
          />

          <SummaryCard
            icon={<Activity size={28} />}
            title="Average Adoption Rate"
            value={`${statistics.average_adoption_rate}%`}
          />
        </div>

        {/* REPOSITORY */}
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl">
          <div className="p-6 border-b border-slate-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Technology Repository
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Explore and manage technology intelligence.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={fetchData}
                  className="flex items-center gap-2 border border-slate-600 text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-800"
                >
                  <RefreshCw size={17} />
                  Refresh
                </button>

                <button
                  onClick={() => {
                    setForm(emptyForm);
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400"
                >
                  <Plus size={18} />
                  Add Technology
                </button>
              </div>
            </div>

            {/* SEARCH + FILTERS */}
            <div className="grid lg:grid-cols-3 gap-4 mt-6">
              <div className="lg:col-span-1 relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search technology, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    Category: {item}
                  </option>
                ))}
              </select>

              <select
                value={maturity}
                onChange={(e) => setMaturity(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
              >
                {maturityLevels.map((item) => (
                  <option key={item} value={item}>
                    Maturity: {item}
                  </option>
                ))}
              </select>
            </div>

            {filtersActive && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-cyan-400 text-sm">
                  Filters active — {filteredTechnologies.length} matching technologies
                </p>

                <button
                  onClick={clearFilters}
                  className="text-sm text-slate-300 hover:text-white"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw
                className="mx-auto text-cyan-400 animate-spin"
                size={35}
              />

              <p className="text-slate-400 mt-3">
                Loading technologies...
              </p>
            </div>
          ) : filteredTechnologies.length === 0 ? (
            <div className="p-12 text-center">
              <Cpu
                className="mx-auto text-slate-600"
                size={45}
              />

              <p className="text-slate-400 mt-3">
                No technologies found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 text-left">
                    <th className="px-6 py-4 text-slate-400 text-sm">
                      #
                    </th>

                    <th className="px-6 py-4 text-slate-400 text-sm">
                      Technology
                    </th>

                    <th className="px-6 py-4 text-slate-400 text-sm">
                      Category
                    </th>

                    <th className="px-6 py-4 text-slate-400 text-sm">
                      Maturity
                    </th>

                    <th className="px-6 py-4 text-slate-400 text-sm">
                      Growth
                    </th>

                    <th className="px-6 py-4 text-slate-400 text-sm">
                      Adoption
                    </th>

                    <th className="px-6 py-4 text-slate-400 text-sm">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTechnologies.map(
                    (technology, index) => (
                      <tr
                        key={technology.id}
                        className="border-b border-slate-800 hover:bg-slate-800/40"
                      >
                        <td className="px-6 py-5 text-slate-400">
                          {index + 1}
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-white font-semibold">
                            {technology.technology_name}
                          </p>

                          <p className="text-slate-500 text-sm mt-1 max-w-xs truncate">
                            {technology.description}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-slate-300">
                          {technology.category}
                        </td>

                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300">
                            {technology.maturity_level}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-green-300 font-semibold">
                            {technology.growth_score}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-yellow-300 font-semibold">
                            {technology.adoption_rate}%
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <ActionButton
                              title="View"
                              onClick={() =>
                                handleView(technology.id)
                              }
                            >
                              <Eye size={17} />
                            </ActionButton>

                            <ActionButton
                              title="Edit"
                              onClick={() =>
                                openEdit(technology)
                              }
                            >
                              <Pencil size={17} />
                            </ActionButton>

                            <ActionButton
                              title="Delete"
                              danger
                              onClick={() =>
                                handleDelete(technology.id)
                              }
                            >
                              <Trash2 size={17} />
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CATEGORY ANALYTICS */}
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3
              className="text-cyan-400"
              size={25}
            />

            <div>
              <h2 className="text-xl font-bold text-white">
                Category Analytics
              </h2>

              <p className="text-slate-400 text-sm">
                Technology distribution across categories.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryAnalytics.map((item) => (
              <div
                key={item.category}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5"
              >
                <p className="text-slate-400 text-sm">
                  {item.category}
                </p>

                <p className="text-white text-2xl font-bold mt-2">
                  {item.count}
                </p>

                <p className="text-slate-500 text-sm">
                  technology
                  {item.count !== 1 ? "ies" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ADD MODAL */}
      {showAddModal && (
        <TechnologyFormModal
          title="Add Technology"
          form={form}
          onChange={handleChange}
          onSubmit={handleAdd}
          onClose={() => {
            setShowAddModal(false);
            setForm(emptyForm);
          }}
          saving={saving}
          submitText="Add Technology"
        />
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <TechnologyFormModal
          title="Edit Technology"
          form={form}
          onChange={handleChange}
          onSubmit={handleEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTechnology(null);
            setForm(emptyForm);
          }}
          saving={saving}
          submitText="Update Technology"
        />
      )}

      {/* VIEW MODAL */}
      {showViewModal && selectedTechnology && (
        <ViewTechnologyModal
          technology={selectedTechnology}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTechnology(null);
          }}
        />
      )}
    </div>
  );
}

// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
      <div className="text-cyan-400 mb-4">
        {icon}
      </div>

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h3 className="text-white text-3xl font-bold mt-2">
        {value}
      </h3>
    </div>
  );
}

// =========================================================
// ACTION BUTTON
// =========================================================

function ActionButton({
  children,
  title,
  onClick,
  danger = false,
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-2 rounded-lg border transition ${
        danger
          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
          : "border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-400"
      }`}
    >
      {children}
    </button>
  );
}

// =========================================================
// FORM MODAL
// =========================================================

function TechnologyFormModal({
  title,
  form,
  onChange,
  onSubmit,
  onClose,
  saving,
  submitText,
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Technology Name"
          name="technology_name"
          value={form.technology_name}
          onChange={onChange}
          required
        />

        <Input
          label="Category"
          name="category"
          value={form.category}
          onChange={onChange}
          required
        />

        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows="4"
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Maturity Level
          </label>

          <select
            name="maturity_level"
            value={form.maturity_level}
            onChange={onChange}
            required
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
          >
            <option value="">Select maturity level</option>
            <option value="Emerging">Emerging</option>
            <option value="Growing">Growing</option>
            <option value="Mature">Mature</option>
          </select>
        </div>

        <Input
          label="Growth Score"
          name="growth_score"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={form.growth_score}
          onChange={onChange}
          required
        />

        <Input
          label="Adoption Rate"
          name="adoption_rate"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={form.adoption_rate}
          onChange={onChange}
          required
        />

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50"
          >
            {saving ? "Saving..." : submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// =========================================================
// INPUT
// =========================================================

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  ...props
}) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none focus:border-cyan-500"
      />
    </div>
  );
}

// =========================================================
// VIEW MODAL
// =========================================================

function ViewTechnologyModal({
  technology,
  onClose,
}) {
  return (
    <Modal
      title="Technology Details"
      onClose={onClose}
    >
      <div className="space-y-5">
        <Detail
          label="Technology Name"
          value={technology.technology_name}
        />

        <Detail
          label="Category"
          value={technology.category}
        />

        <Detail
          label="Description"
          value={technology.description}
        />

        <Detail
          label="Maturity Level"
          value={technology.maturity_level}
        />

        <div className="grid grid-cols-2 gap-4">
          <Detail
            label="Growth Score"
            value={technology.growth_score}
          />

          <Detail
            label="Adoption Rate"
            value={`${technology.adoption_rate}%`}
          />
        </div>

        <Detail
          label="Technology ID"
          value={technology.id}
        />
      </div>
    </Modal>
  );
}

// =========================================================
// DETAIL
// =========================================================

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-sm">
        {label}
      </p>

      <p className="text-white mt-1">
        {value}
      </p>
    </div>
  );
}

// =========================================================
// MODAL
// =========================================================

function Modal({
  title,
  children,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}