import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FundingTable from "../components/FundingTable";
import api from "../api/axios";

export default function Funding() {
  const [recommendations, setRecommendations] = useState([]);
  const [researchDomain, setResearchDomain] = useState("");

  const [loadingRecommendations, setLoadingRecommendations] =
    useState(true);

  const [recommendationError, setRecommendationError] =
    useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =====================================================
  // LOAD RECOMMENDATIONS
  // =====================================================

  const loadRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      setRecommendationError("");

      // Token is automatically attached by api/axios.js
      const token = localStorage.getItem("accessToken");

      console.log("Token exists:", !!token);

      // User is not logged in
      if (!token) {
        setIsLoggedIn(false);
        setRecommendationError("Please login first.");
        return;
      }

      setIsLoggedIn(true);

      // Axios interceptor automatically sends:
      // Authorization: Bearer <token>
      const response = await api.get(
        "/funding/recommendations/"
      );

      console.log(
        "Funding recommendations:",
        response.data
      );

      setResearchDomain(
        response.data.research_domain || ""
      );

      setRecommendations(
        response.data.recommended_funding || []
      );
    } catch (error) {
      console.error(
        "Error loading funding recommendations:",
        error
      );

      // =================================================
      // UNAUTHORIZED
      // =================================================

      if (error.response?.status === 401) {
        setIsLoggedIn(false);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");

        setRecommendationError(
          "Your login session has expired. Please login again."
        );
      }

      // =================================================
      // PROFILE NOT FOUND
      // =================================================

      else if (error.response?.status === 404) {
        setIsLoggedIn(true);

        setRecommendationError(
          error.response?.data?.detail ||
            "Research profile not found for this user."
        );
      }

      // =================================================
      // OTHER ERRORS
      // =================================================

      else {
        setRecommendationError(
          error.response?.data?.detail ||
            "Unable to load funding recommendations."
        );
      }
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // =====================================================
  // LOAD WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    loadRecommendations();
  }, []);

  // =====================================================
  // LOGIN BUTTON
  // =====================================================

  const handleLogin = () => {
    window.location.href = "/login";
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 overflow-auto p-8">
        <Header
          title="Funding"
          subtitle="Explore funding opportunities."
        />

        {/* =====================================================
            RECOMMENDED FUNDING
        ===================================================== */}

        <div className="mb-8 rounded-2xl border border-cyan-500/20 bg-slate-900 p-6">

          {/* HEADER */}

          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Recommended Funding
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Funding opportunities matching your research
                domain.
              </p>
            </div>

            {researchDomain && (
              <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
                Research Domain: {researchDomain}
              </span>
            )}
          </div>

          {/* =====================================================
              ERROR
          ===================================================== */}

          {recommendationError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <p className="text-red-400">
                  {recommendationError}
                </p>

                {!isLoggedIn && (
                  <button
                    type="button"
                    onClick={handleLogin}
                    className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-black transition hover:bg-cyan-400"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          )}

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loadingRecommendations && (
            <div className="py-8 text-center text-slate-400">
              Loading recommendations...
            </div>
          )}

          {/* =====================================================
              NO RECOMMENDATIONS
          ===================================================== */}

          {!loadingRecommendations &&
            !recommendationError &&
            recommendations.length === 0 && (
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-center">
                <p className="text-slate-300">
                  No matching funding opportunities found.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Update your research profile to get better
                  recommendations.
                </p>
              </div>
            )}

          {/* =====================================================
              RECOMMENDATIONS
          ===================================================== */}

          {!loadingRecommendations &&
            !recommendationError &&
            recommendations.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {recommendations.map((funding) => (
                  <div
                    key={funding.id}
                    className="rounded-xl border border-slate-700 bg-slate-800 p-5 transition hover:border-cyan-500/50"
                  >

                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-white">
                        {funding.title}
                      </h3>

                      <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                        Match
                      </span>
                    </div>

                    <p className="text-sm text-slate-400">
                      {funding.organization}
                    </p>

                    <p className="mt-3 text-sm text-slate-300">
                      {funding.description}
                    </p>

                    <div className="mt-4 space-y-2 text-sm">

                      {/* AMOUNT */}

                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">
                          Amount
                        </span>

                        <span className="font-medium text-green-400">
                          {funding.funding_amount}
                        </span>
                      </div>

                      {/* DEADLINE */}

                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">
                          Deadline
                        </span>

                        <span className="text-slate-300">
                          {funding.deadline}
                        </span>
                      </div>

                      {/* ELIGIBILITY */}

                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500">
                          Eligibility
                        </span>

                        <span className="max-w-[60%] text-right text-slate-300">
                          {funding.eligibility}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}

        </div>

        {/* =====================================================
            FUNDING REPOSITORY
        ===================================================== */}

        <FundingTable />

      </main>
    </div>
  );
}