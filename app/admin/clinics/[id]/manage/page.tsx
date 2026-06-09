

"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Hospital, MapPin, Phone, Clock, Edit2, UserPlus,
    ArrowLeft, Mail, Smartphone, MessageCircle,
    Loader2, Search, X, Check, Stethoscope, ChevronRight,
    Users, Calendar, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { clinicService, doctorService } from "@/lib/api";

// ─────────────────────────────────────────────
// Assign Doctor Modal
// ─────────────────────────────────────────────
function AssignDoctorModal({
    clinicId,
    onClose,
    onAssigned,
}: {
    clinicId: string;
    onClose: () => void;
    onAssigned: () => void;
}) {
    const [allDoctors, setAllDoctors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<number[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        const load = async () => {
            setIsLoading(true);
            try {
                const res = await doctorService.getAll({ page_no: 1, limit: 100 }, controller.signal);
                if (res.status === 200) setAllDoctors(res.data || []);
            } catch (e: any) {
                if (e.name === "AbortError") return;
                toast.error("Failed to load doctors");
            } finally {
                setIsLoading(false);
            }
        };
        load();
        return () => controller.abort("Component unmounted");
    }, []);

    const filtered = allDoctors.filter(d =>
        `${d.full_name} ${d.specialization} ${d.doctor_code}`
            .toLowerCase().includes(search.toLowerCase())
    );

    const toggle = (id: number) =>
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const handleAssign = async () => {
        if (selected.length === 0) { toast.error("Select at least one doctor"); return; }
        setIsAssigning(true);
        try {
            const body = new URLSearchParams({
                clinic_id: clinicId,
                doctor_ids: JSON.stringify(selected),
            }).toString();
            await (clinicService as any).addDoctors(body);
            toast.success(`${selected.length} doctor(s) assigned successfully!`);
            onAssigned(); // refresh assigned list
            onClose();
        } catch (e: any) {
            toast.error(e.message || "Failed to assign doctors");
        } finally {
            setIsAssigning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Assign Doctors</h3>
                            <p className="text-xs text-slate-400 font-medium">
                                {selected.length > 0 ? `${selected.length} selected` : "Select doctors to assign"}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-8 py-4 border-b border-slate-50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search by name, specialization or code..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-8 py-4 space-y-2">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal animate-bounce">
                                <Stethoscope className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                <Loader2 className="w-3 h-3 animate-spin" /> Loading doctors...
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <p className="text-center py-10 text-slate-400 text-sm font-medium">No doctors found.</p>
                    ) : (
                        filtered.map(doctor => {
                            const isSelected = selected.includes(doctor.id);
                            return (
                                <div
                                    key={doctor.id}
                                    onClick={() => toggle(doctor.id)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
                                        isSelected
                                            ? "bg-teal-50 border-teal-200 shadow-sm"
                                            : "bg-slate-50/50 border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    {/* Avatar */}
                                    {doctor.profile_photo ? (
                                        <img src={doctor.profile_photo} alt={doctor.full_name}
                                            className="w-12 h-12 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
                                            onError={(e: any) => { e.target.style.display = "none"; }} />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                                            isSelected ? "bg-medical-teal text-white" : "bg-white border border-slate-100 text-medical-teal"
                                        }`}>
                                            <Stethoscope className="w-5 h-5" />
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold truncate ${isSelected ? "text-teal-800" : "text-slate-800"}`}>
                                            {doctor.title} {doctor.full_name}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                                            {doctor.doctor_code} • {doctor.specialization}
                                        </p>
                                    </div>

                                    {/* Role */}
                                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-white border border-slate-100 text-slate-500 flex-shrink-0">
                                        {doctor.role?.replace(/_/g, " ")}
                                    </span>

                                    {/* Check */}
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                        isSelected ? "bg-medical-teal text-white shadow-lg shadow-teal-900/20" : "bg-white border-2 border-slate-200"
                                    }`}>
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between gap-4">
                    <p className="text-xs font-bold text-slate-400">
                        {selected.length === 0 ? "No doctors selected" : `${selected.length} doctor(s) will be assigned`}
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="btn-secondary !py-3 !px-6 !text-[10px] font-black tracking-widest !rounded-2xl">
                            Cancel
                        </button>
                        <button
                            onClick={handleAssign}
                            disabled={isAssigning || selected.length === 0}
                            className="btn-primary !py-3 !px-8 !text-[10px] font-black tracking-widest !rounded-2xl shadow-xl shadow-teal-900/10 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isAssigning
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> Assigning...</>
                                : <><UserPlus className="w-4 h-4" /> Assign {selected.length > 0 ? `(${selected.length})` : ""}</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function ClinicManagePage() {
    const params = useParams();
    const id = params.id as string;

    const [clinicData, setClinicData] = useState<any>(null);
    const [assignedDoctors, setAssignedDoctors] = useState<any[]>([]);
    const [isLoadingClinic, setIsLoadingClinic] = useState(true);
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [doctorSearch, setDoctorSearch] = useState("");

    // Fetch clinic details
    const fetchClinic = async () => {
        if (!id) return;
        setIsLoadingClinic(true);
        try {
            const res = await clinicService.getById(id);
            if (res.status === 200) setClinicData(res.data);
            else toast.error(res.message || "Failed to fetch clinic");
        } catch (e: any) {
            toast.error(e.message || "Error");
        } finally {
            setIsLoadingClinic(false);
        }
    };

    // Fetch assigned doctors — GET /clinic/doctors/{id}
    const fetchAssignedDoctors = async () => {
        if (!id) return;
        setIsLoadingDoctors(true);
        try {
            const res = await (clinicService as any).getDoctors(id);
            if (res.status === 200) setAssignedDoctors(res.data || []);
            else toast.error(res.message || "Failed to fetch assigned doctors");
        } catch (e: any) {
            toast.error(e.message || "Error fetching assigned doctors");
        } finally {
            setIsLoadingDoctors(false);
        }
    };

    useEffect(() => {
        fetchClinic();
        fetchAssignedDoctors();
    }, [id]);

    const filteredDoctors = assignedDoctors.filter(d =>
        `${d.full_name} ${d.specialization} ${d.doctor_code}`
            .toLowerCase().includes(doctorSearch.toLowerCase())
    );

    if (isLoadingClinic) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-medical-teal animate-bounce">
                        <Hospital className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading clinic...
                    </p>
                </div>
            </AdminLayout>
        );
    }

    if (!clinicData) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Clinic not found.</p>
                    <Link href="/admin/clinics" className="btn-secondary !text-[10px] uppercase font-black tracking-widest !py-3 !px-8">
                        Return to Clinics
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {showModal && (
                <AssignDoctorModal
                    clinicId={id}
                    onClose={() => setShowModal(false)}
                    onAssigned={fetchAssignedDoctors}
                />
            )}

            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Link href="/admin/clinics" className="hover:text-medical-teal transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Clinics
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <Link href={`/admin/clinics/${id}`} className="hover:text-medical-teal transition-colors">
                            {clinicData.name}
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">Manage</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            {clinicData.logo_path ? (
                                <img src={clinicData.logo_path} alt={clinicData.name}
                                    className="w-16 h-16 rounded-[28px] object-cover border border-slate-100 shadow-sm"
                                    onError={(e: any) => { e.target.style.display = "none"; }} />
                            ) : (
                                <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-medical-teal">
                                    <Hospital className="w-8 h-8" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{clinicData.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{clinicData.clinic_code}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
                                        clinicData.status === "active" ? "text-emerald-500" : "text-slate-400"
                                    }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${clinicData.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                                        {clinicData.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link href={`/admin/clinics/add?id=${id}`}
                            className="btn-secondary !py-3 !px-6 !text-[10px] font-black tracking-widest flex items-center gap-2">
                            <Edit2 className="w-3.5 h-3.5" /> Edit Clinic
                        </Link>
                    </div>
                </div>

                {/* Assigned Doctors Section */}
                <div className="medical-card !p-0 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    {/* Section Header */}
                    <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal shadow-inner">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Assigned Doctors</h3>
                                <p className="text-xs text-slate-400 font-medium">
                                    {isLoadingDoctors ? "Loading..." : `${assignedDoctors.length} doctor(s) assigned to this clinic`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Search doctors..."
                                    className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    value={doctorSearch}
                                    onChange={e => setDoctorSearch(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn-primary !py-3 !px-6 !text-[10px] font-black tracking-widest flex items-center gap-2 shadow-xl shadow-teal-900/10 whitespace-nowrap"
                            >
                                <UserPlus className="w-4 h-4" /> Assign Doctor
                            </button>
                        </div>
                    </div>

                    {/* Doctors Grid */}
                    <div className="p-8">
                        {isLoadingDoctors ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-3">
                                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal animate-bounce">
                                    <Stethoscope className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Loading assigned doctors...
                                </div>
                            </div>
                        ) : filteredDoctors.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 gap-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300">
                                    <Stethoscope className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-500">
                                        {doctorSearch ? "No doctors match your search" : "No doctors assigned yet"}
                                    </p>
                                    <p className="text-xs text-slate-400 font-medium mt-1">
                                        {!doctorSearch && "Click \"Assign Doctor\" to add doctors to this clinic"}
                                    </p>
                                </div>
                                {!doctorSearch && (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="btn-primary !py-3 !px-8 !text-[10px] font-black tracking-widest flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" /> Assign First Doctor
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredDoctors.map((doctor) => (
                                    <div key={doctor.id}
                                        className="medical-card !p-6 !rounded-[32px] border-slate-100/50 shadow-lg shadow-slate-200/30 group hover:ring-2 hover:ring-medical-teal/10 transition-all">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            {doctor.profile_photo ? (
                                                <img src={doctor.profile_photo} alt={doctor.full_name}
                                                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
                                                    onError={(e: any) => { e.target.style.display = "none"; }} />
                                            ) : (
                                                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal flex-shrink-0 border border-teal-100/50">
                                                    <Stethoscope className="w-7 h-7" />
                                                </div>
                                            )}

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 truncate">
                                                            {doctor.full_name}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                            {doctor.doctor_code}
                                                        </p>
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex-shrink-0 ${
                                                        doctor.status === "active"
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}>
                                                        {doctor.status}
                                                    </span>
                                                </div>

                                                <div className="mt-3 space-y-1.5">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Stethoscope className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                                                        <span className="text-xs font-medium truncate">{doctor.specialization}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Phone className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                                                        <span className="text-xs font-medium">{doctor.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Mail className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                                                        <span className="text-xs font-medium truncate">{doctor.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-5 pt-4 border-t border-slate-50 flex items-center gap-3">
                                            <Link href={`/admin/doctors/${doctor.id}`}
                                                className="flex-1 text-center py-2.5 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all">
                                                View Profile
                                            </Link>
                                            <Link href={`/admin/doctors/add?id=${doctor.id}`}
                                                className="flex-1 text-center py-2.5 border border-slate-100 rounded-xl text-[10px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-50 hover:border-blue-200 transition-all">
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}