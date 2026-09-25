import DashboardView from "@/components/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      <DashboardView />
    </div>
  );
}
