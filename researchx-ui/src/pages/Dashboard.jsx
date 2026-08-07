import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCards from "../components/StatCards";

export default function Dashboard() {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your research overview."
        />

        <StatCards />
      </main>
    </div>
  );
}