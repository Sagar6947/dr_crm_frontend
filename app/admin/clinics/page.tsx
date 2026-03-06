"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Hospital,
    MapPin,
    Users,
    CheckCircle2,
    MoreVertical,
    Plus,
    X,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    ExternalLink,
    Eye
} from "lucide-react";
import Link from "next/link";


interface Clinic {
    id: string;
    name: string;
    code: string;
    location: string;
    doctors: number;
    patients: number;
    status: "Active" | "Inactive";
    joined: string;
}

const INITIAL_CLINICS: Clinic[] = [
    { id: "1", name: "City Care Hospital", code: "CC-01", location: "Bhopal, MP", doctors: 8, patients: 450, status: "Active", joined: "12 Jan 2024" },
    { id: "2", name: "Sunshine Pediatric", code: "SP-04", location: "Indore, MP", doctors: 5, patients: 280, status: "Active", joined: "05 Feb 2024" },
    { id: "3", name: "Modern Dental Clinic", code: "MD-09", location: "New York, NY", doctors: 3, patients: 120, status: "Inactive", joined: "20 Mar 2024" },
    { id: "4", name: "Riverside Wellness", code: "RW-12", location: "Portland, OR", doctors: 12, patients: 890, status: "Active", joined: "01 Apr 2024" },
];

export default function ClinicsManager() {
    const [clinics, setClinics] = useState<Clinic[]>(INITIAL_CLINICS);
    const [searchQuery, setSearchQuery] = useState("");

    const handleAddClinic = (e: React.FormEvent) => {
        // This will be handled in the new /admin/clinics/add page
    };

    const filteredClinics = clinics.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Clinics Manager</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage global branches and clinical operations.</p>
                    </div>
                    <Link
                        href="/admin/clinics/add"
                        className="btn-primary !py-4 !px-8 shadow-xl shadow-teal-900/10"
                    >
                        <Plus className="w-4 h-4" /> Add New Clinic
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="medical-card !p-4 !rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search clinics by name, code or location..."
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

                {/* Table View */}
                <div className="medical-card !p-0 !rounded-[40px] overflow-hidden border-slate-100/50 shadow-2xl shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Clinic Name</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Location</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Resources</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Onboarding</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredClinics.map((clinic) => (
                                    <tr key={clinic.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-medical-teal group-hover:bg-medical-teal group-hover:text-white transition-all duration-300 shadow-sm">
                                                    <Hospital className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{clinic.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{clinic.code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="text-sm font-medium">{clinic.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex -space-x-3 overflow-hidden">
                                                {[...Array(Math.min(clinic.doctors, 3))].map((_, i) => (
                                                    <div key={i} className="inline-block h-8 w-8 rounded-full border-2 border-white bg-teal-50 flex items-center justify-center text-[10px] font-bold text-medical-teal">
                                                        D
                                                    </div>
                                                ))}
                                                {clinic.doctors > 3 && (
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-50 text-[10px] font-bold text-slate-500">
                                                        +{clinic.doctors - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-tighter">{clinic.doctors} Doctors • {clinic.patients} Patients</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${clinic.status === "Active"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-slate-100 text-slate-500 border-slate-200"
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${clinic.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                                                {clinic.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-medium text-slate-600">{clinic.joined}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/clinics/${clinic.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn"
                                                >
                                                    View <Eye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                                </Link>
                                                <Link
                                                    href={`/admin/clinics/${clinic.id}/manage`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn"
                                                >
                                                    Manage <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-400">Showing {filteredClinics.length} of {clinics.length} clinical nodes</p>
                        <div className="flex gap-2">
                            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white transition-colors disabled:opacity-50" disabled>
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:bg-white transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal removed in favor of dedicated /admin/clinics/add page */}
        </AdminLayout>
    );
}
