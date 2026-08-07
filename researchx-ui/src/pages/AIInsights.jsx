import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import {
  Sparkles,
  TrendingUp,
  Target,
  ShieldCheck,
  Award,
  Brain,
  RefreshCw,
  Lightbulb,
  CheckCircle,
  BarChart3,
  Rocket,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function AIInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/patents/ai-insights`
      );

      console.log("AI Insights response:", response.data);

      setData(response.data);
    } catch (err) {
      console.error("AI Insights error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load AI insights."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">

        <Header
          title="AI Insights"
          subtitle="Intelligent research and patent intelligence."
        />

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-10 text-center">

            <Brain
              className="mx-auto text-cyan-400 animate-pulse mb-4"
              size={48}
            />

            <h2 className="text-xl font-semibold text-white">
              Analyzing Patent Intelligence...
            </h2>

            <p className="text-slate-400 mt-2">
              Generating research insights from your patent
              repository.
            </p>

          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {!loading && error && (
          <div className="mt-8 bg-slate-900 border border-red-500/30 rounded-2xl p-10 text-center">

            <ShieldCheck
              className="mx-auto text-red-400 mb-4"
              size={48}
            />

            <h2 className="text-xl font-semibold text-white">
              AI Insights Unavailable
            </h2>

            <p className="text-red-400 mt-2">
              {error}
            </p>

            <button
              onClick={fetchInsights}
              className="mt-5 inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-lg font-medium transition"
            >
              <RefreshCw size={18} />
              Retry
            </button>

          </div>
        )}

        {/* =====================================================
            DATA
        ====================================================== */}

        {!loading && !error && data && (
          <div className="mt-8">

            {/* =================================================
                HERO
            ================================================== */}

            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">

              <div className="flex items-center gap-3 mb-3">

                <Sparkles size={34} />

                <h2 className="text-3xl font-bold">
                  AI Research Intelligence
                </h2>

              </div>

              <p className="text-cyan-100 max-w-3xl">
                AI-powered analysis of your patent portfolio,
                technology domains, citation performance,
                and research opportunities.
              </p>

              <button
                onClick={fetchInsights}
                className="mt-5 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition"
              >
                <RefreshCw size={17} />
                Refresh Insights
              </button>

            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================== */}

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

              <InsightCard
                icon={
                  <BarChart3
                    className="text-cyan-400"
                    size={30}
                  />
                }
                title="Total Patents"
                value={data.total_patents}
                description="Patents analyzed"
              />

              <InsightCard
                icon={
                  <Award
                    className="text-yellow-400"
                    size={30}
                  />
                }
                title="Highest Citations"
                value={
                  data.highest_citation_patent
                    ?.citation_count ?? 0
                }
                description={
                  data.highest_citation_patent
                    ?.patent_title ||
                  "No patent available"
                }
              />

              <InsightCard
                icon={
                  <TrendingUp
                    className="text-green-400"
                    size={30}
                  />
                }
                title="Average Citations"
                value={
                  data.average_citations ?? 0
                }
                description="Citations per patent"
              />

              <InsightCard
                icon={
                  <ShieldCheck
                    className="text-purple-400"
                    size={30}
                  />
                }
                title="Grant Rate"
                value={`${data.grant_rate ?? 0}%`}
                description="Granted patents"
              />

            </div>

            {/* =================================================
                HIGHLIGHTED PATENT + DOMAIN
            ================================================== */}

            <div className="grid lg:grid-cols-2 gap-6 mt-6">

              {/* Highest Impact Patent */}

              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <Award
                    className="text-yellow-400"
                    size={28}
                  />

                  <h3 className="text-xl font-bold text-white">
                    Highest Impact Patent
                  </h3>

                </div>

                {data.highest_citation_patent ? (
                  <div>

                    <h4 className="text-white text-lg font-semibold">
                      {
                        data.highest_citation_patent
                          .patent_title
                      }
                    </h4>

                    <div className="grid grid-cols-2 gap-4 mt-5">

                      <div className="bg-slate-800 rounded-xl p-4">

                        <p className="text-slate-400 text-sm">
                          Citations
                        </p>

                        <p className="text-yellow-400 text-2xl font-bold mt-1">
                          {
                            data.highest_citation_patent
                              .citation_count
                          }
                        </p>

                      </div>

                      <div className="bg-slate-800 rounded-xl p-4">

                        <p className="text-slate-400 text-sm">
                          Status
                        </p>

                        <p className="text-green-400 text-lg font-bold mt-2">
                          {
                            data.highest_citation_patent
                              .status
                          }
                        </p>

                      </div>

                    </div>

                    <div className="mt-4">

                      <p className="text-slate-400 text-sm">
                        Technology Domain
                      </p>

                      <p className="text-cyan-400 font-medium mt-1">
                        {
                          data.highest_citation_patent
                            .technology_domain
                        }
                      </p>

                    </div>

                  </div>
                ) : (
                  <p className="text-slate-400">
                    No patent data available.
                  </p>
                )}

              </div>

              {/* Most Active Domain */}

              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-5">

                  <Target
                    className="text-cyan-400"
                    size={28}
                  />

                  <h3 className="text-xl font-bold text-white">
                    Leading Technology Domain
                  </h3>

                </div>

                {data.most_active_domain ? (
                  <div>

                    <p className="text-3xl font-bold text-cyan-400">
                      {
                        data.most_active_domain.domain
                      }
                    </p>

                    <p className="text-slate-400 mt-2">
                      This is currently the most active
                      research domain in your patent
                      repository.
                    </p>

                    <div className="mt-6 bg-slate-800 rounded-xl p-5">

                      <p className="text-slate-400 text-sm">
                        Number of Patents
                      </p>

                      <p className="text-white text-3xl font-bold mt-1">
                        {
                          data.most_active_domain.count
                        }
                      </p>

                    </div>

                  </div>
                ) : (
                  <p className="text-slate-400">
                    No domain information available.
                  </p>
                )}

              </div>

            </div>

            {/* =================================================
                AI INSIGHTS
            ================================================== */}

            <div className="mt-6">

              <div className="flex items-center gap-3 mb-4">

                <Lightbulb
                  className="text-yellow-400"
                  size={28}
                />

                <h3 className="text-xl font-bold text-white">
                  AI-Generated Insights
                </h3>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                {data.insights?.map(
                  (insight, index) => (
                    <div
                      key={index}
                      className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition"
                    >

                      <div className="flex items-start gap-4">

                        <div className="bg-cyan-500/10 rounded-xl p-3">

                          <Brain
                            className="text-cyan-400"
                            size={24}
                          />

                        </div>

                        <div>

                          <h4 className="text-white font-semibold text-lg">
                            {insight.title}
                          </h4>

                          <p className="text-slate-400 mt-2 leading-6">
                            {insight.description}
                          </p>

                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =================================================
                RECOMMENDATIONS
            ================================================== */}

            <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-5">

                <Rocket
                  className="text-purple-400"
                  size={28}
                />

                <div>

                  <h3 className="text-xl font-bold text-white">
                    AI Recommendations
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    Suggested actions based on your patent
                    portfolio.
                  </p>

                </div>

              </div>

              <div className="space-y-4">

                {data.recommendations?.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-slate-800 rounded-xl p-4"
                    >

                      <CheckCircle
                        className="text-green-400 mt-0.5 flex-shrink-0"
                        size={21}
                      />

                      <p className="text-slate-300 leading-6">
                        {recommendation}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* =================================================
                PORTFOLIO SUMMARY
            ================================================== */}

            <div className="mt-6 bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-4">

                <Sparkles
                  className="text-cyan-400"
                  size={25}
                />

                <h3 className="text-lg font-bold text-white">
                  Patent Intelligence Summary
                </h3>

              </div>

              <p className="text-slate-300 leading-7">

                Your repository currently contains{" "}
                <span className="text-cyan-400 font-semibold">
                  {data.total_patents}
                </span>{" "}
                patents with an average of{" "}
                <span className="text-cyan-400 font-semibold">
                  {data.average_citations}
                </span>{" "}
                citations per patent. The leading research
                domain is{" "}
                <span className="text-cyan-400 font-semibold">
                  {data.most_active_domain?.domain}
                </span>
                , while the highest-cited patent is{" "}
                <span className="text-yellow-400 font-semibold">
                  {
                    data.highest_citation_patent
                      ?.patent_title
                  }
                </span>
                . The current grant rate is{" "}
                <span className="text-green-400 font-semibold">
                  {data.grant_rate}%
                </span>
                .

              </p>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}


/* ============================================================
   INSIGHT CARD
============================================================ */

function InsightCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition">

      <div className="mb-4">
        {icon}
      </div>

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h3 className="text-white text-2xl font-bold mt-2">
        {value}
      </h3>

      <p className="text-slate-500 text-sm mt-2">
        {description}
      </p>

    </div>
  );
}