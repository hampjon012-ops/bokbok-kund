"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Kolla din e-post!</h2>
          <p className="text-gray-500 mb-6">
            Vi har skickat en bekräftelselänk till <strong>{email}</strong>
          </p>
          <Link href="/login" className="text-pink-600 hover:underline">
            Tillbaka till login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 text-white p-12 flex-col justify-center">
        <h1 className="text-4xl font-serif mb-4">Bokbok</h1>
        <p className="text-gray-400 text-lg">Skapa konto och börja boka</p>
        <div className="mt-12 space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-2xl">📅</span>
            <span className="text-gray-300">Boka enkelt online</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl">📱</span>
            <span className="text-gray-300">Hantera dina bokningar</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl">🔔</span>
            <span className="text-gray-300">Påminnelser automatiskt</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-serif text-gray-900">Bokbok</h1>
          </div>

          <h2 className="text-2xl font-medium text-gray-900 mb-2">Skapa konto</h2>
          <p className="text-gray-500 mb-8">Registrera dig för att boka tider</p>

          {/* Google register */}
          <button
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 mb-6"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            )}
            <span>{googleLoading ? "Öppnar Google..." : "Fortsätt med Google"}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">eller</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Namn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                placeholder="Ditt namn"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-post</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                placeholder="din@email.se"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lösenord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                placeholder="Minst 6 tecken"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
            >
              {loading ? "Skapar konto..." : "Skapa konto"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Har du redan ett konto?{" "}
            <Link href="/login" className="text-pink-600 hover:underline">
              Logga in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
