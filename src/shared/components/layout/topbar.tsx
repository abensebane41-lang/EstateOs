"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Search, Menu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { getUnreadNotificationCount } from "@/modules/agency/actions";

interface TopbarProps {
  title?: string;
  agency?: { name: string; logoUrl?: string | null } | null;
  onMenuClick?: () => void;
}

export function Topbar({ title, agency, onMenuClick }: TopbarProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadNotificationCount().then((res) => {
      if (res.success) setUnreadCount(Number(res.data) || 0);
    });
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <Input placeholder="بحث..." className="w-64 pl-9" />
        </div>
        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        </Link>
        <Avatar>
          {agency?.logoUrl ? (
            <img src={agency.logoUrl} alt={agency.name} className="h-full w-full rounded-full object-cover" />
          ) : (
            <AvatarFallback>{agency?.name?.charAt(0) || "أح"}</AvatarFallback>
          )}
        </Avatar>
      </div>
    </header>
  );
}
