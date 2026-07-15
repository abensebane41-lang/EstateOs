"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { markNotificationRead, markAllNotificationsRead } from "@/modules/agency/actions";
import { EmptyState } from "@/shared/components/shared/empty-state";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

const TYPE_ICONS: Record<string, string> = {
  LEAD: "👤",
  SUBSCRIPTION: "💳",
  SYSTEM: "⚙️",
  PROPERTY: "🏠",
};

export function NotificationsList({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="لا توجد إشعارات"
        description="ستظهر هنا الإشعارات الجديدة"
      />
    );
  }

  return (
    <div>
      {notifications.some((n) => !n.isRead) && (
        <div className="mb-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="ml-2 h-4 w-4" />
            قراءة الكل
          </Button>
        </div>
      )}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
              notification.isRead ? "border-border bg-white" : "border-primary/20 bg-primary/5"
            }`}
          >
            <div className="text-2xl">{TYPE_ICONS[notification.type] || "📌"}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-text-primary">{notification.title}</h4>
                {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-sm text-text-secondary">{notification.message}</p>
              <p className="mt-1 text-xs text-text-tertiary">
                {new Date(notification.createdAt).toLocaleDateString("ar-DZ", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            {!notification.isRead && (
              <Button variant="ghost" size="sm" onClick={() => handleMarkRead(notification.id)}>
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
