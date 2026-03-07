"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, CalendarCheck, Save } from "lucide-react";

export default function AddAppointmentPage() {
    const [form, setForm] = useState({
        patient: "", phone: "", email: "",
        doctor: "", clinic: "", date: "", time: "",
        type: "", notes: "", status: "Pending"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // submit logic
    };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-3xl">

                {/* PAGE HEADER */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/appointments"
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">New Appointment</h1>
                        <p className="text-slate-500 text-sm mt-0.5">Schedule a new patient appointment</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* PATIENT INFO */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-5 flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-teal-600" /> Patient Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Patient Name *</label>
                                <input type="text" name="patient" value={form.patient} onChange={handleChange} required
                                    placeholder="Full name"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Phone *</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
                                    placeholder="+91 98765 43210"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange}
                                    placeholder="patient@email.com"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                            </div>
                        </div>
                    </div>

                    {/* APPOINTMENT DETAILS */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-6">
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-5 flex items-center gap-2">
                            <CalendarCheck className="w-4 h-4 text-teal-600" /> Appointment Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Clinic *</label>
                                <select name="clinic" value={form.clinic} onChange={handleChange} required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition bg-white">
                                    <option value="">Select clinic</option>
                                    <option>City Care Hospital</option>
                                    <option>LifeLine Clinic</option>
                                    <option>MediCare Plus</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Doctor *</label>
                                <select name="doctor" value={form.doctor} onChange={handleChange} required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition bg-white">
                                    <option value="">Select doctor</option>
                                    <option>Dr. Rahul Sharma</option>
                                    <option>Dr. Priya Mehta</option>
                                    <option>Dr. Anil Verma</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Date *</label>
                                <input type="date" name="date" value={form.date} onChange={handleChange} required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Time *</label>
                                <input type="time" name="time" value={form.time} onChange={handleChange} required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Type *</label>
                                <select name="type" value={form.type} onChange={handleChange} required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition bg-white">
                                    <option value="">Select type</option>
                                    <option>General Checkup</option>
                                    <option>Follow-up</option>
                                    <option>Consultation</option>
                                    <option>Lab Test</option>
                                    <option>Emergency</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Status</label>
                                <select name="status" value={form.status} onChange={handleChange}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 transition bg-white">
                                    <option>Pending</option>
                                    <option>Confirmed</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Notes</label>
                                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                                    placeholder="Any additional notes..."
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition resize-none" />
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3">
                        <button type="submit"
                            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                            <Save className="w-4 h-4" /> Save Appointment
                        </button>
                        <Link href="/admin/appointments"
                            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors">
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}