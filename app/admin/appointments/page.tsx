

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    CalendarCheck, Plus, Search, Eye, FileText,
    Clock, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { appointmentService } from "@/lib/api";
import { request } from "@/lib/api";

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    confirmed:  { color: "bg-teal-50 text-teal-700",   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    scheduled:  { color: "bg-teal-50 text-teal-700",   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    pending:    { color: "bg-yellow-50 text-yellow-700", icon: <AlertCircle className="w-3.5 h-3.5" /> },
    completed:  { color: "bg-blue-50 text-blue-700",   icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    cancelled:  { color: "bg-red-50 text-red-600",     icon: <XCircle className="w-3.5 h-3.5" /> },
};

const LIMIT = 10;

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total_records: 0,
        current_page: 1,
        total_pages: 1,
    });

    const abortRef = useRef<AbortController | null>(null);

   const fetchAppointments = async (page = 1, search = debouncedSearch) => {
        if (abortRef.current) abortRef.current.abort("Cancel previous request");
        const controller = new AbortController();
        abortRef.current = controller;

        setIsLoading(true);
        try {
            const body = new URLSearchParams({
                page_no: String(page),
                limit: String(LIMIT),
                search: search,
            }).toString();

            const data = await request("/appointment/list", {
                method: "POST",
                body,
                signal: controller.signal,
            });

            setAppointments(data.data || []);
            if (data.pagination) setPagination(data.pagination);
            else setPagination(prev => ({ ...prev, total_records: data.total_records || 0 }));

        } catch (err: any) {
            if (err?.name === "AbortError") return;
        } finally {
            if (abortRef.current === controller) setIsLoading(false);
        }
    };
    // 1. Debounce search & reset pagination if search changes
    useEffect(() => {
        const t = setTimeout(() => {
            if (debouncedSearch !== search) {
                setDebouncedSearch(search);
                setPagination(prev => prev.current_page === 1 ? prev : { ...prev, current_page: 1 });
            }
        }, 500);
        return () => clearTimeout(t);
    }, [search, debouncedSearch]);

    // 2. Fetch data when page or search changes
    useEffect(() => {
        fetchAppointments(pagination.current_page, debouncedSearch);
        return () => { if (abortRef.current) abortRef.current.abort("Component unmounted or page changed"); };
    }, [pagination.current_page, debouncedSearch]);

    // Client-side status filter (since API may not support it)
    const filtered = statusFilter === "All"
        ? appointments
        : appointments.filter(a => a.status?.toLowerCase() === statusFilter.toLowerCase());

    const getStatusCfg = (status: string) =>
        statusConfig[status?.toLowerCase()] || { color: "bg-slate-100 text-slate-600", icon: null };

    return (
        <AdminLayout>
            <div className="space-y-6">

                {/* PAGE HEADER */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage and track all clinic appointments</p>
                    </div>
                    <Link href="/appointment"
                        className="flex items-center gap-2 bg-medical-teal hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-teal-100">
                        <Plus className="w-4 h-4" /> New Appointment
                    </Link>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Appointments", value: pagination.total_records, icon: <CalendarCheck className="w-5 h-5" />, change: "All time", up: true },
                        { label: "Confirmed", value: appointments.filter(a => ["confirmed","scheduled"].includes(a.status?.toLowerCase())).length, icon: <CheckCircle2 className="w-5 h-5" />, change: "This page", up: true },
                        { label: "Pending", value: appointments.filter(a => a.status?.toLowerCase() === "pending").length, icon: <Clock className="w-5 h-5" />, change: "Needs action", up: false },
                        { label: "Cancelled", value: appointments.filter(a => a.status?.toLowerCase() === "cancelled").length, icon: <XCircle className="w-5 h-5" />, change: "This page", up: false },
                    ].map((s, i) => (
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
                            {isLoading
                                ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 animate-spin" />
                                : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            }
                            <input
                                type="text"
                                placeholder="Search patient, doctor, ID..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {["All", "scheduled", "confirmed", "pending", "completed", "cancelled"].map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors capitalize ${statusFilter === s ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
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
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Clinic</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Date & Time</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Mode</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Payment</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Status</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center">
                                            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                                                <Loader2 className="w-4 h-4 animate-spin" /> Loading appointments...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-slate-400 text-sm">
                                            No appointments found.
                                        </td>
                                    </tr>
                                ) : filtered.map((apt, i) => {
                                    const cfg = getStatusCfg(apt.status);
                                    return (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-4 text-xs font-mono text-slate-500">{apt.appointment_code}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-bold flex-shrink-0">
                                                        {apt.patient?.name?.charAt(0) || apt.booking_name?.charAt(0) || "?"}
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-800">
                                                        {apt.patient?.name || apt.booking_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">
                                                {apt.doctor?.full_name || apt.doctor?.name || "—"}
                                            </td>
                                            <td className="px-5 py-4 hidden md:table-cell text-sm text-slate-600">
                                                {apt.clinic?.name || "—"}
                                            </td>
                                            <td className="px-5 py-4 hidden md:table-cell">
                                                <div className="text-sm text-slate-800 font-medium">{apt.appointment_date}</div>
                                                <div className="text-xs text-slate-400">{apt.appointment_time}</div>
                                            </td>
                                            <td className="px-5 py-4 hidden lg:table-cell">
                                                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium capitalize">
                                                    {apt.consultation_mode || "—"}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="text-sm font-semibold capitalize text-slate-700">
                                                    {(apt.payment?.mode || apt.payment_mode) === 'online' ? 'Razorpay' : ((apt.payment?.mode || apt.payment_mode) === 'pay_at_visit' ? 'Clinic' : ((apt.payment?.mode || apt.payment_mode) || 'Cash'))}
                                                    {(apt.payment?.amount || apt.payment_amount) ? ` (₹${Number(apt.payment?.amount || apt.payment_amount).toFixed(0)})` : ''}
                                                </div>
                                                <div className={`text-[10px] uppercase tracking-wider font-bold mt-0.5 ${(apt.payment?.status || apt.payment_status) === 'completed' ? 'text-green-600' : 'text-orange-500'}`}>{(apt.payment?.status || apt.payment_status) || 'Pending'}</div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg capitalize ${cfg.color}`}>
                                                    {cfg.icon} {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {/* <Link href={`/admin/appointments/${apt.id}`}
                                                    className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-semibold">
                                                    <Eye className="w-3.5 h-3.5" /> View
                                                </Link> */}

                                                <div className="flex items-center gap-3">
                                                    <Link
                                                        href={`/admin/appointments/${apt.id}`}
                                                        onClick={() => sessionStorage.setItem("apt_detail", JSON.stringify(apt))}
                                                        className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-semibold">
                                                        <Eye className="w-3.5 h-3.5" /> View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/appointments/${apt.id}/invoice`}
                                                        onClick={() => sessionStorage.setItem("apt_detail", JSON.stringify(apt))}
                                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold">
                                                        <FileText className="w-3.5 h-3.5" /> Invoice
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                            Showing {filtered.length} of {pagination.total_records} appointments
                            (Page {pagination.current_page} of {pagination.total_pages})
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPagination(p => ({ ...p, current_page: p.current_page - 1 }))}
                                disabled={pagination.current_page <= 1 || isLoading}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-40"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                                .filter(p => Math.abs(p - pagination.current_page) <= 1)
                                .map(p => (
                                    <button key={p}
                                        onClick={() => setPagination(prev => ({ ...prev, current_page: p }))}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${p === pagination.current_page ? "bg-teal-600 text-white" : "hover:bg-slate-100 text-slate-600"}`}>
                                        {p}
                                    </button>
                                ))}
                            <button
                                onClick={() => setPagination(p => ({ ...p, current_page: p.current_page + 1 }))}
                                disabled={pagination.current_page >= pagination.total_pages || isLoading}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 disabled:opacity-40"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}