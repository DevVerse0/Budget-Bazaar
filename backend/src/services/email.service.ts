import nodemailer from 'nodemailer';
// Resend HTTP API (preferred on Railway - SMTP often blocked)
const RESEND_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || process.env.FROM_EMAIL || 'Budget Bazar Service <onboarding@resend.dev>';
async function sendViaResend(to:string, subject:string, html:string){
  // If using onboarding@resend.dev, Resend only allows to own email — will 403 for others (needs verified domain)
  const from = RESEND_FROM;
  const res = await fetch('https://api.resend.com/emails', {
    method:'POST',
    headers:{ 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ from, to, subject, html })
  });
  if(!res.ok){ const t=await res.text(); throw new Error(`Resend ${res.status}: ${t} (from: ${from})`); }
  return res.json();
}
// SMTP fallback - use 587 STARTTLS (465 often timeout on Railway), configurable via env
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: SMTP_PORT,
  secure: SMTP_PORT===465, // 465 SSL, 587 STARTTLS
  auth: { user: process.env.SMTP_USER || 'budgetbazaarservicebd@gmail.com', pass: (process.env.SMTP_PASS || 'zhmf ptla fpmf ndty').replace(/\s/g,'') },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});
export async function sendMail(to:string, subject:string, html:string){
  // try Resend first only if key exists (HTTP, works on Railway)
  if(RESEND_KEY){
    try{ await sendViaResend(to, subject, html); console.log('Email sent via Resend to', to, 'from', RESEND_FROM); return; }catch(e){
      console.warn('Resend fail, fallback SMTP', (e as any)?.message);
      // If Resend 403 due to onboarding domain, give clear hint
      if(String((e as any)?.message).includes('403')) console.warn('Fix: Verify domain at resend.com/domains and set RESEND_FROM=noreply@yourdomain.com');
    }
  } else {
    console.log('RESEND_API_KEY not set, using SMTP');
  }
  const from = process.env.SMTP_USER || process.env.FROM_EMAIL || 'budgetbazaarservicebd@gmail.com';
  try{
    await transporter.sendMail({ from: `Budget Bazar Service <${from}>`, to, subject, html });
    console.log('Email sent via SMTP to', to, `port ${SMTP_PORT}`);
  }catch(e:any){
    console.error('SMTP send failed', e?.message, `port ${SMTP_PORT} host ${process.env.SMTP_HOST||'smtp.gmail.com'}`);
    throw e;
  }
}
export function otpEmailHtml(code:string, logoUrl:string){
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;background:#0B1220;color:#fff;border-radius:16px;overflow:hidden">
    <div style="background:#0B1220;padding:20px;text-align:center;border-bottom:4px solid #F5B800">
      <img src="${logoUrl}" alt="Budget Bazar Service" style="width:80px;height:80px;border-radius:50%;background:#fff;padding:6px"/>
      <h1 style="margin:12px 0 0;font-size:22px;letter-spacing:1px">BUDGET BAZAAR <span style="color:#F5B800">SERVICE</span></h1>
      <p style="margin:4px 0 0;color:#F5B800;font-size:12px">কম দামে ভালো পণ্য • সঠিক পরামর্শ</p>
    </div>
    <div style="background:#fff;color:#0B1220;padding:24px;text-align:center">
      <h2 style="margin:0;font-size:18px">Your Verification Code</h2>
      <p style="color:#64748b;font-size:13px;margin:8px 0 16px">Use this code to complete signup. Valid for 10 minutes.</p>
      <div style="background:#0B1220;color:#F5B800;font-size:32px;letter-spacing:8px;font-weight:800;padding:14px;border-radius:12px;border:2px dashed #F5B800">${code}</div>
      <p style="color:#64748b;font-size:12px;margin:16px 0 0">If you didn't request this, ignore this email.</p>
      <p style="color:#94a3b8;font-size:11px;margin:16px 0 0">Good Product • Low Price • Best Quality • Best Service</p>
    </div>
     <div style="background:#F5B800;color:#0B1220;text-align:center;padding:10px;font-size:12px;font-weight:600">https://budget-bazaar.pages.dev</div>
  </div>`;
}
export async function sendOtpCode(to:string, code:string){
  const logo = 'https://budget-bazaar.pages.dev/logo.png';
  await sendMail(to, `Budget Bazar Service - Your Code ${code}`, otpEmailHtml(code, logo));
}
export async function sendResetLink(to:string, link:string){
  await sendMail(to, 'Budget Bazar Service - Reset Password', `<div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:0 auto;background:#fff;padding:24px;border-radius:12px;border:1px solid #eee;text-align:center"><img src="https://budget-bazaar.pages.dev/logo.png" style="width:60px;height:60px;border-radius:50%"/><h2>Budget Bazar Service</h2><p>Click to reset:</p><a href="${link}" style="display:inline-block;background:#0B1220;color:#F5B800;padding:12px 24px;border-radius:8px;text-decoration:none">${link}</a></div>`);
}
