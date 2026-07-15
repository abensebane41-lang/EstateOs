export const metadata = {
  title: {
    default: "عقارات",
    template: "%s",
  },
  description: "منصة احترافية لإدارة العقارات والوكلاء العقاريين.",
  keywords: ["عقارات", "إدارة عقارات", "وكلاء عقاريين", "بيع عقارات", "تأجير عقارات", "الجزائر"],
  openGraph: {
    title: "عقارات",
    description: "منصة احترافية لإدارة العقارات والوكلاء العقاريين",
    type: "website",
    locale: "ar_DZ",
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
