"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Hospital,
    Users,
    Calendar,
    Package,
    CreditCard,
    ArrowLeft,
    ChevronRight,
    Search,
    Bell,
    Settings,
    Clock,
    TrendingUp,
    AlertTriangle,
    Plus,
    Filter,
    Download,
    Eye,
    FileText,
    MoreVertical,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// --- Tabs ---
type TabType = "overview" | "doctors" | "inventory" | "appointments" | "billing";

const TABS: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "doctors", label: "Doctors", icon: Users },
    { id: "inventory", label: "Inventory", icon: Package, count: 3 },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "billing", label: "Billing & Reports", icon: FileText },
];

function LayoutGrid(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
    )
}

export default function ClinicManagePage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Link href="/admin/clinics" className="hover:text-medical-teal transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Clinics Manager
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">Dashboard / Clinics Manager</span>
                    </div>

                    {/* Clinic Name & ID */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-medical-teal shadow-inner">
                                <Hospital className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">City Care Hospital</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Branch ID: CC-01</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative group hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-medical-teal transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Quick search..."
                                    className="bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none transition-all shadow-sm"
                                />
                            </div>
                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-medical-teal transition-all shadow-sm group">
                                <Bell className="w-5 h-5 group-hover:animate-bounce" />
                            </button>
                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-medical-teal transition-all shadow-sm">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 p-1 bg-slate-100/50 rounded-[24px] w-fit border border-slate-200/50">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-[20px] text-xs font-bold transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-white text-medical-teal shadow-xl shadow-teal-900/5 border border-white"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-medical-teal" : "text-slate-400"}`} />
                            {tab.label}
                            {tab.count && (
                                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-medical-teal text-white" : "bg-rose-100 text-rose-500"
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in duration-500">
                    {activeTab === "overview" && <OverviewTab />}
                    {activeTab === "doctors" && <DoctorsTab />}
                    {activeTab === "inventory" && <InventoryTab />}
                    {activeTab === "appointments" && <AppointmentsTab />}
                    {activeTab === "billing" && <BillingTab />}
                </div>
            </div>
        </AdminLayout>
    );
}

// --- Tab Components ---

const OverviewTab = () => {
    const metrics = [
        { label: "Today's Appointments", value: "42", trend: "+12% vs yesterday", icon: Calendar, color: "teal" },
        { label: "Active Doctors", value: "8/12", trend: "Currently clocked in", icon: Users, color: "blue" },
        { label: "Today's Revenue", value: "₹1,25,000", trend: "15 Invoices generated", icon: CreditCard, color: "green" },
        { label: "Inventory Alerts", value: "3", trend: "Items low on stock", icon: AlertTriangle, color: "rose" },
    ];

    const schedule = [
        { patient: "Amit Patel", doctor: "Dr. Anjali Sharma", time: "09:30 AM", status: "Waiting", payment: "Unpaid" },
        { patient: "Priya Singh", doctor: "Dr. Rajesh Verma", time: "10:00 AM", status: "In-progress", payment: "Balance" },
        { patient: "Rahul Roy", doctor: "Dr. Anjali Sharma", time: "10:45 AM", status: "Scheduled", payment: "Paid" },
        { patient: "Sanjay Gupta", doctor: "Dr. Vikram Malhotra", time: "11:30 AM", status: "Completed", payment: "Paid" },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((metric, i) => (
                    <div key={i} className="medical-card !p-6 !rounded-[32px] group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-300 ${metric.color === "teal" ? "bg-teal-50 text-teal-600 group-hover:bg-teal-600" :
                                    metric.color === "blue" ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600" :
                                        metric.color === "green" ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600" :
                                            "bg-rose-50 text-rose-600 group-hover:bg-rose-600"
                                } group-hover:text-white`}>
                                <metric.icon className="w-6 h-6" />
                            </div>
                            {metric.color === "rose" && (
                                <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                            )}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{metric.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{metric.value}</h3>
                            <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wide opacity-60">{metric.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Today's Schedule</h4>
                        <p className="text-xs text-slate-400 font-medium">Real-time update of patient intake and specialist load.</p>
                    </div>
                    <button className="text-[10px] font-bold text-medical-teal uppercase hover:underline tracking-widest">View Calendar</button>
                </div>
                <div className="overflow-x-auto -mx-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-y border-slate-50">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Doctor</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Time</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Payment Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {schedule.map((item, i) => (
                                <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-5 text-sm font-bold text-slate-800">{item.patient}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-600/80">{item.doctor}</td>
                                    <td className="px-8 py-5 text-sm font-black text-slate-900">{item.time}</td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${item.status === "Waiting" ? "bg-orange-50 text-orange-600" :
                                                item.status === "In-progress" ? "bg-blue-50 text-blue-600" :
                                                    item.status === "Scheduled" ? "bg-teal-50 text-teal-600" :
                                                        "bg-emerald-50 text-emerald-600"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${item.payment === "Unpaid" ? "bg-rose-50 text-rose-600" :
                                                item.payment === "Balance" ? "bg-amber-50 text-amber-600" :
                                                    "bg-emerald-50 text-emerald-600"
                                            }`}>
                                            {item.payment}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button className="p-2 text-slate-300 hover:text-medical-teal transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DoctorsTab = () => {
    const doctors = [
        { name: "Dr. Anjali Sharma", specialty: "Cardiologist", status: "Available", time: "09:00 AM - 02:00 PM", days: "Mon, Wed, Fri", initial: "AS" },
        { name: "Dr. Rajesh Verma", specialty: "General Physician", status: "Off Duty", time: "02:00 PM - 08:00 PM", days: "Mon - Sat", initial: "RV" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Assigned Doctors</h4>
                    <p className="text-xs text-slate-400 font-medium">Manage doctors assigned to this branch.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button className="btn-primary !rounded-xl !py-3 !px-6 !text-[10px] !tracking-widest font-black">
                        <Plus className="w-4 h-4" /> Assign Doctor
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doc, i) => (
                    <div key={i} className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 group hover:ring-2 hover:ring-medical-teal/10 transition-all">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-xl font-black text-medical-teal border border-teal-100/50">
                                    {doc.initial}
                                </div>
                                <div>
                                    <h5 className="text-lg font-black text-slate-900 tracking-tight">{doc.name}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.specialty}</p>
                                </div>
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${doc.status === "Available" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                                }`}>
                                {doc.status}
                            </span>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Clock className="w-4 h-4 text-slate-300" />
                                <span className="text-sm font-medium">{doc.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                                <Calendar className="w-4 h-4 text-slate-300" />
                                <span className="text-sm font-medium">{doc.days}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="flex-1 btn-secondary !rounded-2xl !py-4 !text-[10px] !tracking-[0.2em] font-black border-slate-100 bg-slate-50/50">
                                View Schedule
                            </button>
                            <button className="p-4 border border-slate-100 rounded-2xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all">
                                <AlertTriangle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InventoryTab = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                        Branch Inventory
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-teal-50 text-medical-teal px-3 py-1 rounded-full border border-teal-100/50">Independent</span>
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">Manage medicine stock specifically for this clinic.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search medicines..."
                            className="bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button className="btn-primary !rounded-xl !py-3 !px-6 !text-[10px] !tracking-widest font-black">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            <div className="medical-card !p-0 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Medicine Name</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Stock Qty</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Expiry Date</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { name: "Paracetamol 500mg", cat: "Tablet", qty: "15 Strips", expiry: "Dec 2024", status: "Low Stock" }
                            ].map((item, i) => (
                                <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-6 text-sm font-bold text-slate-800">{item.name}</td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-500">{item.cat}</td>
                                    <td className="px-8 py-6 text-sm font-black text-rose-500">{item.qty}</td>
                                    <td className="px-8 py-6 text-sm font-medium text-slate-600">{item.expiry}</td>
                                    <td className="px-8 py-6">
                                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-rose-50 text-rose-500 rounded-lg">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Showing 1-3 of 24 results</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-white transition-all disabled:opacity-50">Previous</button>
                        <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-white transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppointmentsTab = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Daily Doctor Schedule</h4>
                    <p className="text-xs text-slate-400 font-medium">View availability and multi-clinic assignments.</p>
                </div>
                <div className="flex gap-4">
                    <select className="bg-white border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-500 outline-none shadow-sm min-w-[140px]">
                        <option>All Departments</option>
                    </select>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="date"
                            defaultValue="2023-10-01"
                            className="bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-500 outline-none shadow-sm"
                        />
                    </div>
                    <button className="btn-primary !rounded-xl !py-3 !px-6 !text-[10px] !tracking-widest font-black">
                        <Plus className="w-4 h-4" /> Add Shift
                    </button>
                </div>
            </div>

            <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                <div className="flex items-start gap-6 border-l-4 border-medical-teal pl-6">
                    <div className="w-14 h-14 bg-teal-50 rounded-[24px] flex items-center justify-center text-lg font-black text-medical-teal">AS</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h5 className="text-lg font-black text-slate-900 tracking-tight">Dr. Anjali Sharma</h5>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-medical-teal uppercase tracking-widest">Cardiologist</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <Hospital className="w-3 h-3" /> Home Clinic: City Care
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 justify-end">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Available (City Care)
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 rounded-[32px] p-6 border border-slate-100/50 w-fit min-w-[320px]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-slate-900 uppercase">09:00 AM - 12:00 PM</span>
                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-lg">On Duty</span>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <Hospital className="w-5 h-5 text-slate-300" />
                                <div>
                                    <p className="text-sm font-bold text-slate-800">City Care Hospital</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">General OPD & Rounds</p>
                                </div>
                            </div>
                            <button className="w-full btn-primary !rounded-xl !py-3 !text-[9px] font-black">
                                <Plus className="w-3 h-3" /> Assign Patient
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BillingTab = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Billing & Reports</h4>
                    <p className="text-xs text-slate-400 font-medium">Track revenue and invoices.</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 transition-all shadow-sm">
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm">
                        <FileText className="w-4 h-4" /> Excel
                    </button>
                    <button className="btn-primary !rounded-xl !py-3 !px-6 !text-[10px] !tracking-widest font-black">
                        <Plus className="w-4 h-4" /> New Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Total Revenue (This Month)", value: "₹45,23,100", trend: "+8.2% Growth", icon: CreditCard, color: "teal" },
                    { label: "Pending Payments", value: "₹12,500", trend: "From 4 Invoices", icon: Clock, color: "rose" },
                    { label: "Average Per Patient", value: "₹850", trend: "Analytics Insight", icon: TrendingUp, color: "blue" },
                ].map((stat, i) => (
                    <div key={i} className="medical-card !p-8 !rounded-[40px] bg-slate-900 border-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                        <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                        <p className={`text-[10px] font-black mt-4 uppercase tracking-wider flex items-center gap-1 ${stat.color === "teal" ? "text-emerald-400" : stat.color === "rose" ? "text-rose-400" : "text-blue-400"
                            }`}>
                            <TrendingUp className="w-3 h-3" /> {stat.trend}
                        </p>
                    </div>
                ))}
            </div>

            <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Recent Invoices</h4>
                    <div className="flex gap-4">
                        <select className="bg-slate-50 border border-slate-100 rounded-xl py-2 px-4 text-[10px] font-bold text-slate-500 outline-none">
                            <option>All Status</option>
                        </select>
                        <input type="text" placeholder="dd/mm/yyyy" className="bg-slate-50 border border-slate-100 rounded-xl py-2 px-4 text-[10px] font-bold text-slate-500 outline-none w-32" />
                    </div>
                </div>
                <div className="overflow-x-auto -mx-8">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-y border-slate-50">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Invoice ID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Patient</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Amount</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[
                                { id: "INV-00234", patient: "Amit Patel", date: "Oct 01, 2023", amount: "₹1,500.00", status: "Paid" },
                                { id: "INV-00235", patient: "Priya Singh", date: "Oct 01, 2023", amount: "₹750.00", status: "Pending" },
                            ].map((inv, i) => (
                                <tr key={i} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-5 text-sm font-black text-medical-teal">{inv.id}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-800">{inv.patient}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-500">{inv.date}</td>
                                    <td className="px-8 py-5 text-sm font-black text-slate-900">{inv.amount}</td>
                                    <td className="px-8 py-5">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${inv.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-slate-300 hover:text-medical-teal transition-colors flex items-center gap-1 group/act">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
