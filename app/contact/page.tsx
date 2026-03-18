"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, HeartPulse, ArrowRight } from "lucide-react";
import Link from "next/link";

const contactInfo = [
    { icon: <Phone className="w-5 h-5" />, title: "Call Us", lines: ["+91 98765 43210", "+91 11 4567 8900"], sub: "Mon–Sat, 9am–7pm IST" },
    { icon: <Mail className="w-5 h-5" />, title: "Email Us", lines: ["support@drcrm.in", "sales@drcrm.in"], sub: "We reply within 4 hours" },
    { icon: <MapPin className="w-5 h-5" />, title: "Visit Us", lines: ["42, Cyber City, Gurugram", "Haryana - 122002, India"], sub: "By appointment only" },
    { icon: <Clock className="w-5 h-5" />, title: "Office Hours", lines: ["Mon–Fri: 9:00am – 7:00pm", "Sat: 10:00am – 4:00pm"], sub: "Sunday closed" },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen bg-white mt-20">

            {/* HERO */}
            <section className="bg-gradient-to-br from-teal-50 to-white py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
                    <h1 className="text-5xl font-extrabold text-slate-900 leading-tight mb-5">
                        We&apos;re Here to <br />
                        <span className="text-medical-teal italic">Help You.</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-md mx-auto">
                        Have a question or want a demo? Our team is ready to assist you.
                    </p>
                </div>
            </section>

            {/* CONTACT INFO */}
            <section className="py-14 px-6 border-b border-slate-100">
                <div className="container mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-5">
                    {contactInfo.map((info, i) => (
                        <div key={i} className="bg-slate-50 rounded-2xl p-5">
                            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-3">
                                {info.icon}
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-2">{info.title}</h3>
                            {info.lines.map((line, j) => (
                                <div key={j} className="text-sm text-slate-600">{line}</div>
                            ))}
                            <div className="text-xs text-slate-400 mt-1">{info.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FORM + SIDE */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl grid md:grid-cols-5 gap-8">

                    {/* FORM */}
                    <div className="md:col-span-3 bg-white rounded-2xl p-8 border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">Send us a message</h2>
                        <p className="text-slate-500 text-sm mb-6">We&apos;ll get back to you within 4 hours.</p>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-14 text-center">
                                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                                    <HeartPulse className="w-8 h-8 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                <p className="text-slate-500 text-sm mb-4">Thanks for reaching out. We&apos;ll respond shortly.</p>
                                <button onClick={() => setSubmitted(false)} className="text-teal-600 text-sm font-semibold underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Dr. Rahul Sharma"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Phone</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email *</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@clinic.com"
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Subject *</label>
                                    <select name="subject" value={form.subject} onChange={handleChange} required
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition bg-white">
                                        <option value="">Select a topic...</option>
                                        <option>Request a Demo</option>
                                        <option>Technical Support</option>
                                        <option>Billing Inquiry</option>
                                        <option>Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Message *</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="Tell us how we can help..."
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none" />
                                </div>
                                <button type="submit"
                                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm">
                                    Send Message <Send className="w-4 h-4" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* SIDE */}
                    <div className="md:col-span-2 flex flex-col gap-5">
                        <div className="bg-teal-600 rounded-2xl p-6 text-white">
                            <MapPin className="w-7 h-7 mb-3 opacity-80" />
                            <div className="font-bold">42, Cyber City, Gurugram</div>
                            <div className="text-teal-200 text-sm mt-1">Haryana - 122002, India</div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex-1">
                            <h3 className="font-bold text-slate-900 mb-5">Quick Answers</h3>
                            <div className="space-y-4">
                                {[
                                    { q: "How long does onboarding take?", a: "Most clinics go live within 24–48 hours." },
                                    { q: "Is training provided?", a: "Free live training for your entire team." },
                                    { q: "Free trial available?", a: "14 days free, no credit card required." },
                                    { q: "Can I migrate patient data?", a: "Yes, our team handles the full transfer." },
                                ].map((item, i) => (
                                    <div key={i} className="pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="text-sm font-semibold text-slate-800 mb-0.5">{item.q}</div>
                                        <div className="text-xs text-slate-500">{item.a}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-5 text-white">
                            <div className="font-bold mb-1">Prefer a live demo?</div>
                            <div className="text-slate-400 text-xs mb-4">Book a free 30-min walkthrough.</div>
                            <Link href="/appointment" className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                                Book Demo <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}