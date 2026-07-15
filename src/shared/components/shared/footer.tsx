import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">E</div>
              <span className="font-bold text-text-primary text-lg">EstateOS</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-[24rem]">
              منصة إدارة العقارات الاحترافية للوكلاء العقاريين في الجزائر. أضف عقاراتك وتتبع عملائك من مكان واحد.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">المنصة</h3>
            <ul className="space-y-2">
              <li><Link href="/properties" className="text-sm text-text-secondary hover:text-primary transition-colors">تصفح العقارات</Link></li>
              <li><Link href="/register" className="text-sm text-text-secondary hover:text-primary transition-colors">إنشاء وكالة</Link></li>
              <li><Link href="/login" className="text-sm text-text-secondary hover:text-primary transition-colors">تسجيل الدخول</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-4">القانونية</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="text-sm text-text-secondary hover:text-primary transition-colors">شروط الاستخدام</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-text-tertiary">
          <p>© {new Date().getFullYear()} EstateOS. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
