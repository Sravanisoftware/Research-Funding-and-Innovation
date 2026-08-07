import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import {
  BarChart3,
  RefreshCw,
  FileText,
  CheckCircle,
  Clock,
  Globe,
  TrendingUp,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const API_URL = "http://127.0.0.1:8000";

function Analytics() {
  const [statistics, setStatistics] = useState({
    total_patents: 0,
    granted_patents: 0,
    pending_patents: 0,
    published_patents: 0,
  });

  const [domainData, setDomainData] = useState([]);
  const [patents, setPatents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ANALYTICS
  // ==========================================

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        statisticsResponse,
        domainResponse,
        patentsResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/patents/statistics`),
        axios.get(`${API_URL}/patents/domain-summary`),
        axios.get(`${API_URL}/patents/`),
      ]);

      setStatistics(statisticsResponse.data);
      setDomainData(domainResponse.data);
      setPatents(patentsResponse.data);
    } catch (err) {
      console.error("Analytics error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load patent analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // ==========================================
  // TOTAL CITATIONS
  // ==========================================

  const totalCitations = patents.reduce(
    (sum, patent) =>
      sum + Number(patent.citation_count || 0),
    0
  );

  // ==========================================
  // AVERAGE CITATIONS
  // ==========================================

  const averageCitations =
    patents.length > 0
      ? (totalCitations / patents.length).toFixed(1)
      : "0.0";

  // ==========================================
  // MOST ACTIVE DOMAIN
  // ==========================================

  const mostActiveDomain =
    domainData.length > 0
      ? [...domainData].sort(
          (a, b) => b.count - a.count
        )[0]
      : null;

  // ==========================================
  // CITATION DATA
  // ==========================================

  const citationData = [...patents]
    .sort(
      (a, b) =>
        Number(b.citation_count || 0) -
        Number(a.citation_count || 0)
    )
    .map((patent) => ({
      patent:
        patent.patent_title?.length > 28
          ? patent.patent_title.substring(0, 28) + "..."
          : patent.patent_title,
      citations: Number(patent.citation_count || 0),
    }));

  // ==========================================
  // DOMAIN CHART DATA
  // ==========================================

  const chartDomainData = domainData.map((item) => ({
    domain:
      item.technology_domain?.length > 18
        ? item.technology_domain.substring(0, 18) + "..."
        : item.technology_domain,
    count: Number(item.count || 0),
  }));

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="flex-1 p-8">
          <Header
            title="Analytics"
            subtitle="Analyze research and patent intelligence."
          />

          <div className="flex items-center justify-center py-20">
            <p className="text-cyan-400">
              Loading analytics...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 overflow-auto p-8">

        <Header
          title="Analytics"
          subtitle="Analyze research and patent intelligence."
        />

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* ======================================
            REFRESH
        ====================================== */}

        <div className="mt-8 flex justify-end">

          <button
            type="button"
            onClick={loadAnalytics}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            <RefreshCw size={18} />

            Refresh Analytics
          </button>

        </div>

        {/* ======================================
            STATISTICS CARDS
        ====================================== */}

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">

          {/* TOTAL PATENTS */}

          <StatCard
            title="Total Patents"
            value={statistics.total_patents}
            icon={<FileText size={22} />}
            iconClass="text-cyan-400"
          />

          {/* GRANTED */}

          <StatCard
            title="Granted"
            value={statistics.granted_patents}
            icon={<CheckCircle size={22} />}
            iconClass="text-green-400"
            valueClass="text-green-400"
          />

          {/* PENDING */}

          <StatCard
            title="Pending"
            value={statistics.pending_patents}
            icon={<Clock size={22} />}
            iconClass="text-yellow-400"
            valueClass="text-yellow-400"
          />

          {/* CITATIONS */}

          <StatCard
            title="Total Citations"
            value={totalCitations}
            icon={<TrendingUp size={22} />}
            iconClass="text-cyan-400"
            valueClass="text-cyan-400"
          />

          {/* DOMAINS */}

          <StatCard
            title="Technology Domains"
            value={domainData.length}
            icon={<Globe size={22} />}
            iconClass="text-purple-400"
            valueClass="text-purple-400"
          />

        </div>

        {/* ======================================
            CHARTS
        ====================================== */}

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* DOMAIN CHART */}

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-cyan-500/10 p-3">
                <BarChart3
                  size={22}
                  className="text-cyan-400"
                />
              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Patents by Technology Domain
                </h2>

                <p className="text-sm text-slate-400">
                  Number of patents in each research domain.
                </p>

              </div>

            </div>

            <div className="mt-8 h-[320px] w-full">

              {chartDomainData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={chartDomainData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 50,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />

                    <XAxis
                      dataKey="domain"
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      tick={{
                        fill: "#94a3b8",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                    />

                    <Bar
                      dataKey="count"
                      name="Patents"
                      fill="#22d3ee"
                      radius={[8, 8, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No domain data available.
                </div>
              )}

            </div>

          </div>

          {/* CITATION CHART */}

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-purple-500/10 p-3">
                <TrendingUp
                  size={22}
                  className="text-purple-400"
                />
              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Patent Citation Ranking
                </h2>

                <p className="text-sm text-slate-400">
                  Patents ranked by citation count.
                </p>

              </div>

            </div>

            <div className="mt-8 h-[320px] w-full">

              {citationData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={citationData}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 20,
                      left: 20,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                    />

                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tick={{
                        fill: "#94a3b8",
                      }}
                    />

                    <YAxis
                      type="category"
                      dataKey="patent"
                      width={150}
                      tick={{
                        fill: "#94a3b8",
                        fontSize: 11,
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                    />

                    <Bar
                      dataKey="citations"
                      name="Citations"
                      fill="#a78bfa"
                      radius={[0, 8, 8, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No citation data available.
                </div>
              )}

            </div>

          </div>

        </div>

        {/* ======================================
            STATUS ANALYSIS
        ====================================== */}

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-green-500/10 p-3">
              <CheckCircle
                size={22}
                className="text-green-400"
              />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Patent Status Analysis
              </h2>

              <p className="text-sm text-slate-400">
                Current status distribution.
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-6">

            <StatusRow
              label="Granted"
              value={statistics.granted_patents}
              total={statistics.total_patents}
              textClass="text-green-400"
              barClass="bg-green-400"
            />

            <StatusRow
              label="Pending"
              value={statistics.pending_patents}
              total={statistics.total_patents}
              textClass="text-yellow-400"
              barClass="bg-yellow-400"
            />

            <StatusRow
              label="Published"
              value={statistics.published_patents}
              total={statistics.total_patents}
              textClass="text-blue-400"
              barClass="bg-blue-400"
            />

          </div>

        </div>

        {/* ======================================
            CITATION TABLE
        ====================================== */}

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">

          <div className="flex items-center gap-3">

            <TrendingUp
              size={22}
              className="text-cyan-400"
            />

            <div>

              <h2 className="text-xl font-bold">
                Citation Ranking
              </h2>

              <p className="text-sm text-slate-400">
                Highest-cited patents in your repository.
              </p>

            </div>

          </div>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-700">

                  <th className="px-4 py-4 text-left text-sm text-slate-400">
                    Rank
                  </th>

                  <th className="px-4 py-4 text-left text-sm text-slate-400">
                    Patent
                  </th>

                  <th className="px-4 py-4 text-left text-sm text-slate-400">
                    Domain
                  </th>

                  <th className="px-4 py-4 text-left text-sm text-slate-400">
                    Status
                  </th>

                  <th className="px-4 py-4 text-left text-sm text-slate-400">
                    Citations
                  </th>

                </tr>

              </thead>

              <tbody>

                {[...patents]
                  .sort(
                    (a, b) =>
                      Number(b.citation_count || 0) -
                      Number(a.citation_count || 0)
                  )
                  .map((patent, index) => (

                    <tr
                      key={patent.id}
                      className="border-b border-slate-800 transition hover:bg-slate-800"
                    >

                      <td className="px-4 py-4 font-semibold text-slate-500">
                        #{index + 1}
                      </td>

                      <td className="px-4 py-4 font-medium text-white">
                        {patent.patent_title}
                      </td>

                      <td className="px-4 py-4 text-cyan-300">
                        {patent.technology_domain}
                      </td>

                      <td className="px-4 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            patent.status === "Granted"
                              ? "bg-green-500/20 text-green-400"
                              : patent.status === "Pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-blue-500/20 text-blue-400"
                          }`}
                        >
                          {patent.status}
                        </span>

                      </td>

                      <td className="px-4 py-4">

                        <span className="rounded-full bg-cyan-500/10 px-4 py-2 font-semibold text-cyan-300">
                          {patent.citation_count}
                        </span>

                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* ======================================
            INTELLIGENCE SUMMARY
        ====================================== */}

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">

          <div className="flex items-center gap-3">

            <TrendingUp className="text-cyan-400" />

            <h2 className="text-xl font-bold">
              Patent Intelligence Summary
            </h2>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* MOST ACTIVE DOMAIN */}

            <div className="rounded-xl bg-slate-800 p-5">

              <p className="text-sm text-slate-400">
                Most Active Domain
              </p>

              <p className="mt-2 text-lg font-semibold text-cyan-400">

                {mostActiveDomain
                  ? mostActiveDomain.technology_domain
                  : "No data"}

              </p>

              {mostActiveDomain && (
                <p className="mt-1 text-sm text-slate-400">

                  {mostActiveDomain.count} patent
                  {mostActiveDomain.count !== 1
                    ? "s"
                    : ""}

                </p>
              )}

            </div>

            {/* AVERAGE CITATIONS */}

            <div className="rounded-xl bg-slate-800 p-5">

              <p className="text-sm text-slate-400">
                Average Citations
              </p>

              <p className="mt-2 text-lg font-semibold text-cyan-400">
                {averageCitations}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                citations per patent
              </p>

            </div>

            {/* GRANT RATE */}

            <div className="rounded-xl bg-slate-800 p-5">

              <p className="text-sm text-slate-400">
                Grant Rate
              </p>

              <p className="mt-2 text-lg font-semibold text-green-400">

                {statistics.total_patents > 0
                  ? (
                      (statistics.granted_patents /
                        statistics.total_patents) *
                      100
                    ).toFixed(0)
                  : 0}
                %

              </p>

              <p className="mt-1 text-sm text-slate-400">
                of all patents
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

// ==========================================
// STAT CARD
// ==========================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
  valueClass = "text-white",
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${valueClass}`}
          >
            {value}
          </p>

        </div>

        <div className="rounded-xl bg-slate-800 p-3">
          <span className={iconClass}>
            {icon}
          </span>
        </div>

      </div>

    </div>
  );
}

// ==========================================
// STATUS ROW
// ==========================================

function StatusRow({
  label,
  value,
  total,
  textClass,
  barClass,
}) {
  const percentage =
    total > 0
      ? ((value / total) * 100).toFixed(0)
      : 0;

  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-slate-300">
          {label}
        </span>

        <span
          className={`font-semibold ${textClass}`}
        >
          {value} ({percentage}%)
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full ${barClass}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

export default Analytics;