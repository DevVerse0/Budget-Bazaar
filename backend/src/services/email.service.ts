import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: { user: process.env.SMTP_USER || 'budgetbazaarservicebd@gmail.com', pass: (process.env.SMTP_PASS || 'zhmf ptla fpmf ndty').replace(/\s/g,'') },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 10000,
});
export async function sendMail(to:string, subject:string, html:string){
  const from = process.env.SMTP_USER || 'budgetbazaarservicebd@gmail.com';
  await transporter.sendMail({ from: `Budget Bazar Service <${from}>`, to, subject, html });
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
    <div style="background:#F5B800;color:#0B1220;text-align:center;padding:10px;font-size:12px;font-weight:600">https://budgetbazar.netlify.app</div>
  </div>`;
}
export async function sendOtpCode(to:string, code:string){
  const logo = 'https://budgetbazar.netlify.app/logo.png';
  await sendMail(to, `Budget Bazar Service - Your Code ${code}`, otpEmailHtml(code, logo));
}
