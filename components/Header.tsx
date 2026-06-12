"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeartPulse, Menu, X, Calendar } from "lucide-react";

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass-header py-3" : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* BRAND */}
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/dr-mahesh-clinic-logo.png" alt="Elixa Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
                    <div className="flex flex-col justify-center">
                        <span className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                            Elixa
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                            Homeopathic Healing Hands and House of Hopes
                        </span>
                    </div>
                </Link>

                {/* NAVIGATION - DESKTOP */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-medical-teal transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-medical-teal transition-colors">
                        Our Clinic
                    </Link>
                    <Link href="/services" className="text-sm font-medium text-slate-600 hover:text-medical-teal transition-colors">
                        Services
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-slate-600 hover:text-medical-teal transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* ACTIONS */}
                <div className="flex items-center gap-4">
                    <Link href="/appointment" className="btn-primary hidden sm:flex">
                        Book Appointment <Calendar className="w-4 h-4" />
                    </Link>
                    <Link href="/login" className="btn-secondary hidden sm:block">
                    Login
                    </Link>
                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center gap-8 text-xl font-medium md:hidden">
                    <button className="absolute top-6 right-6 p-4 text-slate-400" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="w-8 h-8" />
                    </button>
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Clinic</Link>
                    <Link href="/services" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    <Link href="/appointment" className="btn-primary mt-4" onClick={() => setIsMobileMenuOpen(false)}>
                        Book Appointment
                    </Link>
                    <button className="btn-secondary" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
