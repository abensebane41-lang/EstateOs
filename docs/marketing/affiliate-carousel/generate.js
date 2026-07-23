const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const W = 1080, H = 1920;

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${W}px; height: ${H}px; font-family: 'IBM Plex Sans Arabic', sans-serif; overflow: hidden; position: relative; }
.bg-navy { background: #0F2747; }
.bg-gold { background: #C9A227; }
.bg-dark { background: #0a1a2f; }
.bg-gradient { background: linear-gradient(180deg, #0F2747 0%, #1a3a5c 100%); }
.bg-gradient-gold { background: linear-gradient(180deg, #C9A227 0%, #b8922a 100%); }
.content { position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 50px; text-align: center; }
.slide-num { position: absolute; top: 40px; left: 50px; font-size: 18px; font-weight: 600; }
.slide-num-white { color: rgba(255,255,255,0.3); }
.slide-num-dark { color: rgba(26,26,26,0.3); }
h1 { font-size: 52px; font-weight: 800; line-height: 1.3; margin-bottom: 20px; }
.gold { color: #C9A227; }
.navy { color: #0F2747; }
.white { color: #fff; }
p { font-size: 28px; font-weight: 300; line-height: 1.6; margin-bottom: 30px; }
.p-white { color: rgba(255,255,255,0.6); }
.p-dark { color: rgba(26,26,26,0.6); }
.divider { width: 80px; height: 4px; background: #C9A227; border-radius: 2px; margin: 20px auto; }
.items { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 800px; margin-top: 10px; }
.item { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px 22px; text-align: right; }
.item-icon { width: 50px; height: 50px; border-radius: 14px; background: rgba(201,162,39,0.15); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.item-text { font-size: 22px; font-weight: 500; color: rgba(255,255,255,0.85); line-height: 1.4; }
.cta { display: inline-flex; align-items: center; gap: 12px; background: #C9A227; color: #0F2747; font-size: 26px; font-weight: 700; padding: 22px 50px; border-radius: 16px; margin-top: 10px; }
.cta-navy { background: #0F2747; color: #fff; }
.swipe { position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); font-size: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.swipe-white { color: rgba(255,255,255,0.3); }
.money { font-size: 100px; font-weight: 900; color: #C9A227; line-height: 1; margin-bottom: 10px; }
.money-navy { color: #0F2747; }
.plan { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 800px; }
.plan-box { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 28px; text-align: center; }
.plan-label { font-size: 20px; color: rgba(255,255,255,0.5); margin-bottom: 10px; }
.plan-price { font-size: 64px; font-weight: 900; color: #C9A227; }
.plan-desc { font-size: 20px; color: rgba(255,255,255,0.6); margin-top: 8px; }
.steps { display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 750px; margin-top: 10px; }
.step { display: flex; gap: 20px; align-items: flex-start; }
.step-num { width: 56px; height: 56px; border-radius: 50%; background: #C9A227; color: #0F2747; font-size: 28px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step-content { flex: 1; text-align: right; }
.step-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.step-desc { font-size: 20px; color: rgba(255,255,255,0.5); line-height: 1.5; }
.example { background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.25); border-radius: 16px; padding: 24px; margin-top: 20px; width: 100%; max-width: 750px; }
.example-title { font-size: 20px; color: #C9A227; font-weight: 700; margin-bottom: 12px; }
.example-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
.example-label { font-size: 18px; color: rgba(255,255,255,0.6); }
.example-value { font-size: 20px; font-weight: 700; color: #C9A227; }
.quote { font-size: 32px; font-weight: 600; color: rgba(255,255,255,0.9); line-height: 1.5; max-width: 700px; border-right: 4px solid #C9A227; padding-right: 30px; text-align: right; margin-top: 20px; }
`;

const slides = [
  // 1/6 — Hook
  { bg: 'bg-navy', content: `
    <div class="slide-num slide-num-white">1/6</div>
    <div class="money">💰</div>
    <h1 class="white">كسب <span class="gold">دخل إضافي</span><br>ببيع الوكالات العقارية</h1>
    <p class="p-white">هل لديك علاقات مع أصحاب الوكالات؟<br>هذه الفرصة لك</p>
    <div class="swipe swipe-white">← اسحب للمتابعة</div>
  `},
  // 2/6 — العرض
  { bg: 'bg-dark', content: `
    <div class="slide-num slide-num-white">2/6</div>
    <h1 class="white">العرض <span class="gold">بسيط</span></h1>
    <div class="plan">
      <div class="plan-box">
        <div class="plan-label">إذا أقنعت الوكالة باشتراك شهري</div>
        <div class="plan-price">500 دج</div>
        <div class="plan-desc">كل شهر ما دام العميل مشترك</div>
      </div>
      <div class="plan-box">
        <div class="plan-label">إذا أقنعتها باشتراك سنوي</div>
        <div class="plan-price">2,000 دج</div>
        <div class="plan-desc">دفعة واحدة</div>
      </div>
    </div>
  `},
  // 3/6 — مثال عملي
  { bg: 'bg-navy', content: `
    <div class="slide-num slide-num-white">3/6</div>
    <h1 class="white">مثال <span class="gold">عملي</span></h1>
    <div class="example">
      <div class="example-title">📊 حساب بسيط</div>
      <div class="example-row"><div class="example-label">10 وكالات (شهري)</div><div class="example-value">5,000 دج/شهر</div></div>
      <div class="example-row"><div class="example-label">5 سنوات (شهري)</div><div class="example-value">25,000 دج/شهر</div></div>
      <div class="example-row"><div class="example-label">10 سنوي</div><div class="example-value">20,000 دج (مرة)</div></div>
    </div>
    <div class="quote">"لا حد أقصى لدخلك"</div>
  `},
  // 4/6 — كيفاشاشتغل
  { bg: 'bg-dark', content: `
    <div class="slide-num slide-num-white">4/6</div>
    <h1 class="white">كيفاشاشتغل؟</h1>
    <div class="steps">
      <div class="step"><div class="step-num">1</div><div class="step-content"><div class="step-title">قنّع الوكالة</div><div class="step-desc">解释 المنصة والمميزات</div></div></div>
      <div class="step"><div class="step-num">2</div><div class="step-content"><div class="step-title">قولي اسم الوكالة</div><div class="step-desc">عبر الواتساب أو المكالمة</div></div></div>
      <div class="step"><div class="step-num">3</div><div class="step-content"><div class="step-title">أنا أتأكد</div><div class="step-desc">أتحقق من الاشتراك في لوحة التحكم</div></div></div>
      <div class="step"><div class="step-num">4</div><div class="step-content"><div class="step-title">تحصل على عمولتك</div><div class="step-desc">حوالة بريدية / CCP / بريدي موب</div></div></div>
    </div>
  `},
  // 5/6 — ليش تختارنا
  { bg: 'bg-navy', content: `
    <div class="slide-num slide-num-white">5/6</div>
    <h1 class="white">ليش تسوّق لنا؟</h1>
    <div class="items">
      <div class="item"><div class="item-icon">💎</div><div class="item-text">منتج فريد في السوق الجزائري</div></div>
      <div class="item"><div class="item-icon">📈</div><div class="item-text">عمولة متكررة كل شهر</div></div>
      <div class="item"><div class="item-icon">🤝</div><div class="item-text">دعم مباشر من الفريق</div></div>
      <div class="item"><div class="item-icon">🚀</div><div class="item-text">السوق في نمو — الطلب كبير</div></div>
      <div class="item"><div class="item-icon">💰</div><div class="item-text">بدون استثمار — دخل صافي</div></div>
    </div>
  `},
  // 6/6 — CTA
  { bg: 'bg-gradient-gold', content: `
    <div class="slide-num slide-num-dark">6/6</div>
    <div class="money money-navy">🤝</div>
    <h1 class="navy">ابدأ الآن<br>وابدأ تكسب</h1>
    <p class="p-dark">تواصل معي الآن وسجل كمسوّق<br>بدون أي تكلفة</p>
    <div class="cta cta-navy">تواصل معي الآن ←</div>
    <p class="p-dark" style="font-size:18px; margin-top:20px;">estate-os-beryl.vercel.app</p>
  `},
];

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  });
  const outDir = path.join(__dirname, 'affiliate-carousel');
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
