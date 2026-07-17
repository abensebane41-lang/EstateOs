export const metadata = {
  title: "شروط الاستخدام - EstateOS",
  description: "شروط استخدام منصة EstateOS لإدارة العقارات والوكلاء العقاريين.",
};

export default function TermsPage() {
  return (
    <div className="py-16 bg-surface-secondary">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary mb-8 font-public-heading">شروط الاستخدام</h1>

        <div className="rounded-2xl border border-border bg-white p-8 space-y-6 text-text-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">1. قبول الشروط</h2>
            <p>باستخدام منصة EstateOS، أنت توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">2. وصف الخدمة</h2>
            <p>EstateOS هي منصة إلكترونية لإدارة العقارات والوكلاء العقاريين في الجزائر. توفر المنصة أدوات لإدارة العقارات، التعامل مع العملاء المحتملين، وإنشاء مواقع عقارية احترافية.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">3. الحسابات</h2>
            <p>أنت مسؤول عن الحفاظ على سرية بيانات حسابك. أنت مسؤول عن جميع الأنشطة التي تتم تحت حسابك. يجب عليك إخطارنا فوراً بأي استخدام غير مصرح به لحسابك.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">4. الاستخدام المقبول</h2>
            <p>أنت توافق على عدم استخدام المنصة لأي غرض غير قانوني أو غير مصرح به. يُحظر استخدام المنصة لنشر معلومات كاذبة أو مضللة về العقارات.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">5. المحتوى</h2>
            <p>أنت تحتفظ بالملكية الكاملة للمحتوى الذي تنشره على المنصة. أنت تمنحنا ترخيصاً لاستخدام هذا عرضه وترويجه ضمن خدمات المنصة.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">6. الدفع والإلغاء</h2>
            <p>الفترة التجريبية المجانية تستمر 14 يوماً. يمكنك إلغاء اشتراكك في أي وقت. لا تُقدم استرداد الأموال للفترات المدفوعة جزئياً.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">7. إخلاء المسؤولية</h2>
            <p>المنصة مقدمة "كما هي" دون ضمانات من أي نوع. لا نتحمل المسؤولية عن أي أضرار ناتجة عن استخدام المنصة.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">8. تعديل الشروط</h2>
            <p>نحتفظ بحق تعديل هذه الشروط في أي وقت. سيتم إخطارك بالتغييرات الجوهرية عبر البريد الإلكتروني أو من خلال المنصة.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-3">9. الاتصال بنا</h2>
            <p>لأي استفسارات حول شروط الاستخدام، يرجى التواصل عبر البريد الإلكتروني: support@estateos.dz</p>
          </section>
        </div>
      </div>
    </div>
  );
}
