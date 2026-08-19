import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import api from "../api/axios";

export default function Settings() {
  const navigate = useNavigate();

  // =====================================================
  // RESEARCH PROFILE
  // =====================================================

  const [profile, setProfile] = useState({
    organization: "",
    research_domain: "",
    technology_area: "",
    keywords: "",
    publications: "",
    patents: "",
  });

  // =====================================================
  // ACCOUNT INFORMATION
  // =====================================================

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Tracks whether a research profile already exists in the
  // database for this user. Determines whether saving should
  // POST (create) or PUT (update).
  const [profileExists, setProfileExists] = useState(false);

  // =====================================================
  // NOTIFICATION SETTINGS
  // =====================================================

  const [fundingAlerts, setFundingAlerts] = useState(true);
  const [patentUpdates, setPatentUpdates] = useState(true);
  const [technologyNews, setTechnologyNews] = useState(true);

  // =====================================================
  // APPEARANCE
  // =====================================================

  const [darkTheme] = useState(true);

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      // JWT is automatically attached by axios interceptor
      const response = await api.get("/profile/");

      setProfileExists(true);

      const savedEmail = localStorage.getItem("userEmail") || "";

      setEmail(savedEmail);

      // Backend currently does not return full_name,
      // so derive a display name from the email.
      if (savedEmail) {
        const username = savedEmail.split("@")[0];

        const formattedName = username
          .replace(/[._-]/g, " ")
          .replace(/\d+/g, "")
          .trim()
          .replace(/\b\w/g, (letter) => letter.toUpperCase());

        setFullName(formattedName || username);
      }

      setProfile({
        organization: response.data.organization || "",
        research_domain: response.data.research_domain || "",
        technology_area: response.data.technology_area || "",
        keywords: response.data.keywords || "",
        publications: response.data.publications || "",
        patents: response.data.patents || "",
      });
    } catch (err) {
      console.error("Error loading profile:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");

        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 404) {
        // No profile yet — this is expected for new accounts.
        // Leave the form empty and let the user create one.
        setProfileExists(false);
        setMessage(
          "You don't have a research profile yet. Fill in the form below and save to create one."
        );
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load research profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // HANDLE PROFILE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      // First save ever -> create the profile.
      // Subsequent saves -> update the existing profile.
      const response = profileExists
        ? await api.put("/profile/", profile)
        : await api.post("/profile/", profile);

      setProfileExists(true);

      setProfile({
        organization: response.data.organization || "",
        research_domain: response.data.research_domain || "",
        technology_area: response.data.technology_area || "",
        keywords: response.data.keywords || "",
        publications: response.data.publications || "",
        patents: response.data.patents || "",
      });

      setMessage(
        profileExists
          ? "Profile updated successfully."
          : "Profile created successfully."
      );
    } catch (err) {
      console.error("Error saving profile:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to save profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");

    navigate("/login");
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = () => {
    navigate("/login");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 overflow-auto p-8">

        <Header
          title="Settings"
          subtitle="Manage your ResearchX preferences."
        />

        <div className="mx-auto max-w-5xl">

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-red-400">
                  {error}
                </p>

                {error.toLowerCase().includes("login") && (
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

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {message && (
            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
              {message}
            </div>
          )}

          {/* =================================================
              ACCOUNT INFORMATION
          ================================================= */}

          <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">

            <h2 className="mb-6 text-2xl font-bold text-white">
              Account Information
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* FULL NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-300 outline-none"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-300 outline-none"
                />
              </div>

            </div>

          </div>

          {/* =================================================
              RESEARCH PROFILE
          ================================================= */}

          <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">

            <h2 className="text-2xl font-bold text-white">
              Research Profile
            </h2>

            <p className="mb-6 mt-2 text-sm text-slate-400">
              Update your research information to improve
              funding recommendations.
            </p>

            {loading ? (

              <div className="py-16 text-center text-slate-400">
                Loading profile...
              </div>

            ) : (

              <form
                onSubmit={handleSave}
                className="space-y-6"
              >

                {/* =================================================
                    ORGANIZATION + DOMAIN
                ================================================= */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                  {/* ORGANIZATION */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Organization
                    </label>

                    <input
                      type="text"
                      name="organization"
                      value={profile.organization}
                      onChange={handleChange}
                      placeholder="Example: VIT-AP University"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                    />
                  </div>

                  {/* RESEARCH DOMAIN */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Research Domain
                    </label>

                    <input
                      type="text"
                      name="research_domain"
                      value={profile.research_domain}
                      onChange={handleChange}
                      placeholder="Example: Data Science"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                    />
                  </div>

                  {/* TECHNOLOGY AREA */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Technology Area
                    </label>

                    <input
                      type="text"
                      name="technology_area"
                      value={profile.technology_area}
                      onChange={handleChange}
                      placeholder="Example: Artificial Intelligence"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                    />
                  </div>

                  {/* KEYWORDS */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Research Keywords
                    </label>

                    <input
                      type="text"
                      name="keywords"
                      value={profile.keywords}
                      onChange={handleChange}
                      placeholder="Python, Machine Learning, Data Analytics"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                    />
                  </div>

                </div>

                {/* =================================================
                    PUBLICATIONS
                ================================================= */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Publications
                  </label>

                  <textarea
                    name="publications"
                    value={profile.publications}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter your research publications..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                {/* =================================================
                    PATENTS
                ================================================= */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Patents
                  </label>

                  <textarea
                    name="patents"
                    value={profile.patents}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter your patents..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
                  />
                </div>

                {/* =================================================
                    SAVE
                ================================================= */}

                <div className="flex justify-end border-t border-slate-700 pt-6">

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : profileExists
                      ? "Save Changes"
                      : "Create Profile"}
                  </button>

                </div>

              </form>

            )}

          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">

            <h2 className="mb-2 text-2xl font-bold text-white">
              Notifications
            </h2>

            <p className="mb-6 text-sm text-slate-400">
              Choose which research notifications you want
              to receive.
            </p>

            {/* FUNDING ALERTS */}

            <div className="flex items-center justify-between border-b border-slate-700 py-4">

              <div>
                <h3 className="font-medium text-white">
                  Funding Alerts
                </h3>

                <p className="text-sm text-slate-500">
                  Get notified about relevant funding opportunities.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFundingAlerts(!fundingAlerts)
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  fundingAlerts
                    ? "bg-cyan-500"
                    : "bg-slate-600"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    fundingAlerts
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

            {/* PATENT UPDATES */}

            <div className="flex items-center justify-between border-b border-slate-700 py-4">

              <div>
                <h3 className="font-medium text-white">
                  Patent Updates
                </h3>

                <p className="text-sm text-slate-500">
                  Receive updates related to your patent portfolio.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setPatentUpdates(!patentUpdates)
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  patentUpdates
                    ? "bg-cyan-500"
                    : "bg-slate-600"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    patentUpdates
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

            {/* TECHNOLOGY NEWS */}

            <div className="flex items-center justify-between py-4">

              <div>
                <h3 className="font-medium text-white">
                  Technology News
                </h3>

                <p className="text-sm text-slate-500">
                  Stay updated on emerging research technologies.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTechnologyNews(!technologyNews)
                }
                className={`relative h-6 w-11 rounded-full transition ${
                  technologyNews
                    ? "bg-cyan-500"
                    : "bg-slate-600"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    technologyNews
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </button>

            </div>

          </div>

          {/* =================================================
              APPEARANCE
          ================================================= */}

          <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">

            <h2 className="mb-2 text-2xl font-bold text-white">
              Appearance
            </h2>

            <p className="mb-6 text-sm text-slate-400">
              Manage your ResearchX appearance preferences.
            </p>

            <div className="flex items-center justify-between">

              <div>
                <h3 className="font-medium text-white">
                  Dark Theme
                </h3>

                <p className="text-sm text-slate-500">
                  Use the dark ResearchX interface.
                </p>
              </div>

              <div className="flex items-center gap-3">

                <span className="text-sm text-slate-400">
                  {darkTheme ? "Enabled" : "Disabled"}
                </span>

                <div className="relative h-6 w-11 rounded-full bg-cyan-500">
                  <span className="absolute left-6 top-1 h-4 w-4 rounded-full bg-white" />
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">

            <h2 className="mb-2 text-2xl font-bold text-white">
              Security
            </h2>

            <p className="mb-6 text-sm text-slate-400">
              Manage your ResearchX account session.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              Logout
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}