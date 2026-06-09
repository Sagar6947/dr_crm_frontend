
"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    User, MapPin, Phone, Plus, Search, ChevronLeft, ChevronRight,
    Filter, Download, Eye, Pencil, HeartPulse, Loader2,
} from "lucide-react";
import Link from "next/link";
import { patientService } from "@/lib/api";


interface Patient {
    id: number;
    full_name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    state: string;
    city: string;
    address: string;
    disease: string;
    blood_group: string;
    status: string;
    create_date: string;
}

const ITEMS_PER_PAGE = 10;

export default function PatientsManager() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

   

  const fetchPatients = async () => {
    setLoading(true);
    try {
        const response = await patientService.getAll({
            page_no: currentPage,
            limit: ITEMS_PER_PAGE,
            search: searchQuery,
        });
        const list = Array.isArray(response?.data) ? response.data : [];
        setPatients(list);
        setTotalItems(response?.pagination?.total_records || response?.total || list.length);
    } catch (err: any) {
        console.error("Failed to fetch patients", err);
        setPatients([]);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchPatients();
    }, [currentPage, searchQuery]);

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patients Manager</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage patient records and medical history.</p>
                    </div>
                    <Link
    href="/admin/patients/add"
    onClick={() => setActionLoading("add")}
    className="btn-primary !py-4 !px-8 shadow-xl shadow-teal-900/10"
>
    {actionLoading === "add" ? (
        <Loader2 className="w-4 h-4 animate-spin" />
    ) : (
        <Plus className="w-4 h-4" />
    )}
    Add New Patient
</Link>
                </div>

                {/* Search */}
                <div className="medical-card !p-4 !rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search patients by name, disease, city..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Disease</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Blood Group</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center">
                                            <Loader2 className="w-6 h-6 animate-spin text-medical-teal mx-auto" />
                                        </td>
                                    </tr>
                                ) : patients.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center text-slate-400 text-sm">
                                            No patients found.
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.id} className="group hover:bg-slate-50/30 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-medical-teal group-hover:bg-medical-teal group-hover:text-white transition-all duration-300 shadow-sm">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{patient.full_name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {patient.age} yrs • {patient.gender}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                    <Phone className="w-3.5 h-3.5" />
                                                    <span className="text-sm font-medium">{patient.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    <span className="text-xs">{patient.city}{patient.state ? `, ${patient.state}` : ""}</span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <HeartPulse className="w-4 h-4 text-rose-400" />
                                                    <span className="text-sm font-medium text-slate-700">{patient.disease || "—"}</span>
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-500 border border-rose-100">
                                                    {patient.blood_group || "—"}
                                                </span>
                                            </td>

                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                                    patient.status === "active"
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        : "bg-slate-100 text-slate-500 border-slate-200"
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${patient.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                                                    {patient.status}
                                                </span>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/admin/patients/${patient.id}`}
                                                        onClick={() => setActionLoading(`view-${patient.id}`)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn"
                                                    >
                                                        View {actionLoading === `view-${patient.id}` ? (
    <Loader2 className="w-3 h-3 animate-spin" />
) : (
    <Eye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
)}
                                                    </Link>
                                                    <Link
                                                        href={`/admin/patients/add?id=${patient.id}`}
                                                        onClick={() => setActionLoading(`edit-${patient.id}`)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn"
                                                    >
                                                        Edit {actionLoading === `edit-${patient.id}` ? (
    <Loader2 className="w-3 h-3 animate-spin" />
) : (
    <Pencil className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
)}
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
                            Showing {patients.length} of {totalItems} patients
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white transition-colors disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white transition-colors disabled:opacity-50"
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