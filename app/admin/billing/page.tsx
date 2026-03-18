"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Receipt, Plus, Search, ChevronLeft, ChevronRight,
    Filter, Download, Eye, ExternalLink,
    IndianRupee, CheckCircle2, Clock, XCircle,
} from "lucide-react";
import Link from "next/link";

interface Bill {
    id: string;
    billNumber: string;
    patientName: string;
    patientCode: string;
    clinic: string;
    amount: number;
    paid: number;
    status: "Paid" | "Pending" | "Cancelled";
    billedOn: string;
}

const INITIAL_BILLS: Bill[] = [
    { id: "1", billNumber: "BILL-0001", patientName: "Rahul Sharma", patientCode: "PT-001", clinic: "City Care Hospital", amount: 1500, paid: 1500, status: "Paid", billedOn: "12 Jan 2024" },
    { id: "2", billNumber: "BILL-0002", patientName: "Priya Verma", patientCode: "PT-002", clinic: "Sunshine Pediatric", amount: 800, paid: 0, status: "Pending", billedOn: "05 Feb 2024" },
    { id: "3", billNumber: "BILL-0003", patientName: "Amit Patel", patientCode: "PT-003", clinic: "Modern Dental Clinic", amount: 2200, paid: 2200, status: "Paid", billedOn: "20 Mar 2024" },
    { id: "4", billNumber: "BILL-0004", patientName: "Sunita Joshi", patientCode: "PT-004", clinic: "Riverside Wellness", amount: 3500, paid: 1000, status: "Pending", billedOn: "01 Apr 2024" },
    { id: "5", billNumber: "BILL-0005", patientName: "Rohit Kumar", patientCode: "PT-005", clinic: "City Care Hospital", amount: 600, paid: 0, status: "Cancelled", billedOn: "10 Apr 2024" },
];

const statusStyles: Record<string, string> = {
    "Paid": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "Pending": "bg-amber-50 text-amber-600 border-amber-100",
    "Cancelled": "bg-red-50 text-red-500 border-red-100",
};
const statusDot: Record<string, string> = {
    "Paid": "bg-emerald-500",
    "Pending": "bg-amber-500",
    "Cancelled": "bg-red-500",
};
const statusIcon: Record<string, any> = {
    "Paid": CheckCircle2,
    "Pending": Clock,
    "Cancelled": XCircle,
};

export default function BillingManager() {
    const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBills = bills.filter(b =>
        b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.clinic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRevenue = bills.filter(b => b.status === "Paid").reduce((sum, b) => sum + b.paid, 0);
    const totalPending = bills.filter(b => b.status === "Pending").reduce((sum, b) => sum + b.amount, 0);

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage patient bills and payment records.</p>
                    </div>
                    <Link href="/admin/billing/add" className="btn-primary !py-4 !px-8 shadow-xl shadow-teal-900/10">
                        <Plus className="w-4 h-4" /> Create Bill
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-medical-teal", bg: "bg-teal-50" },
                        { label: "Pending Amount", value: `₹${totalPending.toLocaleString()}`, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                        { label: "Total Bills", value: bills.length, icon: Receipt, color: "text-slate-500", bg: "bg-slate-50" },
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

                {/* Search */}
                <div className="medical-card !p-4 !rounded-3xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search by patient name, bill number or clinic..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors"><Filter className="w-4 h-4" /></button>
                        <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-colors"><Download className="w-4 h-4" /></button>
                    </div>
                </div>

                {/* Table */}
                <div className="medical-card !p-0 !rounded-[40px] overflow-hidden border-slate-100/50 shadow-2xl shadow-slate-200/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Bill</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Patient</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Clinic</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Billed On</th>
                                    <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBills.map((bill) => {
                                    const StatusIcon = statusIcon[bill.status];
                                    return (
                                        <tr key={bill.id} className="group hover:bg-slate-50/30 transition-colors">
                                            {/* Bill */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-medical-teal group-hover:bg-medical-teal group-hover:text-white transition-all duration-300 shadow-sm">
                                                        <Receipt className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{bill.billNumber}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bill.billedOn}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Patient */}
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-800">{bill.patientName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bill.patientCode}</p>
                                            </td>

                                            {/* Clinic */}
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-medium text-slate-600">{bill.clinic}</p>
                                            </td>

                                            {/* Amount */}
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-800">₹{bill.amount.toLocaleString()}</p>
                                                {bill.status === "Pending" && bill.paid > 0 && (
                                                    <p className="text-[9px] font-bold text-amber-500 mt-0.5">Paid: ₹{bill.paid}</p>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusStyles[bill.status]}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${statusDot[bill.status]}`} />
                                                    {bill.status}
                                                </span>
                                            </td>

                                            {/* Billed On */}
                                            <td className="px-8 py-6 text-sm font-medium text-slate-600">{bill.billedOn}</td>

                                            {/* Actions */}
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/billing/${bill.id}`} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn">
                                                        View <Eye className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                                                    </Link>
                                                    <Link href={`/admin/billing/${bill.id}/manage`} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:border-medical-teal hover:text-medical-teal hover:bg-teal-50/30 transition-all group/btn">
                                                        Manage <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-8 py-6 bg-slate-50/50 flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-400">Showing {filteredBills.length} of {bills.length} bills</p>
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