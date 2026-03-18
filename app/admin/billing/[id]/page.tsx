"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Receipt, ChevronLeft, User, Building2,
    Calendar, IndianRupee, CheckCircle2, Clock, XCircle, Activity
} from "lucide-react";
import Link from "next/link";

export default function BillDetailPage({ params }: { params: { id: string } }) {
    const [bill, setBill] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // await billingService.getById(params.id) // Uncomment when backend ready
        setTimeout(() => {
            setBill({
                id: params.id,
                billNumber: "BILL-0001",
                patientName: "Rahul Sharma",
                patientCode: "PT-001",
                clinic: "City Care Hospital",
                amount: 1500,
                paid: 1500,
                status: "Paid",
                billedOn: "12 Jan 2024",
                description: "Consultation charges, blood sugar test, insulin prescription.",
            });
            setLoading(false);
        }, 300);
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

    if (!bill) return null;

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

    const balance = bill.amount - bill.paid;

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/billing" className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{bill.billNumber}</h1>
                        <p className="text-slate-500 text-sm mt-1">{bill.patientName} • Bill Detail</p>
                    </div>
                    <span className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusStyles[bill.status]}`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${statusDot[bill.status]}`} />
                        {bill.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="medical-card !rounded-3xl">
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-50">
                                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                    <Receipt className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-slate-800">{bill.billNumber}</p>
                                    <p className="text-sm text-slate-400">Billed on {bill.billedOn}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">{bill.patientName}</p>
                                        <p className="text-[10px] text-slate-400">{bill.patientCode}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinic</p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">{bill.clinic}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billed On</p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">{bill.billedOn}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-0.5">
                                        <IndianRupee className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                                        <p className="text-sm font-medium text-slate-700 mt-0.5">₹{bill.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        {bill.description && (
                            <div className="medical-card !rounded-3xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Services / Description</p>
                                <p className="text-sm text-slate-600 leading-relaxed">{bill.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Right - Payment Summary */}
                    <div className="space-y-4">
                        <div className="medical-card !rounded-3xl space-y-4">
                            <p className="text-sm font-bold text-slate-800 pb-4 border-b border-slate-50">Payment Summary</p>
                            <div className="space-y-3">
                                <div className="bg-slate-50 rounded-2xl px-4 py-3 flex justify-between items-center">
                                    <p className="text-xs text-slate-400 font-medium">Total</p>
                                    <p className="text-sm font-bold text-slate-800">₹{bill.amount.toLocaleString()}</p>
                                </div>
                                <div className="bg-emerald-50 rounded-2xl px-4 py-3 flex justify-between items-center">
                                    <p className="text-xs text-emerald-600 font-medium">Paid</p>
                                    <p className="text-sm font-bold text-emerald-600">₹{bill.paid.toLocaleString()}</p>
                                </div>
                                <div className={`rounded-2xl px-4 py-3 flex justify-between items-center ${balance > 0 ? "bg-amber-50" : "bg-emerald-50"}`}>
                                    <p className={`text-xs font-medium ${balance > 0 ? "text-amber-600" : "text-emerald-600"}`}>Balance Due</p>
                                    <p className={`text-sm font-bold ${balance > 0 ? "text-amber-600" : "text-emerald-600"}`}>₹{balance.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/admin/billing/${bill.id}/manage`}
                            className="btn-primary w-full !py-4 shadow-xl shadow-teal-900/10 flex items-center justify-center gap-2"
                        >
                            <Activity className="w-4 h-4" /> Manage Bill
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}