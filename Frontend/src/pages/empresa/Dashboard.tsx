import DashboardLayout from "@/components/layouts/DashboardLayout";
import TabsSection from "@/components/layouts/TabsSection";

export default function EmpresaDashboard() {
  return (
    <DashboardLayout title="LinkJob">
      <TabsSection role="empresa" />
    </DashboardLayout>
  );
}
