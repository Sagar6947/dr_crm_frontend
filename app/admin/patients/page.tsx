"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    User,
    MapPin,
    Phone,
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    ExternalLink,
    Eye,
    HeartPulse,
} from "lucide-react";
import Link from "next/link";

interface Patient {
    id: string;
    name: string;
    patientCode: string;
    age: number;
    gender: "Male" | "Female" | "Other";
    phone: string;
    location: string;
    disease: string;
    status: "Active" | "Inactive";
    registeredOn: string;
}

const INITIAL_PATIENTS: Patient[] = [
    { id: "1", name: "Rahul Sharma", patientCode: "PT-001", age: 34, gender: "Male", phone: "+91 98765 43210", location: "Bhopal, MP", disease: "Diabetes", status: "Active", registeredOn: "12 Jan 2024" },
    { id: "2", name: "Priya Verma", patientCode: "PT-002", age: 27, gender: "Female", phone: "+91 91234 56789", location: "Indore, MP", disease: "Hypertension", status: "Active", registeredOn: "05 Feb 2024" },
    { id: "3", name: "Amit Patel", patientCode: "PT-003", age: 45, gender: "Male", phone: "+91 99887 76655", location: "Bhopal, MP", disease: "Arthritis", status: "Inactive", registeredOn: "20 Mar 2024" },
    { id: "4", name: "Sunita Joshi", patientCode: "PT-004", age: 52, gender: "Female", phone: "+91 87654 32109", location: "Jabalpur, MP", disease: "Thyroid", status: "Active", registeredOn: "01 Apr 2024" },
];

export default function PatientsManager() {
    const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.patientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.disease.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        className="btn-primary !py-4 !px-8 shadow-xl shadow-teal-900/10"
                    >
                        <Plus className="w-4 h-4" /> Add New Patient
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="medical-card !p-4 !rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search patients by name, code, location or disease..."
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
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient Name</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Disease</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Registered On</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="group hover:bg-slate-50/30 transition-colors">
                                        {/* Patient Name */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-medical-teal group-hover:bg-medical-teal group-hover:text-white transition-all duration-300 shadow-sm">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{patient.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {patient.patientCode} • {patient.age} yrs • {patient.gender}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span className="text-sm font-medium">{patient.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="text-xs">{patient.location}</span>
                                            </div>
                                        </td>

                                        {/* Disease */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <HeartPulse className="w-4 h-4 text-rose-400" />
                                                <span className="text-sm font-medium text-slate-700">{patient.disease}</span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${patient.status === "Active"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-slate-100 text-slate-500 border-slate-200"
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${patient.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                                                {patient.status}
                                            </span>
                                        </td>

                                        {/* Registered On */}
                                        <td className="px-8 py-6 text-sm font-medium text-slate-600">{patient.registeredOn}</td>

                                        {/* Actions */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/patients/${patient.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn"
                                                >
                                                    View <Eye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                                </Link>
                                                <Link
                                                    href={`/admin/patients/${patient.id}/manage`}
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
                        <p className="text-xs font-bold text-slate-400">Showing {filteredPatients.length} of {patients.length} patients</p>
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
        </AdminLayout>
    );
}