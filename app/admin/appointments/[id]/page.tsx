"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    ArrowLeft, CalendarCheck, Clock, User, Stethoscope,
    Hospital, FileText, CheckCircle2, XCircle, AlertCircle, Edit, Trash2
} from "lucide-react";

const appointment = {
    id: "APT001",
    patient: "Ravi Kumar",
    phone: "+91 98765 43210",
    email: "ravi.kumar@email.com",
    doctor: "Dr. Rahul Sharma",
    specialty: "Cardiology",
    clinic: "City Care Hospital",
    date: "07 Mar 2026",
    time: "10:00 AM",
    type: "General Checkup",
    status: "Confirmed",
    notes: "Patient reports mild chest discomfort. Follow-up after ECG.",
    createdAt: "05 Mar 2026, 3:45 PM",
};

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    Confirmed: { color: "text-teal-700", bg: "bg-teal-50", icon: <CheckCircle2 className="w-4 h-4" /> },
    Pending: { color: "text-yellow-700", bg: "bg-yellow-50", icon: <AlertCircle className="w-4 h-4" /> },
    Completed: { color: "text-blue-700", bg: "bg-blue-50", icon: <CheckCircle2 className="w-4 h-4" /> },
    Cancelled: { color: "text-red-600", bg: "bg-red-50", icon: <XCircle className="w-4 h-4" /> },
};

export default function AppointmentDetailPage() {
    const [status, setStatus] = useState(appointment.status);
    const cfg = statusConfig[status];

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-4xl">

                {/* PAGE HEADER */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/appointments"
                            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Appointment Detail</h1>
                            <p className="text-slate-500 text-sm mt-0.5 font-mono">{appointment.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button className="flex items-center gap-2 border border-red-100 text-red-500 hover:bg-red-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                            <Trash2 className="w-4 h-4" /> Cancel
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">

                    {/* LEFT */}
                    <div className="md:col-span-2 space-y-5">

                        {/* STATUS */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Status</h2>
                                <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl ${cfg.bg} ${cfg.color}`}>
                                    {cfg.icon} {status}
                                </span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => (
                                    <button key={s} onClick={() => setStatus(s)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${status === s ? "bg-teal-600 text-white border-teal-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* PATIENT */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-teal-600" /> Patient
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-black">
                                    {appointment.patient.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-lg">{appointment.patient}</div>
                                    <div className="text-slate-500 text-sm">{appointment.email}</div>
                                    <div className="text-slate-500 text-sm">{appointment.phone}</div>
                                </div>
                            </div>
                        </div>

                        {/* DETAILS */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4 text-teal-600" /> Appointment Info
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: <Clock className="w-4 h-4" />, label: "Date", value: appointment.date },
                                    { icon: <Clock className="w-4 h-4" />, label: "Time", value: appointment.time },
                                    { icon: <FileText className="w-4 h-4" />, label: "Type", value: appointment.type },
                                    { icon: <CalendarCheck className="w-4 h-4" />, label: "Booked On", value: appointment.createdAt },
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">{item.icon} {item.label}</div>
                                        <div className="font-semibold text-slate-800 text-sm">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NOTES */}
                        {appointment.notes && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-teal-600" /> Notes
                                </h2>
                                <p className="text-slate-600 text-sm leading-relaxed">{appointment.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-5">

                        {/* DOCTOR */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-teal-600" /> Doctor
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg">
                                    {appointment.doctor.charAt(4)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{appointment.doctor}</div>
                                    <div className="text-teal-600 text-xs font-medium">{appointment.specialty}</div>
                                </div>
                            </div>
                        </div>

                        {/* CLINIC */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Hospital className="w-4 h-4 text-teal-600" /> Clinic
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                    <Hospital className="w-5 h-5" />
                                </div>
                                <div className="font-bold text-slate-900 text-sm">{appointment.clinic}</div>
                            </div>
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="bg-teal-600 rounded-2xl p-6 text-white">
                            <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                    Send Reminder
                                </button>
                                <button className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                    View Patient Record
                                </button>
                                <button className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                    Generate Invoice
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}