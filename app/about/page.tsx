"use client";

import React from "react";
import { Award, Users, Clock, Shield, Star, ArrowRight } from "lucide-react";
import Link from "next/link";


const stats = [
    { value: "15+", label: "Years of Excellence" },
    { value: "500+", label: "Healthcare Providers" },
    { value: "50k+", label: "Patients Served" },
    { value: "99%", label: "Satisfaction Rate" },
];

const values = [
    { icon: <Shield className="w-5 h-5" />, title: "Patient Safety First", desc: "Every decision prioritizes the safety and well-being of our patients." },
    { icon: <Star className="w-5 h-5" />, title: "Clinical Excellence", desc: "Highest standards of medical practice through continuous learning." },
    { icon: <Users className="w-5 h-5" />, title: "Compassionate Care", desc: "We treat every patient with empathy, dignity, and respect." },
    { icon: <Clock className="w-5 h-5" />, title: "24/7 Availability", desc: "Always available to support patients and providers round the clock." },
];

const team = [
    { name: "Dr. Rahul Sharma", role: "Chief Medical Officer", specialty: "Cardiology · 20 yrs", initial: "R" },
    { name: "Dr. Priya Mehta", role: "Head of Operations", specialty: "Internal Medicine · 15 yrs", initial: "P" },
    { name: "Dr. Anil Verma", role: "Lead Consultant", specialty: "Neurology · 18 yrs", initial: "A" },
];

export default function AboutPage() {
    return (
        
        <main className="min-h-screen bg-white mt-20 ">
            
            {/* HERO */}
            <section className="bg-gradient-to-br from-teal-50 to-white py-20 px-6">
                
                <div className="container mx-auto max-w-4xl">
                    <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">About Dr. CRM</p>
                    <h1 className="text-5xl font-extrabold text-slate-900 leading-tight mb-5">
                        Redefining Healthcare <br />
                        <span className="text-medical-teal italic">Management.</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-xl leading-relaxed mb-8">
                        Dr. CRM was founded to empower healthcare providers with intelligent tools that transform patient care and clinical efficiency.
                    </p>
                    <Link href="/appointment" className="btn-primary inline-flex items-center gap-2">
                        Book a Demo <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* STATS */}
            <section className="py-14 bg-slate-900">
                <div className="container mx-auto max-w-4xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((s, i) => (
                        <div key={i}>
                            <div className="text-4xl font-black text-teal-400 mb-1">{s.value}</div>
                            <div className="text-slate-400 text-sm">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* STORY */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl grid md:grid-cols-2 gap-14 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-5">Our Story</h2>
                        <p className="text-slate-500 leading-relaxed mb-4">
                            Founded in 2009, Dr. CRM emerged from a shared frustration — existing clinic tools were fragmented and not built for real medical challenges.
                        </p>
                        <p className="text-slate-500 leading-relaxed mb-4">
                            We partnered with doctors and staff to build a platform that is intelligent, intuitive, and genuinely helpful.
                        </p>
                        <p className="text-slate-500 leading-relaxed">
                            Today, we power 500+ healthcare providers across India.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-teal-600 rounded-2xl p-5 text-white">
                            <Award className="w-6 h-6 mb-3 opacity-80" />
                            <div className="font-bold">Award Winning</div>
                            <div className="text-teal-200 text-xs mt-1">Best HealthTech 2023</div>
                        </div>
                        <div className="bg-slate-900 rounded-2xl p-5 text-white">
                            <Shield className="w-6 h-6 mb-3 opacity-80" />
                            <div className="font-bold">HIPAA Secure</div>
                            <div className="text-slate-400 text-xs mt-1">Enterprise-grade security</div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-5 col-span-2">
                            <div className="font-bold text-slate-900 mb-1">Free Data Migration</div>
                            <div className="text-slate-500 text-sm">We handle the full transfer from your existing system.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Our Core Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map((v, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">
                                <div className="w-10 h-10 bg-teal-50 group-hover:bg-teal-600 rounded-xl flex items-center justify-center text-teal-600 group-hover:text-white mb-4 transition-all">
                                    {v.icon}
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1 text-sm">{v.title}</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">Meet Our Leadership</h2>
                    <p className="text-slate-500 text-center mb-10 text-sm">Experienced professionals driving innovation</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {team.map((m, i) => (
                            <div key={i} className="text-center bg-slate-50 rounded-2xl p-7 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-700 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black shadow-md">
                                    {m.initial}
                                </div>
                                <h3 className="font-bold text-slate-900">{m.name}</h3>
                                <div className="text-medical-teal text-sm mt-1">{m.role}</div>
                                <div className="text-slate-400 text-xs mt-1">{m.specialty}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-teal-600">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-white mb-3">Ready to transform your clinic?</h2>
                    <p className="text-teal-100 mb-8">Join 500+ healthcare providers already using Dr. CRM</p>
                    <Link href="/appointment" className="inline-flex items-center gap-2 bg-white text-teal-600 font-bold px-8 py-3.5 rounded-full hover:bg-teal-50 transition-colors">
                        Book a Demo <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

        </main>
    );
}