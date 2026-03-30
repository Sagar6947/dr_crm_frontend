
"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    User,
    Phone,
    MapPin,
    HeartPulse,
    ChevronLeft,
    Calendar,
    Droplets,
    Activity,
    ClipboardList
} from "lucide-react";
import Link from "next/link";
import { patientService } from "@/lib/api";

export default function PatientDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        patientService
            .getById(params.id)
            .then((data: any) => {
                console.log("PATIENT DETAIL =>", data);
                setPatient(data?.data || null);
            })
            .catch((err) => {
                console.error("Failed to fetch patient detail", err);
                setPatient(null);
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

    if (!patient) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64 text-slate-400">
                    Patient not found
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
                        href="/admin/patients"
                        className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {patient.full_name}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Patient ID: {patient.id}
                        </p>
                    </div>

                    <span
                        className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            patient.status === "active"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                    >
                        <div
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                patient.status === "active"
                                    ? "bg-emerald-500"
                                    : "bg-slate-400"
                            }`}
                        />
                        {patient.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="medical-card !rounded-3xl">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                    <User className="w-8 h-8" />
                                </div>

                                <div>
                                    <p className="text-lg font-bold text-slate-800">
                                        {patient.full_name}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {patient.age} years • {patient.gender}
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
                                            {patient.phone}
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
                                            {patient.city}
                                            {patient.state
                                                ? `, ${patient.state}`
                                                : ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Registered On
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                                            {patient.create_date || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <Droplets className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Blood Group
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                                            {patient.blood_group || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {patient.notes && (
                            <div className="medical-card !rounded-3xl">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                        <ClipboardList className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">
                                        Clinical Notes
                                    </p>
                                </div>

                                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                                    {patient.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right */}
                    <div className="space-y-4">
                        <div className="medical-card !rounded-3xl">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400">
                                    <HeartPulse className="w-5 h-5" />
                                </div>
                                <p className="text-sm font-bold text-slate-800">
                                    Medical Summary
                                </p>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="bg-slate-50 rounded-2xl px-4 py-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Primary Condition
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 mt-1">
                                        {patient.disease || "Not Available"}
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl px-4 py-3">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Blood Group
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 mt-1">
                                        {patient.blood_group || "Not Set"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/admin/patients/add?id=${patient.id}`}
                            className="btn-primary w-full !py-4 shadow-xl shadow-teal-900/10 flex items-center justify-center gap-2"
                        >
                            <Activity className="w-4 h-4" />
                            Edit Patient
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}