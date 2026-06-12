"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Hospital,
    UserRound,
    CalendarCheck,
    Users,
    Package,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Search,
    Bell,
    HeartPulse
} from "lucide-react";

interface SidebarItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
    active?: boolean;
}

const SidebarItem = ({ href, icon: Icon, label, active }: SidebarItemProps) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? "bg-medical-teal text-white shadow-lg shadow-teal-100"
                : "text-slate-500 hover:bg-teal-50 hover:text-medical-teal"
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400 group-hover:text-medical-teal"}`} />
        <span className="text-sm font-semibold">{label}</span>
    </Link>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
     const router = useRouter();

    const navigation = [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "Clinics", href: "/admin/clinics", icon: Hospital },
        { label: "Doctors", href: "/admin/doctors", icon: UserRound },
        { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
        { label: "Patients", href: "/admin/patients", icon: Users },
        { label: "Medicine Stock", href: "/admin/medicine-stock", icon: Package },
        { label: "Billing", href: "/admin/billing", icon: CreditCard },
    ];
    const handleLogout = () => {
    // token delete
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // redirect login
    // router.push("/login");
    router.replace("/login");
};

    return (
        <div className="min-h-screen bg-medical-slate-bg font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-50 h-full bg-white border-r border-slate-100 transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"
                    }`}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                            <img src="/dr-mahesh-clinic-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <span className="text-xl font-black text-slate-900 tracking-tight leading-none block whitespace-nowrap uppercase">
                                    Elixa
                                </span>
                                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest block whitespace-normal mt-1 leading-tight">
                                    Homeopathic Healing Hands<br/>and House of Hopes
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navigation.map((item) => (
                            <SidebarItem
                                key={item.href}
                                href={item.href}
                                icon={item.icon}
                                label={isSidebarOpen ? item.label : ""}
                                active={pathname === item.href}
                            />
                        ))}
                    </nav>

                    {/* Footer Navigation */}
                    <div className="pt-4 border-t border-slate-50 space-y-1">
                        <SidebarItem
                            href="/admin/settings"
                            icon={Settings}
                            label={isSidebarOpen ? "Settings" : ""}
                            active={pathname === "/admin/settings"}
                        />
                        <button
    onClick={handleLogout}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
>
                            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600" />
                            {isSidebarOpen && <span className="text-sm font-semibold">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main
                className={`transition-all duration-300 min-h-screen flex flex-col ${isSidebarOpen ? "pl-64" : "pl-20"
                    }`}
            >
                {/* Header */}
                <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-md border-bottom border-slate-100 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-medical-teal transition-colors" />
                            <input
                                type="text"
                                placeholder="Search analytics, records..."
                                className="bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 w-64 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="h-8 w-[1px] bg-slate-100" />

                        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-800 leading-none mb-1">Dr. Amit Patel</p>
                                <span className="text-[9px] font-bold text-medical-teal uppercase tracking-widest leading-none">Chief Admin</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-medical-teal font-bold shadow-sm group-hover:shadow-md transition-all">
                                AP
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Overflow Container */}
                <div className="flex-1 p-8 h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
