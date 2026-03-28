"use client";

import React, { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Stethoscope, MapPin, Phone, Plus, Search,
    ChevronLeft, ChevronRight, Filter, Download,
    ExternalLink, Eye, GraduationCap, Loader2,
} from "lucide-react";
import Link from "next/link";
import { doctorService } from "@/lib/api";
import { toast } from "sonner";

export default function DoctorsManager() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total_records: 0,
        current_page: 1,
        total_pages: 0,
        limit: 10,
    });
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchDoctors = async (page = 1, search = debouncedSearch) => {
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        try {
            // const response = await doctorService.getAll(controller.signal);
            const response = await doctorService.getAll(
    { page_no: page, limit: pagination.limit, search },
    controller.signal
);
            if (response.status === 200) {
                setDoctors(response.data || []);
                if (response.pagination) setPagination(response.pagination);
            } else {
                toast.error(response.message || "Failed to fetch doctors");
            }
        } catch (error: any) {
            if (error.name === "AbortError") return;
            toast.error(error.message || "Failed to fetch doctors");
        } finally {
            if (abortControllerRef.current === controller) setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors(pagination.current_page);
        return () => { abortControllerRef.current?.abort(); };
    }, [pagination.current_page]);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchDoctors(1, debouncedSearch);
    }, [debouncedSearch]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.total_pages)
            setPagination(prev => ({ ...prev, current_page: newPage }));
    };

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctors Manager</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage doctors and their clinical assignments.</p>
                    </div>
                    <Link href="/admin/doctors/add" className="btn-primary !py-4 !px-8 shadow-xl shadow-teal-900/10">
                        <Plus className="w-4 h-4" /> Add New Doctor
                    </Link>
                </div>

                {/* Search & Filters */}
                <div className="medical-card !p-4 !rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        {isLoading ? (
                            <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-teal animate-spin" />
                        ) : (
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        )}
                        <input
                            type="text"
                            placeholder="Search doctors by name, specialization..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="medical-card !p-0 !rounded-[40px] overflow-hidden border-slate-100/50 shadow-2xl shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Doctor Name</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Specialization</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Experience</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Joined On</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal animate-bounce">
                                                    <Stethoscope className="w-6 h-6" />
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                                    <Loader2 className="w-3 h-3 animate-spin" /> Fetching doctors...
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : doctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-8 py-10 text-center text-slate-400 font-medium text-sm">
                                            No doctors found.
                                        </td>
                                    </tr>
                                ) : (
                                    doctors.map((doctor) => (
                                        <tr key={doctor.id} className="group hover:bg-slate-50/30 transition-colors">
                                            {/* Doctor Name */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    {doctor.profile_photo ? (
    <img src={doctor.profile_photo} alt={doctor.full_name}
                                                            className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-medical-teal group-hover:bg-medical-teal group-hover:text-white transition-all duration-300 shadow-sm">
                                                            <Stethoscope className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">
                                                            {doctor.title} {doctor.full_name}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {doctor.doctor_code} • {doctor.role?.replace(/_/g, " ")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span className="text-sm font-medium">{doctor.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    <span className="text-xs">{doctor.address || "—"}</span>
                                                </div>
                                            </td>

                                            {/* Specialization */}
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-medium text-slate-700">{doctor.specialization}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{doctor.qualification || "—"}</p>
                                            </td>

                                            {/* Experience */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="w-4 h-4 text-purple-400" />
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {doctor.experience_years ? `${doctor.experience_years} yrs` : "—"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                                    doctor.status === "active"
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        : "bg-slate-100 text-slate-500 border-slate-200"
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${doctor.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                                                    {doctor.status}
                                                </span>
                                            </td>

                                            {/* Joined On */}
                                            <td className="px-8 py-6 text-sm font-medium text-slate-600">
                                                {doctor.create_date || "—"}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/doctors/${doctor.id}`}
                                                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn">
                                                        View <Eye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                                    </Link>
                                                    <Link href={`/admin/doctors/add?id=${doctor.id}`}
                                                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:bg-blue-50 hover:border-blue-200 transition-all">
                                                        Edit
                                                    </Link>
                                                    <Link href={`/admin/doctors/${doctor.id}/manage`}
                                                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn">
                                                        Manage <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-400">
                            Showing {doctors.length} of {pagination.total_records} doctors
                            {pagination.total_pages > 0 && ` (Page ${pagination.current_page} of ${pagination.total_pages})`}
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page <= 1 || isLoading}
                                className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white transition-colors disabled:opacity-50">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page >= pagination.total_pages || isLoading}
                                className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white transition-colors disabled:opacity-50">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}