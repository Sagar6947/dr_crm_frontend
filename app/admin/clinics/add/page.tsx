

"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Hospital,
    MapPin,
    Phone,
    Clock,
    Upload,
    ChevronRight,
    ArrowLeft,
    Building2,
    Save,
    Trash2,
    Plus,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { clinicService, geoService } from "@/lib/api";
import { toast } from "sonner";

function AddClinicForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Agar ?id=xxx hai to edit mode, warna add mode
    const clinicId = searchParams.get("id");
    const isEditMode = !!clinicId;

    const [logo, setLogo] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [states, setStates] = useState<{ id: string; state_name: string }[]>([]);
    const [cities, setCities] = useState<{ city_id: string; city_name: string }[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [selectedStateId, setSelectedStateId] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const abortCitiesRef = useRef<AbortController | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        reg_number: "",
        status: "active",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        map_link: "",
        primary_phone: "",
        alternate_phone: "",
        email: "",
        whatsapp_number: "",
        working_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        open_time: "09:00",
        close_time: "18:00",
        break_start: "13:00",
        break_end: "14:00",
    });

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setLogo(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const toggleDay = (day: string) => {
        setFormData(prev => ({
            ...prev,
            working_days: prev.working_days.includes(day)
                ? prev.working_days.filter(d => d !== day)
                : [...prev.working_days, day]
        }));
    };

    // Step 1: Load states
    useEffect(() => {
        const controller = new AbortController();
        const fetchStates = async () => {
            setIsLoadingStates(true);
            try {
                const response = await geoService.getStates(controller.signal);
                setStates(response.data || []);
            } catch (error: any) {
                if (error.name === 'AbortError') return;
                console.error("Failed to fetch states:", error);
            } finally {
                setIsLoadingStates(false);
            }
        };
        fetchStates();
        return () => controller.abort("Component unmounted");
    }, []);

    // Step 2: Agar edit mode hai to states load hone ke baad clinic data fetch karo
    useEffect(() => {
        if (!isEditMode || !clinicId || states.length === 0) return;

        const controller = new AbortController();

        const fetchClinic = async () => {
            setIsLoadingData(true);
            try {
                const response = await clinicService.getById(clinicId, controller.signal);
                if (response.status === 200) {
                    const c = response.data;

                    // if (c.logo) setLogo(c.logo);
                    if (c.logo_path) setLogo(c.logo_path);

                    const workingDaysArray = c.working_days
                        ? c.working_days.split(",").map((d: string) => d.trim())
                        : ["Mon", "Tue", "Wed", "Thu", "Fri"];

                    setFormData({
                        name: c.name || "",
                        reg_number: c.reg_number || "",
                        status: c.status?.toLowerCase() || "active",
                        address_line1: c.address_line1 || "",
                        address_line2: c.address_line2 || "",
                        city: c.city || "",
                        state: c.state || "",
                        pincode: c.pincode || "",
                        country: c.country || "India",
                        map_link: c.map_link || "",
                        primary_phone: c.primary_phone || "",
                        alternate_phone: c.alternate_phone || "",
                        email: c.email || "",
                        whatsapp_number: c.whatsapp_number || "",
                        working_days: workingDaysArray,
                        open_time: c.open_time || "09:00",
                        close_time: c.close_time || "18:00",
                        break_start: c.break_start || "13:00",
                        break_end: c.break_end || "14:00",
                    });

                    // State dropdown match karo
                    if (c.state) {
                        const matchedState = states.find(
                            s => s.state_name.toLowerCase() === c.state.toLowerCase()
                        );
                        if (matchedState) {
                            setSelectedStateId(String(matchedState.id));
                            // Us state ki cities load karo
                            setIsLoadingCities(true);
                            try {
                                const cityRes = await geoService.getCities(String(matchedState.id), controller.signal);
                                setCities(cityRes.data || []);
                            } catch (err: any) {
                                if (err.name !== 'AbortError') console.error("Failed to fetch cities:", err);
                            } finally {
                                setIsLoadingCities(false);
                            }
                        }
                    }
                } else {
                    toast.error(response.message || "Failed to load clinic data");
                    router.push("/admin/clinics");
                }
            } catch (error: any) {
                if (error.name === 'AbortError') return;
                toast.error("Failed to load clinic data");
                router.push("/admin/clinics");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchClinic();
        return () => controller.abort("Component unmounted");
    }, [isEditMode, clinicId, states]);

    const handleStateChange = async (stateId: string) => {
        if (abortCitiesRef.current) abortCitiesRef.current.abort("Cancel previous request");
        const controller = new AbortController();
        abortCitiesRef.current = controller;

        const selectedState = states.find(s => String(s.id) === String(stateId));
        setSelectedStateId(stateId);
        setFormData(prev => ({ ...prev, state: selectedState ? selectedState.state_name : "", city: "" }));
        setCities([]);

        if (stateId) {
            setIsLoadingCities(true);
            try {
                const response = await geoService.getCities(stateId, controller.signal);
                setCities(response.data || []);
            } catch (error: any) {
                if (error.name === 'AbortError') return;
            } finally {
                if (abortCitiesRef.current === controller) setIsLoadingCities(false);
            }
        }
    };

    const scrollToError = (errorFields: Record<string, any>) => {
        const firstErrorField = Object.keys(errorFields)[0];
        if (firstErrorField && fieldRefs.current[firstErrorField]) {
            fieldRefs.current[firstErrorField]?.scrollIntoView({ behavior: "smooth", block: "center" });
            fieldRefs.current[firstErrorField]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'working_days') {
                    submitData.append(key, (value as string[]).join(','));
                } else {
                    submitData.append(key, value as string);
                }
            });
            if (logoFile) submitData.append('logo', logoFile);

            if (isEditMode) {
                await clinicService.update(clinicId!, submitData);
                toast.success("Clinic updated successfully!");
            } else {
                await clinicService.add(submitData);
                toast.success("Clinic created successfully!");
            }

            router.push("/admin/clinics");
        } catch (error: any) {
            if (error.status === 400 && typeof error.message === 'object') {
                setErrors(error.message);
                toast.error("Please fill in all required fields correctly.");
                scrollToError(error.message);
            } else if (error.message) {
                toast.error(error.message);
                if (error.message.includes("Name")) scrollToError({ name: true });
                else if (error.message.includes("Phone")) scrollToError({ primary_phone: true });
                else if (error.message.includes("Email")) scrollToError({ email: true });
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-medical-teal animate-bounce">
                        <Hospital className="w-8 h-8" />
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Loader2 className="w-3 h-3 animate-spin" /> Loading clinic data...
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                {/* Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Link href="/admin/clinics" className="hover:text-medical-teal transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Clinics Manager
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">{isEditMode ? "Edit Clinic" : "Create New Clinic"}</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                                {isEditMode ? "Edit Clinic" : "New Clinic"}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                {isEditMode
                                    ? `Modifying parameters for ${formData.name || "clinic"}`
                                    : "Configure global medical facility parameters."}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/admin/clinics" className="btn-secondary !py-3 !px-6 !text-[10px] font-black tracking-widest">
                                Cancel
                            </Link>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="btn-primary !py-3 !px-8 !text-[10px] font-black tracking-widest shadow-xl shadow-teal-900/10 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> {isEditMode ? "Saving..." : "Initializing..."}</>
                                ) : isEditMode ? (
                                    <><Save className="w-4 h-4" /> Save Changes</>
                                ) : (
                                    <><Plus className="w-4 h-4" /> Create</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Section A: Basic Details */}
                    <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-start gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal shadow-inner">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Basic Identity</h3>
                                <p className="text-xs text-slate-400 font-medium">Core institutional data for the clinic.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10">
                            <div className="flex-shrink-0">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Clinic Logo</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-32 h-32 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-medical-teal hover:bg-teal-50/30 transition-all duration-300 group"
                                >
                                    {logo ? (
                                        <>
                                            <img src={logo} alt="Preview" className="w-full h-full object-cover rounded-[22px]" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[22px]">
                                                <Trash2 className="text-white w-6 h-6" onClick={(e) => { e.stopPropagation(); setLogo(null); setLogoFile(null); }} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-medical-teal group-hover:scale-110 transition-all duration-300" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Clinic Name <span className="text-rose-500">*</span></label>
                                    <input
                                        ref={(el) => { fieldRefs.current["name"] = el; }}
                                        type="text"
                                        placeholder="e.g. City Care Hospital"
                                        className={`w-full bg-slate-50 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium ${errors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-100'}`}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                    {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Registration Number</label>
                                    <input
                                        ref={(el) => { fieldRefs.current["reg_number"] = el; }}
                                        type="text"
                                        placeholder="Optional"
                                        className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium"
                                        value={formData.reg_number}
                                        onChange={(e) => setFormData({ ...formData, reg_number: e.target.value })}
                                        disabled={isSubmitting}
                                    />
                                </div>
                                {isEditMode && (
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Status</label>
                                        <select
                                            className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium appearance-none"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            disabled={isSubmitting}
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section B: Address */}
                    <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-start gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Location Details</h3>
                                <p className="text-xs text-slate-400 font-medium">Physical coordinates and facility address.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Address Line 1 <span className="text-rose-500">*</span></label>
                                <input
                                    ref={(el) => { fieldRefs.current["address_line1"] = el; }}
                                    type="text"
                                    placeholder="Street address, building name"
                                    className={`w-full bg-slate-50 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium ${errors.address_line1 ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-100'}`}
                                    value={formData.address_line1}
                                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                                    disabled={isSubmitting}
                                />
                                {errors.address_line1 && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.address_line1}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Address Line 2</label>
                                <input
                                    ref={(el) => { fieldRefs.current["address_line2"] = el; }}
                                    type="text"
                                    placeholder="Apartment, suite, unit (optional)"
                                    className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium"
                                    value={formData.address_line2}
                                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">State <span className="text-rose-500">*</span></label>
                                <select
                                    ref={(el: any) => { fieldRefs.current["state"] = el; }}
                                    className={`w-full bg-slate-50 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium appearance-none ${errors.state ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-100'}`}
                                    value={selectedStateId}
                                    onChange={(e) => handleStateChange(e.target.value)}
                                    disabled={isSubmitting || isLoadingStates}
                                >
                                    <option value="">{isLoadingStates ? "Loading..." : "Select State"}</option>
                                    {states.map((state) => (
                                        <option key={state.id} value={state.id}>{state.state_name}</option>
                                    ))}
                                </select>
                                {errors.state && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.state}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">City <span className="text-rose-500">*</span></label>
                                <select
                                    ref={(el: any) => { fieldRefs.current["city"] = el; }}
                                    className={`w-full bg-slate-50 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium appearance-none ${errors.city ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-100'}`}
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    disabled={isSubmitting || isLoadingCities || !formData.state}
                                >
                                    <option value="">{isLoadingCities ? "Loading..." : formData.state ? "Select City" : "Select State First"}</option>
                                    {cities.map((city) => (
                                        <option key={city.city_id} value={city.city_name}>{city.city_name}</option>
                                    ))}
                                </select>
                                {errors.city && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.city}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Pincode <span className="text-rose-500">*</span></label>
                                <input
                                    ref={(el) => { fieldRefs.current["pincode"] = el; }}
                                    type="text"
                                    className={`w-full bg-slate-50 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium ${errors.pincode ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-100'}`}
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    disabled={isSubmitting}
                                />
                                {errors.pincode && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.pincode}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Country</label>
                                <input
                                    ref={(el) => { fieldRefs.current["country"] = el; }}
                                    type="text"
                                    className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Google Map Location (Link)</label>
                                <input
                                    ref={(el) => { fieldRefs.current["map_link"] = el; }}
                                    type="text"
                                    placeholder="https://maps.google.com/..."
                                    className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium"
                                    value={formData.map_link}
                                    onChange={(e) => setFormData({ ...formData, map_link: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section C: Contact Details */}
                    <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-start gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Contact Information</h3>
                                <p className="text-xs text-slate-400 font-medium">Public and internal contact node details.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Primary Phone <span className="text-rose-500">*</span></label>
                                <input
                                    ref={(el) => { fieldRefs.current["primary_phone"] = el; }}
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className={`w-full bg-slate-50 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium ${errors.primary_phone ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-100'}`}
                                    value={formData.primary_phone}
                                    onChange={(e) => setFormData({ ...formData, primary_phone: e.target.value })}
                                    disabled={isSubmitting}
                                />
                                {errors.primary_phone && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.primary_phone}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Alternate Phone</label>
                                <input
                                    ref={(el) => { fieldRefs.current["alternate_phone"] = el; }}
                                    type="tel"
                                    placeholder="Optional"
                                    className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium"
                                    value={formData.alternate_phone}
                                    onChange={(e) => setFormData({ ...formData, alternate_phone: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Email Address <span className="text-rose-500">*</span></label>
                                <input
                                    ref={(el) => { fieldRefs.current["email"] = el; }}
                                    type="email"
                                    placeholder="clinic@example.com"
                                    className={`w-full bg-slate-50 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium ${errors.email ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-100'}`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isSubmitting}
                                />
                                {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">WhatsApp Number</label>
                                <input
                                    ref={(el) => { fieldRefs.current["whatsapp_number"] = el; }}
                                    type="tel"
                                    placeholder="For patient communication"
                                    className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium"
                                    value={formData.whatsapp_number}
                                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section D: Working Hours */}
                    <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-start gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Temporal Cycles</h3>
                                <p className="text-xs text-slate-400 font-medium">Define active operational windows.</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 block">Working Day Matrix</label>
                                <div className="flex flex-wrap gap-3">
                                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(day)}
                                            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 ${formData.working_days.includes(day)
                                                ? "bg-medical-teal text-white shadow-lg shadow-teal-900/10 scale-110"
                                                : "bg-slate-50 text-slate-400 border border-slate-100 hover:border-teal-200 hover:text-teal-600"
                                                }`}
                                        >
                                            {day.substring(0, 1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Opening Time</label>
                                    <input type="time" className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium" value={formData.open_time} onChange={(e) => setFormData({ ...formData, open_time: e.target.value })} disabled={isSubmitting} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Closing Time</label>
                                    <input type="time" className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium" value={formData.close_time} onChange={(e) => setFormData({ ...formData, close_time: e.target.value })} disabled={isSubmitting} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Break Interval Start</label>
                                    <input type="time" className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium" value={formData.break_start} onChange={(e) => setFormData({ ...formData, break_start: e.target.value })} disabled={isSubmitting} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Break Interval End</label>
                                    <input type="time" className="w-full bg-slate-50 border-slate-100 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium" value={formData.break_end} onChange={(e) => setFormData({ ...formData, break_end: e.target.value })} disabled={isSubmitting} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/clinics" className="btn-secondary !py-4 !px-10 !text-[11px] font-black tracking-widest !rounded-2xl">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary !py-4 !px-12 !text-[11px] font-black tracking-widest !rounded-2xl shadow-xl shadow-teal-900/10 ring-2 ring-medical-teal ring-offset-4 ring-offset-white disabled:opacity-50 cursor-pointer flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> {isEditMode ? "Saving..." : "Initializing..."}</>
                            ) : isEditMode ? (
                                <><Save className="w-5 h-5" /> Save Changes</>
                            ) : (
                                <><Plus className="w-5 h-5" /> Create</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

// useSearchParams ke liye Suspense wrap zaruri hai Next.js me
export default function AddClinicPage() {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-medical-teal animate-bounce">
                        <Hospital className="w-8 h-8" />
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </div>
                </div>
            </AdminLayout>
        }>
            <AddClinicForm />
        </Suspense>
    );
}
