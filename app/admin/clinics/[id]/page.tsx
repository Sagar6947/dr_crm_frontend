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
    Sliders
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ClinicProfilePage() {
    const params = useParams();
    const id = params.id;

    // Mock data based on user request fields
    const clinicData = {
        name: "City Care Hospital",
        code: "CC-01",
        regNo: "REG-2024-8892",
        status: "Active",
        logo: "https://via.placeholder.com/150/0d9488/ffffff?text=Logo",
        doctorCount: 3,
        availability: "Online & Offline",
        inventoryStatus: "Independent Inventory",
        address: {
            line1: "Plot No. 45, Sector B, Indrapuri",
            line2: "Near Chetak Bridge",
            cityState: "Bhopal, Madhya Pradesh - 462022",
            country: "India",
            mapLink: "#"
        },
        contact: {
            primary: "+91 98765 43210 (Primary)",
            alternate: "+91 755 2456789 (Alt)",
            whatsApp: "+91 98765 43210 (WhatsApp)",
            email: "info@citycare.com"
        },
        hours: {
            days: "Mon - Sat",
            open: "09:00 AM",
            close: "08:00 PM",
            break: "01:00 PM - 02:00 PM"
        },
        rules: {
            slotDuration: "15 Mins",
            maxPatients: "4 Patients",
            capacity: "5 Doctors Max",
            online: true,
            offline: true
        },
        independence: {
            inventory: { enabled: true, desc: "Stock is managed separately from HQ." },
            billing: { enabled: true, desc: "Generates unique invoice sequence." },
            reports: { enabled: true, desc: "Patient records are specific to this branch." }
        },
        staff: [
            { name: "Dr. Arjun Mehta", specialty: "Cardiologist", seed: "Arjun" },
            { name: "Dr. Rohan Gupta", specialty: "General Physician", seed: "Rohan" },
            { name: "Dr. Anjali Desai", specialty: "Pediatrician", seed: "Anjali" }
        ]
    };

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
                            <img src={clinicData.logo} alt="Clinic Logo" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                            <div className="absolute inset-0 bg-medical-teal/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex-1 w-full flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                                <div>
                                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight uppercase">{clinicData.name}</h2>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100/50 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-widest">
                                            Code: {clinicData.code}
                                        </span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Reg: {clinicData.regNo}
                                        </span>
                                    </div>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${clinicData.status === "Active"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-400/20"
                                        : "bg-slate-100 text-slate-500 border-slate-200"
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full ${clinicData.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                                    {clinicData.status}
                                </div>
                            </div>

                            {/* Quick Stats Chips */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                                {[
                                    { icon: Users, text: `${clinicData.doctorCount} Doctors Assigned`, bg: "bg-teal-50/50", textCol: "text-teal-700" },
                                    { icon: MonitorSmartphone, text: clinicData.availability, bg: "bg-blue-50/50", textCol: "text-blue-700" },
                                    { icon: Database, text: clinicData.inventoryStatus, bg: "bg-amber-50/50", textCol: "text-amber-700" }
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
                                <a href={clinicData.address.mapLink} className="btn-secondary !py-2 !px-4 !text-[9px] font-black tracking-widest flex items-center gap-1.5 !rounded-xl">
                                    <ExternalLink className="w-3 h-3" /> View on Satellite
                                </a>
                            </div>
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                        Physical Node Address
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-base font-black text-slate-800 tracking-tight leading-snug">
                                            {clinicData.address.line1}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500 italic">{clinicData.address.line2}</p>
                                        <div className="pt-3 flex flex-col gap-1">
                                            <p className="text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                {clinicData.address.cityState}
                                            </p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-3 mt-1">
                                                {clinicData.address.country}
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
                                                    <p className="text-xs font-black text-slate-800">{clinicData.contact.primary}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Primary Line</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 transition-colors shadow-sm">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <Smartphone className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800">{clinicData.contact.alternate}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Backup Uplink</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                            Digital Communication Matrix
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl hover:border-emerald-300 transition-colors shadow-sm">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <MessageCircle className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-emerald-700">{clinicData.contact.whatsApp}</p>
                                                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">WhatsApp Node</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:border-teal-200 transition-colors shadow-sm">
                                                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-800">{clinicData.contact.email}</p>
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
                                            { label: "Operating Days", val: clinicData.hours.days, col: "text-slate-900" },
                                            { label: "Opening Cycle", val: clinicData.hours.open, col: "text-emerald-600" },
                                            { label: "Closing Cycle", val: clinicData.hours.close, col: "text-rose-500" },
                                            { label: "Break Interval", val: clinicData.hours.break, col: "text-amber-600" }
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
                                            { label: "Slot Duration", val: clinicData.rules.slotDuration },
                                            { label: "Max Throughput", val: clinicData.rules.maxPatients },
                                            { label: "Unit Capacity", val: clinicData.rules.capacity }
                                        ].map((row, i) => (
                                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 text-sm">
                                                <span className="text-slate-500 font-medium">{row.label}</span>
                                                <span className="font-black text-slate-800 tracking-tight">{row.val}</span>
                                            </div>
                                        ))}
                                        <div className="flex gap-2 pt-4">
                                            {clinicData.rules.online && (
                                                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                    Online Protocol: ACTIVE
                                                </span>
                                            )}
                                            {clinicData.rules.offline && (
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
                                {Object.entries(clinicData.independence).map(([key, config], i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl mt-0.5 shadow-sm group-hover:scale-110 transition-transform">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800 tracking-tight leading-tight uppercase">
                                                {key.replace(/([A-Z])/g, ' $1').trim()}
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

                {/* Assigned Doctors Section */}
                <div className="medical-card !p-0 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-rose-500/10 rounded-[14px] text-rose-500 shadow-inner">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                Assigned Medical Personnel Node View
                            </h3>
                        </div>
                        <button className="text-[10px] font-black text-slate-400 hover:text-medical-teal tracking-widest uppercase flex items-center gap-1.5 transition-colors">
                            View All Matrix <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clinicData.staff.map((doctor, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white border-2 border-slate-50 rounded-[28px] hover:border-medical-teal/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all group duration-500">
                                    <div className="relative">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.seed}`}
                                            className="w-16 h-16 rounded-[22px] bg-slate-100 group-hover:rotate-6 transition-transform duration-500 shadow-inner"
                                            alt={doctor.name}
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
                                    </div>
                                    <div>
                                        <p className="text-base font-black text-slate-800 tracking-tight leading-none group-hover:text-medical-teal transition-colors">{doctor.name}</p>
                                        <div className="flex flex-col gap-1 mt-1.5">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doctor.specialty}</p>
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase w-fit tracking-tighter">
                                                On-Shift Status: Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button className="flex flex-col items-center justify-center gap-3 p-6 border-3 border-dashed border-slate-100 rounded-[28px] hover:border-medical-teal/40 hover:bg-teal-50/20 transition-all group min-h-[112px]">
                                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-medical-teal group-hover:text-white transition-all shadow-inner">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-medical-teal">Manage Global Team</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
