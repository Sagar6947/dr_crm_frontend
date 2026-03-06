"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Stethoscope, Phone, MapPin, GraduationCap, ChevronLeft, Save, Building2 } from "lucide-react";
import Link from "next/link";
import { doctorService } from "@/lib/api";

export default function AddDoctorPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        experience: "",
        phone: "",
        email: "",
        location: "",
        clinic: "",
        qualification: "",
        status: "Active",
        bio: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await doctorService.add(formData);
            window.location.href = "/admin/doctors";
        } catch (err: any) {
            setError(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Doctor</h1>
                        <p className="text-slate-500 text-sm mt-1">Register a new doctor in the system.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Personal Info */}
                        <div className="lg:col-span-2 medical-card !rounded-3xl space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                    <Stethoscope className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Personal Information</p>
                                    <p className="text-xs text-slate-400">Basic doctor details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Dr. Amit Sharma"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Specialization *</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        required
                                        value={formData.specialization}
                                        onChange={handleChange}
                                        placeholder="e.g. Cardiologist"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Experience (years) *</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        required
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="e.g. 10"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="doctor@email.com"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Location *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        required
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Bhopal, MP"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Qualification</label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={formData.qualification}
                                        onChange={handleChange}
                                        placeholder="e.g. MBBS, MD"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Assign Clinic *</label>
                                    <input
                                        type="text"
                                        name="clinic"
                                        required
                                        value={formData.clinic}
                                        onChange={handleChange}
                                        placeholder="e.g. City Care Hospital"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Bio / Notes</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Short bio or additional notes..."
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Panel */}
                        <div className="space-y-6">
                            <div className="medical-card !rounded-3xl space-y-4">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-400">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Doctor Status</p>
                                        <p className="text-xs text-slate-400">Availability setting</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full !py-4 shadow-xl shadow-teal-900/10 disabled:opacity-60"
                            >
                                <Save className="w-4 h-4" />
                                {loading ? "Saving..." : "Save Doctor"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}