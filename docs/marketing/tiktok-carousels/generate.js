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
.bg-light { background: #FAFAF8; color: #1a1a1a; }
.bg-gradient { background: linear-gradient(180deg, #0F2747 0%, #1a3a5c 100%); }
.bg-gradient-gold { background: linear-gradient(180deg, #C9A227 0%, #b8922a 100%); }
.content { position: relative; z-index: 10; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 50px; text-align: center; }
.num { font-size: 120px; font-weight: 900; color: rgba(201,162,39,0.2); line-height: 1; margin-bottom: 10px; }
.num-dark { color: rgba(15,39,71,0.1); }
h1 { font-size: 52px; font-weight: 800; line-height: 1.3; margin-bottom: 20px; }
.gold { color: #C9A227; }
.navy { color: #0F2747; }
.white { color: #fff; }
p { font-size: 28px; font-weight: 300; line-height: 1.6; margin-bottom: 30px; }
.p-white { color: rgba(255,255,255,0.6); }
.p-dark { color: rgba(26,26,26,0.6); }
.slide-num { position: absolute; top: 40px; left: 50px; font-size: 18px; font-weight: 600; }
.slide-num-white { color: rgba(255,255,255,0.3); }
.slide-num-dark { color: rgba(26,26,26,0.3); }
.swipe { position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); font-size: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.swipe-white { color: rgba(255,255,255,0.3); }
.swipe-dark { color: rgba(26,26,26,0.3); }
.items { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 800px; margin-top: 10px; }
.item { display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px 22px; text-align: right; }
.item-dark { background: rgba(15,39,71,0.05); border-color: rgba(15,39,71,0.1); }
.item-icon { width: 50px; height: 50px; border-radius: 14px; background: rgba(201,162,39,0.15); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.item-text { font-size: 22px; font-weight: 500; color: rgba(255,255,255,0.85); line-height: 1.4; }
.item-text-dark { color: rgba(26,26,26,0.85); }
.cta { display: inline-flex; align-items: center; gap: 12px; background: #C9A227; color: #0F2747; font-size: 26px; font-weight: 700; padding: 22px 50px; border-radius: 16px; margin-top: 10px; }
.cta-navy { background: #0F2747; color: #fff; }
.divider { width: 80px; height: 4px; background: #C9A227; border-radius: 2px; margin: 20px auto; }
.quote { font-size: 36px; font-weight: 600; font-style: italic; color: rgba(255,255,255,0.9); line-height: 1.5; max-width: 700px; border-right: 4px solid #C9A227; padding-right: 30px; text-align: right; }
.quote-dark { color: rgba(26,26,26,0.8); border-color: #0F2747; }
.stats { display: flex; gap: 30px; margin-top: 20px; }
.stat { text-align: center; }
.stat-num { font-size: 56px; font-weight: 900; color: #C9A227; }
.stat-label { font-size: 18px; color: rgba(255,255,255,0.5); margin-top: 5px; }
.steps { display: flex; flex-direction: column; gap: 24px; width: 100%; max-width: 750px; margin-top: 10px; }
.step { display: flex; gap: 20px; align-items: flex-start; }
.step-num { width: 56px; height: 56px; border-radius: 50%; background: #C9A227; color: #0F2747; font-size: 28px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step-content { flex: 1; text-align: right; }
.step-title { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.step-desc { font-size: 20px; color: rgba(255,255,255,0.5); line-height: 1.5; }
`;

const carousels = [
  // CAROUSEL 1: 5 أسباب تحتاج موقع عقاري
  {
    name: 'carousel-1-5-reasons',
    slides: [
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">1/6</div>
        <div class="num">5</div>
        <h1 class="white">أسباب تحتاج<br><span class="gold">موقع عقاري</span></h1>
        <p class="p-white">لماذا الوكالات العقارية في الجزائر<br>تحتاج موقع خاص بها</p>
        <div class="swipe swipe-white">← اسحب للمتابعة</div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">2/6</div>
        <div class="num">1</div>
        <h1 class="white">80% من المشترين<br>يبحثون <span class="gold">عبر الإنترنت</span></h1>
        <p class="p-white">إذا لم تكن وكالتك موجودة على الإنترنت<br>تخسر عملاء كل يوم</p>
        <div class="divider"></div>
        <div class="quote">"أول مكان يبحث فيه المشتري هو جوجل"</div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">3/6</div>
        <div class="num">2</div>
        <h1 class="white">المصداقية <span class="gold">تبدأ من الموقع</span></h1>
        <div class="items">
          <div class="item"><div class="item-icon">❌</div><div class="item-text">النشر فقط في فيسبوك = مصداقية محدودة</div></div>
          <div class="item"><div class="item-icon">✅</div><div class="item-text">موقع خاص = وكالة احترافية</div></div>
        </div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">4/6</div>
        <div class="num">3</div>
        <h1 class="white">المنافسة <span class="gold">شديدة</span></h1>
        <p class="p-white">في الجزائر أكثر من 500 وكالة عقارية<br>الذي يملك موقع يتفوق على المنافسين</p>
        <div class="stats">
          <div class="stat"><div class="stat-num">500+</div><div class="stat-label">وكالة عقارية</div></div>
          <div class="stat"><div class="stat-num">80%</div><div class="stat-label">يبحثون أونلاين</div></div>
        </div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">5/6</div>
        <div class="num">4</div>
        <h1 class="white">توفير <span class="gold">الوقت والمال</span></h1>
        <div class="items">
          <div class="item"><div class="item-icon">💰</div><div class="item-text">بدون موقع: تدفع للإعلانات كل شهر</div></div>
          <div class="item"><div class="item-icon">📊</div><div class="item-text">بموقع: عملاء يأتون إليك تلقائياً</div></div>
        </div>
      `},
      { bg: 'bg-gradient-gold', content: `
        <div class="slide-num slide-num-dark">6/6</div>
        <div class="num num-dark">5</div>
        <h1 class="navy">الآن أصبح <span class="navy">مجاناً</span></h1>
        <p class="p-dark">منصة EstateOS تمنحك موقعك الخاص<br>في 5 دقائق — بدون أي تكلفة</p>
        <div class="cta cta-navy">ابدأ تجربتك المجانية ←</div>
        <p class="p-dark" style="font-size:18px; margin-top:20px;">7 أيام تجربة — بدون بطاقة ائتمان</p>
      `},
    ]
  },
  // CAROUSEL 2: قبل وبعد
  {
    name: 'carousel-2-before-after',
    slides: [
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">1/6</div>
        <div class="num">?</div>
        <h1 class="white">هل وكالتك<br><span class="gold">على الإنترنت؟</span></h1>
        <p class="p-white">إليك الفرق بين من يملك موقع<br>ومن لا يملك</p>
        <div class="swipe swipe-white">← اسحب للمتابعة</div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">2/6</div>
        <h1 style="font-size:36px;" class="white">❌ بدون موقع</h1>
        <div class="divider"></div>
        <div class="items">
          <div class="item"><div class="item-icon">😰</div><div class="item-text">تنشر في 10 قروبات كل يوم</div></div>
          <div class="item"><div class="item-icon">💸</div><div class="item-text">تدفع 5000 دج شهرياً للإعلانات</div></div>
          <div class="item"><div class="item-icon">📉</div><div class="item-text">العملاء لا يثقون بك</div></div>
          <div class="item"><div class="item-icon">⏰</div><div class="item-text">تضيع وقتك في الرد على الرسائل</div></div>
        </div>
      `},
      { bg: 'bg-gradient', content: `
        <div class="slide-num slide-num-white">3/6</div>
        <h1 style="font-size:36px;" class="white">✅ بموقع احترافي</h1>
        <div class="divider"></div>
        <div class="items">
          <div class="item"><div class="item-icon">🎯</div><div class="item-text">عملاء يأتون إليك تلقائياً</div></div>
          <div class="item"><div class="item-icon">💰</div><div class="item-text">توفير 60,000 دج سنوياً</div></div>
          <div class="item"><div class="item-icon">🏆</div><div class="item-text">مصداقية عالية أمام العملاء</div></div>
          <div class="item"><div class="item-icon">⚡</div><div class="item-text">عرض العقارات بنقرة واحدة</div></div>
        </div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">4/6</div>
        <h1 class="white">الأرقام <span class="gold">تتحدث</span></h1>
        <div class="stats">
          <div class="stat"><div class="stat-num">3x</div><div class="stat-label">المزيد من الاستفسارات</div></div>
          <div class="stat"><div class="stat-num">50%</div><div class="stat-label">توفير في الإعلانات</div></div>
        </div>
        <div class="stats" style="margin-top:30px;">
          <div class="stat"><div class="stat-num">24/7</div><div class="stat-label">متوفر دائماً</div></div>
          <div class="stat"><div class="stat-num">5 دقائق</div><div class="stat-label">للإنشاء</div></div>
        </div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">5/6</div>
        <h1 class="white">ما الذي تحصل عليه؟</h1>
        <div class="items">
          <div class="item"><div class="item-icon">🏠</div><div class="item-text">موقع خاص بوكالتك</div></div>
          <div class="item"><div class="item-icon">📸</div><div class="item-text">عرض العقارات بصور احترافية</div></div>
          <div class="item"><div class="item-icon">📊</div><div class="item-text">لوحة تحكم متكاملة</div></div>
          <div class="item"><div class="item-icon">🌍</div><div class="item-text">دعم عربي وفرنسي</div></div>
          <div class="item"><div class="item-icon">📱</div><div class="item-text">متوافق مع الجوال</div></div>
        </div>
      `},
      { bg: 'bg-gradient-gold', content: `
        <div class="slide-num slide-num-dark">6/6</div>
        <h1 class="navy" style="font-size:44px;">جرّب الآن <span class="navy">مجاناً</span></h1>
        <p class="p-dark">7 أيام تجربة مجانية<br>بدون بطاقة ائتمان</p>
        <div class="cta cta-navy">ابدأ تجربتك المجانية ←</div>
        <p class="p-dark" style="font-size:18px; margin-top:20px;">estate-os-beryl.vercel.app</p>
      `},
    ]
  },
  // CAROUSEL 3: كيف تضاعف عملائك
  {
    name: 'carousel-3-double-clients',
    slides: [
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">1/6</div>
        <div class="num">×2</div>
        <h1 class="white">كيف <span class="gold">تضاعف</span><br>عملاء وكالتك</h1>
        <p class="p-white">3 استراتيجيات فعالة<br>لجلب المزيد من العملاء</p>
        <div class="swipe swipe-white">← اسحب للمتابعة</div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">2/6</div>
        <div class="num">1</div>
        <h1 class="white">كن <span class="gold">مرئياً</span> على الإنترنت</h1>
        <div class="items">
          <div class="item"><div class="item-icon">🔍</div><div class="item-text">90% من المشترين يبحثون في جوجل</div></div>
          <div class="item"><div class="item-icon">📍</div><div class="item-text">موقعك يظهر في نتائج البحث</div></div>
          <div class="item"><div class="item-icon">🌐</div><div class="item-text">رابط واحد تشاركه مع كل عملائك</div></div>
        </div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">3/6</div>
        <div class="num">2</div>
        <h1 class="white">اعرض عقاراتك <span class="gold">بشكل احترافي</span></h1>
        <div class="items">
          <div class="item"><div class="item-icon">📸</div><div class="item-text">صور عالية الجودة</div></div>
          <div class="item"><div class="item-icon">📋</div><div class="item-text">تفاصيل كاملة لكل عقار</div></div>
          <div class="item"><div class="item-icon">🗺️</div><div class="item-text">موقع على الخريطة</div></div>
        </div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">4/6</div>
        <div class="num">3</div>
        <h1 class="white">تابع <span class="gold">عملاءك</span> بذكاء</h1>
        <div class="items">
          <div class="item"><div class="item-icon">👥</div><div class="item-text">قاعدة بيانات العملاء المحتملين</div></div>
          <div class="item"><div class="item-icon">📞</div><div class="item-text">تتبع مكالمات التواصل</div></div>
          <div class="item"><div class="item-icon">📊</div><div class="item-text">إحصائيات الأداء</div></div>
        </div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">5/6</div>
        <h1 class="white">النتيجة <span class="gold">المتوقعة</span></h1>
        <div class="stats">
          <div class="stat"><div class="stat-num">3x</div><div class="stat-label">المزيد من الاستفسارات</div></div>
          <div class="stat"><div class="stat-num">2x</div><div class="stat-label">المزيد من المبيعات</div></div>
        </div>
        <div class="quote" style="margin-top:30px;">"الموقع يعمل نيابة عنك 24 ساعة في اليوم"</div>
      `},
      { bg: 'bg-gradient-gold', content: `
        <div class="slide-num slide-num-dark">6/6</div>
        <h1 class="navy">ابدأ الآن <span class="navy">مجاناً</span></h1>
        <p class="p-dark">أنشئ موقعك في 5 دقائق<br>7 أيام تجربة مجانية</p>
        <div class="cta cta-navy">ابدأ تجربتك المجانية ←</div>
      `},
    ]
  },
  // CAROUSEL 4: خطأ فادح
  {
    name: 'carousel-4-mistake',
    slides: [
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">1/6</div>
        <div class="num" style="color:rgba(220,50,50,0.3);">!</div>
        <h1 class="white">خطأ <span style="color:#dc3232;">فادح</span><br>يرتكبه أصحاب الوكالات</h1>
        <p class="p-white">هل أنت ترتكبه أيضاً؟</p>
        <div class="swipe swipe-white">← اسحب للمتابعة</div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">2/6</div>
        <h1 class="white">الخطأ: الاعتماد <span style="color:#dc3232;">فقط</span> على فيسبوك</h1>
        <div class="divider" style="background:#dc3232;"></div>
        <div class="items">
          <div class="item"><div class="item-icon">⚠️</div><div class="item-text">فيسبوك يحذف المنشورات التجارية</div></div>
          <div class="item"><div class="item-icon">⚠️</div><div class="item-text">المنشورات تختفي بعد 24 ساعة</div></div>
          <div class="item"><div class="item-icon">⚠️</div><div class="item-text">لا تملك قاعدة بيانات للعملاء</div></div>
          <div class="item"><div class="item-icon">⚠️</div><div class="item-text">المنافسون ينشرون في نفس القروبات</div></div>
        </div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">3/6</div>
        <h1 class="white">الحل: موقع <span class="gold">خاص بوكالتك</span></h1>
        <p class="p-white">الموقع يعمل نيابة عنك — دائماً</p>
        <div class="items">
          <div class="item"><div class="item-icon">✅</div><div class="item-text">رابط واحد تشاركه مع كل عملائك</div></div>
          <div class="item"><div class="item-icon">✅</div><div class="item-text">عقاراتك ظاهرة 24/7</div></div>
          <div class="item"><div class="item-icon">✅</div><div class="item-text">بيانات العملاء محفوظة אצלك</div></div>
        </div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">4/6</div>
        <h1 class="white">ما الذي <span class="gold">تخسره</span> يومياً؟</h1>
        <div class="stats">
          <div class="stat"><div class="stat-num">10+</div><div class="stat-label">عملاء محتملين يومياً</div></div>
          <div class="stat"><div class="stat-num">300+</div><div class="stat-label">عميل شهرياً</div></div>
        </div>
        <div class="quote" style="margin-top:30px;">"كل يوم بدون موقع = عملاء يذهبون للمنافسين"</div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">5/6</div>
        <h1 class="white">أنشئ موقعك <span class="gold">الآن</span></h1>
        <div class="steps">
          <div class="step"><div class="step-num">1</div><div class="step-content"><div class="step-title">سجّل حسابك</div><div class="step-desc">في أقل من دقيقة</div></div></div>
          <div class="step"><div class="step-num">2</div><div class="step-content"><div class="step-title">أضف عقاراتك</div><div class="step-desc">صور + تفاصيل + أسعار</div></div></div>
          <div class="step"><div class="step-num">3</div><div class="step-content"><div class="step-title">شارك رابط موقعك</div><div class="step-desc">مع عملائك ووسائل التواصل</div></div></div>
        </div>
      `},
      { bg: 'bg-gradient-gold', content: `
        <div class="slide-num slide-num-dark">6/6</div>
        <h1 class="navy">لا تضيع <span class="navy">المزيد</span></h1>
        <p class="p-dark">أنشئ موقعك الآن — مجاناً لمدة 7 أيام</p>
        <div class="cta cta-navy">ابدأ تجربتك المجانية ←</div>
      `},
    ]
  },
  // CAROUSEL 5: خطوات الإنشاء
  {
    name: 'carousel-5-steps',
    slides: [
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">1/6</div>
        <div class="num">3</div>
        <h1 class="white">خطوات لإنشاء<br><span class="gold">موقعك العقاري</span></h1>
        <p class="p-white">في 5 دقائق فقط — بدون خبرة تقنية</p>
        <div class="swipe swipe-white">← اسحب للمتابعة</div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">2/6</div>
        <div class="num">1</div>
        <h1 class="white">سجّل <span class="gold">حسابك</span></h1>
        <p class="p-white">أدخل اسمك وكلمتك — انتهيت</p>
        <div class="items">
          <div class="item"><div class="item-icon">✏️</div><div class="item-text">اسم الوكالة + المدينة</div></div>
          <div class="item"><div class="item-icon">📧</div><div class="item-text">البريد الإلكتروني</div></div>
          <div class="item"><div class="item-icon">🔑</div><div class="item-text">كلمة مرور</div></div>
        </div>
        <div style="margin-top:30px; padding:20px; background:rgba(201,162,39,0.1); border-radius:12px;">
          <p style="font-size:20px; color:rgba(255,255,255,0.7);">⏱️ أقل من دقيقة</p>
        </div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">3/6</div>
        <div class="num">2</div>
        <h1 class="white">أضف <span class="gold">عقاراتك</span></h1>
        <p class="p-white">ارفع الصور وأضف التفاصيل</p>
        <div class="items">
          <div class="item"><div class="item-icon">📸</div><div class="item-text">ارفع صور العقار</div></div>
          <div class="item"><div class="item-icon">📝</div><div class="item-text">أضف العنوان والوصف</div></div>
          <div class="item"><div class="item-icon">💰</div><div class="item-text">حدد السعر</div></div>
          <div class="item"><div class="item-icon">📍</div><div class="item-text">أضف الموقع</div></div>
        </div>
      `},
      { bg: 'bg-dark', content: `
        <div class="slide-num slide-num-white">4/6</div>
        <div class="num">3</div>
        <h1 class="white">شارك <span class="gold">رابط موقعك</span></h1>
        <p class="p-white">شاركه مع عملائك وعلى وسائل التواصل</p>
        <div class="items">
          <div class="item"><div class="item-icon">🔗</div><div class="item-text">رابط خاص بوكالتك</div></div>
          <div class="item"><div class="item-icon">📱</div><div class="item-text">شاركه على واتساب</div></div>
          <div class="item"><div class="item-icon">📘</div><div class="item-text">انشره على فيسبوك</div></div>
        </div>
      `},
      { bg: 'bg-navy', content: `
        <div class="slide-num slide-num-white">5/6</div>
        <h1 class="white">ما تحصل عليه <span class="gold">مجاناً</span></h1>
        <div class="items">
          <div class="item"><div class="item-icon">🏠</div><div class="item-text">موقع احترافي خاص بوكالتك</div></div>
          <div class="item"><div class="item-icon">📊</div><div class="item-text">لوحة تحكم لإدارة العقارات</div></div>
          <div class="item"><div class="item-icon">👥</div><div class="item-text">تتبع العملاء المحتملين</div></div>
          <div class="item"><div class="item-icon">📱</div><div class="item-text">متوافق مع جميع الأجهزة</div></div>
          <div class="item"><div class="item-icon">🌍</div><div class="item-text">دعم عربي وفرنسي</div></div>
        </div>
      `},
      { bg: 'bg-gradient-gold', content: `
        <div class="slide-num slide-num-dark">6/6</div>
        <h1 class="navy">جاهز للبدء؟</h1>
        <p class="p-dark">7 أيام تجربة مجانية<br>بدون بطاقة ائتمان</p>
        <div class="cta cta-navy">ابدأ تجربتك المجانية ←</div>
        <p class="p-dark" style="font-size:18px; margin-top:20px;">estate-os-beryl.vercel.app</p>
      `},
    ]
  },
];

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  });
  const outDir = __dirname;

  for (const carousel of carousels) {
    const dir = path.join(outDir, carousel.name);
    fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < carousel.slides.length; i++) {
      const slide = carousel.slides[i];
      const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><style>${css}</style></head><body class="${slide.bg}"><div class="content">${slide.content}</div></body></html>`;
      const tmpFile = path.join(dir, `_tmp_${i}.html`);
      fs.writeFileSync(tmpFile, html, 'utf8');

      const page = await browser.newPage({ viewport: { width: W, height: H } });
      await page.goto('file:///' + tmpFile.replace(/\\/g, '/'));
      await page.waitForTimeout(1500);
      const pngFile = path.join(dir, `slide-${i + 1}.png`);
      await page.screenshot({ path: pngFile, type: 'png' });
      await page.close();
      fs.unlinkSync(tmpFile);
      console.log(`${carousel.name}/slide-${i + 1}.png`);
    }
  }

  await browser.close();
  console.log('All carousels done!');
})();
