"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Receipt, ChevronLeft, Save, IndianRupee, User } from "lucide-react";
import Link from "next/link";

export default function AddBillPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "", patientCode: "", clinic: "",
        amount: "", paid: "", status: "Pending",
        description: "", billedOn: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // await billingService.add(formData); // Uncomment when backend ready
        console.log("Bill Data:", formData);
        setTimeout(() => {
            window.location.href = "/admin/billing";
        }, 500);
    };

    const balance = Number(formData.amount || 0) - Number(formData.paid || 0);

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-4">
                    <Link href="/admin/billing" className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Bill</h1>
                        <p className="text-slate-500 text-sm mt-1">Generate a new patient bill.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Patient & Clinic */}
                        <div className="lg:col-span-2 medical-card !rounded-3xl space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Patient & Clinic</p>
                                    <p className="text-xs text-slate-400">Bill details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Patient Name *</label>
                                    <input type="text" name="patientName" required value={formData.patientName} onChange={handleChange} placeholder="e.g. Rahul Sharma" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Patient Code</label>
                                    <input type="text" name="patientCode" value={formData.patientCode} onChange={handleChange} placeholder="e.g. PT-001" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Clinic *</label>
                                    <input type="text" name="clinic" required value={formData.clinic} onChange={handleChange} placeholder="e.g. City Care Hospital" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Total Amount (₹) *</label>
                                    <input type="number" name="amount" required value={formData.amount} onChange={handleChange} placeholder="e.g. 1500" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Amount Paid (₹)</label>
                                    <input type="number" name="paid" value={formData.paid} onChange={handleChange} placeholder="e.g. 500" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Bill Date *</label>
                                    <input type="date" name="billedOn" required value={formData.billedOn} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none">
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Description / Services</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Consultation, medicines, tests..." className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="space-y-6">
                            <div className="medical-card !rounded-3xl space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                        <IndianRupee className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">Bill Summary</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-400 font-medium">Total Amount</p>
                                        <p className="text-sm font-bold text-slate-800">₹{Number(formData.amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs text-slate-400 font-medium">Paid</p>
                                        <p className="text-sm font-bold text-emerald-600">₹{Number(formData.paid || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="border-t border-slate-50 pt-3 flex justify-between items-center">
                                        <p className="text-xs text-slate-400 font-medium">Balance Due</p>
                                        <p className={`text-sm font-bold ${balance > 0 ? "text-amber-500" : "text-emerald-600"}`}>₹{balance.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="btn-primary w-full !py-4 shadow-xl shadow-teal-900/10 disabled:opacity-60">
                                <Save className="w-4 h-4" />
                                {loading ? "Saving..." : "Create Bill"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}