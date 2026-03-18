"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Hospital,
    MapPin,
    Phone,
    Clock,
    Settings,
    Edit2,
    UserPlus,
    ArrowLeft,
    ExternalLink,
    Mail,
    Smartphone,
    MessageCircle,
    Database,
    MonitorSmartphone,
    Users,
    Check,
    Stethoscope,
    Plus,
    ChevronRight,
    CalendarCheck,
    Server,
    Sliders,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { toast } from "sonner";
import { clinicService } from "@/lib/api";

export default function ClinicProfilePage() {
    const params = useParams();
    const id = params.id as string;

    const [clinicData, setClinicData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchClinic = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const response = await clinicService.getById(id);
                if (response.status === 200) {
                    setClinicData(response.data);
                } else {
                    toast.error(response.message || "Failed to fetch clinic details");
                }
            } catch (error: any) {
                toast.error(error.message || "Error connecting to server");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };



        fetchClinic();
    }, [id]);

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-medical-teal animate-bounce">
                        <Hospital className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Synchronizing...
                    </p>
                </div>
            </AdminLayout>
        );
    }

    if (!clinicData) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Node not found in global matrix.</p>
                    <Link href="/admin/clinics" className="btn-secondary !text-[10px] uppercase font-black tracking-widest !py-3 !px-8">
                        Return to Hub
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    // Display helpers
    const statusText = clinicData.status == "1" ? "Active" : "Inactive";
    const addressLine1 = clinicData.address_line1 || "N/A";
    const addressLine2 = clinicData.address_line2 || "";
    const cityState = `${clinicData.city}, ${clinicData.state} - ${clinicData.pincode}`;
    const logoUrl = clinicData.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${clinicData.name}&backgroundColor=0d9488`;

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 text-slate-900">
                {/* Navigation Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <Link href="/admin/clinics" className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-medical-teal transition-all">
                            <ArrowLeft className="w-3 h-3" /> Back to Clinic List
                        </Link>
                        <div className="flex items-center gap-2 text-3xl font-black tracking-tighter">
                            <Hospital className="w-8 h-8 text-medical-teal" />
                            <span>Clinic Profile View</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="btn-secondary !py-3 !px-6 !text-[10px] font-black tracking-widest flex items-center gap-2">
                            <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                        </button>
                        <button className="btn-primary !py-3 !px-8 !text-[10px] font-black tracking-widest flex items-center gap-2 shadow-xl shadow-teal-900/10">
                            <UserPlus className="w-3.5 h-3.5" /> Assign Staff
                        </button>
                    </div>
                </div>

                {/* Identity Card */}
                <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl -z-10" />

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                        <div className="w-32 h-32 rounded-[32px] bg-white border-2 border-slate-100 flex items-center justify-center flex-shrink-0 shadow-xl shadow-slate-200/50 group relative overflow-hidden">
                            <img src={logoUrl} alt="Clinic Logo" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                            <div className="absolute inset-0 bg-medical-teal/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex-1 w-full flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                <div>
                                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight uppercase">{clinicData.name}</h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100/50 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">
                                            Code: {clinicData.clinic_code}
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Reg: {clinicData.registration_no || "UNREGISTERED"}
                                        </span>
                                    </div>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${statusText === "Active"
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-400/20"
                                    : "bg-slate-100 text-slate-500 border-slate-200"
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${statusText === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                    {statusText}
                                </div>
                            </div>

                            {/* Quick Stats Chips */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                                {[
                                    { icon: Users, text: `${clinicData.max_doctors || 0} Doctors Capacity`, bg: "bg-teal-50/50", textCol: "text-teal-700" },
                                    { icon: MonitorSmartphone, text: clinicData.online_protocol == "1" ? "Omni-Channel" : "Physical Only", bg: "bg-blue-50/50", textCol: "text-blue-700" },
                                    { icon: Database, text: clinicData.inventory_independence == "1" ? "Independent Inventory" : "HQ Linked", bg: "bg-amber-50/50", textCol: "text-amber-700" }
                                ].map((stat, i) => (
                                    <div key={i} className={`px-4 py-2 rounded-[18px] border border-slate-100 ${stat.bg} flex items-center gap-2.5 shadow-sm transition-all hover:scale-105 cursor-default`}>
                                        <stat.icon className={`w-4 h-4 ${stat.textCol}`} />
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${stat.textCol}`}>{stat.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Location & Contact Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Address Card */}
                        <div className="medical-card !p-0 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-medical-teal/10 rounded-[14px] text-medical-teal shadow-inner">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                        Global Coordinates & Matrix
                                    </h3>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                        Physical Node Address
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-base font-black text-slate-800 tracking-tight leading-snug">
                                            {addressLine1}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500 italic">{addressLine2}</p>
                                        <div className="pt-3 flex flex-col gap-1">
                                            <p className="text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                {cityState}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                            Tele-Operational Hubs
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 transition-colors shadow-sm">
                                                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800">{clinicData.primary_phone || "N/A"}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Primary Line</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 transition-colors shadow-sm">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Smartphone className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800">{clinicData.alternate_phone || "UNSET"}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Backup Uplink</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                            Digital Communication
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl hover:border-emerald-300 transition-colors shadow-sm">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <MessageCircle className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-emerald-700">{clinicData.whatsapp_no || clinicData.primary_phone || "N/A"}</p>
                                                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">WhatsApp</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 transition-colors shadow-sm">
                                                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800">{clinicData.email || "N/A"}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Dispatch</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Operational Config */}
                        <div className="medical-card !p-0 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-500/10 rounded-[14px] text-blue-600 shadow-inner">
                                        <Sliders className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                        Operational Framework & Directives
                                    </h3>
                                </div>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Hours */}
                                <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        Temporal Cycles
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Operating Days", val: clinicData.operating_days || "N/A", col: "text-slate-900" },
                                            { label: "Opening Cycle", val: clinicData.opening_time || "N/A", col: "text-emerald-600" },
                                            { label: "Closing Cycle", val: clinicData.closing_time || "N/A", col: "text-rose-500" },
                                            { label: "Break Interval", val: clinicData.break_time || "N/A", col: "text-amber-600" }
                                        ].map((row, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.label}</span>
                                                <span className={`text-sm font-black tracking-tight ${row.col}`}>{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Appointment Rules */}
                                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                                    <h4 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <CalendarCheck className="w-4 h-4 text-emerald-500" />
                                        Protocol Constraints
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Slot Duration", val: `${clinicData.slot_duration} Mins` },
                                            { label: "Max Throughput", val: `${clinicData.max_patients} Patients` },
                                            { label: "Unit Capacity", val: `${clinicData.max_doctors} Doctors` }
                                        ].map((row, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 text-sm">
                                                <span className="text-slate-500 font-medium">{row.label}</span>
                                                <span className="font-black text-slate-800 tracking-tight">{row.val}</span>
                                            </div>
                                        ))}
                                        <div className="flex gap-2 pt-4">
                                            {clinicData.online_protocol == "1" && (
                                                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                    Online Protocol: ACTIVE
                                                </span>
                                            )}
                                            {clinicData.offline_protocol == "1" && (
                                                <span className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                    Offline Protocol: ACTIVE
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System & Independence Settings */}
                    <div className="space-y-8">
                        <div className="medical-card !p-0 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 overflow-hidden h-full">
                            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-500/10 rounded-[14px] text-indigo-600 shadow-inner">
                                    <Server className="w-5 h-5" />
                                </div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                    Autonomy Protocols
                                </h3>
                            </div>
                            <div className="p-8 space-y-6">
                                {[
                                    { key: "Inventory Management", status: clinicData.inventory_independence == "1", desc: "Stock is managed separately from HQ." },
                                    { key: "Billing Independence", status: clinicData.billing_independence == "1", desc: "Generates unique invoice sequence." },
                                    { key: "Report Autonomy", status: clinicData.report_independence == "1", desc: "Patient records are specific to this branch." }
                                ].map((config, i) => (
                                    <div key={i} className={`flex items-start gap-4 p-4 rounded-3xl border transition-colors group ${config.status ? "bg-emerald-50/30 border-emerald-100" : "bg-slate-50/50 border-slate-100"}`}>
                                        <div className={`p-2 rounded-xl mt-0.5 shadow-sm group-hover:scale-110 transition-transform ${config.status ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"}`}>
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className={`text-sm font-black tracking-tight leading-tight uppercase ${config.status ? "text-emerald-700" : "text-slate-500"}`}>
                                                {config.key}
                                            </p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1">
                                                {config.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/20 text-center">
                                <button className="text-[10px] font-black text-medical-teal uppercase tracking-[0.2em] hover:tracking-[0.3em] transition-all flex items-center justify-center gap-2 mx-auto">
                                    Reconfigure Protocol <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
