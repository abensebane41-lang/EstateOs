"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Home,
  Bell,
  Shield,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const NAV_HREFS = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/dashboard/properties", icon: Building2, key: "properties" },
  { href: "/dashboard/leads", icon: Users, key: "leads" },
  { href: "/dashboard/users", icon: Users, key: "users" },
  { href: "/dashboard/analytics", icon: BarChart3, key: "analytics" },
  { href: "/dashboard/notifications", icon: Bell, key: "notifications" },
  { href: "/dashboard/settings", icon: Settings, key: "settings" },
] as const;

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  agency?: { name: string; logoUrl?: string | null; slug?: string | null } | null;
  userRole?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed = false, onToggle, agency, userRole, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  useEffect(() => {
    onMobileClose?.();
  }, [pathname]);

  const navigation = NAV_HREFS.map((item) => ({
    name: t(item.key as "dashboard" | "properties" | "leads" | "users" | "analytics" | "notifications" | "settings"),
    href: item.href,
    icon: item.icon,
  }));

  const navContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            {agency?.logoUrl ? (
              <img src={agency.logoUrl} alt={agency.name} className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
                {agency?.name?.charAt(0) || "E"}
              </div>
            )}
            <span className="font-bold text-text-primary">{agency?.name || "EstateOS"}</span>
          </Link>
        )}
        <button onClick={onToggle} className="rounded-lg p-2 hover:bg-surface-secondary transition-colors hidden lg:block">
          <ChevronLeft className={cn("h-4 w-4 text-text-secondary transition-transform", collapsed && "rotate-180")} />
        </button>
        <button onClick={onMobileClose} className="rounded-lg p-2 hover:bg-surface-secondary transition-colors lg:hidden">
          <X className="h-4 w-4 text-text-secondary" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-2">
        {agency?.slug && (
          <a
            href={`/agency/${agency.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-accent/10 px-3 py-2.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
          >
            <ExternalLink className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t("publicSiteLink")}</span>}
          </a>
        )}
        {userRole === "SUPER_ADMIN" && (
          <Link href="/super-admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
            <Shield className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t("superAdminDashboard")}</span>}
          </Link>
        )}
        <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors">
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t("home")}</span>}
        </Link>
        <a
          href="/api/auth/sign-out"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t("logout")}</span>}
        </a>
      </div>
    </>
  );

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col border-l border-border bg-white transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {navContent}
      </aside>

      <aside
        className={cn(
          "hidden flex-col border-l border-border bg-white transition-all duration-300 lg:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
