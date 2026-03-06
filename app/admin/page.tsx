"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Users,
    Hospital,
    CreditCard,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Stethoscope
} from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { label: "Active Clinics", value: "12", icon: Hospital, trend: "+2 this month", trendType: "up" },
        { label: "Total Doctors", value: "48", icon: Stethoscope, trend: "+5 this month", trendType: "up" },
        { label: "Total Patients", value: "2,840", icon: Users, trend: "+12.5%", trendType: "up" },
        { label: "Monthly Revenue", value: "$42,500", icon: CreditCard, trend: "-3.2%", trendType: "down" },
    ];

    const recentActivity = [
        { id: 1, action: "New Clinic Registered", target: "City Care Hospital", time: "2 hours ago", status: "completed" },
        { id: 2, action: "Payment Verified", target: "John Doe (Patient ID: CRM-9928)", time: "3 hours ago", status: "completed" },
        { id: 3, action: "New Doctor Onboarded", target: "Dr. Sarah Mitchell", time: "5 hours ago", status: "pending" },
        { id: 4, action: "Stock Alert", target: "Paracetamol (New York Clinic)", time: "6 hours ago", status: "warning" },
    ];

    return (
        <AdminLayout>
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 text-sm mt-1">Welcome back, Chief Admin. Here is what is happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="medical-card p-6 !rounded-[32px] group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal shadow-inner group-hover:bg-medical-teal group-hover:text-white transition-all duration-300">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${stat.trendType === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                                    {stat.trendType === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Chart Placeholder */}
                    <div className="lg:col-span-2 medical-card !p-8 !rounded-[40px] flex flex-col min-h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="font-bold text-slate-900">Revenue Performance</h4>
                                <p className="text-xs text-slate-400">Monthly analytics across all clinic divisions.</p>
                            </div>
                            <button className="text-[10px] font-bold text-medical-teal uppercase hover:underline">Download Report</button>
                        </div>
                        <div className="flex-1 bg-slate-50/50 rounded-[32px] border border-dashed border-slate-200 flex items-center justify-center">
                            <div className="text-center space-y-3 opacity-30">
                                <TrendingUp className="w-12 h-12 mx-auto" />
                                <p className="text-xs font-bold uppercase tracking-widest">Interactive Chart Data</p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="medical-card !p-8 !rounded-[40px] flex flex-col h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="font-bold text-slate-900">Real-time Activity</h4>
                            <Clock className="w-4 h-4 text-slate-300" />
                        </div>
                        <div className="space-y-6">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex gap-4 relative group">
                                    <div className="shrink-0 w-2 h-2 rounded-full mt-1.5 bg-medical-teal relative z-10 shadow-[0_0_10px_rgba(13,148,136,0.5)]" />
                                    {activity.id !== recentActivity.length && (
                                        <div className="absolute left-[3px] top-4 w-[2px] h-10 bg-slate-100" />
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-800 leading-tight">{activity.action}</p>
                                        <p className="text-xs text-slate-500">{activity.target}</p>
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest pt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-secondary w-full justify-center mt-auto !py-4 !rounded-2xl !text-[10px] !tracking-[0.2em] font-black border-slate-100">
                            View All Logs
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
