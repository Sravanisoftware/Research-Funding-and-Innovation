import { Link } from "react-router-dom";
import {
  Brain,
  FileText,
  Landmark,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-blue-600/10"></div>

      {/* Navbar */}
      <nav className="relative flex items-center justify-between px-10 py-6">

        <h1 className="text-3xl font-bold text-cyan-400">
          ResearchX
        </h1>

        <Link
          to="/login"
          className="bg-cyan-500 hover:bg-cyan-600 text-black px-6 py-2 rounded-lg font-semibold transition"
        >
          Login
        </Link>

      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-10 py-24 grid lg:grid-cols-2 gap-16 items-center">

        <div>

          <span className="text-cyan-400 font-semibold uppercase tracking-wider">
            AI Powered Research Platform
          </span>

          <h1 className="text-6xl font-extrabold mt-5 leading-tight">
            Accelerating
            <span className="text-cyan-400"> Research </span>
            Innovation with AI
          </h1>

          <p className="mt-8 text-slate-300 text-xl leading-8">
            Discover patents, funding opportunities, emerging technologies
            and AI-powered commercialization insights in one intelligent
            platform.
          </p>

          <div className="flex gap-5 mt-10">

            {/* Get Started */}
            <Link
              to="/login"
              className="bg-cyan-500 hover:bg-cyan-600 text-black px-7 py-4 rounded-xl font-semibold flex items-center gap-2 transition"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            {/* Live Demo */}
            <Link
              to="/login"
              className="border border-cyan-500 text-cyan-400 px-7 py-4 rounded-xl hover:bg-cyan-500/10 transition"
            >
              Live Demo
            </Link>

          </div>

        </div>

        {/* Right Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 shadow-2xl">

          <h2 className="text-2xl font-bold mb-8">
            Research Overview
          </h2>

          <div className="space-y-5">

            <Stat title="Patents" value="6" />
            <Stat title="Funding Programs" value="7" />
            <Stat title="Technologies" value="5" />
            <Stat title="Innovation Score" value="59.48" />

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-10 py-20">

        <h2 className="text-4xl font-bold text-center mb-14">
          Everything You Need for Research
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          <Feature
            icon={<FileText size={36} className="text-cyan-400" />}
            title="Patent Intelligence"
            text="Track patents and monitor innovation."
          />

          <Feature
            icon={<Landmark size={36} className="text-green-400" />}
            title="Funding Discovery"
            text="Explore grants and funding opportunities."
          />

          <Feature
            icon={<Brain size={36} className="text-purple-400" />}
            title="AI Insights"
            text="Commercialization recommendations powered by AI."
          />

          <Feature
            icon={<BarChart3 size={36} className="text-yellow-400" />}
            title="Analytics"
            text="Visualize research performance with live dashboards."
          />

        </div>

      </section>

      {/* Statistics */}
      <section className="bg-slate-900 mt-12">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 text-center py-16">

          <Counter value="10K+" title="Research Papers" />
          <Counter value="2.5K+" title="Patents" />
          <Counter value="₹50Cr+" title="Funding Tracked" />
          <Counter value="95%" title="AI Accuracy" />

        </div>

      </section>

      {/* Footer */}
      <footer className="text-center text-slate-500 py-10">
        © 2026 ResearchX • AI Research Intelligence Platform
      </footer>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="flex justify-between bg-slate-800 rounded-xl p-5">
      <span>{title}</span>
      <span className="font-bold text-cyan-400">{value}</span>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500 hover:-translate-y-1 transition duration-300">

      <div className="mb-5">
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-slate-400">
        {text}
      </p>

    </div>
  );
}

function Counter({ value, title }) {
  return (
    <div>
      <h2 className="text-5xl font-bold text-cyan-400">
        {value}
      </h2>

      <p className="text-slate-400 mt-3">
        {title}
      </p>
    </div>
  );
}