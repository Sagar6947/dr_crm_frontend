

"use client";

import React, { useState, useEffect, Suspense } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useSearchParams, useRouter } from "next/navigation";
import { User, HeartPulse, ChevronLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

function AddEditPatientForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const patientId = searchParams.get("id");
    const isEdit = !!patientId;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const [full_name, setFullName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [disease, setDisease] = useState("");
    const [blood_group, setBloodGroup] = useState("");
    const [status, setStatus] = useState("active");

    useEffect(() => {
        if (!isEdit) return;
        const fetchPatient = async () => {
            setFetching(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patient/detail/${patientId}`);
                const data = await res.json();
                const p = data?.data;
                if (p) {
                    setFullName(p.full_name || "");
                    setAge(String(p.age || ""));
                    setGender(p.gender || "");
                    setPhone(p.phone || "");
                    setEmail(p.email || "");
                    setState(p.state || "");
                    setCity(p.city || "");
                    setAddress(p.address || "");
                    setDisease(p.disease || "");
                    setBloodGroup(p.blood_group || "");
                    setStatus(p.status || "active");
                }
            } catch (err) {
                console.error("Failed to fetch patient", err);
            } finally {
                setFetching(false);
            }
        };
        fetchPatient();
    }, [patientId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
    //     try {
            
    //         const endpoint = isEdit
    // ? `/patient/edit/${patientId}`
    // : "/patient/add";
    try {
    // Duplicate check only while adding new patient
    if (!isEdit) {
        const checkFormData = new FormData();
        checkFormData.append("page_no", "1");
        checkFormData.append("limit", "1000");
        checkFormData.append("search", "");

        const checkRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/patient/list`,
            {
                method: "POST",
                body: checkFormData,
            }
        );

        const checkData = await checkRes.json();
        const existingPatients = checkData?.data || [];

        const duplicatePhone = existingPatients.some(
            (p: any) => String(p.phone).trim() === String(phone).trim()
        );

        const duplicateEmail =
            email.trim() !== "" &&
            existingPatients.some(
                (p: any) =>
                    String(p.email || "").trim().toLowerCase() ===
                    String(email).trim().toLowerCase()
            );

        if (duplicatePhone) {
            setError("This phone number already exists");
            setLoading(false);
            return;
        }

        if (duplicateEmail) {
            setError("This email already exists");
            setLoading(false);
            return;
        }
    }

    const endpoint = isEdit
        ? `/patient/edit/${patientId}`
        : "/patient/add";

            const formData = new FormData();
            formData.append("full_name", full_name);
            formData.append("age", age);
            formData.append("gender", gender);
            formData.append("phone", phone);
            formData.append("email", email);
            formData.append("state", state);
            formData.append("city", city);
            formData.append("address", address);
            formData.append("disease", disease);
            formData.append("blood_group", blood_group);
            formData.append("status", status);
            // if (isEdit && patientId) formData.append("id", patientId);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                router.push("/admin/patients");
            } else {
                setError(
                    typeof data?.message === "object"
                        ? Object.values(data.message).join(", ")
                        : data?.message || "Something went wrong"
                );
            }
        } catch (err: any) {
            setError(err?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin text-medical-teal" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/patients" className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {isEdit ? "Edit Patient" : "Add New Patient"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {isEdit ? "Update patient information." : "Register a new patient in the system."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left — Personal Info */}
                    <div className="lg:col-span-2 medical-card !rounded-3xl space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                            <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Personal Information</p>
                                <p className="text-xs text-slate-400">Basic patient details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    value={full_name}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="e.g. Rahul Sharma"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Age *</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="e.g. 18"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Gender *</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="8889898992"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="someone@gmail.com"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">State</label>
                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="Madhya Pradesh"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">City</label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Bhopal"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Address</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="e.g. New York Area"
                                    className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right — Medical Info + Submit */}
                    <div className="space-y-6">
                        <div className="medical-card !rounded-3xl space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                                <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400">
                                    <HeartPulse className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Medical Info</p>
                                    <p className="text-xs text-slate-400">Health details</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Disease / Condition *</label>
                                    <input
                                        type="text"
                                        value={disease}
                                        onChange={(e) => setDisease(e.target.value)}
                                        placeholder="e.g. Mild Fever"
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Blood Group</label>
                                    <select
                                        value={blood_group}
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    >
                                        <option value="">Select blood group</option>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-medical-teal/20 outline-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
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
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {loading ? "Saving..." : isEdit ? "Update Patient" : "Save Patient"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function AddEditPatientPage() {
    return (
        <AdminLayout>
            <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-6 h-6 animate-spin text-medical-teal" />
                </div>
            }>
                <AddEditPatientForm />
            </Suspense>
        </AdminLayout>
    );
}