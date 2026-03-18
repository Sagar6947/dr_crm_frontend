"use client";

import React, { useState } from "react";
import {
    Calendar, Users, FileText, BarChart2, Bell, CreditCard,
    Stethoscope, Pill, ClipboardList, ArrowRight, CheckCircle2
} from "lucide-react";
import Link from "next/link";

const services = [
    {
        icon: <Calendar className="w-6 h-6" />,
        title: "Smart Appointment Booking",
        desc: "Intelligent scheduling with automated reminders and real-time availability.",
        features: ["Online booking portal", "SMS & email reminders", "Recurring appointments", "Waitlist management"],
        color: "bg-teal-50 text-teal-600",
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Patient Management",
        desc: "360° patient profiles with history, records, and communication logs.",
        features: ["Complete medical history", "Document storage", "Family linking", "Patient portal access"],
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: <FileText className="w-6 h-6" />,
        title: "Electronic Medical Records",
        desc: "Paperless, secure EMR. Create prescriptions and notes in seconds.",
        features: ["Digital prescriptions", "SOAP notes", "Template library", "E-signature support"],
        color: "bg-violet-50 text-violet-600",
    },
    {
        icon: <Pill className="w-6 h-6" />,
        title: "Medicine Stock Management",
        desc: "Real-time inventory tracking with low-stock alerts and supplier orders.",
        features: ["Real-time stock tracking", "Expiry alerts", "Supplier management", "Purchase orders"],
        color: "bg-orange-50 text-orange-600",
    },
    {
        icon: <CreditCard className="w-6 h-6" />,
        title: "Billing & Invoicing",
        desc: "GST-compliant invoices, insurance claims, and payment tracking.",
        features: ["Auto-generated invoices", "Insurance claims", "Payment reminders", "Revenue reports"],
        color: "bg-green-50 text-green-600",
    },
    {
        icon: <BarChart2 className="w-6 h-6" />,
        title: "Analytics & Reports",
        desc: "Real-time dashboards and customizable reports for clinic performance.",
        features: ["Revenue analytics", "Patient trends", "Doctor performance", "Custom reports"],
        color: "bg-pink-50 text-pink-600",
    },
    {
        icon: <Bell className="w-6 h-6" />,
        title: "Smart Notifications",
        desc: "Automated alerts for appointments, follow-ups, and lab results.",
        features: ["WhatsApp integration", "Push notifications", "Follow-up reminders", "Lab result alerts"],
        color: "bg-yellow-50 text-yellow-600",
    },
    {
        icon: <Stethoscope className="w-6 h-6" />,
        title: "Doctor Management",
        desc: "Manage schedules, specialties, departments, and staff performance.",
        features: ["Staff scheduling", "Specialty tagging", "Leave management", "Performance tracking"],
        color: "bg-teal-50 text-teal-600",
    },
    {
        icon: <ClipboardList className="w-6 h-6" />,
        title: "Lab & Diagnostics",
        desc: "Test ordering, result tracking, and direct patient delivery.",
        features: ["Test order management", "Digital lab reports", "Result notifications", "Lab partner integration"],
        color: "bg-blue-50 text-blue-600",
    },
];

export default function ServicesPage() {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    return (
        <main className="min-h-screen bg-white mt-20">

            {/* HERO */}
            <section className="bg-gradient-to-br from-teal-50 to-white py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <p className="text-teal-600 font-semibold text-sm uppercase tracking-widest mb-3">What We Offer</p>
                    <h1 className="text-5xl font-extrabold text-slate-900 leading-tight mb-5">
                        Everything Your Clinic <br />
                        <span className="text-medical-teal italic">Needs to Thrive.</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
                        From patient registration to billing, Dr. CRM covers every workflow so you can focus entirely on care.
                    </p>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((service, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                                className={`border rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all duration-200 ${activeIdx === i ? "border-teal-300 bg-teal-50/40" : "border-slate-100 bg-white"}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${service.color}`}>
                                    {service.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{service.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>

                                <div className={`overflow-hidden transition-all duration-300 ${activeIdx === i ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
                                    <div className="border-t border-slate-200 pt-4 space-y-2">
                                        {service.features.map((f, j) => (
                                            <div key={j} className="flex items-center gap-2 text-sm text-slate-600">
                                                <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0" /> {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-teal-600 text-sm font-medium mt-4">
                                    {activeIdx === i ? "Show less" : "See features"}
                                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${activeIdx === i ? "rotate-90" : ""}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">Simple Pricing</h2>
                    <p className="text-slate-500 text-center mb-12">No hidden fees. Cancel anytime.</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { plan: "Starter", price: "₹999", period: "/mo", desc: "Solo practitioners", features: ["Up to 100 patients/mo", "Appointments & EMR", "Basic reports"] },
                            { plan: "Pro", price: "₹2,499", period: "/mo", desc: "Growing clinics", features: ["Unlimited patients", "All 9 modules", "Priority support", "Advanced analytics"], highlight: true },
                            { plan: "Enterprise", price: "Custom", period: "", desc: "Hospital groups", features: ["Multi-branch support", "Dedicated manager", "API access"] },
                        ].map((p, i) => (
                            <div key={i} className={`rounded-2xl p-6 relative ${p.highlight ? "bg-teal-600 text-white shadow-xl shadow-teal-100" : "bg-white border border-slate-100"}`}>
                                {p.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
                                )}
                                <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${p.highlight ? "text-teal-200" : "text-slate-400"}`}>{p.plan}</div>
                                <div className={`text-3xl font-black mb-1 ${p.highlight ? "text-white" : "text-slate-900"}`}>
                                    {p.price}<span className={`text-sm font-normal ${p.highlight ? "text-teal-200" : "text-slate-400"}`}>{p.period}</span>
                                </div>
                                <div className={`text-xs mb-5 ${p.highlight ? "text-teal-100" : "text-slate-500"}`}>{p.desc}</div>
                                {p.features.map((f, j) => (
                                    <div key={j} className={`flex items-center gap-2 text-sm mb-2.5 ${p.highlight ? "text-teal-50" : "text-slate-600"}`}>
                                        <CheckCircle2 className={`w-4 h-4 ${p.highlight ? "text-teal-200" : "text-teal-500"}`} /> {f}
                                    </div>
                                ))}
                                <Link href="/appointment" className={`mt-4 w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${p.highlight ? "bg-white text-teal-600 hover:bg-teal-50" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                                    Get Started <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-teal-600">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold text-white mb-3">Start your 14-day free trial</h2>
                    <p className="text-teal-100 mb-8">No credit card required. Full access to all features.</p>
                    <Link href="/appointment" className="inline-flex items-center gap-2 bg-white text-teal-600 font-bold px-8 py-3.5 rounded-full hover:bg-teal-50 transition-colors">
                        Get Started Free <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

        </main>
    );
}