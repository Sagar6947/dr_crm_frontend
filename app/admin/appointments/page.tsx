"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    CalendarCheck, Plus, Search, Eye,
    Clock, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight
} from "lucide-react";

const appointments = [
    { id: "APT001", patient: "Ravi Kumar", doctor: "Dr. Rahul Sharma", clinic: "City Care Hospital", date: "07 Mar 2026", time: "10:00 AM", type: "General Checkup", status: "Confirmed" },
    { id: "APT002", patient: "Sneha Patel", doctor: "Dr. Priya Mehta", clinic: "LifeLine Clinic", date: "07 Mar 2026", time: "11:30 AM", type: "Follow-up", status: "Pending" },
    { id: "APT003", patient: "Mohit Singh", doctor: "Dr. Anil Verma", clinic: "MediCare Plus", date: "07 Mar 2026", time: "02:00 PM", type: "Consultation", status: "Completed" },
    { id: "APT004", patient: "Anjali Rao", doctor: "Dr. Rahul Sharma", clinic: "City Care Hospital", date: "08 Mar 2026", time: "09:00 AM", type: "Lab Test", status: "Cancelled" },
    { id: "APT005", patient: "Deepak Nair", doctor: "Dr. Priya Mehta", clinic: "LifeLine Clinic", date: "08 Mar 2026", time: "03:30 PM", type: "General Checkup", status: "Confirmed" },
    { id: "APT006", patient: "Pooja Sharma", doctor: "Dr. Anil Verma", clinic: "MediCare Plus", date: "09 Mar 2026", time: "10:30 AM", type: "Follow-up", status: "Pending" },
    { id: "APT007", patient: "Arjun Mehta", doctor: "Dr. Rahul Sharma", clinic: "City Care Hospital", date: "09 Mar 2026", time: "01:00 PM", type: "Consultation", status: "Confirmed" },
    { id: "APT008", patient: "Kavya Reddy", doctor: "Dr. Priya Mehta", clinic: "LifeLine Clinic", date: "10 Mar 2026", time: "11:00 AM", type: "Lab Test", status: "Completed" },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    Confirmed: { color: "bg-teal-50 text-teal-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    Pending: { color: "bg-yellow-50 text-yellow-700", icon: <AlertCircle className="w-3.5 h-3.5" /> },
    Completed: { color: "bg-blue-50 text-blue-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    Cancelled: { color: "bg-red-50 text-red-600", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const stats = [
    { label: "Today's Appointments", value: "24", icon: <CalendarCheck className="w-5 h-5" />, change: "+3 from yesterday", up: true },
    { label: "Confirmed", value: "18", icon: <CheckCircle2 className="w-5 h-5" />, change: "75% of total", up: true },
    { label: "Pending", value: "4", icon: <Clock className="w-5 h-5" />, change: "Needs action", up: false },
    { label: "Cancelled", value: "2", icon: <XCircle className="w-5 h-5" />, change: "8% rate", up: false },
];

export default function AppointmentsPage() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filtered = appointments.filter(a => {
        const matchSearch =
            a.patient.toLowerCase().includes(search.toLowerCase()) ||
            a.doctor.toLowerCase().includes(search.toLowerCase()) ||
            a.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "All" || a.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* PAGE HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage and track all clinic appointments</p>
                    </div>
                    <Link href="/admin/appointments/add"
                        className="flex items-center gap-2 bg-medical-teal hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-teal-100">
                        <Plus className="w-4 h-4" /> New Appointment
                    </Link>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                                    {s.icon}
                                </div>
                                <span className={`text-xs font-semibold ${s.up ? "text-teal-600" : "text-red-500"}`}>
                                    {s.change}
                                </span>
                            </div>
                            <div className="text-2xl font-black text-slate-900 mb-0.5">{s.value}</div>
                            <div className="text-xs text-slate-500">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* TABLE CARD */}
                <div className="bg-white rounded-2xl border border-slate-100">

                    {/* TOOLBAR */}
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search patient, doctor, ID..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${statusFilter === s ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">ID</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Patient</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Doctor</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Date & Time</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Type</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Status</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((apt, i) => (
                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4 text-xs font-mono text-slate-500">{apt.id}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold flex-shrink-0">
                                                    {apt.patient.charAt(0)}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-800">{apt.patient}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-600">{apt.doctor}</td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <div className="text-sm text-slate-800 font-medium">{apt.date}</div>
                                            <div className="text-xs text-slate-400">{apt.time}</div>
                                        </td>
                                        <td className="px-5 py-4 hidden lg:table-cell">
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">{apt.type}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${statusConfig[apt.status].color}`}>
                                                {statusConfig[apt.status].icon} {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link href={`/admin/appointments/${apt.id}`}
                                                className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-semibold">
                                                <Eye className="w-3.5 h-3.5" /> View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="py-16 text-center text-slate-400 text-sm">No appointments found.</div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">Showing {filtered.length} of {appointments.length} appointments</span>
                        <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><ChevronLeft className="w-4 h-4" /></button>
                            <button className="w-7 h-7 rounded-lg bg-teal-600 text-white text-xs font-bold">1</button>
                            <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold">2</button>
                            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}