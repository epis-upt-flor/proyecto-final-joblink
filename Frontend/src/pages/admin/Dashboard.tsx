import DashboardLayout from "@/components/layouts/DashboardLayout";
import StatsCards from "@/components/layouts/StatsCard";
import TabsSection from "@/components/layouts/TabsSection";

export default function AdminDashboard() {
  return (
    <DashboardLayout title="LinkJob">
      <StatsCards />
      <TabsSection role="admin" />
    </DashboardLayout>
  );
}
