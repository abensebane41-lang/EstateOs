const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const W = 1080, H = 1920;

const css = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;font-family:'IBM Plex Sans Arabic',sans-serif;overflow:hidden;position:relative}
.bg-n{background:#0F2747}.bg-d{background:#0a1a2f}.bg-g{background:linear-gradient(180deg,#0F2747,#1a3a5c)}.bg-gg{background:linear-gradient(180deg,#C9A227,#b8922a)}.bg-r{background:linear-gradient(135deg,#1a1a2e,#16213e)}
.c{position:relative;z-index:10;height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:50px 44px;text-align:center}
.sn{position:absolute;top:40px;left:50px;font-size:17px;font-weight:600}
.snw{color:rgba(255,255,255,.3)}.snd{color:rgba(26,26,26,.3)}
h1{font-size:48px;font-weight:800;line-height:1.3;margin-bottom:14px}
.go{color:#C9A227}.nv{color:#0F2747}.wh{color:#fff}
p{font-size:24px;font-weight:300;line-height:1.6;margin-bottom:16px}
.pw{color:rgba(255,255,255,.6)}.pd{color:rgba(26,26,26,.6)}
.dv{width:70px;height:4px;background:#C9A227;border-radius:2px;margin:14px auto}
.its{display:flex;flex-direction:column;gap:12px;width:100%;max-width:780px}
.it{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px 18px;text-align:right}
.ii{width:44px;height:44px;border-radius:12px;background:rgba(201,162,39,.15);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.tx{font-size:20px;font-weight:500;color:rgba(255,255,255,.85);line-height:1.4}
.sb{font-size:15px;color:rgba(255,255,255,.4);margin-top:3px}
.ct{display:inline-flex;align-items:center;gap:12px;background:#C9A227;color:#0F2747;font-size:24px;font-weight:700;padding:20px 44px;border-radius:14px;margin-top:8px}
.cn{background:#0F2747;color:#fff}
.sw{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);font-size:15px;color:rgba(255,255,255,.3)}
.vs{display:flex;gap:16px;width:100%;max-width:780px;margin-top:10px}
.vb{flex:1;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px;text-align:center}
.vb-t{font-size:18px;font-weight:700;color:#C9A227;margin-bottom:10px}
.vb-i{font-size:16px;color:rgba(255,255,255,.7);line-height:1.6}
.stats{display:flex;gap:24px;margin-top:16px;justify-content:center}
.st{text-align:center}
.st-n{font-size:48px;font-weight:900;color:#C9A227}
.st-l{font-size:16px;color:rgba(255,255,255,.5);margin-top:4px}
.q{font-size:28px;font-weight:600;color:rgba(255,255,255,.9);line-height:1.5;max-width:680px;border-right:4px solid #C9A227;padding-right:22px;text-align:right;margin-top:14px}
`;

function s(bg,content){return{bg,content}}

const C=[
// ===== CAROUSEL 1: أخطاء شراء شقة =====
{name:'c1-buying-mistakes',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<div class="its"><div class="it"><div class="ii">⚠️</div><div class="tx">5 أخطاء يرتكبها 90% من المشترين</div></div></div>
<h1 class="wh">أخطاء <span class="go">شائعة</span><br>عند شراء شقة في الجزائر</h1>
<p class="pw">هل تخطط لشراء شقة؟<br>تجنب هذه الأخطاء الباهظة</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">الخطأ 1: عدم التحقق <span class="go">القانوني</span></h1>
<div class="its">
<div class="it"><div class="ii">📄</div><div class="tx">عدم التأكد من وجود <b>الlive foncier</b><div class="sb">الlive foncier هو المستند الأهم — بدونه لا تشتري</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx">عدم التأكد من <b>الرسالة العقارية</b><div class="sb">تأكد أن العقار مسجل باسم البائع فعلياً</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx">عدم التحقق من <b>الحجز Judicial</b><div class="sb">العقار قد يكون محجوزاً — تحقق من المحكمة</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">الخطأ 2: عدم <span class="go">معاينة</span> العقار</h1>
<div class="its">
<div class="it"><div class="ii">👀</div><div class="tx">الشراء بناءً على الصور فقط<div class="sb">الصور قد تكون متحيدة — زُر العقار فعلياً</div></div></div>
<div class="it"><div class="ii">🔍</div><div class="tx">عدم التحقق من الحالة<div class="sb">الجدران، الأسقف، الكهرباء، الماء، الغاز</div></div></div>
<div class="it"><div class="ii">🏗️</div><div class="tx">عدم التحقق من البناء<div class="sb">هل هو قانوني؟ هل له رخصة بناء؟</div></div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">الخطأ 3: عدم حساب <span class="go">التكلفة الكاملة</span></h1>
<div class="its">
<div class="it"><div class="ii">💰</div><div class="tx">التركيز على السعر فقط<div class="sb">أضف: fees notaire + Frais de mutation + travaux</div></div></div>
<div class="it"><div class="ii">📊</div><div class="tx">عدم حساب <b>taxes</b><div class="sb">TAF (taxe additionnelle foncière) + taxe communale</div></div></div>
<div class="it"><div class="ii">🔧</div><div class="tx">عدم حساب <b>travaux</b><div class="sb">الصيانة والترميم قد تكلف 10-20% من السعر</div></div></div>
</div>
<div class="stats">
<div class="st"><div class="st-n">+30%</div><div class="st-l">التكلفة الفعلية</div></div>
<div class="st"><div class="st-n">فقط</div><div class="st-l">70% هو السعر</div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">الخطأ 4: عدم <span class="go">المقارنة</span></h1>
<div class="its">
<div class="it"><div class="ii">📊</div><div class="tx">شراء أول عقار تراه<div class="sb">قارن بين 5 عقارات على الأقل</div></div></div>
<div class="it"><div class="ii">🏘️</div><div class="tx">عدم التحقق من الحي<div class="sb">المرافق، المواصلات، الأمن، الجيران</div></div></div>
<div class="it"><div class="ii">📈</div><div class="tx">عدم التفكير بالمستقبل<div class="sb">هل سيرتفع السعر؟ هل سهل إعادة البيع؟</div></div></div>
</div>
<div class="q">"الصبر عند الشراء = التوفير"</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">الخطأ 5: عدم <span class="nv">الاستعانة بوكيل</span></h1>
<p class="pd">الوكيل العقاري يعرف السوق والقوانين<br>ويمكنه إنقاذ آلاف الدنانير</p>
<div class="ct cn">ابدأ البحث عن عقارك الآن ←</div>
<p class="pd" style="font-size:16px;margin-top:16px;">estate-os-beryl.vercel.app</p>`)
]},

// ===== CAROUSEL 2: نصائح بيع عقار =====
{name:'c2-selling-tips',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh">5 نصائح <span class="go">لبيع</span><br>عقاراتك بأفضل سعر</h1>
<p class="pw">كيف تزيد قيمة عقارك 20-30% قبل البيع</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">النصيحة 1: <span class="go">تحسين</span> المظهر الخارجي</h1>
<div class="its">
<div class="it"><div class="ii">🎨</div><div class="tx">طلاء الباب الأمامي<div class="sb">تكلفة بسيطة — تأثير كبير على الانطباع الأول</div></div></div>
<div class="it"><div class="ii">🌿</div><div class="tx">ترتيب الحديقة<div class="sb">العشب النظيف + الزهور = انطباع ممتاز</div></div></div>
<div class="it"><div class="ii">💡</div><div class="tx">إضاءة جيدة<div class="sb">الإضاءة الساطعة تجعل العقار يبدو أكبر وأجمل</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">النصيحة 2: <span class="go">التصوير</span> الاحترافي</h1>
<div class="its">
<div class="it"><div class="ii">📸</div><div class="tx">استعن بمصور عقارات<div class="sb">التكلفة: 3,000-5,000 دج — العائد: آلاف الدنانير</div></div></div>
<div class="it"><div class="ii">☀️</div><div class="tx">صور في الصباح الباكر<div class="sb">الضوء الطبيعي أجمل —تجنب الظهيرة</div></div></div>
<div class="it"><div class="ii">📐</div><div class="tx">صور الزوايا الصعبة<div class="sb">الحمام والمطبخ — العملاء يهتمون بهذه الأماكن</div></div></div>
</div>
<div class="q">"الصورة الأولى تبيع — أو تطرد"</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">النصيحة 3: <span class="go">التسعير</span> الصحيح</h1>
<div class="its">
<div class="it"><div class="ii">💰</div><div class="tx">لا تضع سعر مرتفع جداً<div class="sb">العقارات المرتفعة تبقى في السوق أشهر</div></div></div>
<div class="it"><div class="ii">📊</div><div class="tx">ابحث عن أسعار المنطقة<div class="sb">اسأل الوكالات العقارية عن الأسعار الحالية</div></div></div>
<div class="it"><div class="ii">🎯</div><div class="tx">ضع سعراً جذاباً قليلاً<div class="sb">السعر المنخفض يجذب مشترين أكثر + مزايدة</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">النصيحة 4: <span class="go">التنظيف</span> والترتيب</h1>
<div class="its">
<div class="it"><div class="ii">🧹</div><div class="tx">نظف كل زاوية<div class="sb">ال(clean) = العقار يبدو أكبر وأحدث</div></div></div>
<div class="it"><div class="ii">📦</div><div class="tx">أزل الفائض<div class="sb">الأثاث الكثير يصغر المساحة — أزل 50%</div></div></div>
<div class="it"><div class="ii">🌸</div><div class="tx">أضف لمسات بسيطة<div class="sb">شموع، زهور، رائحة نظيفة</div></div></div>
</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">النصيحة 5: <span class="nv">التوثيق</span> الكامل</h1>
<div class="its">
<div class="it"><div class="ii">📄</div><div class="tx" style="color:#0F2747;">جهّز كل المستندات مسبقاً<div class="sb" style="color:rgba(15,39,71,.5);">Acte + livret foncier + taxe + receipt</div></div></div>
<div class="it"><div class="ii">⏱️</div><div class="tx" style="color:#0F2747;">التوثيق السريع يسرّع البيع<div class="sb" style="color:rgba(15,39,71,.5);">المشتري الجاد يحتاج المستندات فوراً</div></div></div>
</div>
<div class="ct cn">ابدأ البيع الآن ←</div>`)
]},

// ===== CAROUSEL 3: تكلفة بناء فيلا =====
{name:'c3-villa-cost',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh">كم <span class="go">تكلف</span><br>بناء فيلا في الجزائر؟</h1>
<p class="pw">حساب تقريبي حسب المساحة والولاية</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">الأساسيات: <span class="go">المساحة</span></h1>
<div class="its">
<div class="it"><div class="ii">📐</div><div class="tx">100 م² = فيلا صغيرة<div class="sb">مناسبة لعائلة صغيرة — 2-3 غرف نوم</div></div></div>
<div class="it"><div class="ii">📐</div><div class="tx">150-200 م² = فيلا متوسطة<div class="sb">مناسبة لعائلة متوسطة — 3-4 غرف نوم</div></div></div>
<div class="it"><div class="ii">📐</div><div class="tx">250+ م² = فيلا كبيرة<div class="sb">فخمة — 4-6 غرف نوم + حديقة كبيرة</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">التكلفة التقريبية <span class="go">للمساحة الواحدة</span></h1>
<div class="its">
<div class="it"><div class="ii">💰</div><div class="tx">بناء عادي: <span class="go">25,000 - 35,000</span> دج/م²<div class="sb">بلاط عادي + نوافذ عادية + دهان عادي</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">بناء متوسط: <span class="go">40,000 - 60,000</span> دج/م²<div class="sb">بلاط أجنبي + نوافذ UPVC + دهان جيد</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">بناء فاخر: <span class="go">70,000 - 120,000</span> دج/م²<div class="sb">رخام + نوافذ آلية + دهان فاخر + إضاءة</div></div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">أمثلة <span class="go">عملية</span></h1>
<div class="its">
<div class="it"><div class="ii">🏠</div><div class="tx">فيلا 150 م² (عادي)<div class="sb">150 × 30,000 = <b>4.5 مليار سنتيم</b></div></div></div>
<div class="it"><div class="ii">🏡</div><div class="tx">فيلا 150 م² (متوسط)<div class="sb">150 × 50,000 = <b>7.5 مليار سنتيم</b></div></div></div>
<div class="it"><div class="ii">🏰</div><div class="tx">فيلا 200 م² (فاخر)<div class="sb">200 × 100,000 = <b>20 مليار سنتيم</b></div></div></div>
</div>
<div class="q">"الأسعار تتغير حسب الولاية والسوق"</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">التكاليف <span class="go">الإضافية</span> المنسيّة</h1>
<div class="its">
<div class="it"><div class="ii">📐</div><div class="tx">دفتر تقني: 100,000 - 200,000 دج<div class="sb">مهندس معماري + مهندس أشغال</div></div></div>
<div class="it"><div class="ii">📋</div><div class="tx">رخصة البناء: 20,000 - 50,000 دج<div class="sb"> البلدية — قد يستغرق 3-6 أشهر</div></div></div>
<div class="it"><div class="ii">⚡</div><div class="tx">اتصالات الكهرباء/Mاء/غاز: 200,000 - 500,000 دج<div class="sb">حسب المسافة من الشبكة</div></div></div>
<div class="it"><div class="ii">🚧</div><div class="tx">سياج + بوابة: 500,000 - 2,000,000 دج<div class="sb">لا تنسَ السياج!</div></div></div>
</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">نصيحتي <span class="nv">الذهبية</span></h1>
<div class="its">
<div class="it"><div class="ii">💡</div><div class="tx" style="color:#0F2747;">ابدأ بالأساسيات وطوّر تدريجياً<div class="sb" style="color:rgba(15,39,71,.5);">ابنِ الطابق الأول ثم أكمل لاحقاً</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx" style="color:#0F2747;">خصص 20% طوارئ<div class="sb" style="color:rgba(15,39,71,.5);">الأسعار ترتفع دائماً — لا تنسَ الاحتياطي</div></div></div>
</div>
<div class="ct cn">ابدأ خطتك الآن ←</div>`)
]},

// ===== CAROUSEL 4: المستندات القانونية =====
{name:'c4-legal-docs',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh">المستندات <span class="go">القانونية</span><br>للبيع العقاري في الجزائر</h1>
<p class="pw">الوثائق التي تحتاجها قبل أي عملية بيع أو شراء</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">المستندات <span class="go">الأساسية</span></h1>
<div class="its">
<div class="it"><div class="ii">📄</div><div class="tx"><b>Acte de propriété</b> (الlive foncier)<div class="sb">المستند الأهم — يثبت ملكيتك للعقار</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx"><b>الرسالة العقارية</b> (certificat)<div class="sb">تظهر من البلدية — تثبت أن العقار مسجل باسمك</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx"><b>Certificat négatif</b><div class="sb">يثبت أن العقار غير محجوز أو مرهون</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">مستندات <span class="go">إضافية</span></h1>
<div class="its">
<div class="it"><div class="ii">📋</div><div class="tx"><b>Plan de situation</b><div class="sb">خريطة توضيحية لموقع العقار</div></div></div>
<div class="it"><div class="ii">📋</div><div class="tx"><b>Plan cadastral</b><div class="sb">خريطة المساحة من البلدية</div></div></div>
<div class="it"><div class="ii">📋</div><div class="tx"><b>Titre foncier</b><div class="sb">البطاقة العقارية — إن وُجدت</div></div></div>
<div class="it"><div class="ii">📋</div><div class="tx"><b>Réception de travaux</b><div class="sb">إذا كان العقار حديث البناء</div></div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">الرسوم <span class="go">الإدارية</span></h1>
<div class="its">
<div class="it"><div class="ii">💰</div><div class="tx"><b>Droits de mutation</b>: 5% من ثمن البيع<div class="sb">يُدفع من المشتري — ضريبة نقل ملكية</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx"><b>Frais de notaire</b>: 1-3% تقريباً<div class="sb">رسوم العدول + التوثيق</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx"><b>Taxe communale</b><div class="sb">رسوم البلدية — تختلف حسب الولاية</div></div></div>
</div>
<div class="stats">
<div class="st"><div class="st-n">~7%</div><div class="st-l">الرسوم الإجمالية</div></div>
<div class="st"><div class="st-n">من البائع</div><div class="st-l">أو المشتري</div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">نصائح <span class="go">قانونية</span> مهمة</h1>
<div class="its">
<div class="it"><div class="ii">⚖️</div><div class="tx">لا ت签 أي عقد قبل التحقق<div class="sb">استشر محامياً أو موثقاً أولاً</div></div></div>
<div class="it"><div class="ii">🔍</div><div class="tx">تحقق من وجود حجز Judicial<div class="sb">عقار قد يكون محجوزاً — تحقق من المحكمة</div></div></div>
<div class="it"><div class="ii">📝</div><div class="tx">احتفظ بنسخ من كل المستندات<div class="sb">لا تعطي الأصل لأحد — احتفظ بنسخ</div></div></div>
<div class="it"><div class="ii">⏱️</div><div class="tx">تأكد من صلاحية المستندات<div class="sb">بعض المستندات تنتهي صلاحيتها — حدّثها</div></div></div>
</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">هل تحتاج مساعدة؟</h1>
<p class="pd">الوكالات العقارية تعرف كل هذه الإجراءات<br>ويمكنها مساعدتك في كل خطوة</p>
<div class="ct cn">ابحث عن وكالتك الآن ←</div>
<p class="pd" style="font-size:16px;margin-top:16px;">estate-os-beryl.vercel.app</p>`)
]},

// ===== CAROUSEL 5: شقة vs فيلا =====
{name:'c5-apartment-vs-villa',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh"><span class="go">شقة</span> vs <span class="go">فيلا</span><br>أيهما تختار؟</h1>
<p class="pw">مقارنة شاملة لمساعدتك في الاختيار</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">السعر <span class="go">والتكلفة</span></h1>
<div class="vs">
<div class="vb"><div class="vb-t">🏠 شقة</div><div class="vb-i">5-20 مليار سنتيم<br><br>صيانة شهرية: 2,000-5,000 دج<br>لا ت需 أرض خاصة</div></div>
<div class="vb"><div class="vb-t">🏡 فيلا</div><div class="vb-i">15-100 مليار سنتيم<br><br>صيانة شهرية: 10,000-30,000 دج<br>تحتاج حديقة + سياج</div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">الخصوصية <span class="go">والراحة</span></h1>
<div class="vs">
<div class="vb"><div class="vb-t">🏠 شقة</div><div class="vb-i">❌ جيران في كل اتجاه<br>❌ ضوضاء<br>❌ مواقف محدودة<br>✅ أمان (باب واحد)</div></div>
<div class="vb"><div class="vb-t">🏡 فيلا</div><div class="vb-i">✅ خصوصية تامة<br>✅ لا جيران<br>✅ حديقة خاصة<br>❌ أمان ذاتي</div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">المساحة <span class="go">والعائلية</span></h1>
<div class="vs">
<div class="vb"><div class="vb-t">🏠 شقة</div><div class="vb-i">70-150 م²<br>مناسبة لعائلة صغيرة<br>2-3 غرف نوم<br>مناسب لل单身 + الأزواج الجدد</div></div>
<div class="vb"><div class="vb-t">🏡 فيلا</div><div class="vb-i">150-500 م²<br>مناسبة لعائلات كبيرة<br>4-6 غرف نوم<br>مناسبة للعائلات الكبيرة</div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">الاستثمار <span class="go">والإيجار</span></h1>
<div class="vs">
<div class="vb"><div class="vb-t">🏠 شقة</div><div class="vb-i">✅ سهلة الإيجار<br>✅ الطلب دائماً مرتفع<br>❌ هامش ربح أقل<br>✅ سهلة إعادة البيع</div></div>
<div class="vb"><div class="vb-t">🏡 فيلا</div><div class="vb-i">❌ صعبة الإيجار<br>❌ الطلب أقل<br>✅ هامش ربح أكبر<br>❌ صعبة إعادة البيع</div></div>
</div>
<div class="q">"الشقة للإيجار — الفيلا للسكن"</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">الخلاصة</h1>
<div class="its">
<div class="it"><div class="ii">🏠</div><div class="tx" style="color:#0F2747;">الشقة: أفضل للمبتدئين + الإيجار<div class="sb" style="color:rgba(15,39,71,.5);">سعر أقل + صيانة أقل + سهلة البيع</div></div></div>
<div class="it"><div class="ii">🏡</div><div class="tx" style="color:#0F2747;">الفيلا: للأسر الكبيرة + الاستثمار<div class="sb" style="color:rgba(15,39,71,.5);">خصوصية + مساحة + قيمة أعلى</div></div></div>
</div>
<div class="ct cn">ابدأ البحث الآن ←</div>`)
]},

// ===== CAROUSEL 6: أفضل الولايات للاستثمار =====
{name:'c6-best-investment-states',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh">أفضل <span class="go">5 ولايات</span><br>للاستثمار العقاري في الجزائر</h1>
<p class="pw">أين تشتري عقاراً اليوم؟</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">1. الجزائر العاصمة <span class="go">🥇</span></h1>
<div class="its">
<div class="it"><div class="ii">📈</div><div class="tx">الطلب الأعلى في الجزائر<div class="sb">5 مليون نسمة — أكبر سوق عقاري</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">أسعار مرتفعة لكن مستقرة<div class="sb">العائد على الإيجار: 3-5% سنوياً</div></div></div>
<div class="it"><div class="ii">🏢</div><div class="tx">أفضل المناطق: بن عكنون، حيالا، المحمدية<div class="sb">مناطق راقية — إيجارات مرتفعة</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">2. وهران <span class="go">🥈</span></h1>
<div class="its">
<div class="it"><div class="ii">📈</div><div class="tx">ثاني أكبر سوق في الجزائر<div class="sb">1.5 مليون نسمة — نمو سريع</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">أسعار أقل من الجزائر 30-40%<div class="sb">هذا يعني عائد أعلى على الإيجار</div></div></div>
<div class="it"><div class="ii">🏖️</div><div class="tx">مناطق سياحية: العقيدية، لاروساس<div class="sb">إيجارات عطل — دخل إضافي</div></div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">3. قسنطينة <span class="go">🥉</span></h1>
<div class="its">
<div class="it"><div class="ii">📈</div><div class="tx">مدينة جامعية — طلب مرتفع<div class="sb">طلاب + أساتذة يبحثون عن إيجار</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">أسعار معقولة جداً<div class="sb">شقة F3 بـ 8-12 مليار سنتيم فقط</div></div></div>
</div>
<h1 style="margin-top:20px;font-size:36px;" class="wh">4. بجاية <span class="go">4</span></h1>
<div class="its">
<div class="it"><div class="ii">🏖️</div><div class="tx">سياحية + جامعية — إيجارات ممتازة<div class="sb">45 وكالة عقارية مسجلة على Lkeria</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">5. تيزي وزو <span class="go">5</span></h1>
<div class="its">
<div class="it"><div class="ii">📈</div><div class="tx">قريبة من الجزائر — نمو سريع<div class="sb">20 وكالة عقارية على Lkeria</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">أسعار أقل من الجزائر 50%<div class="sb">هناك فرص استثمارية ممتازة</div></div></div>
</div>
<div class="q">"كل ولاية لها سوقها — اعرف السوق قبل الشراء"</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">نصيحة ذهبية</h1>
<div class="its">
<div class="it"><div class="ii">💡</div><div class="tx" style="color:#0F2747;">لا تستثمر في ولايتك فقط<div class="sb" style="color:rgba(15,39,71,.5);">اسأل عن الولايات الأخرى — فرص أفضل</div></div></div>
<div class="it"><div class="ii">📊</div><div class="tx" style="color:#0F2747;">اسأل الوكالات العقارية<div class="sb" style="color:rgba(15,39,71,.5);">تعرف السوق المحلي أفضل من أي أحد</div></div></div>
</div>
<div class="ct cn">ابحث عن عقارك الآن ←</div>`)
]},

// ===== CAROUSEL 7: القرض العقاري =====
{name:'c7-mortgage',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh">كيف <span class="go">تحصل</span><br>على قرض عقاري في الجزائر؟</h1>
<p class="pw">دليل كامل للحصول على تمويل لشراء عقارك</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">شروط <span class="go">الحصول</span> على القرض</h1>
<div class="its">
<div class="it"><div class="ii">📋</div><div class="tx">عمر المتقدم: 21-65 سنة<div class="sb">يجب أن يتقاعد قبل آخر قسط</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">دخل ثابت مثبت<div class="sb">رواتب + معاشات — لا يُقبل الدخل غير المثبت</div></div></div>
<div class="it"><div class="ii">📊</div><div class="tx">نسبة القسط ≤ 33% من الدخل<div class="sb">القسط الأقصى = ثلث الدخل الشهري</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx">عدم وجود سوابق ائتمانية سيئة<div class="sb">لا أقساط متأخرة — لا ديون غير مسددة</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">المستندات <span class="go">المطلوبة</span></h1>
<div class="its">
<div class="it"><div class="ii">📄</div><div class="tx">بطاقة التعريف الوطنية<div class="sb">أصلية + نسخة</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx">شهادة العمل أو مرسوم التعيين<div class="sb">تثبت الدخل الشهري</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx">آخر 3 كشوفات بنكية<div class="sb">تثبت حركة الحساب</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx">عقد البيع أو عرض الشراء<div class="sb">يجب أن يكون هناك عقد مبدئي</div></div></div>
<div class="it"><div class="ii">📄</div><div class="tx">دفتر تقني للعقار<div class="sb">من مهندس معتمد</div></div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">البنوك <span class="go">التي تقدم</span> القروض العقارية</h1>
<div class="its">
<div class="it"><div class="ii">🏦</div><div class="tx">BNA (بنك الفلاحة والتنمية الريفية)<div class="sb">الأكثر شهرة — أسعار تنافسية</div></div></div>
<div class="it"><div class="ii">🏦</div><div class="tx">CPA (الصندوق الوطني للادخار والتوظيف)<div class="sb">قروض طويلة — حتى 25 سنة</div></div></div>
<div class="it"><div class="ii">🏦</div><div class="tx">BADR (بنك التنمية المحلية)<div class="sb">مناسب للموظفين العموميين</div></div></div>
<div class="it"><div class="ii">🏦</div><div class="tx">BEA (بنكϓρός經濟ي)</div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">حساب <span class="go">تقديري</span></h1>
<div class="its">
<div class="it"><div class="ii">💰</div><div class="tx">شقة بـ 10 مليار سنتيم<div class="sb">القسط الشهري لمدة 20 سنة ≈ 60,000 دج/شهر</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">شقة بـ 15 مليار سنتيم<div class="sb">القسط الشهري لمدة 20 سنة ≈ 90,000 دج/شهر</div></div></div>
</div>
<div class="q">"القسط لا يجب أن يتجاوز ثلث دخلك الشهري"</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">نصائح مهمة</h1>
<div class="its">
<div class="it"><div class="ii">💡</div><div class="tx" style="color:#0F2747;">قدّم لعدة بنوك<div class="sb" style="color:rgba(15,39,71,.5);">قارن الأسعار والشروط</div></div></div>
<div class="it"><div class="ii">💡</div><div class="tx" style="color:#0F2747;">جهّز المستندات مسبقاً<div class="sb" style="color:rgba(15,39,71,.5);">البنوك بطيئة — المستندات الجاهزة تسرّع الإجراء</div></div></div>
<div class="it"><div class="ii">💡</div><div class="tx" style="color:#0F2747;">استشر خبيراً مالياً<div class="sb" style="color:rgba(15,39,71,.5);">يمكنه مساعدتك في اختيار أفضل عرض</div></div></div>
</div>
<div class="ct cn">ابدأ رحلة الشراء الآن ←</div>`)
]},

// ===== CAROUSEL 8: تصوير العقارات =====
{name:'c8-photography-tips',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh">كيف <span class="go">تصور</span><br>عقاراتك احترافياً؟</h1>
<p class="pw">نصائح مجانية لتصوير عقاراتك<br>بأفضل جودة</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">ال装备 <span class="go">الأساسي</span></h1>
<div class="its">
<div class="it"><div class="ii">📱</div><div class="tx">هاتفك الكافي — لا تحتاج كاميرا احترافية<div class="sb">iPhone أو Samsung أو Huawei — كافية تماماً</div></div></div>
<div class="it"><div class="ii">☀️</div><div class="tx">الضوء الطبيعي هو الأفضل<div class="sb">افتح النوافذ — لا تستخدم الفلاش</div></div></div>
<div class="it"><div class="ii">📐</div><div class="tx">ماسح زوايا واسعة (اختياري)<div class="sb">ماسح للكاميرا — 500 دج فقط</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">قبل <span class="go">التصوير</span></h1>
<div class="its">
<div class="it"><div class="ii">🧹</div><div class="tx">نظف الغرفة تماماً<div class="sb">أزل الأشياء الشخصية — الألعاب، الملابس</div></div></div>
<div class="it"><div class="ii">📦</div><div class="tx">رتب الأثاث<div class="sb">أزل الأثاث الزائد — المساحة الفارغة تبدو أكبر</div></div></div>
<div class="it"><div class="ii">💡</div><div class="tx">أضاءة جيدة<div class="sb">افتح كل الستائر — أضف مصادر إضاءة</div></div></div>
<div class="it"><div class="ii">🌸</div><div class="tx">أضف لمسات جذابة<div class="sb">زهور على الطاولة + فاكهة في المطبخ</div></div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">أثناء <span class="go">التصوير</span></h1>
<div class="its">
<div class="it"><div class="ii">📐</div><div class="tx">صور من الزاوية<div class="sb">الزاوية تجعل الغرفة تبدو أكبر</div></div></div>
<div class="it"><div class="ii">📱</div><div class="tx">أبقِ الهاتف أفقياً<div class="sb">التصوير الأفقي أفضل للعقارات</div></div></div>
<div class="it"><div class="ii">🎯</div><div class="tx">صوّر كل زاوية<div class="sb">4 زوايا لكل غرفة + تفاصيل</div></div></div>
<div class="it"><div class="ii">⏱️</div><div class="tx">لا تتعجل<div class="sb">خذ وقتك — التصوير الجيد يحتاج صبراً</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">الصور <span class="go">التي يجب</span> أن تلتقطها</h1>
<div class="its">
<div class="it"><div class="ii">🏠</div><div class="tx">المدخل الخارجي<div class="sb">الانطباع الأول — الباب + المبنى من الخارج</div></div></div>
<div class="it"><div class="ii">🛋️</div><div class="tx">غرفة المعيشة<div class="sb">الصورة الأهم — أجمل زاوية</div></div></div>
<div class="it"><div class="ii">🍳</div><div class="tx">المطبخ<div class="sb">العملاء يهتمون بالمطبخ كثيراً</div></div></div>
<div class="it"><div class="ii">🛏️</div><div class="tx">غرفة النوم<div class="sb">نظيفة + مرتبة + ضوء جيد</div></div></div>
<div class="it"><div class="ii">🚿</div><div class="tx">الحمام<div class="sb">نظيف + بلاط متوهج + إضاءة جيدة</div></div></div>
</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">خطأ شائع</h1>
<div class="its">
<div class="it"><div class="ii">❌</div><div class="tx" style="color:#0F2747;">لا تصور الهاتف المحمول من يدك<div class="sb" style="color:rgba(15,39,71,.5);">استخدم حامل ثلاثي أو ادعم يدك على جدار</div></div></div>
<div class="it"><div class="ii">❌</div><div class="tx" style="color:#0F2747;">لا تستخدم الفلاش<div class="sb" style="color:rgba(15,39,71,.5);">الفلاش يغير ألوان الغرفة — الضوء الطبيعي أفضل</div></div></div>
</div>
<div class="ct cn">اعرض عقاراتك بصور احترافية ←</div>`)
]},

// ===== CAROUSEL 9: قيمة عقارك =====
{name:'c9-property-value',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh">كيف <span class="go">تعرف</span><br>قيمة عقارك الحقيقية؟</h1>
<p class="pw">5 عوامل تحدد سعر عقارك</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">العامل 1: <span class="go">الموقع</span> 📍</h1>
<div class="its">
<div class="it"><div class="ii">🏙️</div><div class="tx">المنطقة:市中心 vs الريف<div class="sb">ال市中心 أعلى سعراً بـ 50-100%</div></div></div>
<div class="it"><div class="ii">🏫</div><div class="tx">المرافق القريبة: مدارس، مستشفيات، أسواق<div class="sb">كلما زادت المرافق — زادت القيمة</div></div></div>
<div class="it"><div class="ii">🚗</div><div class="tx">المواصلات: مترو، حافلات، طرق رئيسية<div class="sb">قرب المواصلات = سعر أعلى</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">العامل 2: <span class="go">المساحة</span> 📐</h1>
<div class="its">
<div class="it"><div class="ii">📏</div><div class="tx">المساحة الأكبر = السعر الأعلى<div class="sb">لكن ليس دائماً — الجودة أهم من الكمية</div></div></div>
<div class="it"><div class="ii">🛏️</div><div class="tx">عدد الغرف: F2, F3, F4<div class="sb">F3 هو الأكثر طلباً في الجزائر</div></div></div>
<div class="it"><div class="ii">🚗</div><div class="tx">الجراج: هل يملك جراج؟<div class="sb">الجراج يضيف 10-15% للقيمة</div></div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">العامل 3: <span class="go">الحالة</span> 🏗️</h1>
<div class="its">
<div class="it"><div class="ii">🆕</div><div class="tx">جديد (أقل من 5 سنوات)<div class="sb">أعلى سعراً — لا يحتاج ترميم</div></div></div>
<div class="it"><div class="ii">🔧</div><div class="tx">يحتاج ترميم<div class="sb">خصم 15-25% من السعر</div></div></div>
<div class="it"><div class="ii">💀</div><div class="tx">قديم جداً (أكثر من 30 سنة)<div class="sb">قد يحتاج هدم + بناء — خصم كبير</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">العامل 4: <span class="go">السوق</span> 📈</h1>
<div class="its">
<div class="it"><div class="ii">📊</div><div class="tx">العرض والطلب<div class="sb">إذا كان الطلب مرتفع — السعر يرتفع</div></div></div>
<div class="it"><div class="ii">💹</div><div class="tx">التضخم: 5-7% سنوياً<div class="sb">أسعار العقارات ترتفع مع التضخم</div></div></div>
<div class="it"><div class="ii">📅</div><div class="tx">التوقيت: متى تبيع؟<div class="sb">أفضل وقت: مارس-أبريل + سبتمبر-أكتوبر</div></div></div>
</div>
<div class="q">"التوقيت يصنع الفرق"</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">كيف تحسب القيمة؟</h1>
<div class="its">
<div class="it"><div class="ii">🔍</div><div class="tx" style="color:#0F2747;">اسأل 3 وكالات عقارية<div class="sb" style="color:rgba(15,39,71,.5);">خذ متوسط أسعارهم</div></div></div>
<div class="it"><div class="ii">📊</div><div class="tx" style="color:#0F2747;">تصفح الإعلانات المشابهة<div class="sb" style="color:rgba(15,39,71,.5);">قارن مع عقارات مماثلة في المنطقة</div></div></div>
<div class="it"><div class="ii">💻</div><div class="tx" style="color:#0F2747;">استخدم أدوات التقدير<div class="sb" style="color:rgba(15,39,71,.5);">Lamacta تقدم خدمة تقدير مجانية</div></div></div>
</div>
<div class="ct cn">اعرف قيمة عقارك الآن ←</div>`)
]},

// ===== CAROUSEL 10: أخطاء التأجير =====
{name:'c10-rental-mistakes',slides:[
s('bg-n',`
<div class="sn snw">1/6</div>
<h1 class="wh">5 أخطاء <span class="go">قاتلة</span><br>في التأجير العقاري</h1>
<p class="pw">تجنب هذه الأخطاء التي يقع فيها<br>معظم المالكين</p>
<div class="sw">← اسحب للمتابعة</div>`),
s('bg-d',`
<div class="sn snw">2/6</div>
<h1 class="wh">الخطأ 1: عدم <span class="go">توقيع</span> العقد</h1>
<div class="its">
<div class="it"><div class="ii">❌</div><div class="tx">التأجير بدون عقد مكتوب<div class="sb">هذا خطأ قاتل — لا دليل قانوني</div></div></div>
<div class="it"><div class="ii">✅</div><div class="tx">العقد يجب أن يشمل:<div class="sb">المدة + السعر + شروط الإخلاء + حالة العقار</div></div></div>
<div class="it"><div class="ii">📋</div><div class="tx">سجّل العقد في البلدية<div class="sb">التسجيل يحميك قانونياً</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">3/6</div>
<h1 class="wh">الخطأ 2: عدم <span class="go">التحقق</span> من المستأجر</h1>
<div class="its">
<div class="it"><div class="ii">🔍</div><div class="tx">لا تأجر لأول شخص يأتي<div class="sb">تحقق من الهوية + العمل + السوابق</div></div></div>
<div class="it"><div class="ii">📞</div><div class="tx">اتصل بработه السابق<div class="sb">اسأل: هل دفع بانتظام؟ هل كان يحترم العقار؟</div></div></div>
<div class="it"><div class="ii">💰</div><div class="tx">اطلب ضمان (caution)<div class="sb">شهر أو شهرين كضمان — يُرجع عند الإخلاء</div></div></div>
</div>`),
s('bg-d',`
<div class="sn snw">4/6</div>
<h1 class="wh">الخطأ 3: السعر <span class="go">الخاطئ</span></h1>
<div class="its">
<div class="it"><div class="ii">💸</div><div class="tx">سعر مرتفع جداً = فراغ طويل<div class="sb">العقار يبقى شهوراً بدون مستأجر</div></div></div>
<div class="it"><div class="ii">📉</div><div class="tx">سعر منخفض جداً = خسارة<div class="sb">تفقد الدخل — والصيانة تكلفك</div></div></div>
<div class="it"><div class="ii">📊</div><div class="tx">ابحث عن السعر المتوازن<div class="sb">اسأل الوكالات عن أسعار المنطقة</div></div></div>
</div>`),
s('bg-n',`
<div class="sn snw">5/6</div>
<h1 class="wh">الخطأ 4: عدم <span class="go">الصيانة</span></h1>
<div class="its">
<div class="it"><div class="ii">🔧</div><div class="tx">الصيانة الدورية تحميك<div class="sb">فحص الكهرباء + الماء + التسريبات كل 6 أشهر</div></div></div>
<div class="it"><div class="ii">📸</div><div class="tx">وثّق حالة العقار<div class="sb">صور قبل الإيجار + بعد الإخلاء</div></div></div>
<div class="it"><div class="ii">📝</div><div class="tx">دوّن كل الإصلاحات<div class="sb">السجل يحميك عند خلاف المستأجر</div></div></div>
</div>`),
s('bg-gg',`
<div class="sn snd">6/6</div>
<h1 class="nv">الخطأ 5: عدم <span class="nv">متابعة</span> الدفع</h1>
<div class="its">
<div class="it"><div class="ii">💰</div><div class="tx" style="color:#0F2747;">لا تتأخر في المتابعة<div class="sb" style="color:rgba(15,39,71,.5);">إذا تأخر 3 أشهر — تدخل قانونياً فوراً</div></div></div>
<div class="it"><div class="ii">📱</div><div class="tx" style="color:#0F2747;">أرسل تذكيراً قبل كل شهر<div class="sb" style="color:rgba(15,39,71,.5);">رسالة واتساب بسيطة — "أذكر بالدفع"</div></div></div>
<div class="it"><div class="ii">⚖️</div><div class="tx" style="color:#0F2747;">اعرف حقوقك قانونياً<div class="sb" style="color:rgba(15,39,71,.5);">القانون يحمي المالك — استخدمه</div></div></div>
</div>
<div class="ct cn">أدر عقاراتك بذكاء ←</div>`)
]}
];

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\HP\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe',
  });
  const base = __dirname;

  for (const carousel of C) {
    const dir = path.join(base, carousel.name);
    fs.mkdirSync(dir, { recursive: true });

    for (let i = 0; i < carousel.slides.length; i++) {
      const slide = carousel.slides[i];
      const html = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><style>${css}</style></head><body class="${slide.bg}"><div class="c">${slide.content}</div></body></html>`;
      const tmp = path.join(dir, `_t${i}.html`);
      fs.writeFileSync(tmp, html, 'utf8');

      const page = await browser.newPage({ viewport: { width: W, height: H } });
      await page.goto('file:///' + tmp.replace(/\\/g, '/'));
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(dir, `slide-${i + 1}.png`), type: 'png' });
      await page.close();
      fs.unlinkSync(tmp);
      console.log(`${carousel.name}/slide-${i + 1}.png`);
    }
  }

  await browser.close();
  console.log('All 10 carousels done!');
})();
