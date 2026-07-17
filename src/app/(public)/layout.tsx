import Link from "next/link";

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
      <header className="border-b border-border bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary font-public-heading">
            EstateOS
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              تسجيل الدخول
            </Link>
            <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
              ابدأ مجاناً
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-white py-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-text-secondary">&copy; {new Date().getFullYear()} EstateOS. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-text-secondary hover:text-text-primary transition-colors">شروط الاستخدام</Link>
            <a href="mailto:support@estateos.dz" className="text-sm text-text-secondary hover:text-text-primary transition-colors">تواصل معنا</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
