"use client";

import React, { useState } from "react";
import { HeartPulse, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // handle login logic here
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-slate-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* LOGO */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-11 h-11 bg-medical-teal rounded-xl flex items-center justify-center shadow-lg shadow-teal-100">
                        <HeartPulse className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                        Dr. <span className="text-medical-teal">CRM</span>
                    </span>
                </div>

                {/* CARD */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
                    <p className="text-slate-500 text-sm mb-7">Sign in to your Dr. CRM account</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="you@clinic.com"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
                                <Link href="/forgot-password" className="text-xs text-teal-600 hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm mt-2"
                        >
                            Sign In <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>

                {/* FOOTER */}
                <p className="text-center text-slate-400 text-xs mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/appointment" className="text-teal-600 font-semibold hover:underline">
                        Book a Demo
                    </Link>
                </p>

            </div>
        </main>
    );
}