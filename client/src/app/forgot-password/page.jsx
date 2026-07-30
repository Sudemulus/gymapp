"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/api";
import PageHeader from "@/components/PageHeader";
import { KeyRound } from "lucide-react";

function GmailIcon(props) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z" />
      <path fill="#1e88e5" d="M3,16.2l3.614,2.011L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z" />
      <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
      <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z" />
      <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0C43.076,8,45,9.924,45,12.298z" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await forgotPassword({ email });
      setMessage(res.message);
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <PageHeader
        icon={KeyRound}
        title="Şifremi Unuttum"
        subtitle={
          <>
            Şifreni mi hatırladın?{" "}
            <Link href="/login" className="text-emerald-400 hover:underline">
              Giriş yap
            </Link>
          </>
        }
      />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Gmail Adresin</span>
          <div className="relative">
            <GmailIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@gmail.com"
              required
              disabled={submitting || !!message}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-11 pr-4 text-slate-100 focus:border-emerald-500 focus:outline-none disabled:opacity-60"
            />
          </div>
        </label>

        {error && <p className="text-sm text-red-400">Hata: {error}</p>}
        {message && <p className="text-sm text-emerald-400">{message}</p>}

        <button
          type="submit"
          disabled={submitting || !!message}
          className="mt-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Gönderiliyor..." : "Sıfırlama Kodu Gönder"}
        </button>
      </form>
    </div>
  );
}
