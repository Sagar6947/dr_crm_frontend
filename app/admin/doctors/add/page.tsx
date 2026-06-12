
"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Stethoscope, ChevronRight, Save, Plus, Loader2,
    Upload, Trash2, User, GraduationCap, ShieldCheck,
    FileText, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { doctorService } from "@/lib/api";
import { toast } from "sonner";

function AddDoctorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const doctorId = searchParams.get("id");
    const isEditMode = !!doctorId;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // File states
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [licenseFile, setLicenseFile] = useState<File | null>(null);
    const [govtIdFile, setGovtIdFile] = useState<File | null>(null);
    const [licenseFileName, setLicenseFileName] = useState("");
    const [govtIdFileName, setGovtIdFileName] = useState("");

    const photoRef = useRef<HTMLInputElement>(null);
    const licenseRef = useRef<HTMLInputElement>(null);
    const govtIdRef = useRef<HTMLInputElement>(null);
    const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

    // Exact API payload fields (from Postman screenshot)
    const [formData, setFormData] = useState({
        title: "Dr",
        full_name: "",
        gender: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
        reg_number: "",
        qualification: "",
        consultant_preference: "",
        specialization: "",
        experience_years: "",
        username: "",
        password: "",
        role: "senior_doctor",
        status: "1",
    });

    const set = (field: string, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    // Load doctor in edit mode
    useEffect(() => {
        if (!isEditMode || !doctorId) return;
        const controller = new AbortController();

        const fetchDoctor = async () => {
            setIsLoadingData(true);
            try {
                const response = await doctorService.getById(doctorId, controller.signal);
                if (response.status === 200) {
                    const d = response.data;
                       

                    setFormData({
                        title: d.title || "Dr",
                        full_name: d.full_name || "",
                        gender: d.gender || "",
                        dob: d.dob ? d.dob.split("T")[0] : "",
                        phone: d.phone ? String(d.phone) : "",
                        email: d.email || "",
                        address: d.address || "",
                        reg_number: d.reg_number || "",
                        qualification: d.qualification || "",
                        consultant_preference: d.consultation_preferences || "",
                        specialization: d.specialization || "",
                        experience_years: d.experience_years ? String(d.experience_years) : "",
                        username: d.username || "",
                        password: "", // password blank in edit mode
                        role: d.role || "senior_doctor",
                        status: d.status?.toString().toLowerCase() === "active" || d.status == "1" ? "1" : "0",
                    });
                    // if (d.profile_photo_url) setProfilePhoto(d.profile_photo_url);
                    // if (d.profile_photo) setProfilePhoto(d.profile_photo);
                    if (d.profile_photo_url) {
  setProfilePhoto(d.profile_photo_url);
}
                    if (d.medical_license_url) setLicenseFileName("Uploaded file");
                    if (d.govt_id_proof_url) setGovtIdFileName("Uploaded file");
                } else {
                    toast.error(response.message || "Failed to load doctor");
                    router.push("/admin/doctors");
                }
            } catch (error: any) {
                if (error?.name === "AbortError" || error === "Component unmounted") return;
                toast.error("Failed to load doctor data");
                router.push("/admin/doctors");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchDoctor();
        return () => controller.abort();
    }, [isEditMode, doctorId]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setProfilePhoto(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: (f: File) => void,
        setName: (n: string) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) { setFile(file); setName(file.name); }
    };

    const scrollToError = (errorFields: Record<string, any>) => {
        const first = Object.keys(errorFields)[0];
        if (first && fieldRefs.current[first])
            fieldRefs.current[first]?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const submitData = new FormData();

            // Append all text fields
            // Object.entries(formData).forEach(([key, value]) => {
            //     // Skip password in edit mode if empty
            //     if (key === "password" && isEditMode && !value) return;
            //     submitData.append(key, value);
            // });
            Object.entries(formData).forEach(([key, value]) => {
    if (key === "password" && isEditMode && !value) return;

    if (key === "consultant_preference") {
        submitData.append("consultation_preferences", value);
        return;
    }

    submitData.append(key, value);
});

            // Append files
            if (profilePhotoFile) submitData.append("profile_photo", profilePhotoFile);
            if (licenseFile) submitData.append("medical_license_file", licenseFile);
            if (govtIdFile) submitData.append("govt_id_proof_file", govtIdFile);

            if (isEditMode) {
                await doctorService.update(doctorId!, submitData);
                toast.success("Doctor updated successfully!");
            } else {
                await doctorService.add(submitData);
                toast.success("Doctor added successfully!");
            }

            router.push("/admin/doctors");
        } catch (error: any) {
            if (error.status === 400 && typeof error.message === "object") {
                setErrors(error.message);
                toast.error("Please fix the errors and try again.");
                scrollToError(error.message);
            } else {
                toast.error(error.message || "An unexpected error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = (field?: string) =>
        `w-full bg-slate-50 border p-4 rounded-2xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium ${field && errors[field] ? "border-rose-400 ring-1 ring-rose-400" : "border-slate-100"}`;

    const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block";

    if (isLoadingData) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-medical-teal animate-bounce">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Loader2 className="w-3 h-3 animate-spin" /> Loading doctor data...
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
                        <Link href="/admin/doctors" className="hover:text-medical-teal transition-colors flex items-center gap-1">
                            <ArrowLeft className="w-3 h-3" /> Doctors Manager
                        </Link>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-slate-900">{isEditMode ? "Edit Doctor" : "Add New Doctor"}</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                                {isEditMode ? "Edit Doctor" : "New Doctor"}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                {isEditMode
                                    ? `Editing profile for ${formData.title} ${formData.full_name || "doctor"}`
                                    : "Register a new doctor in the system."}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/admin/doctors" className="btn-secondary !py-3 !px-6 !text-[10px] font-black tracking-widest">
                                Cancel
                            </Link>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="btn-primary !py-3 !px-8 !text-[10px] font-black tracking-widest shadow-xl shadow-teal-900/10 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> {isEditMode ? "Saving..." : "Adding..."}</>
                                ) : isEditMode ? (
                                    <><Save className="w-4 h-4" /> Save Changes</>
                                ) : (
                                    <><Plus className="w-4 h-4" /> Add Doctor</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* ── Section A: Personal Info ── */}
                    <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-start gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal shadow-inner">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Personal Info</h3>
                                <p className="text-xs text-slate-400 font-medium">Basic identity and contact details.</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10">
                            {/* Profile Photo */}
                            <div className="flex-shrink-0">
                                <label className={labelClass}>Profile Photo</label>
                                <div
                                    onClick={() => photoRef.current?.click()}
                                    className="relative w-32 h-32 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-medical-teal hover:bg-teal-50/30 transition-all duration-300 group"
                                >
                                    {profilePhoto ? (
                                        <>
                                            <img src={profilePhoto} alt="Preview" className="w-full h-full object-cover rounded-[22px]"  />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[22px]">
                                                <Trash2 className="text-white w-6 h-6" onClick={(e) => { e.stopPropagation(); setProfilePhoto(null); setProfilePhotoFile(null); }} />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-medical-teal group-hover:scale-110 transition-all duration-300" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload</span>
                                        </div>
                                    )}
                                    <input type="file" ref={photoRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Title + Name */}
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Full Name <span className="text-rose-500">*</span></label>
                                    <div className="flex gap-3">
                                        <select
                                            className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-medical-teal w-24 appearance-none"
                                            value={formData.title}
                                            onChange={(e) => set("title", e.target.value)}
                                            disabled={isSubmitting}
                                        >
                                            <option value="Dr">Dr</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Mrs">Mrs</option>
                                        </select>
                                        <input
                                            ref={(el) => { fieldRefs.current["full_name"] = el; }}
                                            type="text"
                                            placeholder="e.g. Amit Sharma"
                                            className={`flex-1 ${inputClass("full_name")}`}
                                            value={formData.full_name}
                                            onChange={(e) => set("full_name", e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    {errors.full_name && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.full_name}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Gender</label>
                                    <select className={`${inputClass()} appearance-none`} value={formData.gender} onChange={(e) => set("gender", e.target.value)} disabled={isSubmitting}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Date of Birth</label>
                                    <input type="date" className={inputClass()} value={formData.dob} onChange={(e) => set("dob", e.target.value)} disabled={isSubmitting} />
                                </div>

                                <div>
                                    <label className={labelClass}>Phone <span className="text-rose-500">*</span></label>
                                    <input
                                        ref={(el) => { fieldRefs.current["phone"] = el; }}
                                        type="tel" placeholder="9876543210"
                                        className={inputClass("phone")}
                                        value={formData.phone} onChange={(e) => set("phone", e.target.value)} disabled={isSubmitting}
                                    />
                                    {errors.phone && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className={labelClass}>Email <span className="text-rose-500">*</span></label>
                                    <input
                                        ref={(el) => { fieldRefs.current["email"] = el; }}
                                        type="email" placeholder="doctor@example.com"
                                        className={inputClass("email")}
                                        value={formData.email} onChange={(e) => set("email", e.target.value)} disabled={isSubmitting}
                                    />
                                    {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.email}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>Address</label>
                                    <input type="text" placeholder="e.g. 123 Medical St, Health City"
                                        className={inputClass()} value={formData.address} onChange={(e) => set("address", e.target.value)} disabled={isSubmitting} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Section B: Professional Details ── */}
                    <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-start gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 shadow-inner">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Professional Details</h3>
                                <p className="text-xs text-slate-400 font-medium">Qualifications, specialization and role.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className={labelClass}>Specialization <span className="text-rose-500">*</span></label>
                                <input ref={(el) => { fieldRefs.current["specialization"] = el; }}
                                    type="text" placeholder="e.g. Cardiologist"
                                    className={inputClass("specialization")}
                                    value={formData.specialization} onChange={(e) => set("specialization", e.target.value)} disabled={isSubmitting} />
                                {errors.specialization && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.specialization}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Qualification</label>
                                <input type="text" placeholder="e.g. MBBS, MD"
                                    className={inputClass()} value={formData.qualification} onChange={(e) => set("qualification", e.target.value)} disabled={isSubmitting} />
                            </div>

                            <div>
                                <label className={labelClass}>Consultant Preference</label>
                                <div className="space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {formData.consultant_preference.split(',').map(p => p.trim()).filter(Boolean).map(pref => (
                                            <span key={pref} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest border border-teal-100 animate-in zoom-in duration-200">
                                                {pref === 'video' ? 'Online Video' : pref === 'clinic' ? 'Offline Clinic' : pref === 'phone' ? 'Proxy (By attendant)' : pref}
                                                <button
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    onClick={() => {
                                                        const current = formData.consultant_preference.split(',').map(p => p.trim()).filter(Boolean);
                                                        set("consultant_preference", current.filter(p => p !== pref).join(', '));
                                                    }}
                                                    className="w-4 h-4 rounded-full hover:bg-teal-200/50 flex items-center justify-center text-teal-700 transition-colors"
                                                >
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                                </button>
                                            </span>
                                        ))}
                                        {(!formData.consultant_preference || formData.consultant_preference.split(',').filter(Boolean).length === 0) && (
                                            <span className="text-xs text-slate-400 font-medium py-1.5">No preferences selected</span>
                                        )}
                                    </div>
                                    <select
                                        className={`${inputClass()} appearance-none cursor-pointer`}
                                        value=""
                                        onChange={(e) => {
                                            if (!e.target.value) return;
                                            const current = formData.consultant_preference.split(',').map(p => p.trim()).filter(Boolean);
                                            if (!current.includes(e.target.value)) {
                                                current.push(e.target.value);
                                                set("consultant_preference", current.join(', '));
                                            }
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        <option value="">+ Add Preference</option>
                                        {!formData.consultant_preference.split(',').map(p=>p.trim()).includes('video') && <option value="video">Online Video</option>}
                                        {!formData.consultant_preference.split(',').map(p=>p.trim()).includes('clinic') && <option value="clinic">Offline Clinic</option>}
                                        {!formData.consultant_preference.split(',').map(p=>p.trim()).includes('phone') && <option value="phone">Proxy (By attendant)</option>}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Experience (Years)</label>
                                <input type="number" min="0" placeholder="e.g. 10"
                                    className={inputClass()} value={formData.experience_years} onChange={(e) => set("experience_years", e.target.value)} disabled={isSubmitting} />
                            </div>

                            <div>
                                <label className={labelClass}>Registration Number</label>
                                <input type="text" placeholder="e.g. REG-123456"
                                    className={inputClass()} value={formData.reg_number} onChange={(e) => set("reg_number", e.target.value)} disabled={isSubmitting} />
                            </div>

                            <div>
                                <label className={labelClass}>Role</label>
                                <select className={`${inputClass()} appearance-none`} value={formData.role} onChange={(e) => set("role", e.target.value)} disabled={isSubmitting}>
                                    <option value="master">Master</option>
                                    <option value="professional">Professional</option>
                                    <option value="senior_doctor">Senior Doctor</option>
                                    <option value="junior_doctor">Junior Doctor</option>
                                    <option value="consultant">Consultant</option>
                                    <option value="resident">Resident</option>
                                    <option value="intern">Intern</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Status</label>
                                <select className={`${inputClass()} appearance-none`} value={formData.status} onChange={(e) => set("status", e.target.value)} disabled={isSubmitting}>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Section C: Account & Access ── */}
                    <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-start gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-inner">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Account & Access</h3>
                                <p className="text-xs text-slate-400 font-medium">
                                    Portal login credentials.{isEditMode && " Leave password blank to keep unchanged."}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                                <label className={labelClass}>Username <span className="text-rose-500">*</span></label>
                                <input ref={(el) => { fieldRefs.current["username"] = el; }}
                                    type="text" placeholder="e.g. drjohndoe"
                                    className={inputClass("username")}
                                    value={formData.username} onChange={(e) => set("username", e.target.value)} disabled={isSubmitting} />
                                {errors.username && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.username}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Password {!isEditMode && <span className="text-rose-500">*</span>}
                                    {isEditMode && <span className="text-slate-400 normal-case font-medium"> (optional)</span>}
                                </label>
                                <input
                                    type="password"
                                    placeholder={isEditMode ? "Leave blank to keep unchanged" : "Set initial password"}
                                    className={inputClass("password")}
                                    value={formData.password} onChange={(e) => set("password", e.target.value)} disabled={isSubmitting} />
                                {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1 uppercase">{errors.password}</p>}
                            </div>
                        </div>
                    </div>

                    {/* ── Section D: Documents ── */}
                    <div className="medical-card !p-8 !rounded-[40px] border-slate-100/50 shadow-2xl shadow-slate-200/50">
                        <div className="flex items-start gap-4 mb-10 border-b border-slate-50 pb-6">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Documents</h3>
                                <p className="text-xs text-slate-400 font-medium">Medical license and government ID proof.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Medical License */}
                            <div>
                                <label className={labelClass}>Medical License File</label>
                                <div onClick={() => licenseRef.current?.click()}
                                    className="w-full border-2 border-dashed border-slate-100 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:border-medical-teal hover:bg-teal-50/20 transition-all group">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-medical-teal group-hover:bg-teal-50 transition-all flex-shrink-0">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-600 truncate">{licenseFileName || "Click to upload"}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF, JPG, PNG</p>
                                    </div>
                                    <input type="file" ref={licenseRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, setLicenseFile, setLicenseFileName)} />
                                </div>
                            </div>

                            {/* Govt ID */}
                            <div>
                                <label className={labelClass}>Government ID Proof</label>
                                <div onClick={() => govtIdRef.current?.click()}
                                    className="w-full border-2 border-dashed border-slate-100 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:border-medical-teal hover:bg-teal-50/20 transition-all group">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-medical-teal group-hover:bg-teal-50 transition-all flex-shrink-0">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-600 truncate">{govtIdFileName || "Click to upload"}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF, JPG, PNG</p>
                                    </div>
                                    <input type="file" ref={govtIdRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) => handleFileUpload(e, setGovtIdFile, setGovtIdFileName)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Link href="/admin/doctors" className="btn-secondary !py-4 !px-10 !text-[11px] font-black tracking-widest !rounded-2xl">
                            Cancel
                        </Link>
                        <button type="submit" disabled={isSubmitting}
                            className="btn-primary !py-4 !px-12 !text-[11px] font-black tracking-widest !rounded-2xl shadow-xl shadow-teal-900/10 ring-2 ring-medical-teal ring-offset-4 ring-offset-white disabled:opacity-50 cursor-pointer flex items-center gap-2">
                            {isSubmitting ? (
                                <><Loader2 className="w-5 h-5 animate-spin" /> {isEditMode ? "Saving..." : "Adding..."}</>
                            ) : isEditMode ? (
                                <><Save className="w-5 h-5" /> Save Changes</>
                            ) : (
                                <><Plus className="w-5 h-5" /> Add Doctor</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

export default function AddDoctorPage() {
    return (
        <Suspense fallback={
            <AdminLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-16 h-16 bg-teal-50 rounded-[28px] flex items-center justify-center text-medical-teal animate-bounce">
                        <Stethoscope className="w-8 h-8" />
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </div>
                </div>
            </AdminLayout>
        }>
            <AddDoctorForm />
        </Suspense>
    );
}