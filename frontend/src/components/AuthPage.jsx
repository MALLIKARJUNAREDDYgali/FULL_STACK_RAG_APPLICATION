import React, { useState, useEffect } from "react";
import { signupUser, loginUser } from "../services/api";

/* ───────────────────────── Particle Background ───────────────────────── */
function ParticleField() {
          const particles = Array.from({ length: 50 }, (_, i) => ({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 3 + 1,
                    duration: Math.random() * 20 + 10,
                    delay: Math.random() * 10,
                    opacity: Math.random() * 0.5 + 0.1,
          }));

          return (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              {particles.map((p) => (
                                        <div
                                                  key={p.id}
                                                  className="absolute rounded-full bg-white"
                                                  style={{
                                                            left: `${p.x}%`,
                                                            top: `${p.y}%`,
                                                            width: `${p.size}px`,
                                                            height: `${p.size}px`,
                                                            opacity: p.opacity,
                                                            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                                                  }}
                                        />
                              ))}
                    </div>
          );
}

/* ───────────────────────── Main Auth Page ───────────────────────── */
export default function AuthPage({ onLogin }) {
          const [isLogin, setIsLogin] = useState(true);
          const [name, setName] = useState("");
          const [email, setEmail] = useState("");
          const [password, setPassword] = useState("");
          const [confirmPassword, setConfirmPassword] = useState("");
          const [error, setError] = useState("");
          const [loading, setLoading] = useState(false);
          const [showPassword, setShowPassword] = useState(false);
          const [successMsg, setSuccessMsg] = useState("");
          const [mounted, setMounted] = useState(false);

          useEffect(() => {
                    setMounted(true);
          }, []);

          const switchMode = () => {
                    setIsLogin(!isLogin);
                    setError("");
                    setSuccessMsg("");
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
          };

          const handleSubmit = async (e) => {
                    e.preventDefault();
                    setError("");
                    setSuccessMsg("");

                    if (!email.trim() || !password.trim()) {
                              setError("Please fill in all fields");
                              return;
                    }
                    if (!isLogin && !name.trim()) {
                              setError("Please enter your name");
                              return;
                    }
                    if (!isLogin && password !== confirmPassword) {
                              setError("Passwords do not match");
                              return;
                    }
                    if (password.length < 6) {
                              setError("Password must be at least 6 characters");
                              return;
                    }

                    setLoading(true);
                    try {
                              if (isLogin) {
                                        const res = await loginUser(email, password);
                                        localStorage.setItem("user", JSON.stringify(res.data.user));
                                        onLogin(res.data.user);
                              } else {
                                        await signupUser(name, email, password);
                                        setSuccessMsg("Account created! Please sign in.");
                                        setIsLogin(true);
                                        setPassword("");
                                        setConfirmPassword("");
                              }
                    } catch (err) {
                              setError(err.response?.data?.detail || err.message || "Something went wrong");
                    } finally {
                              setLoading(false);
                    }
          };

          return (
                    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050510]">
                              {/* ── Gradient Orbs Background ── */}
                              <div className="absolute inset-0 z-0">
                                        {/* Large gradient orbs */}
                                        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/30 to-indigo-600/20 blur-[120px] animate-pulse-glow" />
                                        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-500/25 to-cyan-500/15 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
                                        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: '3s' }} />

                                        {/* Grid pattern overlay */}
                                        <div
                                                  className="absolute inset-0 opacity-[0.03]"
                                                  style={{
                                                            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                                                            backgroundSize: '60px 60px',
                                                  }}
                                        />

                                        {/* Particles */}
                                        <ParticleField />
                              </div>

                              {/* ── Main Card ── */}
                              <div
                                        className={`relative z-10 w-full max-w-[1040px] mx-4 flex rounded-3xl overflow-hidden transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                                                  }`}
                                        style={{
                                                  background: 'linear-gradient(135deg, rgba(20,20,40,0.8) 0%, rgba(15,15,30,0.9) 100%)',
                                                  backdropFilter: 'blur(40px)',
                                                  border: '1px solid rgba(255,255,255,0.06)',
                                                  boxShadow: '0 32px 100px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1) inset, 0 0 80px rgba(99,102,241,0.08)',
                                        }}
                              >
                                        {/* ─── Left Panel — Branding ─── */}
                                        <div className="hidden lg:flex w-[460px] flex-col justify-between p-10 relative overflow-hidden">
                                                  {/* Decorative gradient line */}
                                                  <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                                                  {/* Floating shapes */}
                                                  <div className="absolute top-20 right-16 w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 backdrop-blur-sm border border-white/5 animate-float rotate-12" />
                                                  <div className="absolute bottom-32 left-8 w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 backdrop-blur-sm border border-white/5 animate-float-delayed -rotate-12" />
                                                  <div className="absolute top-[45%] left-[60%] w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/10 backdrop-blur-sm border border-white/5 animate-float-slow rotate-45" />

                                                  {/* Top: Logo & Title */}
                                                  <div>
                                                            <div className="flex items-center gap-3 mb-8">
                                                                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
                                                                                🤖
                                                                      </div>
                                                                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                                                                RAG AI
                                                                      </span>
                                                            </div>

                                                            <h1 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                                                                      Your documents,
                                                                      <br />
                                                                      <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                                                                supercharged.
                                                                      </span>
                                                            </h1>
                                                            <p className="text-[15px] text-gray-400 leading-relaxed max-w-xs">
                                                                      Upload any document and have intelligent conversations powered by AI. Get instant, contextual answers.
                                                            </p>
                                                  </div>

                                                  {/* Middle: Features */}
                                                  <div className="space-y-5 my-8">
                                                            {[
                                                                      { icon: '⚡', title: 'Instant Analysis', desc: 'AI reads and understands your PDFs in seconds', color: 'from-amber-500/15 to-orange-500/10' },
                                                                      { icon: '🧠', title: 'Smart Retrieval', desc: 'Context-aware answers from your documents', color: 'from-violet-500/15 to-purple-500/10' },
                                                                      { icon: '💬', title: 'Natural Chat', desc: 'Talk to your documents like a colleague', color: 'from-emerald-500/15 to-cyan-500/10' },
                                                            ].map((f, i) => (
                                                                      <div
                                                                                key={i}
                                                                                className="group flex items-start gap-4 p-3 rounded-2xl transition-all duration-300 hover:bg-white/[0.03] cursor-default"
                                                                      >
                                                                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} backdrop-blur-sm border border-white/[0.06] flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                                                          {f.icon}
                                                                                </div>
                                                                                <div>
                                                                                          <div className="text-sm font-semibold text-gray-200 mb-0.5">{f.title}</div>
                                                                                          <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
                                                                                </div>
                                                                      </div>
                                                            ))}
                                                  </div>

                                                  {/* Bottom: Social proof */}
                                                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                                            <div className="flex -space-x-2">
                                                                      {['🟣', '🔵', '🟢', '🟡'].map((c, i) => (
                                                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0f0f1e] flex items-center justify-center text-sm bg-gray-800/80">
                                                                                          {c}
                                                                                </div>
                                                                      ))}
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                      <span className="text-gray-300 font-medium">500+</span> users analyzing documents daily
                                                            </p>
                                                  </div>
                                        </div>

                                        {/* ─── Right Panel — Form ─── */}
                                        <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16">
                                                  <div className="w-full max-w-sm">
                                                            {/* Mobile logo */}
                                                            <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                                                                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-xl">
                                                                                🤖
                                                                      </div>
                                                                      <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                                                                                RAG AI
                                                                      </span>
                                                            </div>

                                                            {/* Header */}
                                                            <div className="mb-8">
                                                                      <h2 className="text-[28px] font-bold text-white tracking-tight mb-2">
                                                                                {isLogin ? "Welcome back" : "Get started"}
                                                                      </h2>
                                                                      <p className="text-sm text-gray-500">
                                                                                {isLogin
                                                                                          ? "Enter your credentials to access your account"
                                                                                          : "Create your account and start exploring"}
                                                                      </p>
                                                            </div>

                                                            {/* Alerts */}
                                                            {error && (
                                                                      <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2 animate-fade-in">
                                                                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                                </svg>
                                                                                {error}
                                                                      </div>
                                                            )}
                                                            {successMsg && (
                                                                      <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-2 animate-fade-in">
                                                                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                </svg>
                                                                                {successMsg}
                                                                      </div>
                                                            )}

                                                            {/* Form */}
                                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                                      {/* Name field (signup) */}
                                                                      {!isLogin && (
                                                                                <div className="space-y-1.5 animate-fade-in">
                                                                                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</label>
                                                                                          <div className="group relative">
                                                                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                                                              <svg className="w-[18px] h-[18px] text-gray-600 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                                                                              </svg>
                                                                                                    </div>
                                                                                                    <input
                                                                                                              type="text"
                                                                                                              value={name}
                                                                                                              onChange={(e) => setName(e.target.value)}
                                                                                                              placeholder="John Doe"
                                                                                                              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                                                                                                              autoComplete="name"
                                                                                                    />
                                                                                          </div>
                                                                                </div>
                                                                      )}

                                                                      {/* Email */}
                                                                      <div className="space-y-1.5">
                                                                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
                                                                                <div className="group relative">
                                                                                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                                                    <svg className="w-[18px] h-[18px] text-gray-600 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                                                              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                                                                                    </svg>
                                                                                          </div>
                                                                                          <input
                                                                                                    type="email"
                                                                                                    value={email}
                                                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                                                    placeholder="you@example.com"
                                                                                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                                                                                                    autoComplete="email"
                                                                                          />
                                                                                </div>
                                                                      </div>

                                                                      {/* Password */}
                                                                      <div className="space-y-1.5">
                                                                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                                                                                <div className="group relative">
                                                                                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                                                    <svg className="w-[18px] h-[18px] text-gray-600 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                                                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                                                                    </svg>
                                                                                          </div>
                                                                                          <input
                                                                                                    type={showPassword ? "text" : "password"}
                                                                                                    value={password}
                                                                                                    onChange={(e) => setPassword(e.target.value)}
                                                                                                    placeholder="••••••••"
                                                                                                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                                                                                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                                                                          />
                                                                                          <button
                                                                                                    type="button"
                                                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-300 transition-colors"
                                                                                                    tabIndex={-1}
                                                                                          >
                                                                                                    {showPassword ? (
                                                                                                              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                                                                              </svg>
                                                                                                    ) : (
                                                                                                              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                                              </svg>
                                                                                                    )}
                                                                                          </button>
                                                                                </div>
                                                                      </div>

                                                                      {/* Confirm Password (signup) */}
                                                                      {!isLogin && (
                                                                                <div className="space-y-1.5 animate-fade-in">
                                                                                          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Confirm Password</label>
                                                                                          <div className="group relative">
                                                                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                                                              <svg className="w-[18px] h-[18px] text-gray-600 group-focus-within:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                                                                                              </svg>
                                                                                                    </div>
                                                                                                    <input
                                                                                                              type={showPassword ? "text" : "password"}
                                                                                                              value={confirmPassword}
                                                                                                              onChange={(e) => setConfirmPassword(e.target.value)}
                                                                                                              placeholder="••••••••"
                                                                                                              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-gray-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
                                                                                                              autoComplete="new-password"
                                                                                                    />
                                                                                          </div>
                                                                                </div>
                                                                      )}

                                                                      {/* Submit Button */}
                                                                      <button
                                                                                type="submit"
                                                                                disabled={loading}
                                                                                className="relative w-full py-3.5 rounded-xl font-semibold text-sm text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98]"
                                                                                style={{
                                                                                          background: 'linear-gradient(135deg, #10b981, #06b6d4, #6366f1)',
                                                                                          backgroundSize: '200% 200%',
                                                                                          animation: 'gradient 4s ease infinite',
                                                                                }}
                                                                      >
                                                                                {/* Shimmer overlay */}
                                                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                                                          style={{
                                                                                                    background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)',
                                                                                                    backgroundSize: '200% 100%',
                                                                                                    animation: 'shimmer 1.5s linear infinite',
                                                                                          }}
                                                                                />
                                                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                                                          {loading ? (
                                                                                                    <>
                                                                                                              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                                                              </svg>
                                                                                                              Processing...
                                                                                                    </>
                                                                                          ) : isLogin ? (
                                                                                                    <>
                                                                                                              Sign In
                                                                                                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                                                                              </svg>
                                                                                                    </>
                                                                                          ) : (
                                                                                                    <>
                                                                                                              Create Account
                                                                                                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                                                                              </svg>
                                                                                                    </>
                                                                                          )}
                                                                                </span>
                                                                      </button>
                                                            </form>

                                                            {/* Divider */}
                                                            <div className="flex items-center gap-4 my-7">
                                                                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                                      <span className="text-xs text-gray-600">or</span>
                                                                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                                            </div>

                                                            {/* Switch mode */}
                                                            <p className="text-center text-sm text-gray-500">
                                                                      {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                                                                      <button
                                                                                onClick={switchMode}
                                                                                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors hover:underline underline-offset-4"
                                                                      >
                                                                                {isLogin ? "Sign Up" : "Sign In"}
                                                                      </button>
                                                            </p>

                                                            {/* Bottom info */}
                                                            <p className="text-center text-[11px] text-gray-700 mt-6 leading-relaxed">
                                                                      By continuing, you agree to our Terms of Service
                                                                      <br /> and Privacy Policy
                                                            </p>
                                                  </div>
                                        </div>
                              </div>

                              {/* Bottom glow effect */}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent blur-sm" />
                    </div>
          );
}
