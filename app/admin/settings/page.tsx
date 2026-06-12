"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { settingsService } from "@/lib/api";
import {
    Settings, User, Bell, Shield, Palette,
    Building2, ChevronRight, Save, Camera,
    Moon, Sun, Globe, Lock, Mail, Phone,
    ToggleLeft, ToggleRight, CreditCard, Loader2, Eye, EyeOff
} from "lucide-react";

type SettingTab = "profile" | "clinic" | "notifications" | "security" | "appearance" | "payment";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingTab>("profile");
    const [saved, setSaved] = useState(false);
    const [loadingPayment, setLoadingPayment] = useState(false);
    const [showKeys, setShowKeys] = useState({ testId: false, testSecret: false, liveId: false, liveSecret: false });

    const [profile, setProfile] = useState({
        name: "Dr. Amit Patel",
        email: "amit@drcrm.com",
        phone: "+91 98765 43210",
        role: "Chief Admin",
        location: "Bhopal, MP",
        bio: "Chief Administrator managing all clinical operations across branches.",
    });

    const [clinicInfo, setClinicInfo] = useState({
        portalName: "DR. CRM",
        tagline: "PORTAL V1.0",
        contactEmail: "info@drcrm.com",
        contactPhone: "+91 99999 00000",
        address: "Bhopal, Madhya Pradesh, India",
        timezone: "Asia/Kolkata",
        currency: "INR",
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        smsAlerts: false,
        newPatient: true,
        appointmentReminder: true,
        lowStock: true,
        billingAlert: true,
        systemUpdates: false,
    });

    const [appearance, setAppearance] = useState({
        theme: "light",
        language: "English",
        dateFormat: "DD MMM YYYY",
    });

    const [paymentSettings, setPaymentSettings] = useState({
        razorpay_mode: "test",
        razorpay_test_key_id: "",
        razorpay_test_key_secret: "",
        razorpay_live_key_id: "",
        razorpay_live_key_secret: ""
    });

    useEffect(() => {
        setLoadingPayment(true);
        settingsService.getSettings()
            .then((res: any) => {
                if (res.data) {
                    setPaymentSettings(prev => ({ ...prev, ...res.data }));
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingPayment(false));
    }, []);

    const handleSave = () => {
        if (activeTab === "payment") {
            setSaved(false);
            settingsService.updateSettings(paymentSettings)
                .then(() => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2500);
                })
                .catch(err => console.error(err));
            return;
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const tabs: { key: SettingTab; label: string; icon: any }[] = [
        { key: "profile", label: "Profile", icon: User },
        { key: "clinic", label: "Clinic Info", icon: Building2 },
        { key: "notifications", label: "Notifications", icon: Bell },
        { key: "security", label: "Security", icon: Shield },
        { key: "payment", label: "Payment Gateway", icon: CreditCard },
        { key: "appearance", label: "Appearance", icon: Palette },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your account and portal preferences.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="medical-card !rounded-3xl !p-3 space-y-1 h-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.key
                                    ? "bg-medical-teal text-white shadow-lg shadow-teal-200"
                                    : "text-slate-500 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </div>
                                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.key ? "rotate-90" : ""}`} />
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* ── PROFILE ── */}
                        {activeTab === "profile" && (
                            <div className="medical-card !rounded-3xl space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Profile Settings</p>
                                        <p className="text-xs text-slate-400">Update your personal information</p>
                                    </div>
                                </div>

                                {/* Avatar */}
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-medical-teal text-2xl font-bold border-2 border-teal-100">
                                            AP
                                        </div>
                                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-medical-teal rounded-full flex items-center justify-center text-white shadow-lg">
                                            <Camera className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{profile.name}</p>
                                        <p className="text-xs text-slate-400">{profile.role}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Name</label>
                                        <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Role</label>
                                        <input type="text" value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Email</label>
                                        <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Phone</label>
                                        <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Location</label>
                                        <input type="text" value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Bio</label>
                                        <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none resize-none" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── CLINIC INFO ── */}
                        {activeTab === "clinic" && (
                            <div className="medical-card !rounded-3xl space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Clinic / Portal Info</p>
                                        <p className="text-xs text-slate-400">Update portal and clinic details</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Portal Name</label>
                                        <input type="text" value={clinicInfo.portalName} onChange={e => setClinicInfo({ ...clinicInfo, portalName: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Tagline</label>
                                        <input type="text" value={clinicInfo.tagline} onChange={e => setClinicInfo({ ...clinicInfo, tagline: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Contact Email</label>
                                        <input type="email" value={clinicInfo.contactEmail} onChange={e => setClinicInfo({ ...clinicInfo, contactEmail: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Contact Phone</label>
                                        <input type="tel" value={clinicInfo.contactPhone} onChange={e => setClinicInfo({ ...clinicInfo, contactPhone: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Address</label>
                                        <input type="text" value={clinicInfo.address} onChange={e => setClinicInfo({ ...clinicInfo, address: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Timezone</label>
                                        <select value={clinicInfo.timezone} onChange={e => setClinicInfo({ ...clinicInfo, timezone: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none">
                                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                            <option value="America/New_York">America/New_York (EST)</option>
                                            <option value="Europe/London">Europe/London (GMT)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Currency</label>
                                        <select value={clinicInfo.currency} onChange={e => setClinicInfo({ ...clinicInfo, currency: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none">
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── NOTIFICATIONS ── */}
                        {activeTab === "notifications" && (
                            <div className="medical-card !rounded-3xl space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Notification Settings</p>
                                        <p className="text-xs text-slate-400">Control what alerts you receive</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    {[
                                        { key: "emailAlerts", label: "Email Alerts", desc: "Receive alerts via email", icon: Mail },
                                        { key: "smsAlerts", label: "SMS Alerts", desc: "Receive alerts via SMS", icon: Phone },
                                        { key: "newPatient", label: "New Patient", desc: "When a new patient registers", icon: User },
                                        { key: "appointmentReminder", label: "Appointment Reminder", desc: "Before scheduled appointments", icon: Bell },
                                        { key: "lowStock", label: "Low Stock Alert", desc: "When medicine stock is low", icon: Bell },
                                        { key: "billingAlert", label: "Billing Alert", desc: "New bills and pending payments", icon: Bell },
                                        { key: "systemUpdates", label: "System Updates", desc: "Portal updates and announcements", icon: Settings },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-400">
                                                    <item.icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-700">{item.label}</p>
                                                    <p className="text-xs text-slate-400">{item.desc}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                                className={`transition-colors ${notifications[item.key as keyof typeof notifications] ? "text-medical-teal" : "text-slate-300"}`}
                                            >
                                                {notifications[item.key as keyof typeof notifications]
                                                    ? <ToggleRight className="w-8 h-8" />
                                                    : <ToggleLeft className="w-8 h-8" />
                                                }
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── SECURITY ── */}
                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <div className="medical-card !rounded-3xl space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                        <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Change Password</p>
                                            <p className="text-xs text-slate-400">Update your login password</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Confirm New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="medical-card !rounded-3xl border border-red-100 space-y-4">
                                    <p className="text-sm font-bold text-red-500 pb-4 border-b border-red-50">Danger Zone</p>
                                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Delete Account</p>
                                            <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
                                        </div>
                                        <button className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── PAYMENT GATEWAY ── */}
                        {activeTab === "payment" && (
                            <div className="medical-card !rounded-3xl space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Payment Gateway</p>
                                        <p className="text-xs text-slate-400">Manage Razorpay API Keys and Environment Mode</p>
                                    </div>
                                </div>

                                {loadingPayment ? (
                                    <div className="flex justify-center p-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-medical-teal" />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm">Gateway Mode</h4>
                                                <p className="text-xs text-slate-500 mt-1">Toggle between Test and Live processing</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentSettings(p => ({ ...p, razorpay_mode: p.razorpay_mode === 'live' ? 'test' : 'live' }))}
                                                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${paymentSettings.razorpay_mode === 'live' ? 'bg-medical-teal' : 'bg-slate-300'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${paymentSettings.razorpay_mode === 'live' ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${paymentSettings.razorpay_mode === 'live' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                                    {paymentSettings.razorpay_mode} mode
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                            {/* Test Keys */}
                                            <div className="space-y-4">
                                                <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-amber-500" />
                                                    Test Environment
                                                </h4>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Test Key ID</label>
                                                    <div className="relative group">
                                                        <input
                                                            type={showKeys.testId ? "text" : "password"}
                                                            value={paymentSettings.razorpay_test_key_id}
                                                            onChange={e => setPaymentSettings({ ...paymentSettings, razorpay_test_key_id: e.target.value })}
                                                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowKeys({ ...showKeys, testId: !showKeys.testId })}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                        >
                                                            {showKeys.testId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Test Key Secret</label>
                                                    <div className="relative group">
                                                        <input
                                                            type={showKeys.testSecret ? "text" : "password"}
                                                            value={paymentSettings.razorpay_test_key_secret}
                                                            onChange={e => setPaymentSettings({ ...paymentSettings, razorpay_test_key_secret: e.target.value })}
                                                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowKeys({ ...showKeys, testSecret: !showKeys.testSecret })}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                        >
                                                            {showKeys.testSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Live Keys */}
                                            <div className="space-y-4">
                                                <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-emerald-500" />
                                                    Live Environment
                                                </h4>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Live Key ID</label>
                                                    <div className="relative group">
                                                        <input
                                                            type={showKeys.liveId ? "text" : "password"}
                                                            value={paymentSettings.razorpay_live_key_id}
                                                            onChange={e => setPaymentSettings({ ...paymentSettings, razorpay_live_key_id: e.target.value })}
                                                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowKeys({ ...showKeys, liveId: !showKeys.liveId })}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                        >
                                                            {showKeys.liveId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Live Key Secret</label>
                                                    <div className="relative group">
                                                        <input
                                                            type={showKeys.liveSecret ? "text" : "password"}
                                                            value={paymentSettings.razorpay_live_key_secret}
                                                            onChange={e => setPaymentSettings({ ...paymentSettings, razorpay_live_key_secret: e.target.value })}
                                                            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowKeys({ ...showKeys, liveSecret: !showKeys.liveSecret })}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                                        >
                                                            {showKeys.liveSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── APPEARANCE ── */}
                        {activeTab === "appearance" && (
                            <div className="medical-card !rounded-3xl space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                    <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                        <Palette className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Appearance</p>
                                        <p className="text-xs text-slate-400">Theme, language and display settings</p>
                                    </div>
                                </div>

                                {/* Theme Toggle */}
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Theme</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["light", "dark"].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setAppearance({ ...appearance, theme: t })}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${appearance.theme === t ? "border-medical-teal bg-teal-50" : "border-slate-100 bg-slate-50"}`}
                                            >
                                                {t === "light" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-500" />}
                                                <span className={`text-sm font-bold ${appearance.theme === t ? "text-medical-teal" : "text-slate-500"}`}>
                                                    {t.charAt(0).toUpperCase() + t.slice(1)} Mode
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Language</label>
                                        <select value={appearance.language} onChange={e => setAppearance({ ...appearance, language: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none">
                                            <option value="English">English</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Gujarati">Gujarati</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Date Format</label>
                                        <select value={appearance.dateFormat} onChange={e => setAppearance({ ...appearance, dateFormat: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none">
                                            <option value="DD MMM YYYY">DD MMM YYYY (12 Jan 2024)</option>
                                            <option value="MM/DD/YYYY">MM/DD/YYYY (01/12/2024)</option>
                                            <option value="YYYY-MM-DD">YYYY-MM-DD (2024-01-12)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        {activeTab !== "security" && (
                            <button
                                onClick={handleSave}
                                className="btn-primary w-full !py-4 shadow-xl shadow-teal-900/10"
                            >
                                <Save className="w-4 h-4" />
                                {saved ? "Saved! ✓" : "Save Changes"}
                            </button>
                        )}

                        {activeTab === "security" && (
                            <button
                                onClick={handleSave}
                                className="btn-primary w-full !py-4 shadow-xl shadow-teal-900/10"
                            >
                                <Save className="w-4 h-4" />
                                {saved ? "Password Updated! ✓" : "Update Password"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}