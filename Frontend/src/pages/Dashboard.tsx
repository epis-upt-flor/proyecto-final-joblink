"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import StatsCards from "@/components/StatsCard";
import TabsSection from "@/components/TabsSection";

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-muted/40">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1">
                <Header />
                <div className="p-4 md:p-6 space-y-6">
                    <StatsCards />
                    <TabsSection />
                </div>
            </main>
        </div>
    );
}
