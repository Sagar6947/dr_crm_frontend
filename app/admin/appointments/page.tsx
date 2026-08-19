

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    CalendarCheck, Plus, Search, Eye, FileText,
    Clock, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { appointmentService, patientService, doctorService, clinicService, request } from "@/lib/api";

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    confirmed: { color: "bg-teal-50 text-teal-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    scheduled: { color: "bg-teal-50 text-teal-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    pending: { color: "bg-yellow-50 text-yellow-700", icon: <AlertCircle className="w-3.5 h-3.5" /> },
    completed: { color: "bg-blue-50 text-blue-700", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    cancelled: { color: "bg-red-50 text-red-600", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const LIMIT = 10;

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedClinic, setSelectedClinic] = useState("");

    const [dateFilterType, setDateFilterType] = useState<"booked" | "appointment">("booked");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [patientsList, setPatientsList] = useState<any[]>([]);
    const [doctorsList, setDoctorsList] = useState<any[]>([]);
    const [clinicsList, setClinicsList] = useState<any[]>([]);

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
            const params: Record<string, string> = {
                page_no: String(page),
                limit: String(LIMIT),
                search: search,
            };
            if (selectedPatient) params.patient_id = selectedPatient;
            if (selectedDoctor) params.doctor_id = selectedDoctor;
            if (selectedClinic) params.clinic_id = selectedClinic;

            if (fromDate) {
                if (dateFilterType === "booked") params.booked_from = fromDate;
                else params.appointment_from = fromDate;
            }
            if (toDate) {
                if (dateFilterType === "booked") params.booked_to = toDate;
                else params.appointment_to = toDate;
            }

            const body = new URLSearchParams(params).toString();

            const data = await request("/appointment/list", {
                method: "POST",
                body,
                signal: controller.signal,
            });

            setAppointments(data.data || []);
            if (data.pagination) setPagination(data.pagination);
            else setPagination(prev => ({ 
                ...prev, 
                total_records: data.total_records || 0,
                total_pages: Math.ceil((data.total_records || 0) / LIMIT) || 1
            }));

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

    // 2. Fetch data when page, search, or filters change
    useEffect(() => {
        fetchAppointments(pagination.current_page, debouncedSearch);
        return () => { if (abortRef.current) abortRef.current.abort("Component unmounted or page changed"); };
    }, [pagination.current_page, debouncedSearch, selectedPatient, selectedDoctor, selectedClinic, fromDate, toDate, dateFilterType]);

    // 3. Fetch filter options once
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [pRes, dRes, cRes] = await Promise.all([
                    patientService.getAll({ page_no: 1, limit: 1000 }),
                    doctorService.getAll({ page_no: 1, limit: 1000 }),
                    clinicService.getAll({ page_no: 1, limit: 1000 })
                ]);
                if (pRes.data) setPatientsList(pRes.data);
                if (dRes.data) setDoctorsList(dRes.data);
                if (cRes.data) setClinicsList(cRes.data);
            } catch (e) {
                console.error("Error fetching filters", e);
            }
        };
        fetchFilters();
    }, []);

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
                        { label: "Confirmed", value: appointments.filter(a => ["confirmed", "scheduled"].includes(a.status?.toLowerCase())).length, icon: <CheckCircle2 className="w-5 h-5" />, change: "This page", up: true },
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
                    <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
                        {/* ROW 1: Search & Status */}
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                            <div className="relative w-full sm:w-96">
                                {isLoading
                                    ? <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-500 animate-spin" />
                                    : <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                }
                                <input
                                    type="text"
                                    placeholder="Search patient, doctor, payment ID..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none"
                                />
                            </div>
                            <div className="flex items-center">
                                <select 
                                    value={statusFilter} 
                                    onChange={e => { setStatusFilter(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
                                    className="bg-teal-50 text-teal-700 font-semibold rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 border-none cursor-pointer capitalize"
                                >
                                    {["All", "scheduled", "completed", "cancelled"].map(s => (
                                        <option key={s} value={s} className="capitalize">{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* ROW 2: Filters */}
                        <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                            <select 
                                value={selectedPatient} 
                                onChange={e => { setSelectedPatient(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
                                className="bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none cursor-pointer flex-shrink-0"
                            >
                                <option value="">All Patients</option>
                                {patientsList.map(p => (
                                    <option key={p.id} value={p.id}>{p.full_name} ({p.phone})</option>
                                ))}
                            </select>
                            
                            <select 
                                value={selectedDoctor} 
                                onChange={e => { setSelectedDoctor(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
                                className="bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none cursor-pointer flex-shrink-0"
                            >
                                <option value="">All Doctors</option>
                                {doctorsList.map(d => (
                                    <option key={d.id} value={d.id}>{d.full_name}</option>
                                ))}
                            </select>

                            <select 
                                value={selectedClinic} 
                                onChange={e => { setSelectedClinic(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
                                className="bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none cursor-pointer flex-shrink-0"
                            >
                                <option value="">All Clinics</option>
                                {clinicsList.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1 flex-shrink-0">
                                <select 
                                    value={dateFilterType} 
                                    onChange={e => { setDateFilterType(e.target.value as any); setPagination(p => ({...p, current_page: 1})); }}
                                    className="bg-slate-50 rounded-xl px-2 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none cursor-pointer"
                                >
                                    <option value="booked">Booked Date</option>
                                    <option value="appointment">Appt Date</option>
                                </select>
                                <input 
                                    type="date" 
                                    value={fromDate}
                                    onChange={e => { setFromDate(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
                                    className="bg-slate-50 rounded-xl px-2 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none"
                                />
                                <span className="text-slate-400 text-xs">to</span>
                                <input 
                                    type="date" 
                                    value={toDate}
                                    onChange={e => { setToDate(e.target.value); setPagination(p => ({...p, current_page: 1})); }}
                                    className="bg-slate-50 rounded-xl px-2 py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 border-none"
                                />
                                {(fromDate || toDate) && (
                                    <button 
                                        onClick={() => { setFromDate(""); setToDate(""); setPagination(p => ({...p, current_page: 1})); }}
                                        className="text-xs text-red-500 hover:text-red-700 font-semibold px-2"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Booked Date</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">ID</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Patient</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Doctor</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Clinic</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Booked Slot</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Mode</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Payment</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Payment ID</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Status</th>
                                    <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-5 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={11} className="py-20 text-center">
                                            <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                                                <Loader2 className="w-4 h-4 animate-spin" /> Loading appointments...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="py-16 text-center text-slate-400 text-sm">
                                            No appointments found.
                                        </td>
                                    </tr>
                                ) : filtered.map((apt, i) => {
                                    const cfg = getStatusCfg(apt.status);

                                    const formatDateOnly = (dateStr: string) => {
                                        if (!dateStr) return "—";
                                        const d = new Date(dateStr.replace(/-/g, '/'));
                                        if (isNaN(d.getTime())) return dateStr;
                                        const day = d.getDate();
                                        const month = d.toLocaleString('en-US', { month: 'long' });
                                        const year = d.getFullYear();
                                        return `${day} ${month}, ${year}`;
                                    };

                                    const formatTimeOnly = (timeStr: string) => {
                                        if (!timeStr) return "";
                                        const [h, m] = timeStr.split(':');
                                        if (!h || !m) return timeStr;
                                        let hour = parseInt(h, 10);
                                        if (isNaN(hour)) return timeStr;
                                        if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
                                        const minute = parseInt(m, 10).toString().padStart(2, '0');
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        hour = hour % 12;
                                        hour = hour || 12;
                                        return `${hour}:${minute} ${ampm}`;
                                    };

                                    const formatBookedParts = (dateStr: string) => {
                                        if (!dateStr) return { date: "—", time: "" };
                                        const d = new Date(dateStr.replace(/-/g, '/'));
                                        if (isNaN(d.getTime())) return { date: dateStr, time: "" };
                                        const day = d.getDate();
                                        const month = d.toLocaleString('en-US', { month: 'long' });
                                        const year = d.getFullYear();
                                        let hour = d.getHours();
                                        const minute = d.getMinutes().toString().padStart(2, '0');
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        hour = hour % 12;
                                        hour = hour || 12;
                                        return {
                                            date: `${day} ${month}, ${year}`,
                                            time: `${hour}:${minute} ${ampm}`
                                        };
                                    };

                                    return (
                                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-4 hidden md:table-cell">
                                                <div className="text-sm text-slate-800 font-medium">
                                                    {formatBookedParts(apt.booked_appointment_date).date}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {formatBookedParts(apt.booked_appointment_date).time}
                                                </div>
                                            </td>
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
                                                <div className="text-sm text-slate-800 font-medium">{formatDateOnly(apt.appointment_date)}</div>
                                                <div className="text-xs text-slate-400">{formatTimeOnly(apt.appointment_time)}</div>
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
                                            <td className="px-5 py-4 hidden lg:table-cell text-sm text-slate-600 font-mono">
                                                {apt.razorpay_payment_id || apt.payment?.razorpay_payment_id || "—"}
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