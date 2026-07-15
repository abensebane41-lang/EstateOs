let resendClient: { emails: { send: (params: Record<string, unknown>) => Promise<unknown> } } | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("resend") as { Resend: new (key: string) => typeof resendClient };
    resendClient = new mod.Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.EMAIL_FROM || "EstateOS <noreply@estateos.app>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email");
    return { success: false, skipped: true };
  }

  try {
    const client = getResendClient();
    if (!client) {
      console.warn("[Email] RESEND_API_KEY not configured, skipping email");
      return { success: false, skipped: true };
    }
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return { success: false, error };
  }
}

export function newLeadEmailHTML(data: {
  agencyName: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  propertyName?: string;
  message?: string;
}): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0F2747, #1a3a5c); color: #fff; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .header p { margin: 8px 0 0; opacity: 0.8; font-size: 14px; }
        .body { padding: 32px; }
        .badge { display: inline-block; background: #C9A227; color: #0F2747; padding: 4px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
        .info-grid { margin: 20px 0; }
        .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
        .info-label { width: 120px; color: #666; font-size: 14px; flex-shrink: 0; }
        .info-value { color: #333; font-size: 14px; font-weight: 500; }
        .message-box { background: #f8f9fa; border-right: 3px solid #C9A227; padding: 16px; border-radius: 8px; margin: 20px 0; }
        .message-box p { margin: 0; color: #555; line-height: 1.7; }
        .footer { background: #f8f9fa; padding: 20px 32px; text-align: center; color: #999; font-size: 12px; }
        .btn { display: inline-block; background: #0F2747; color: #fff !important; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏢 ${data.agencyName}</h1>
          <p>إشعار نظام إدارة العقارات</p>
        </div>
        <div class="body">
          <span class="badge">عميل محتمل جديد</span>
          <h2 style="margin:0 0 16px; color:#333;">تم استلام رسالة جديدة</h2>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">الاسم</span>
              <span class="info-value">${data.leadName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">البريد الإلكتروني</span>
              <span class="info-value">${data.leadEmail}</span>
            </div>
            ${data.leadPhone ? `
            <div class="info-row">
              <span class="info-label">الهاتف</span>
              <span class="info-value">${data.leadPhone}</span>
            </div>` : ""}
            ${data.propertyName ? `
            <div class="info-row">
              <span class="info-label">العقار</span>
              <span class="info-value">${data.propertyName}</span>
            </div>` : ""}
          </div>
          ${data.message ? `
          <div class="message-box">
            <p><strong>الرسالة:</strong></p>
            <p>${data.message}</p>
          </div>` : ""}
          <div style="text-align:center; margin-top:24px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"}/dashboard/leads" class="btn">عرض العملاء المحتملين</a>
          </div>
        </div>
        <div class="footer">
          <p>تم إرسال هذا الإشعار تلقائياً من نظام EstateOS</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function subscriptionActivatedEmailHTML(data: {
  agencyName: string;
  planName: string;
}): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0F2747, #1a3a5c); color: #fff; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .body { padding: 32px; text-align: center; }
        .check { font-size: 48px; margin-bottom: 16px; }
        .btn { display: inline-block; background: #C9A227; color: #0F2747 !important; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
        .footer { background: #f8f9fa; padding: 20px 32px; text-align: center; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>EstateOS</h1>
        </div>
        <div class="body">
          <div class="check">✅</div>
          <h2 style="color:#333;">تم تفعيل اشتراكك!</h2>
          <p style="color:#666;">مرحباً ${data.agencyName}، تم تفعيل اشتراك <strong>${data.planName}</strong> بنجاح.</p>
          <p style="color:#666;">يمكنك الآن الاستفادة من جميع مميزات المنصة.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"}/dashboard" class="btn">الذهاب للوحة التحكم</a>
        </div>
        <div class="footer">
          <p>EstateOS - نظام إدارة العقارات</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function welcomeEmailHTML(agencyName: string): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f6f9; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0F2747, #1a3a5c); color: #fff; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .body { padding: 32px; text-align: center; }
        .btn { display: inline-block; background: #C9A227; color: #0F2747 !important; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
        .footer { background: #f8f9fa; padding: 20px 32px; text-align: center; color: #999; font-size: 12px; }
        ul { text-align: right; padding-right: 20px; color: #555; line-height: 2; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏢 مرحباً بك في EstateOS</h1>
        </div>
        <div class="body">
          <h2 style="color:#333;">تم إنشاء حسابك بنجاح!</h2>
          <p style="color:#666;">مرحباً ${agencyName}،</p>
          <p style="color:#666;">حسابك جاهز. يمكنك الآن:</p>
          <ul>
            <li>إضافة عقاراتك ونشرها</li>
            <li>تتبع العملاء المحتملين</li>
            <li>إدارة حسابك وإعداداتك</li>
          </ul>
          <p style="color:#999;font-size:13px;"> trial مجاني لمدة 14 يوماً</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"}/dashboard" class="btn">البدء الآن</a>
        </div>
        <div class="footer">
          <p>EstateOS - نظام إدارة العقارات</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
