import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'budgetbazaarservicebd@gmail.com',
    pass: process.env.SMTP_PASS || 'zhmf ptla fpmf ndty',
  },
});
export async function sendMail(to:string, subject:string, html:string){
  const from = process.env.SMTP_USER || 'budgetbazaarservicebd@gmail.com';
  await transporter.sendMail({ from: `Budget Bazar <${from}>`, to, subject, html });
}
export async function sendResetLink(to:string, link:string){
  await sendMail(to, 'Reset your Budget Bazar password', `<h2>Budget Bazar</h2><p>Click to reset:</p><a href="${link}">${link}</a><p>Link valid 1 hour.</p>`);
}
