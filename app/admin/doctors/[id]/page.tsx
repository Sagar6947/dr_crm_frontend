

"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Stethoscope,
    Phone,
    MapPin,
    ChevronLeft,
    Calendar,
    GraduationCap,
    Building2,
    Users,
    Activity
} from "lucide-react";
import Link from "next/link";
import { doctorService } from "@/lib/api";

export default function DoctorDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [doctor, setDoctor] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        doctorService
            .getById(params.id)
            .then((data: any) => {
                console.log("DOCTOR DETAIL =>", data);
                setDoctor(data?.data || null);
            })
            .catch((err) => {
                console.error("Failed to fetch doctor detail", err);
                setDoctor(null);
            })
            .finally(() => setLoading(false));
    }, [params.id]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="w-8 h-8 border-2 border-medical-teal border-t-transparent rounded-full animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    if (!doctor) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64 text-slate-400">
                    Doctor not found
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/doctors"
                        className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {doctor.full_name}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            ID: {doctor.id} • {doctor.specialization}
                        </p>
                    </div>

                    <span
                        className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            doctor.status === "active" || doctor.status == "1"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                    >
                        <div
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                doctor.status === "active" || doctor.status == "1"
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                            }`}
                        />
                        {doctor.status == "1" ? "Active" : doctor.status == "0" ? "Inactive" : doctor.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="medical-card !rounded-3xl">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                    <Stethoscope className="w-8 h-8" />
                                </div>

                                <div>
                                    <p className="text-lg font-bold text-slate-800">
                                        {doctor.full_name}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {doctor.specialization} • {doctor.qualification}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Phone
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                                            {doctor.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Location
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                                            {doctor.city}
                                            {doctor.state ? `, ${doctor.state}` : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Clinic
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                                            {doctor.clinic_name || "Not Assigned"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Joined On
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                                            {doctor.create_date || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {doctor.bio && (
                            <div className="medical-card !rounded-3xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    Bio
                                </p>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {doctor.bio}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="space-y-4">
                        <div className="medical-card !rounded-3xl space-y-4">
                            <p className="text-sm font-bold text-slate-800 pb-4 border-b border-slate-50">
                                Quick Stats
                            </p>

                            <div className="bg-teal-50 rounded-2xl px-4 py-3 flex items-center gap-3">
                                <GraduationCap className="w-5 h-5 text-medical-teal" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Experience
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {doctor.experience || 0} Years
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl px-4 py-3 flex items-center gap-3">
                                <Users className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Patients
                                    </p>
                                    <p className="text-sm font-bold text-slate-800">
                                        {doctor.total_patients || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/admin/doctors/add?id=${doctor.id}`}
                            className="btn-primary w-full !py-4 shadow-xl shadow-teal-900/10 flex items-center justify-center gap-2"
                        >
                            <Activity className="w-4 h-4" />
                            Edit Doctor
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}