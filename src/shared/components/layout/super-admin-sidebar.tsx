"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface SuperAdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SuperAdminSidebar({ collapsed = false, onToggle }: SuperAdminSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: t("superAdminDashboard"), href: "/super-admin", icon: LayoutDashboard },
    { name: t("agencies"), href: "/super-admin/agencies", icon: Building2 },
    { name: t("subscriptions"), href: "/super-admin/subscriptions", icon: CreditCard },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/super-admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">E</div>
            <span className="font-bold text-text-primary text-lg">EstateOS</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-4 w-4 text-primary" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-medium text-text-primary">{t("superAdminRole")}</p>
            <p className="text-xs text-text-secondary">Super Admin</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/super-admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors"
        >
          <Building2 className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t("agencyDashboard")}</span>}
        </Link>
        <Link
          href="/api/auth/sign-out"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary hover:bg-error/10 hover:text-error transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{t("logout")}</span>}
        </Link>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-border shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5 text-text-primary" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 h-16">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">E</div>
                <span className="font-bold text-text-primary text-lg">EstateOS</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-surface-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}

      <aside
        className={cn(
          "hidden lg:flex flex-col border-l border-border bg-white transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {navContent}
      </aside>
    </>
  );
}
