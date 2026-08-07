
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText,
  Lightbulb,
  Landmark,
  IndianRupee,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function StatCards() {
  const [patents, setPatents] = useState(0);
  const [technologies, setTechnologies] = useState(0);
  const [funding, setFunding] = useState(0);
  const [totalFunding, setTotalFunding] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        setLoading(true);

        const [patentsResponse, technologiesResponse, fundingResponse] =
          await Promise.all([
            axios.get(`${API_URL}/patents/`),
            axios.get(`${API_URL}/technologies/`),
            axios.get(`${API_URL}/funding/`),
          ]);

        const patentsData = patentsResponse.data || [];
        const technologiesData = technologiesResponse.data || [];
        const fundingData = fundingResponse.data || [];

        setPatents(patentsData.length);
        setTechnologies(technologiesData.length);
        setFunding(fundingData.length);

        // Convert funding amounts such as:
        // "₹20,00,000"
        // "1500000"
        // "2000000"
        // into numbers and calculate total.
        const total = fundingData.reduce((sum, item) => {
          const amount = String(item.funding_amount || "")
            .replace(/[₹,\s]/g, "");

          const numericAmount = Number(amount);

          return sum + (Number.isNaN(numericAmount) ? 0 : numericAmount);
        }, 0);

        setTotalFunding(total);
      } catch (error) {
        console.error(
          "Error loading dashboard statistics:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Patents",
      value: patents,
      icon: FileText,
      iconColor: "text-cyan-400",
      border: "hover:border-cyan-400",
      bg: "from-cyan-500/20 to-cyan-700/10",
      subtitle: "Research patents",
    },
    {
      title: "Technologies",
      value: technologies,
      icon: Lightbulb,
      iconColor: "text-yellow-400",
      border: "hover:border-yellow-400",
      bg: "from-yellow-500/20 to-yellow-700/10",
      subtitle: "Emerging technologies",
    },
    {
      title: "Funding Programs",
      value: funding,
      icon: Landmark,
      iconColor: "text-green-400",
      border: "hover:border-green-400",
      bg: "from-green-500/20 to-green-700/10",
      subtitle: "Funding opportunities",
    },
    {
      title: "Total Funding",
      value: formatCurrency(totalFunding),
      icon: IndianRupee,
      iconColor: "text-purple-400",
      border: "hover:border-purple-400",
      bg: "from-purple-500/20 to-purple-700/10",
      subtitle: "Available funding",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br ${card.bg} p-6 shadow-lg transition-all duration-300 hover:scale-105 ${card.border}`}
          >
            <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  {card.title}
                </p>

                <h2
                  className={`mt-3 font-bold text-white ${
                    card.title === "Total Funding"
                      ? "text-3xl"
                      : "text-5xl"
                  }`}
                >
                  {loading ? "..." : card.value}
                </h2>

                <p className="mt-3 text-slate-300">
                  {card.subtitle}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900/60 p-4">
                <Icon
                  className={card.iconColor}
                  size={34}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

