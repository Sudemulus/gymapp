"use client";

import { useState } from "react";
import { useRequireAuth } from "@/lib/AuthProvider";
import { updateProfile, changePassword } from "@/services/api";
import PageHeader from "@/components/PageHeader";
import { Settings } from "lucide-react";

function SettingsForms({ user, setUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileMessage, setProfileMessage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileSubmitting(true);
    setProfileError(null);
    setProfileMessage(null);

    try {
      const updated = await updateProfile({ name, email });
      setUser(updated);
      setProfileMessage("Profilin güncellendi.");
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Şifreler eşleşmiyor");
      return;
    }

    setPasswordSubmitting(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      setPasswordMessage(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setPasswordSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleProfileSubmit} className="mt-8 flex flex-col gap-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Profil Bilgileri
        </h2>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Ad Soyad</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">E-posta</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        {profileError && <p className="text-sm text-red-400">Hata: {profileError}</p>}
        {profileMessage && <p className="text-sm text-emerald-400">{profileMessage}</p>}

        <button
          type="submit"
          disabled={profileSubmitting}
          className="mt-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {profileSubmitting ? "Kaydediliyor..." : "Profili Güncelle"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-8"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Şifre Değiştir
        </h2>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Mevcut Şifre</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Yeni Şifre</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Yeni Şifre (Tekrar)</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        {passwordError && <p className="text-sm text-red-400">Hata: {passwordError}</p>}
        {passwordMessage && <p className="text-sm text-emerald-400">{passwordMessage}</p>}

        <button
          type="submit"
          disabled={passwordSubmitting}
          className="mt-2 rounded-lg bg-slate-800 px-6 py-3 font-medium text-slate-100 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {passwordSubmitting ? "Güncelleniyor..." : "Şifreyi Değiştir"}
        </button>
      </form>
    </>
  );
}

export default function SettingsPage() {
  const { user, loading, setUser } = useRequireAuth();

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <PageHeader icon={Settings} title="Ayarlar" subtitle="Profil bilgilerini ve şifreni yönet." />

      {loading || !user ? (
        <p className="mt-8 text-center text-slate-400">Yükleniyor...</p>
      ) : (
        <SettingsForms key={user.id} user={user} setUser={setUser} />
      )}
    </div>
  );
}
