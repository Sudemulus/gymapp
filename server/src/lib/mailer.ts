import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, code: string) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "TrackGym Şifre Sıfırlama Kodu",
    text: `TrackGym şifre sıfırlama kodunuz: ${code}\nBu kod 15 dakika geçerlidir.`,
    html: `<p>TrackGym şifre sıfırlama kodunuz: <strong>${code}</strong></p><p>Bu kod 15 dakika geçerlidir.</p>`,
  });
}
