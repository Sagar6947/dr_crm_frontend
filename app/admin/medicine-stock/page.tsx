"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Pill,
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    ExternalLink,
    Eye,
    AlertTriangle,
    Package,
    FlaskConical,
} from "lucide-react";
import Link from "next/link";

interface Medicine {
    id: string;
    name: string;
    medicineCode: string;
    category: string;
    manufacturer: string;
    stock: number;
    minStock: number;
    price: number;
    expiryDate: string;
    status: "In Stock" | "Low Stock" | "Out of Stock";
    addedOn: string;
}

const INITIAL_MEDICINES: Medicine[] = [
    { id: "1", name: "Metformin 500mg", medicineCode: "MED-001", category: "Diabetes", manufacturer: "Sun Pharma", stock: 250, minStock: 50, price: 12.5, expiryDate: "Jan 2026", status: "In Stock", addedOn: "12 Jan 2024" },
    { id: "2", name: "Amlodipine 5mg", medicineCode: "MED-002", category: "Cardiology", manufacturer: "Cipla", stock: 30, minStock: 50, price: 8.0, expiryDate: "Mar 2025", status: "Low Stock", addedOn: "05 Feb 2024" },
    { id: "3", name: "Paracetamol 650mg", medicineCode: "MED-003", category: "General", manufacturer: "GSK", stock: 0, minStock: 100, price: 5.0, expiryDate: "Jun 2025", status: "Out of Stock", addedOn: "20 Mar 2024" },
    { id: "4", name: "Azithromycin 500mg", medicineCode: "MED-004", category: "Antibiotic", manufacturer: "Zydus", stock: 180, minStock: 30, price: 45.0, expiryDate: "Dec 2025", status: "In Stock", addedOn: "01 Apr 2024" },
    { id: "5", name: "Atorvastatin 10mg", medicineCode: "MED-005", category: "Cardiology", manufacturer: "Ranbaxy", stock: 15, minStock: 40, price: 22.0, expiryDate: "Sep 2025", status: "Low Stock", addedOn: "15 Apr 2024" },
];

const statusStyles: Record<string, string> = {
    "In Stock": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Low Stock": "bg-amber-50 text-amber-600 border-amber-100",
    "Out of Stock": "bg-red-50 text-red-500 border-red-100",
};

const statusDot: Record<string, string> = {
    "In Stock": "bg-emerald-500",
    "Low Stock": "bg-amber-500",
    "Out of Stock": "bg-red-500",
};

export default function MedicineStockManager() {
    const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.medicineCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const lowStockCount = medicines.filter(m => m.status === "Low Stock" || m.status === "Out of Stock").length;

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medicine Stock</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage inventory and medicine availability.</p>
                    </div>
                    <Link
                        href="/admin/medicine-stock/add"
                        className="btn-primary !py-4 !px-8 shadow-xl shadow-teal-900/10"
                    >
                        <Plus className="w-4 h-4" /> Add Medicine
                    </Link>
                </div>

                {/* Alert Banner */}
                {lowStockCount > 0 && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-sm font-medium text-amber-700">
                            <span className="font-bold">{lowStockCount} medicines</span> are low or out of stock. Please restock soon.
                        </p>
                    </div>
                )}

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Medicines", value: medicines.length, icon: Pill, color: "text-medical-teal", bg: "bg-teal-50" },
                        { label: "Low Stock", value: medicines.filter(m => m.status === "Low Stock").length, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
                        { label: "Out of Stock", value: medicines.filter(m => m.status === "Out of Stock").length, icon: Package, color: "text-red-500", bg: "bg-red-50" },
                    ].map((stat) => (
                        <div key={stat.label} className="medical-card !rounded-3xl flex items-center gap-4">
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="medical-card !p-4 !rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search by name, code, category or manufacturer..."
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
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Medicine</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Stock</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Price</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Expiry</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredMedicines.map((med) => (
                                    <tr key={med.id} className="group hover:bg-slate-50/30 transition-colors">
                                        {/* Medicine Name */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-medical-teal group-hover:bg-medical-teal group-hover:text-white transition-all duration-300 shadow-sm">
                                                    <Pill className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{med.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{med.medicineCode} • {med.manufacturer}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <FlaskConical className="w-4 h-4 text-purple-400" />
                                                <span className="text-sm font-medium text-slate-700">{med.category}</span>
                                            </div>
                                        </td>

                                        {/* Stock */}
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-800">{med.stock} units</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Min: {med.minStock}</p>
                                        </td>

                                        {/* Price */}
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-slate-800">₹{med.price.toFixed(2)}</p>
                                        </td>

                                        {/* Expiry */}
                                        <td className="px-8 py-6 text-sm font-medium text-slate-600">{med.expiryDate}</td>

                                        {/* Status */}
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusStyles[med.status]}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${statusDot[med.status]}`} />
                                                {med.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/medicine-stock/${med.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn"
                                                >
                                                    View <Eye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                                </Link>
                                                <Link
                                                    href={`/admin/medicine-stock/${med.id}/manage`}
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
                        <p className="text-xs font-bold text-slate-400">Showing {filteredMedicines.length} of {medicines.length} medicines</p>
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