"use client";

import { useState } from "react";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { Topbar } from "@/shared/components/layout/topbar";

interface DashboardShellProps {
  children: React.ReactNode;
  agency?: { name: string; logoUrl?: string | null; slug?: string | null } | null;
  userRole?: string;
}

export function DashboardShell({ children, agency, userRole }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        agency={agency}
        userRole={userRole}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          agency={agency ? { name: agency.name, logoUrl: agency.logoUrl } : null}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto bg-surface-secondary p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
