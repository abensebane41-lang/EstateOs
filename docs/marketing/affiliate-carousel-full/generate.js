const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const W = 1080, H = 1920;

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; font-family: 'IBM Plex Sans Arabic', sans-serif; overflow: hidden; position: relative; }
.bg-navy { background: #0F2747; }
.bg-dark { background: #0a1a2f; }
.bg-gradient { background: linear-gradient(180deg, #0F2747 0%, #1a3a5c 100%); }
.bg-gradient-gold { background: linear-gradient(180deg, #C9A227 0%, #b8922a 100%); }
.content { position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 55px 48px; text-align: center; }
.slide-num { position: absolute; top: 40px; left: 50px; font-size: 18px; font-weight: 600; }
.slide-num-white { color: rgba(255,255,255,0.3); }
.slide-num-dark { color: rgba(26,26,26,0.3); }
h1 { font-size: 50px; font-weight: 800; line-height: 1.3; margin-bottom: 16px; }
.gold { color: #C9A227; }
.navy { color: #0F2747; }
.white { color: #fff; }
p { font-size: 26px; font-weight: 300; line-height: 1.6; margin-bottom: 20px; }
.p-white { color: rgba(255,255,255,0.6); }
.p-dark { color: rgba(26,26,26,0.6); }
.divider { width: 80px; height: 4px; background: #C9A227; border-radius: 2px; margin: 16px auto; }
.items { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 800px; }
.item { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px 20px; text-align: right; }
.item-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(201,162,39,0.15); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
.item-text { font-size: 21px; font-weight: 500; color: rgba(255,255,255,0.85); line-height: 1.4; }
.item-sub { font-size: 16px; color: rgba(255,255,255,0.4); margin-top: 4px; }
.cta { display: inline-flex; align-items: center; gap: 12px; background: #C9A227; color: #0F2747; font-size: 26px; font-weight: 700; padding: 22px 50px; border-radius: 16px; margin-top: 10px; }
.cta-navy { background: #0F2747; color: #fff; }
.swipe { position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); font-size: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.swipe-white { color: rgba(255,255,255,0.3); }
.money { font-size: 90px; font-weight: 900; color: #C9A227; line-height: 1; margin-bottom: 10px; }
.money-navy { color: #0F2747; }
.plan { display: flex; flex-direction: column; gap: 18px; width: 100%; max-width: 800px; }
.plan-box { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 24px; text-align: center; }
.plan-label { font-size: 18px; color: rgba(255,255,255,0.5); margin-bottom: 8px; }
.plan-price { font-size: 56px; font-weight: 900; color: #C9A227; }
.plan-desc { font-size: 18px; color: rgba(255,255,255,0.6); margin-top: 6px; }
.steps { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 750px; }
.step { display: flex; gap: 18px; align-items: flex-start; }
.step-num { width: 52px; height: 52px; border-radius: 50%; background: #C9A227; color: #0F2747; font-size: 26px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step-content { flex: 1; text-align: right; }
.step-title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.step-desc { font-size: 18px; color: rgba(255,255,255,0.5); line-height: 1.5; }
.example { background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.25); border-radius: 16px; padding: 22px; margin-top: 16px; width: 100%; max-width: 750px; }
.example-title { font-size: 18px; color: #C9A227; font-weight: 700; margin-bottom: 10px; }
.example-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.example-label { font-size: 17px; color: rgba(255,255,255,0.6); }
.example-value { font-size: 19px; font-weight: 700; color: #C9A227; }
.quote { font-size: 30px; font-weight: 600; color: rgba(255,255,255,0.9); line-height: 1.5; max-width: 700px; border-right: 4px solid #C9A227; padding-right: 24px; text-align: right; margin-top: 16px; }
.badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(201,162,39,0.15); border: 1px solid rgba(201,162,39,0.3); border-radius: 100px; padding: 10px 24px; margin-bottom: 24px; color: #C9A227; font-size: 18px; font-weight: 500; }
.badge-dot { width: 6px; height: 6px; background: #C9A227; border-radius: 50%; }
`;

const slides = [
  // 1/8 — Hook
  { bg: 'bg-navy', content: `
    <div class="slide-num slide-num-white">1/8</div>
    <div class="badge"><div class="badge-dot"></div>برنامج شركاء</div>
    <div class="money">💰</div>
    <h1 class="white">كسب <span class="gold">دخل إضافي</span><br>بالتسويق لمنصة عقارية</h1>
    <p class="p-white">هل لديك علاقات مع أصحاب الوكالات؟<br>هذه الفرصة لك</p>
    <div class="swipe swipe-white">← اسحب للمتابعة</div>
  `},
  // 2/8 — المنصة هي
  { bg: 'bg-dark', content: `
    <div class="slide-num slide-num-white">2/8</div>
    <h1 class="white">EstateOS <span class="gold">شنو؟</span></h1>
    <div class="divider"></div>
    <p class="p-white" style="font-size:24px;">منصة عقارية رقمية تمنحك</p>
    <div class="items">
      <div class="item"><div class="item-icon">🌐</div><div class="item-text">موقع عقاري احترافي خاص بوكالتك<div class="item-sub">رابط خاص — مثال: roimmobilier.estate-os.com</div></div></div>
      <div class="item"><div class="item-icon">📊</div><div class="item-text">لوحة تحكم كاملة<div class="item-sub">إدارة العقارات + العملاء + الإحصائيات</div></div></div>
      <div class="item"><div class="item-icon">🌍</div><div class="item-text">دعم اللغة العربية والفرنسية<div class="item-sub">自动 تبديل حسب اللغة</div></div></div>
    </div>
  `},
  // 3/8 — المميزات — الموقع
  { bg: 'bg-navy', content: `
    <div class="slide-num slide-num-white">3/8</div>
    <h1 class="white">🌐 الموقع <span class="gold">العام</span></h1>
    <p class="p-white">هذا ما يراه العملاء</p>
    <div class="items">
      <div class="item"><div class="item-icon">🏠</div><div class="item-text">عرض جميع العقارات<div class="item-sub">شقق، فلل، أراضي، محلات تجارية</div></div></div>
      <div class="item"><div class="item-icon">📸</div><div class="item-text">صور احترافية عالية الجودة<div class="item-sub">معرض صور لكل عقار</div></div></div>
      <div class="item"><div class="item-icon">🔍</div><div class="item-text">بحث وتصفية متقدمة<div class="item-sub">بالولاية، المدينة، السعر، النوع</div></div></div>
      <div class="item"><div class="item-icon">📱</div><div class="item-text">متوافق مع جميع الأجهزة<div class="item-sub">جوال، تابلت، حاسوب</div></div></div>
      <div class="item"><div class="item-icon">💬</div><div class="item-text">نموذج تواصل مباشر<div class="item-sub">العميل يتواصل مع الوكالة مباشرة</div></div></div>
    </div>
  `},
  // 4/8 — المميزات — لوحة التحكم
  { bg: 'bg-dark', content: `
    <div class="slide-num slide-num-white">4/8</div>
    <h1 class="white">📊 لوحة <span class="gold">التحكم</span></h1>
    <p class="p-white">هذا ما يستخدمه صاحب الوكالة</p>
    <div class="items">
      <div class="item"><div class="item-icon">➕</div><div class="item-text">إضافة وتعديل وحذف العقارات<div class="item-sub">بصور + تفاصيل + أسعار</div></div></div>
      <div class="item"><div class="item-icon">👥</div><div class="item-text">تتبع العملاء المحتملين<div class="item-sub">قائمة عملاء + حالة كل عميل</div></div></div>
      <div class="item"><div class="item-icon">📈</div><div class="item-text">إحصائيات وتقارير<div class="item-sub">عدد المشاهدات + الاستفسارات</div></div></div>
      <div class="item"><div class="item-icon">⚙️</div><div class="item-text">إعدادات الوكالة<div class="item-sub">الشعار، الوصف، بيانات التواصل</div></div></div>
    </div>
  `},
  // 5/8 — ليش يختلف عن فيسبوك
  { bg: 'bg-navy', content: `
    <div class="slide-num slide-num-white">5/8</div>
    <h1 class="white">ليش <span class="gold">يفترق</span> عن فيسبوك؟</h1>
    <div class="items">
      <div class="item"><div class="item-icon">❌</div><div class="item-text">فيسبوك: المنشورات تختفي بعد 24 ساعة<div class="item-sub">العميل لا يجد العقار مرة ثانية</div></div></div>
      <div class="item"><div class="item-icon">✅</div><div class="item-text">EstateOS: العقارات ظاهرة دائماً<div class="item-sub">رابط واحد يشاركه مع كل عملائه</div></div></div>
      <div class="item"><div class="item-icon">❌</div><div class="item-text">فيسبوك: لا يوجد لوحة تحكم<div class="item-sub">يكتب يدوياً كل منشور</div></div></div>
      <div class="item"><div class="item-icon">✅</div><div class="item-text">EstateOS: إدارة متكاملة<div class="item-sub">إضافة عقار في 30 ثانية</div></div></div>
      <div class="item"><div class="item-icon">❌</div><div class="item-text">فيسبوك: المنافسون في نفس القروب<div class="item-sub">عقاراته تظهر بجانب عقاراتهم</div></div></div>
      <div class="item"><div class="item-icon">✅</div><div class="item-text">EstateOS: موقع خاص به فقط<div class="item-sub">لا منافسة — وكالته هي البطل</div></div></div>
    </div>
  `},
  // 6/8 — العرض
  { bg: 'bg-dark', content: `
    <div class="slide-num slide-num-white">6/8</div>
    <h1 class="white">عمولتك <span class="gold">كمسوّق</span></h1>
    <div class="plan">
      <div class="plan-box">
        <div class="plan-label">اشتراك شهري (2,500 دج/شهر)</div>
        <div class="plan-price">500 دج</div>
        <div class="plan-desc">كل شهر ما دام العميل مشترك</div>
      </div>
      <div class="plan-box">
        <div class="plan-label">اشتراك سنوي</div>
        <div class="plan-price">2,000 دج</div>
        <div class="plan-desc">دفعة واحدة</div>
      </div>
    </div>
  `},
  // 7/8 — مثال + خطوات
  { bg: 'bg-navy', content: `
    <div class="slide-num slide-num-white">7/8</div>
    <h1 class="white">كيفاشاشتغل؟</h1>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><div class="step-content"><div class="step-title">قنّع الوكالة</div><div class="step-desc">ashare الموقع + شرح المميزات</div></div></div>
      <div class="step"><div class="step-num">2</div><div class="step-content"><div class="step-title">قولي اسم الوكالة</div><div class="step-desc">عبر الواتساب</div></div></div>
      <div class="step"><div class="step-num">3</div><div class="step-content"><div class="step-title">أنا أتأكد + أفعّل</div><div class="step-desc">أتحقق من الاشتراك في لوحة التحكم</div></div></div>
      <div class="step"><div class="step-num">4</div><div class="step-content"><div class="step-title">تحصل على عمولتك</div><div class="step-desc">حوالة بريدية / CCP / بريدي موب</div></div></div>
    </div>
    <div class="example">
      <div class="example-title">📊 مثال: 5 شهري + 3 سنوي</div>
      <div class="example-row"><div class="example-label">5 شهري × 500 دج</div><div class="example-value">2,500 دج/شهر</div></div>
      <div class="example-row"><div class="example-label">3 سنوي × 2,000 دج</div><div class="example-value">6,000 دج (مرة)</div></div>
      <div class="example-row"><div class="example-label">الإجمالي الأول</div><div class="example-value">8,500 دج</div></div>
    </div>
  `},
  // 8/8 — CTA
  { bg: 'bg-gradient-gold', content: `
    <div class="slide-num slide-num-dark">8/8</div>
    <div class="money money-navy">🤝</div>
    <h1 class="navy">ابدأ الآن<br>وابدأ تكسب</h1>
    <p class="p-dark">تواصل معي الآن وسجل كمسوّق<br>بدون أي تكلفة — بدون حد أقصى</p>
    <div class="cta cta-navy">تواصل معي الآن ←</div>
    <p class="p-dark" style="font-size:18px; margin-top:20px;">estate-os-beryl.vercel.app</p>
  `},
];

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  });
  const outDir = path.join(__dirname, 'affiliate-carousel-full');
  fs.mkdirSync(outDir, { recursive: true });

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><style>${css}</style></head><body class="${slide.bg}"><div class="content">${slide.content}</div></body></html>`;
    const tmpFile = path.join(outDir, `_tmp_${i}.html`);
    fs.writeFileSync(tmpFile, html, 'utf8');

    const page = await browser.newPage({ viewport: { width: W, height: H } });
    await page.goto('file:///' + tmpFile.replace(/\\/g, '/'));
    await page.waitForTimeout(1500);
    const pngFile = path.join(outDir, `slide-${i + 1}.png`);
    await page.screenshot({ path: pngFile, type: 'png' });
    await page.close();
    fs.unlinkSync(tmpFile);
    console.log(`slide-${i + 1}.png`);
  }

  await browser.close();
  console.log('Done!');
})();
