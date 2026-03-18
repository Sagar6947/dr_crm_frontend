"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Stethoscope,
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
    GraduationCap,
    Building2,
} from "lucide-react";
import Link from "next/link";

interface Doctor {
    id: string;
    name: string;
    doctorCode: string;
    specialization: string;
    phone: string;
    location: string;
    clinic: string;
    experience: number;
    patients: number;
    status: "Active" | "Inactive";
    joinedOn: string;
}

const INITIAL_DOCTORS: Doctor[] = [
    { id: "1", name: "Dr. Amit Sharma", doctorCode: "DR-001", specialization: "Cardiologist", phone: "+91 98765 11111", location: "Bhopal, MP", clinic: "City Care Hospital", experience: 12, patients: 320, status: "Active", joinedOn: "12 Jan 2024" },
    { id: "2", name: "Dr. Priya Mehta", doctorCode: "DR-002", specialization: "Pediatrician", phone: "+91 91234 22222", location: "Indore, MP", clinic: "Sunshine Pediatric", experience: 8, patients: 210, status: "Active", joinedOn: "05 Feb 2024" },
    { id: "3", name: "Dr. Rajan Verma", doctorCode: "DR-003", specialization: "Dentist", phone: "+91 99887 33333", location: "New York, NY", clinic: "Modern Dental Clinic", experience: 5, patients: 95, status: "Inactive", joinedOn: "20 Mar 2024" },
    { id: "4", name: "Dr. Sunita Joshi", doctorCode: "DR-004", specialization: "Neurologist", phone: "+91 87654 44444", location: "Portland, OR", clinic: "Riverside Wellness", experience: 15, patients: 430, status: "Active", joinedOn: "01 Apr 2024" },
];

export default function DoctorsManager() {
    const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDoctors = doctors.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.doctorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctors Manager</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage doctors and their clinical assignments.</p>
                    </div>
                    <Link
                        href="/admin/doctors/add"
                        className="btn-primary !py-4 !px-8 shadow-xl shadow-teal-900/10"
                    >
                        <Plus className="w-4 h-4" /> Add New Doctor
                    </Link>
                </div>

                {/* Filters & Search */}
                <div className="medical-card !p-4 !rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search doctors by name, code, specialization or clinic..."
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
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Clinic</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Experience</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Joined On</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredDoctors.map((doctor) => (
                                    <tr key={doctor.id} className="group hover:bg-slate-50/30 transition-colors">
                                        {/* Doctor Name */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-medical-teal group-hover:bg-medical-teal group-hover:text-white transition-all duration-300 shadow-sm">
                                                    <Stethoscope className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{doctor.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {doctor.doctorCode} • {doctor.specialization}
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
                                                <span className="text-xs">{doctor.location}</span>
                                            </div>
                                        </td>

                                        {/* Clinic */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-teal-400" />
                                                <span className="text-sm font-medium text-slate-700">{doctor.clinic}</span>
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{doctor.patients} Patients</p>
                                        </td>

                                        {/* Experience */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-purple-400" />
                                                <span className="text-sm font-medium text-slate-700">{doctor.experience} yrs</span>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${doctor.status === "Active"
                                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                : "bg-slate-100 text-slate-500 border-slate-200"
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${doctor.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                                                {doctor.status}
                                            </span>
                                        </td>

                                        {/* Joined On */}
                                        <td className="px-8 py-6 text-sm font-medium text-slate-600">{doctor.joinedOn}</td>

                                        {/* Actions */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/doctors/${doctor.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn"
                                                >
                                                    View <Eye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                                </Link>
                                                <Link
                                                    href={`/admin/doctors/${doctor.id}/manage`}
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
                        <p className="text-xs font-bold text-slate-400">Showing {filteredDoctors.length} of {doctors.length} doctors</p>
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