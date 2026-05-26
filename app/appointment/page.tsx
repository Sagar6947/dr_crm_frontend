"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    User,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Calendar,
    Clock,
    HeartPulse,
    MapPin,
    Hospital,
    Video,
    Phone,
    CreditCard,
    QrCode,
    Bell,
    Check,
    Search,
    SearchIcon,
    AlertCircle,
    Loader2,
    Trash2,
    X,
} from "lucide-react";
import { clinicService, geoService, appointmentService } from "@/lib/api";

// --- MOCK DATA ---
const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];

// --- TYPES ---
type FormData = {
    patientType: "new" | "existing";
    patientId: string;
    appointmentId: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    stateId: string;
    stateName: string;
    cityId: string;
    city: string;
    clinic: string;
    clinicId: string;
    doctorId: string;
    consultationMode: "video" | "clinic" | "phone";
    date: string;
    time: string;
    reason: string;
    conditions: string;
    medications: string;
    paymentMethod: "cash" | "qr";
};

const INITIAL_DATA: FormData = {
    patientType: "new",
    patientId: "",
    appointmentId: "",
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    stateId: "",
    stateName: "",
    cityId: "",
    city: "",
    clinic: "",
    clinicId: "",
    doctorId: "",
    consultationMode: "video",
    date: "",
    time: "",
    reason: "",
    conditions: "",
    medications: "",
    paymentMethod: "cash",
};

export default function AppointmentWizard() {
    const generatePatientId = () => `CRM-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const generateAppointmentId = () => `APT-8877-${Math.floor(1000 + Math.random() * 9000)}`;
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // --- EXISTING PATIENT MODULE STATES ---
    const [existingPhone, setExistingPhone] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [otpError, setOtpError] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
    const [reschedulingAppointmentId, setReschedulingAppointmentId] = useState<string | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleTime, setRescheduleTime] = useState("");
    const [rescheduledSlipAppointment, setRescheduledSlipAppointment] = useState<any>(null);
    const [cancellationConfirmId, setCancellationConfirmId] = useState<string | null>(null);
    const [existingPatientName, setExistingPatientName] = useState("Gourav Jain");
    const [appointments, setAppointments] = useState([
        {
            id: "APT-8877-2052",
            patientId: "CRM-2025-7138",
            fullName: "Gourav Jain",
            phone: "9340788649",
            stateName: "Madhya Pradesh",
            city: "Bhopal",
            clinic: "S World test",
            doctorName: "Dr Jane Doe Updated",
            date: "2026-05-29",
            time: "10:00 AM",
            consultationMode: "clinic",
            status: "Scheduled",
            paymentMethod: "cash",
        },
        {
            id: "APT-20260411-0009",
            patientId: "CRM-2025-7138",
            fullName: "Gourav Jain",
            phone: "9340788649",
            stateName: "Madhya Pradesh",
            city: "Bhopal",
            clinic: "World Health Clinic Office road bhopal kolar road",
            doctorName: "Dr Jane Doe Updated",
            date: "2026-06-05",
            time: "02:00 PM",
            consultationMode: "clinic",
            status: "Scheduled",
            paymentMethod: "cash",
        },
        {
            id: "APT-20260409-0007",
            patientId: "CRM-2025-7138",
            fullName: "Gourav Jain",
            phone: "9340788649",
            stateName: "Madhya Pradesh",
            city: "Bhopal",
            clinic: "World Health Clinic Office road bhopal kolar road",
            doctorName: "Dr gourav dubey",
            date: "2026-04-11",
            time: "11:00 AM",
            consultationMode: "clinic",
            status: "Completed",
            paymentMethod: "cash",
        },
        {
            id: "APT-20260403-0006",
            patientId: "CRM-2025-7138",
            fullName: "Gourav Jain",
            phone: "9340788649",
            stateName: "Madhya Pradesh",
            city: "Bhopal",
            clinic: "S World test",
            doctorName: "Dr gourav dubey",
            date: "2026-04-04",
            time: "06:00 PM",
            consultationMode: "clinic",
            status: "Completed",
            paymentMethod: "cash",
        }
    ]);
    

    useEffect(() => {
        if (formData.patientType === "new" && !formData.patientId) {
            updateFields({ patientId: generatePatientId() });
        }
    }, [formData.patientType, formData.patientId]);

    const updateFields = (fields: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...fields }));
    };

    const next = () => setCurrentStep((prev) => prev + 1);
    const back = () => setCurrentStep((prev) => prev - 1);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < 6) {
            if (currentStep === 5 && !formData.appointmentId) {
                updateFields({ appointmentId: generateAppointmentId() });
            }
            next();
        } else {
            // Final submit
            const payload = {
                booking_name: formData.fullName,
                phone: formData.phone,
                clinic_id: formData.clinicId,
                doctor_id: formData.doctorId,
                state: formData.stateName,
                city: formData.city,
                appointment_date: formData.date,
                appointment_time: formData.time,
                consultation_mode: formData.consultationMode,
                chronic_condition: formData.conditions || "None",
                regular_medications: formData.medications || "None",
                payment_mode: formData.paymentMethod === "cash" ? "pay_at_visit" : "qr_payment",
            };

            appointmentService.book(payload)
                .then(() => setIsSubmitted(true))
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    if (isSubmitted) {
        return <SuccessCard formData={formData} />;
    }

    if (rescheduledSlipAppointment) {
        return <UpdatedSuccessCard appointment={rescheduledSlipAppointment} onClose={() => setRescheduledSlipAppointment(null)} />;
    }

    return (
        <div className="min-h-screen bg-medical-slate-bg py-12 md:py-20 font-sans">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 bg-medical-teal rounded-lg flex items-center justify-center shadow-lg shadow-teal-100 group-hover:scale-105 transition-transform">
                                <HeartPulse className="text-white w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-slate-800 uppercase">
                                Dr. <span className="text-medical-teal">CRM</span>
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {formData.patientType === "existing" && isOtpVerified ? "Patient Portal" : "Booking Portal"}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            {formData.patientType === "existing" && isOtpVerified ? "Manage your consultations and visits." : "Precision care starts with a simple choice."}
                        </p>
                    </div>
                    {!(formData.patientType === "existing" && isOtpVerified) && <Stepper currentStep={currentStep} />}
                </div>

                <div className="medical-card shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                        <div
                            className="h-full bg-medical-teal transition-all duration-500"
                            style={{ width: `${(currentStep / 6) * 100}%` }}
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {currentStep === 0 && <Step0 formData={formData} updateFields={updateFields} generatePatientId={generatePatientId} />}
                        {currentStep === 1 && (
                            <Step1
                                formData={formData}
                                updateFields={updateFields}
                                existingPhone={existingPhone}
                                setExistingPhone={setExistingPhone}
                                otpSent={otpSent}
                                setOtpSent={setOtpSent}
                                otpCode={otpCode}
                                setOtpCode={setOtpCode}
                                otpError={otpError}
                                setOtpError={setOtpError}
                                isOtpVerified={isOtpVerified}
                                setIsOtpVerified={setIsOtpVerified}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                reschedulingAppointmentId={reschedulingAppointmentId}
                                setReschedulingAppointmentId={setReschedulingAppointmentId}
                                rescheduleDate={rescheduleDate}
                                setRescheduleDate={setRescheduleDate}
                                rescheduleTime={rescheduleTime}
                                setRescheduleTime={setRescheduleTime}
                                setRescheduledSlipAppointment={setRescheduledSlipAppointment}
                                cancellationConfirmId={cancellationConfirmId}
                                setCancellationConfirmId={setCancellationConfirmId}
                                existingPatientName={existingPatientName}
                                setExistingPatientName={setExistingPatientName}
                                appointments={appointments}
                                setAppointments={setAppointments}
                            />
                        )}
                        {/* Step 2: Consultation Mode (was Step 3 mode part) */}
                        {currentStep === 2 && <Step2ConsultationMode formData={formData} updateFields={updateFields} />}
                        {/* Step 3: Location + Clinic + Doctor (filtered by mode) */}
                        {currentStep === 3 && <Step3LocationClinicDoctor formData={formData} updateFields={updateFields} />}
                        {/* Step 4: Date & Time (was Step 3 schedule part) */}
                        {currentStep === 4 && <Step4Schedule formData={formData} updateFields={updateFields} />}
                        {currentStep === 5 && <Step5Medical formData={formData} updateFields={updateFields} />}
                        {currentStep === 6 && <Step6Payment formData={formData} updateFields={updateFields} />}
                        {/* Step6Review removed — now it's step 6 is payment, review is inline */}

                        <div className="flex justify-between items-center pt-10 border-t border-slate-100">
                            {formData.patientType === "existing" && currentStep === 1 ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={back}
                                        className="btn-secondary gap-2 px-8"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Back to Step 0
                                    </button>
                                    {isOtpVerified && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsOtpVerified(false);
                                                setOtpSent(false);
                                                setOtpCode("");
                                                setExistingPhone("");
                                            }}
                                            className="btn-secondary text-red-500 hover:text-red-600 border-red-100 hover:bg-red-50 gap-2 px-6"
                                        >
                                            Sign Out
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={back}
                                        disabled={currentStep === 0}
                                        className={`btn-secondary gap-2 px-8 ${currentStep === 0 ? "opacity-0 invisible" : ""}`}
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </button>
                                    <button type="submit" className="btn-primary gap-2 !px-12 !py-4">
                                        {currentStep === 6 ? "Confirm Appointment" : "Continue"} <ChevronRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// --- STEPPER ---
const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = [
        { id: 0, icon: User },
        { id: 1, icon: SearchIcon },
        { id: 2, icon: Video },        // Consultation Mode
        { id: 3, icon: MapPin },       // Location + Clinic + Doctor
        { id: 4, icon: Clock },        // Date & Time
        { id: 5, icon: HeartPulse },   // Medical Info
        { id: 6, icon: CreditCard },   // Payment
    ];

    return (
        <div className="flex items-center gap-4 bg-white p-2.5 rounded-[20px] border border-slate-100 shadow-sm">
            {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.id;
                return (
                    <div key={idx} className="flex items-center">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-medical-teal text-white shadow-lg shadow-teal-100 scale-110" : "bg-slate-50 text-slate-400"}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                        {idx !== steps.length - 1 && <div className="mx-2 w-3 h-[1px] bg-slate-200" />}
                    </div>
                );
            })}
        </div>
    );
};

interface StepProps {
    formData: FormData;
    updateFields: (fields: Partial<FormData>) => void;
    generatePatientId?: () => string;
    
    // Existing patient states
    existingPhone?: string;
    setExistingPhone?: (phone: string) => void;
    otpSent?: boolean;
    setOtpSent?: (sent: boolean) => void;
    otpCode?: string;
    setOtpCode?: (code: string) => void;
    otpError?: string;
    setOtpError?: (err: string) => void;
    isOtpVerified?: boolean;
    setIsOtpVerified?: (verified: boolean) => void;
    activeTab?: "upcoming" | "history";
    setActiveTab?: (tab: "upcoming" | "history") => void;
    reschedulingAppointmentId?: string | null;
    setReschedulingAppointmentId?: (id: string | null) => void;
    rescheduleDate?: string;
    setRescheduleDate?: (date: string) => void;
    rescheduleTime?: string;
    setRescheduleTime?: (time: string) => void;
    setRescheduledSlipAppointment?: (appt: any) => void;
    cancellationConfirmId?: string | null;
    setCancellationConfirmId?: (id: string | null) => void;
    existingPatientName?: string;
    setExistingPatientName?: (name: string) => void;
    appointments?: any[];
    setAppointments?: React.Dispatch<React.SetStateAction<any[]>>;
}

// --- STEP 0: Patient Discovery ---
const Step0 = ({ formData, updateFields, generatePatientId }: StepProps) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Step 0: Patient Discovery</h2>
            <p className="text-slate-500">Have you visited our medical center before?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
                type="button"
                onClick={() => updateFields({ patientType: "new", patientId: formData.patientId || (generatePatientId ? generatePatientId() : "") })}
                className={`p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 ${formData.patientType === "new" ? "border-medical-teal bg-teal-50/50 shadow-inner" : "border-slate-100 hover:border-teal-200"}`}
            >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.patientType === "new" ? "bg-medical-teal text-white" : "bg-slate-100 text-slate-400"}`}>
                    <User className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <h4 className="font-bold text-slate-900 mb-1">New Patient</h4>
                    <p className="text-xs text-slate-500 px-4">I am visiting Lumina Health for the first time.</p>
                </div>
            </button>
            <button
                type="button"
                onClick={() => updateFields({ patientType: "existing" })}
                className={`p-8 rounded-[32px] border-2 transition-all flex flex-col items-center gap-4 ${formData.patientType === "existing" ? "border-medical-teal bg-teal-50/50 shadow-inner" : "border-slate-100 hover:border-teal-200"}`}
            >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${formData.patientType === "existing" ? "bg-medical-teal text-white" : "bg-slate-100 text-slate-400"}`}>
                    <Search className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <h4 className="font-bold text-slate-900 mb-1">Existing Patient</h4>
                    <p className="text-xs text-slate-500 px-4">I have a Patient ID or previously registered phone number.</p>
                </div>
            </button>
        </div>
    </div>
);

// --- STEP 1: Patient Identity ---
const Step1 = ({
    formData,
    updateFields,
    existingPhone = "",
    setExistingPhone = () => {},
    otpSent = false,
    setOtpSent = () => {},
    otpCode = "",
    setOtpCode = () => {},
    otpError = "",
    setOtpError = () => {},
    isOtpVerified = false,
    setIsOtpVerified = () => {},
    activeTab = "upcoming",
    setActiveTab = () => {},
    reschedulingAppointmentId = null,
    setReschedulingAppointmentId = () => {},
    rescheduleDate = "",
    setRescheduleDate = () => {},
    rescheduleTime = "",
    setRescheduleTime = () => {},
    setRescheduledSlipAppointment = () => {},
    cancellationConfirmId = null,
    setCancellationConfirmId = () => {},
    existingPatientName = "Gourav Jain",
    setExistingPatientName = () => {},
    appointments = [],
    setAppointments = () => {},
}: StepProps) => {
    const [phoneError, setPhoneError] = useState("");
    const [localOtpError, setLocalOtpError] = useState("");

    const handlePhone = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 10);
        updateFields({ phone: digits });
        if (digits.length > 0 && digits.length < 10) {
            setPhoneError("Phone number must be exactly 10 digits");
        } else {
            setPhoneError("");
        }
    };

    const handleExistingPhoneInput = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 10);
        setExistingPhone(digits);
    };

    const handleSendOtp = () => {
        if (existingPhone.length !== 10) {
            setPhoneError("Please enter a valid 10-digit mobile number");
            return;
        }
        setPhoneError("");
        setOtpSent(true);
        setOtpError("");
    };

    const handleVerifyOtp = () => {
        if (otpCode.length !== 6) {
            setLocalOtpError("OTP must be exactly 6 digits");
            return;
        }
        setLocalOtpError("");
        setIsOtpVerified(true);
        updateFields({ phone: existingPhone });
    };

    const filteredAppts = appointments.filter((appt) => {
        const matchesPhone = appt.phone === existingPhone || existingPhone === "9340788649" || appt.phone === "9340788649";
        if (!matchesPhone) return false;

        if (activeTab === "upcoming") {
            return appt.status === "Scheduled";
        } else {
            return appt.status === "Completed" || appt.status === "Cancelled";
        }
    });

    const handleCancelAppointment = (id: string) => {
        setAppointments((prev) =>
            prev.map((appt) =>
                appt.id === id ? { ...appt, status: "Cancelled" } : appt
            )
        );
        setCancellationConfirmId(null);
    };

    const handleStartReschedule = (appt: any) => {
        setReschedulingAppointmentId(appt.id);
        setRescheduleDate(appt.date);
        setRescheduleTime(appt.time);
    };

    const handleSaveReschedule = (id: string) => {
        if (!rescheduleDate || !rescheduleTime) return;

        setAppointments((prev) => {
            const updated = prev.map((appt) =>
                appt.id === id
                    ? { ...appt, date: rescheduleDate, time: rescheduleTime }
                    : appt
            );

            const updatedAppt = updated.find((appt) => appt.id === id);
            if (updatedAppt) {
                setTimeout(() => {
                    setRescheduledSlipAppointment(updatedAppt);
                }, 100);
            }
            return updated;
        });

        setReschedulingAppointmentId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {formData.patientType === "new" || !isOtpVerified ? "Step 1: Patient Identity" : "Patient Visits Dashboard"}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                    {formData.patientType === "new" ? "Creating your unique medical profile." : isOtpVerified ? "View and manage your consultation schedules." : "Locate your historical records."}
                </p>
            </div>

            {formData.patientType === "new" ? (
                <div className="space-y-8">
                    <div className="p-6 bg-teal-50 rounded-[28px] border border-teal-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-medical-teal tracking-widest uppercase mb-1">Generated ID</p>
                            <p className="text-2xl font-bold text-medical-teal-dark tracking-tighter">{formData.patientId}</p>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-medical-teal shadow-sm"><Check className="w-6 h-6" /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Full Medical Name" placeholder="John Doe" value={formData.fullName} onChange={(val) => updateFields({ fullName: val })} required />
                        <Input label="Email Address" type="email" placeholder="name@active.com" value={formData.email} onChange={(val) => updateFields({ email: val })} required />
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mobile Number</label>
                            <input
                                type="tel"
                                placeholder="10-digit mobile number"
                                maxLength={10}
                                className={`w-full bg-slate-50 border p-4 rounded-xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium ${phoneError ? "border-red-300 focus:ring-red-200" : "border-slate-100"}`}
                                value={formData.phone}
                                onChange={(e) => handlePhone(e.target.value)}
                                required
                            />
                            {phoneError && (
                                <p className="text-[11px] text-red-500 font-medium pl-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {phoneError}
                                </p>
                            )}
                        </div>
                        <Input label="Date of Birth" type="date" value={formData.dob} onChange={(val) => updateFields({ dob: val })} required />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {!isOtpVerified ? (
                        <div className="space-y-6 max-w-md mx-auto">
                            {!otpSent ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Registered Mobile Number</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors font-medium">
                                                <Phone className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="tel"
                                                placeholder="e.g. 9340788649"
                                                maxLength={10}
                                                className={`w-full bg-slate-50 border p-5 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium ${phoneError ? "border-red-300" : "border-slate-100"}`}
                                                value={existingPhone}
                                                onChange={(e) => handleExistingPhoneInput(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {phoneError && (
                                            <p className="text-[11px] text-red-500 font-medium pl-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {phoneError}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="btn-primary w-full justify-center !py-4 shadow-lg shadow-teal-100"
                                    >
                                        Send Verification OTP
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-medical-teal shrink-0 mt-0.5" />
                                        <div className="space-y-0.5">
                                            <p className="text-xs font-bold text-medical-teal">OTP Sent Successfully</p>
                                            <p className="text-[11px] text-medical-teal/80">We have sent a verification code to +91 {existingPhone.slice(0,5)}-{existingPhone.slice(5)}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">6-Digit OTP Code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP (e.g. 123456)"
                                            maxLength={6}
                                            className={`w-full bg-slate-50 border p-5 rounded-[24px] text-center tracking-[0.5em] text-lg font-bold focus:ring-2 focus:ring-medical-teal outline-none transition-all ${localOtpError ? "border-red-300" : "border-slate-100"}`}
                                            value={otpCode}
                                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            required
                                        />
                                        {localOtpError && (
                                            <p className="text-[11px] text-red-500 font-medium pl-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> {localOtpError}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setOtpSent(false)}
                                            className="btn-secondary w-full justify-center !py-4"
                                        >
                                            Change Number
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            disabled={otpCode.length < 6}
                                            className="btn-primary w-full justify-center !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Verify OTP
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {/* Patient Profile Header */}
                            <div className="p-6 bg-gradient-to-r from-teal-50/50 to-emerald-50/30 border border-slate-100 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-medical-teal text-white rounded-[20px] flex items-center justify-center font-bold text-lg shadow-lg shadow-teal-100 shrink-0 uppercase">
                                        {existingPatientName.split(" ").map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg leading-snug">Welcome Back, {existingPatientName}</h3>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-medical-teal bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">Patient ID: CRM-2025-7138</span>
                                            <span className="text-[10px] font-bold text-slate-400">Phone: +91 {existingPhone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs Switcher */}
                            <div className="flex border-b border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab("upcoming");
                                        setReschedulingAppointmentId(null);
                                        setCancellationConfirmId(null);
                                    }}
                                    className={`py-4 px-6 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeTab === "upcoming" ? "border-medical-teal text-medical-teal" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                                >
                                    Not Visited (Upcoming)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveTab("history");
                                        setReschedulingAppointmentId(null);
                                        setCancellationConfirmId(null);
                                    }}
                                    className={`py-4 px-6 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeTab === "history" ? "border-medical-teal text-medical-teal" : "border-transparent text-slate-400 hover:text-slate-600"}`}
                                >
                                    Visited (History)
                                </button>
                            </div>

                            {/* Appointments list */}
                            <div className="space-y-4">
                                {filteredAppts.length === 0 ? (
                                    <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[32px] space-y-3 bg-slate-50/20">
                                        <Calendar className="w-10 h-10 text-slate-300 mx-auto opacity-60" />
                                        <p className="text-sm font-semibold text-slate-400">No appointments found in this section.</p>
                                    </div>
                                ) : (
                                    filteredAppts.map((appt) => (
                                        <div key={appt.id} className="p-6 bg-white border border-slate-100 rounded-[28px] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden space-y-4">
                                            {/* Top Row: Appt ID and badges */}
                                            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-800">{appt.id}</span>
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                                        appt.status === "Scheduled" ? "bg-teal-50 text-medical-teal border-teal-100" :
                                                        appt.status === "Completed" ? "bg-green-50 text-green-600 border-green-100" :
                                                        "bg-red-50 text-red-500 border-red-100"
                                                    }`}>
                                                        {appt.status}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100 capitalize">
                                                    {appt.consultationMode === "clinic" ? "Offline Clinic" : appt.consultationMode === "video" ? "Online Video" : "Phone Call"}
                                                </span>
                                            </div>

                                            {/* Details Info Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Doctor Assigned</p>
                                                    <p className="font-bold text-slate-800">{appt.doctorName}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Clinic Location</p>
                                                    <p className="font-bold text-slate-800">{appt.clinic}</p>
                                                    <p className="text-[10px] text-slate-400">{appt.city}, {appt.stateName}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                                                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-medical-teal" /> {appt.date}
                                                    </p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Schedule Slot</p>
                                                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5 text-medical-teal" /> {appt.time}
                                                    </p>
                                                </div>
                                            </div>

                                            {appt.status === "Scheduled" && (
                                                <div className="pt-2">
                                                    {reschedulingAppointmentId === appt.id ? (
                                                        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                                                <h5 className="text-[10px] font-bold text-medical-teal uppercase tracking-widest">Reschedule Appointment</h5>
                                                                <button type="button" onClick={() => setReschedulingAppointmentId(null)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-1.5">
                                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Date *</label>
                                                                    <div className="relative">
                                                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                                                        <input
                                                                            type="date"
                                                                            className="w-full bg-white border border-slate-200 p-3 pl-9 rounded-xl text-xs outline-none focus:ring-2 focus:ring-medical-teal font-medium text-slate-700"
                                                                            value={rescheduleDate}
                                                                            onChange={(e) => setRescheduleDate(e.target.value)}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Available Slots *</label>
                                                                    <div className="grid grid-cols-3 gap-1.5">
                                                                        {TIME_SLOTS.map((slot) => (
                                                                            <button
                                                                                key={slot}
                                                                                type="button"
                                                                                onClick={() => setRescheduleTime(slot)}
                                                                                className={`py-2 px-1 rounded-lg text-[9px] font-bold border transition-all ${rescheduleTime === slot ? "bg-medical-teal border-medical-teal text-white shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:border-teal-200"}`}
                                                                            >
                                                                                {slot}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-end gap-2 pt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setReschedulingAppointmentId(null)}
                                                                    className="btn-secondary !py-2 !px-4 !text-xs !rounded-xl"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSaveReschedule(appt.id)}
                                                                    className="btn-primary !py-2 !px-5 !text-xs !rounded-xl"
                                                                >
                                                                    Confirm Reschedule
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : cancellationConfirmId === appt.id ? (
                                                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top-1 duration-300">
                                                            <div className="space-y-0.5">
                                                                <p className="text-xs font-bold text-red-700">Cancel this visit?</p>
                                                                <p className="text-[10px] text-red-600">This action cannot be undone.</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setCancellationConfirmId(null)}
                                                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-bold uppercase transition-colors hover:bg-slate-50"
                                                                >
                                                                    No, Keep
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleCancelAppointment(appt.id)}
                                                                    className="px-3 py-1.5 bg-red-600 border border-red-600 text-white rounded-lg text-[10px] font-bold uppercase transition-colors hover:bg-red-700 shadow-sm"
                                                                >
                                                                    Yes, Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                                                            <button
                                                                type="button"
                                                                onClick={() => setCancellationConfirmId(appt.id)}
                                                                className="flex items-center gap-1.5 px-4 py-2 border border-red-100 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-50/50 transition-colors"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" /> Cancel Visit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleStartReschedule(appt)}
                                                                className="flex items-center gap-1.5 px-4 py-2 border border-teal-100 text-medical-teal rounded-xl text-xs font-semibold hover:bg-teal-50/50 transition-colors"
                                                            >
                                                                <Calendar className="w-3.5 h-3.5" /> Reschedule Visit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- STEP 2: Consultation Mode (NEW — moved before location) ---
const Step2ConsultationMode = ({ formData, updateFields }: StepProps) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Step 2: Consultation Mode</h2>
            <p className="text-slate-500 text-sm">How would you like to consult the doctor? Only doctors available for your selected mode will be shown.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModeCard
                id="video"
                title="Online Video"
                desc="Consult from home via video call"
                icon={Video}
                active={formData.consultationMode === "video"}
                onClick={() => updateFields({ consultationMode: "video", doctorId: "" })}
            />
            <ModeCard
                id="clinic"
                title="Offline Clinic"
                desc="Visit the hospital in person"
                icon={Hospital}
                active={formData.consultationMode === "clinic"}
                onClick={() => updateFields({ consultationMode: "clinic", doctorId: "" })}
            />
            <ModeCard
                id="phone"
                title="Phone Call"
                desc="Direct call with the doctor"
                icon={Phone}
                active={formData.consultationMode === "phone"}
                onClick={() => updateFields({ consultationMode: "phone", doctorId: "" })}
            />
        </div>

        {/* Selected mode confirmation badge */}
        {formData.consultationMode && (
            <div className="p-5 bg-teal-50 border border-teal-100 rounded-[24px] flex items-center gap-4 animate-in fade-in duration-300">
                <div className="w-10 h-10 bg-medical-teal rounded-xl flex items-center justify-center text-white shrink-0">
                    {formData.consultationMode === "video" && <Video className="w-5 h-5" />}
                    {formData.consultationMode === "clinic" && <Hospital className="w-5 h-5" />}
                    {formData.consultationMode === "phone" && <Phone className="w-5 h-5" />}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-medical-teal uppercase tracking-widest mb-0.5">Selected Mode</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">{formData.consultationMode === "video" ? "Online Video" : formData.consultationMode === "clinic" ? "Offline Clinic" : "Phone Call"}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Only doctors offering this mode will be shown in the next step.</p>
                </div>
            </div>
        )}
    </div>
);

// --- STEP 3: Location + Clinic + Doctor (filtered by consultationMode) ---
const Step3LocationClinicDoctor = ({ formData, updateFields }: StepProps) => {
    const [states, setStates] = useState<{ id: number; state_name: string }[]>([]);
    const [cities, setCities] = useState<{ city_id: number; city_name: string }[]>([]);
    const [clinics, setClinicList] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);

    const [stateSearch, setStateSearch] = useState("");
    const [citySearch, setCitySearch] = useState("");
    const [clinicSearch, setClinicSearch] = useState("");

    const [loadingStates, setLoadingStates] = useState(true);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingClinics, setLoadingClinics] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);

    // Filter doctors by selected consultation mode
    const filteredDoctors = useMemo(() => {
        if (!doctors.length || !formData.consultationMode) return doctors;
        return doctors.filter((doc: any) => {
            const prefs: string = (doc.consultation_preferences || "").toLowerCase();
            return prefs.includes(formData.consultationMode.toLowerCase());
        });
    }, [doctors, formData.consultationMode]);

    const filteredStates = states.filter(s =>
        s.state_name.toLowerCase().includes(stateSearch.toLowerCase())
    );
    const filteredCities = cities.filter(c =>
        c.city_name.toLowerCase().includes(citySearch.toLowerCase())
    );
    const filteredClinics = clinics.filter(c =>
        c.name.toLowerCase().includes(clinicSearch.toLowerCase())
    );

    useEffect(() => {
        geoService.getStates()
            .then(res => setStates(res.data || []))
            .catch(() => {})
            .finally(() => setLoadingStates(false));
    }, []);

    useEffect(() => {
        if (!formData.stateId) return;
        setLoadingCities(true);
        setCities([]);
        setCitySearch("");
        geoService.getCities(formData.stateId)
            .then(res => setCities(res.data || []))
            .catch(() => {})
            .finally(() => setLoadingCities(false));
    }, [formData.stateId]);

    useEffect(() => {
        if (!formData.cityId || !formData.stateName || !formData.city) return;
        setLoadingClinics(true);
        setClinicList([]);
        setClinicSearch("");
        geoService.getClinicsByLocation(formData.stateName, formData.city)
            .then(res => setClinicList(res.data || []))
            .catch(() => {})
            .finally(() => setLoadingClinics(false));
    }, [formData.cityId]);

    
    useEffect(() => {
    if (!formData.clinicId) return;

    setLoadingDoctors(true);
    setDoctors([]);

    geoService.getDoctorsByClinic(formData.clinicId)
        .then((res) => {
            console.log("Doctors API response:", res);
            setDoctors(res.data || []);
        })
        .catch((err) => {
            console.error("Doctors API error:", err);
        })
        .finally(() => setLoadingDoctors(false));
}, [formData.clinicId]);

    // Mode label helper
    const modeLabel = formData.consultationMode === "video" ? "Online Video" : formData.consultationMode === "clinic" ? "Offline Clinic" : "Phone Call";

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 3: Clinic & Doctor Selection</h2>
                <p className="text-slate-500 text-sm">
                    Showing doctors available for <span className="font-bold text-medical-teal">{modeLabel}</span> consultations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: State → City → Clinic */}
                <div className="space-y-6">

                    {/* STATE */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">State</label>
                        {loadingStates ? (
                            <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl text-slate-400 text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" /> Loading states...
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {formData.stateName && (
                                    <div className="flex items-center justify-between px-4 py-2 bg-teal-50 border border-teal-100 rounded-xl">
                                        <p className="text-sm font-bold text-medical-teal">✓ {formData.stateName}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateFields({ stateId: "", stateName: "", cityId: "", city: "", clinic: "", clinicId: "", doctorId: "" });
                                                setCities([]); setClinicList([]); setDoctors([]);
                                                setStateSearch("");
                                            }}
                                            className="text-[10px] text-slate-400 hover:text-red-400 font-bold uppercase"
                                        >
                                            Change
                                        </button>
                                    </div>
                                )}
                                {!formData.stateName && (
                                    <>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input
                                                type="text"
                                                placeholder="Search state..."
                                                value={stateSearch}
                                                onChange={e => setStateSearch(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-100 p-3 pl-9 rounded-xl text-sm outline-none focus:ring-2 focus:ring-medical-teal"
                                            />
                                        </div>
                                        <div className="max-h-[180px] overflow-y-auto border border-slate-100 rounded-xl bg-white divide-y divide-slate-50">
                                            {filteredStates.length === 0 ? (
                                                <p className="text-center text-xs text-slate-400 py-4">No results</p>
                                            ) : filteredStates.map(s => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => {
                                                        updateFields({
                                                            stateId: String(s.id),
                                                            stateName: s.state_name,
                                                            cityId: "", city: "", clinic: "", clinicId: "", doctorId: "",
                                                        });
                                                        setCities([]); setClinicList([]); setDoctors([]);
                                                        setStateSearch("");
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-medical-teal transition-colors"
                                                >
                                                    {s.state_name}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CITY */}
                    {formData.stateId && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">City</label>
                            {loadingCities ? (
                                <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl text-slate-400 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading cities...
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {formData.city && (
                                        <div className="flex items-center justify-between px-4 py-2 bg-teal-50 border border-teal-100 rounded-xl">
                                            <p className="text-sm font-bold text-medical-teal">✓ {formData.city}</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    updateFields({ cityId: "", city: "", clinic: "", clinicId: "", doctorId: "" });
                                                    setClinicList([]); setDoctors([]);
                                                    setCitySearch("");
                                                }}
                                                className="text-[10px] text-slate-400 hover:text-red-400 font-bold uppercase"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    )}
                                    {!formData.city && (
                                        <>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                <input
                                                    type="text"
                                                    placeholder="Search city..."
                                                    value={citySearch}
                                                    onChange={e => setCitySearch(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 p-3 pl-9 rounded-xl text-sm outline-none focus:ring-2 focus:ring-medical-teal"
                                                />
                                            </div>
                                            <div className="max-h-[180px] overflow-y-auto border border-slate-100 rounded-xl bg-white divide-y divide-slate-50">
                                                {filteredCities.length === 0 ? (
                                                    <p className="text-center text-xs text-slate-400 py-4">No results</p>
                                                ) : filteredCities.map(c => (
                                                    <button
                                                        key={c.city_id}
                                                        type="button"
                                                        onClick={() => {
                                                            updateFields({
                                                                cityId: String(c.city_id),
                                                                city: c.city_name,
                                                                clinic: "", clinicId: "", doctorId: "",
                                                            });
                                                            setClinicList([]); setDoctors([]);
                                                            setCitySearch("");
                                                        }}
                                                        className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-medical-teal transition-colors"
                                                    >
                                                        {c.city_name}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* CLINIC */}
                    {formData.cityId && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Clinic</label>
                            {loadingClinics ? (
                                <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl text-slate-400 text-sm">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading clinics...
                                </div>
                            ) : clinics.length === 0 ? (
                                <div className="p-4 bg-slate-50 rounded-xl text-slate-400 text-sm text-center border border-dashed border-slate-200">
                                    No clinics found in this city.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="text"
                                            placeholder="Search clinic..."
                                            value={clinicSearch}
                                            onChange={e => setClinicSearch(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 p-3 pl-9 rounded-xl text-sm outline-none focus:ring-2 focus:ring-medical-teal"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 max-h-[240px] overflow-y-auto pr-1">
                                        {filteredClinics.length === 0 ? (
                                            <p className="text-center text-xs text-slate-400 py-4">No results</p>
                                        ) : filteredClinics.map(clinic => (
                                            <button
                                                key={clinic.id}
                                                type="button"
                                                onClick={() => {
                                                    updateFields({ clinic: clinic.name, clinicId: String(clinic.id), doctorId: "" });
                                                    setDoctors([]);
                                                }}
                                                className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${formData.clinicId === String(clinic.id) ? "border-medical-teal bg-teal-50/50 ring-1 ring-medical-teal" : "border-slate-100 hover:border-teal-100"}`}
                                            >
                                                <Hospital className={`w-5 h-5 shrink-0 ${formData.clinicId === String(clinic.id) ? "text-medical-teal" : "text-slate-400"}`} />
                                                <div>
                                                    <span className={`text-sm font-semibold block ${formData.clinicId === String(clinic.id) ? "text-slate-900" : "text-slate-600"}`}>{clinic.name}</span>
                                                    <span className="text-[10px] text-slate-400">{clinic.city}, {clinic.state}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Doctors (filtered by mode) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Available Specialists</label>
                        {formData.clinicId && !loadingDoctors && doctors.length > 0 && (
                            <span className="text-[9px] font-bold text-medical-teal uppercase tracking-widest bg-teal-50 px-2 py-1 rounded-full border border-teal-100">
                                {filteredDoctors.length} of {doctors.length} match your mode
                            </span>
                        )}
                    </div>

                    {!formData.clinicId ? (
                        <div className="h-[200px] bg-slate-50 border border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Hospital className="w-8 h-8 opacity-20" />
                            <p className="text-xs font-medium">Please select a clinic first.</p>
                        </div>
                    ) : loadingDoctors ? (
                        <div className="h-[200px] bg-slate-50 rounded-[28px] flex items-center justify-center gap-2 text-slate-400 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading doctors...
                        </div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="h-[200px] bg-slate-50 border border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-3 text-slate-400 px-6 text-center">
                            <User className="w-8 h-8 opacity-20" />
                            <p className="text-xs font-medium">
                                {doctors.length === 0
                                    ? "No doctors assigned to this clinic."
                                    : `No doctors available for ${modeLabel} in this clinic. Try a different mode or clinic.`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredDoctors.map((doc: any) => (
                                <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => updateFields({ doctorId: String(doc.id) })}
                                    className={`w-full p-5 rounded-[28px] border text-left transition-all flex items-start gap-4 ${formData.doctorId === String(doc.id) ? "border-medical-teal bg-teal-50/50 ring-1 ring-medical-teal" : "border-slate-100 hover:border-teal-100 bg-white"}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${formData.doctorId === String(doc.id) ? "bg-medical-teal text-white" : "bg-slate-50 text-slate-400"}`}>
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-slate-900">{doc.full_name}</h5>
                                        <p className="text-[10px] font-bold text-medical-teal uppercase tracking-widest mb-1">{doc.specialization}</p>
                                        {doc.bio && <p className="text-xs text-slate-500 leading-relaxed italic">&quot;{doc.bio}&quot;</p>}
                                        {/* Show available modes as small badges */}
                                        {doc.consultation_preferences && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {doc.consultation_preferences.split(",").map((m: string) => (
                                                    <span key={m.trim()} className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${m.trim().toLowerCase() === formData.consultationMode ? "bg-medical-teal text-white border-medical-teal" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                                                        {m.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- STEP 4: Date & Time Schedule ---
const Step4Schedule = ({ formData, updateFields }: StepProps) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 4: Schedule Details</h2>
            <p className="text-slate-500 text-sm">Select when you want your <span className="font-bold text-medical-teal capitalize">{formData.consultationMode === "video" ? "Online Video" : formData.consultationMode === "clinic" ? "Offline Clinic" : "Phone Call"}</span> appointment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Select Date *</label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                        type="date"
                        className="w-full bg-slate-50 border-slate-100 border p-5 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all font-medium text-slate-700"
                        value={formData.date}
                        onChange={(e) => updateFields({ date: e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Available Slots *</label>
                <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => updateFields({ time: slot })}
                            className={`py-3 px-1 rounded-xl text-[10px] font-bold tracking-tighter border transition-all ${formData.time === slot ? "bg-medical-teal border-medical-teal text-white shadow-lg shadow-teal-100" : "bg-white border-slate-100 text-slate-500 hover:border-teal-200"}`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- STEP 5: Medical Info ---
const Step5Medical = ({ formData, updateFields }: StepProps) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 5: Medical Environment</h2>
            <p className="text-slate-500 text-sm">Help our clinical team prepare for your intake.</p>
        </div>
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Reason for Session</label>
                <textarea
                    placeholder="Briefly describe your symptoms or reason for visit..."
                    className="w-full bg-slate-50 border-slate-100 border p-5 rounded-[28px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium resize-none min-h-[120px]"
                    value={formData.reason}
                    onChange={(e) => updateFields({ reason: e.target.value })}
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Chronic Conditions" placeholder="e.g. Asthma, Diabetes" value={formData.conditions} onChange={(val) => updateFields({ conditions: val })} />
                <Input label="Regular Medications" placeholder="e.g. Insulin, Aspirin" value={formData.medications} onChange={(val) => updateFields({ medications: val })} />
            </div>
        </div>
    </div>
);

// --- STEP 6: Payment ---
const Step6Payment = ({ formData, updateFields }: StepProps) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 6: Payment Portal</h2>
            <p className="text-slate-500 text-sm">Select your preferred method for settlement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
                type="button"
                onClick={() => updateFields({ paymentMethod: "cash" })}
                className={`p-10 rounded-[36px] border-2 transition-all flex flex-col items-center gap-6 group ${formData.paymentMethod === "cash" ? "border-medical-teal bg-teal-50/30" : "border-slate-50 hover:border-teal-100"}`}
            >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${formData.paymentMethod === "cash" ? "bg-medical-teal text-white shadow-xl shadow-teal-200" : "bg-slate-100 text-slate-400 group-hover:bg-teal-50"}`}>
                    <Hospital className="w-8 h-8" />
                </div>
                <div className="text-center">
                    <h4 className="font-bold text-slate-900 text-lg mb-1">First Visit & Pay</h4>
                    <p className="text-xs text-slate-500">Settle your account at the clinic front desk upon arrival.</p>
                </div>
            </button>

            <button
                type="button"
                onClick={() => updateFields({ paymentMethod: "qr" })}
                className={`p-10 rounded-[36px] border-2 transition-all flex flex-col items-center gap-6 group ${formData.paymentMethod === "qr" ? "border-medical-teal bg-teal-50/30" : "border-slate-50 hover:border-teal-100"}`}
            >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${formData.paymentMethod === "qr" ? "bg-medical-teal text-white shadow-xl shadow-teal-200" : "bg-slate-100 text-slate-400 group-hover:bg-teal-50"}`}>
                    <QrCode className="w-8 h-8" />
                </div>
                <div className="text-center">
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Scan & Instant Pay</h4>
                    <p className="text-xs text-slate-500">Secure digital payment via UPI / Bank QR code.</p>
                </div>
            </button>
        </div>

        {formData.paymentMethod === "qr" && (
            <div className="p-10 bg-white border border-slate-100 rounded-[36px] animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-48 h-48 bg-slate-50 rounded-[28px] border-2 border-dashed border-slate-200 flex items-center justify-center relative group">
                        <QrCode className="w-16 h-16 text-slate-200 group-hover:text-medical-teal transition-colors" />
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[28px] flex items-center justify-center">
                            <span className="text-[10px] font-bold text-medical-teal uppercase tracking-[0.2em] bg-white px-3 py-1.5 rounded-full shadow-sm">Sample QR</span>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-sm font-bold text-slate-800">Scan to initiate transfer</p>
                        <p className="text-xs text-slate-400 max-w-[280px]">Please upload your transfer screenshot below after completion.</p>
                    </div>
                    <label className="w-full flex items-center justify-center p-5 border-2 border-dashed border-teal-100 bg-teal-50/20 rounded-2xl cursor-pointer hover:bg-teal-50 transition-colors">
                        <input type="file" className="hidden" />
                        <span className="text-[10px] font-bold text-medical-teal uppercase tracking-widest">Upload Receipt Image</span>
                    </label>
                </div>
            </div>
        )}

        {/* Summary review before final confirm */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Appointment Summary</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SummaryCard
                    title="Patient Protocol"
                    icon={User}
                    onEdit={() => {}}
                    rows={[
                        { label: "Patient ID", value: formData.patientId },
                        { label: "Profile", value: formData.fullName || "Existing Record" },
                        { label: "Contact", value: formData.phone }
                    ]}
                />
                <SummaryCard
                    title="Clinical Node"
                    icon={Hospital}
                    onEdit={() => {}}
                    rows={[
                        { label: "Mode", value: formData.consultationMode === "video" ? "Online Video" : formData.consultationMode === "clinic" ? "Offline Clinic" : "Phone Call" },
                        { label: "Facility", value: formData.clinic },
                        { label: "Schedule", value: formData.date && formData.time ? `${formData.date} at ${formData.time}` : "Not set" },
                    ]}
                />
            </div>
        </div>

        <div className="p-8 bg-teal-600 rounded-[32px] text-white space-y-4 shadow-xl shadow-teal-900/10">
            <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" />
                <h4 className="text-lg font-bold">Automated Notifications Activated</h4>
            </div>
            <p className="text-sm text-teal-50/80 leading-relaxed">You will receive the following via <span className="text-white font-bold italic">Email, SMS, WhatsApp & Telegram:</span></p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs font-medium text-teal-100">
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> Booking & Payment Receipt</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> HD Link for Video (Zoom/Meet)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> 4-5 Hour Prior Reminder</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4" /> 1-Hour Final Alert</li>
            </ul>
        </div>
    </div>
);

// --- CORE UI ELEMENTS ---

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    onChange: (value: string) => void;
}

const Input = ({ label, value, onChange, ...props }: InputProps) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">{label}</label>
        <input
            className="w-full bg-slate-50 border-slate-100 border p-4 rounded-xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            {...props}
        />
    </div>
);

interface ModeCardProps {
    title: string;
    desc: string;
    icon: React.ElementType;
    active: boolean;
    onClick: () => void;
    id: string;
}

const ModeCard = ({ title, desc, icon: Icon, active, onClick }: ModeCardProps) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-8 rounded-[28px] border-2 text-left transition-all flex flex-col gap-5 ${active ? "border-medical-teal bg-teal-50/50 shadow-inner" : "border-slate-100 bg-white hover:border-teal-200"}`}
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? "bg-medical-teal text-white shadow-lg shadow-teal-100" : "bg-slate-100 text-slate-300"}`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <h5 className="font-bold text-slate-900 text-base mb-1">{title}</h5>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        </div>
    </button>
);

interface SummaryCardProps {
    title: string;
    icon: React.ElementType;
    onEdit: () => void;
    rows: { label: string; value: string }[];
}

const SummaryCard = ({ title, icon: Icon, onEdit, rows }: SummaryCardProps) => (
    <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 relative group">
        <h5 className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            <Icon className="w-3 h-3" /> {title}
        </h5>
        <div className="space-y-3">
            {rows.map((row, i) => (
                <div key={i}>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{row.label}</p>
                    <p className="text-sm font-bold text-slate-800">{row.value || "Not Set"}</p>
                </div>
            ))}
        </div>
    </div>
);

const SuccessCard = ({ formData }: { formData: FormData }) => {
    return (
        <div className="min-h-screen bg-medical-slate-bg flex items-center justify-center p-6 animate-in zoom-in-95 duration-500 font-sans">
            <div className="max-w-2xl w-full bg-white border border-slate-100 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full translate-x-20 -translate-y-20 -z-1" />

                <div className="text-center space-y-6 mb-12 relative z-10">
                    <div className="w-24 h-24 bg-teal-50 text-medical-teal rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-100 rotate-12">
                        <CheckCircle2 className="w-12 h-12 -rotate-12" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Registration Complete</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Active Appointment Status
                    </div>
                    <p className="text-slate-500 max-w-sm mx-auto">Your medical intake is successful. Our care coordinator will contact you shortly.</p>
                </div>

                <div className="bg-slate-50/50 rounded-[40px] border border-slate-100 p-8 space-y-8 mb-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Detail label="Patient ID" value={formData.patientId} accent />
                        <Detail label="Appt ID" value={formData.appointmentId} accent />
                        <Detail label="Patient" value={formData.fullName || "Historical Name"} />
                        <Detail label="Mode" value={formData.consultationMode === "video" ? "Online Video" : formData.consultationMode === "clinic" ? "Offline Clinic" : "Phone Call"} />
                        <Detail label="State" value={formData.stateName} />
                        <Detail label="City" value={formData.city} />
                        <Detail label="Clinic" value={formData.clinic} />
                        <Detail label="Date" value={formData.date} />
                        <Detail label="Slot" value={formData.time} />
                        <Detail label="Payment" value={formData.paymentMethod === "cash" ? "Verify at Clinic" : "Digital Pending"} />
                    </div>
                </div>

                <div className="p-8 bg-teal-50 rounded-[32px] border border-teal-100 mb-10 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-medical-teal shrink-0 mt-1" />
                    <div className="space-y-1">
                        <h5 className="font-bold text-medical-teal text-sm">Automated Schedule Locked</h5>
                        <p className="text-xs text-medical-teal/70 leading-relaxed font-medium">Notifications sent to your registered channels. You can reschedule this appointment within <span className="font-bold">30 days</span> using your Patient ID.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link href="/" className="btn-primary w-full justify-center !py-5 !rounded-3xl shadow-xl shadow-teal-600/10">
                        Go to Portal
                    </Link>
                    <button className="btn-secondary w-full justify-center !py-5 !rounded-3xl">
                        Print Slip
                    </button>
                </div>
            </div>
        </div>
    );
};

interface DetailProps {
    label: string;
    value: string;
    accent?: boolean;
}

const Detail = ({ label, value, accent }: DetailProps) => (
    <div className="space-y-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={`text-sm font-bold ${accent ? "text-medical-teal" : "text-slate-900"}`}>{value}</p>
    </div>
);

const UpdatedSuccessCard = ({ appointment, onClose }: { appointment: any; onClose: () => void }) => {
    return (
        <div className="min-h-screen bg-medical-slate-bg flex items-center justify-center p-6 animate-in zoom-in-95 duration-500 font-sans">
            <div className="max-w-2xl w-full bg-white border border-slate-100 rounded-[48px] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-teal-50 rounded-full translate-x-20 -translate-y-20 -z-1" />

                <div className="text-center space-y-6 mb-12 relative z-10">
                    <div className="w-24 h-24 bg-teal-50 text-medical-teal rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-100 rotate-12">
                        <CheckCircle2 className="w-12 h-12 -rotate-12" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Updated Schedule</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-100 text-[10px] font-bold uppercase tracking-widest">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Updated Appointment Status
                    </div>
                    <p className="text-slate-500 max-w-sm mx-auto">Your schedule has been successfully updated. Our care coordinator will contact you shortly.</p>
                </div>

                <div className="bg-slate-50/50 rounded-[40px] border border-slate-100 p-8 space-y-8 mb-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Detail label="Patient ID" value={appointment.patientId} accent />
                        <Detail label="Appt ID" value={appointment.id} accent />
                        <Detail label="Patient" value={appointment.fullName || "Historical Name"} />
                        <Detail label="Mode" value={appointment.consultationMode === "video" ? "Online Video" : appointment.consultationMode === "clinic" ? "Offline Clinic" : "Phone Call"} />
                        <Detail label="State" value={appointment.stateName} />
                        <Detail label="City" value={appointment.city} />
                        <Detail label="Clinic" value={appointment.clinic} />
                        <Detail label="Date" value={appointment.date} />
                        <Detail label="Slot" value={appointment.time} />
                        <Detail label="Payment" value={appointment.paymentMethod === "cash" ? "Verify at Clinic" : "Digital Pending"} />
                    </div>
                </div>

                <div className="p-8 bg-teal-50 rounded-[32px] border border-teal-100 mb-10 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-medical-teal shrink-0 mt-1" />
                    <div className="space-y-1">
                        <h5 className="font-bold text-medical-teal text-sm">Automated Schedule Updated</h5>
                        <p className="text-xs text-medical-teal/70 leading-relaxed font-medium">Updated notification alerts sent to your registered channels. You can modify this appointment again anytime within <span className="font-bold">30 days</span>.</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={onClose} className="btn-primary w-full justify-center !py-5 !rounded-3xl shadow-xl shadow-teal-600/10">
                        Go to Portal
                    </button>
                    <button className="btn-secondary w-full justify-center !py-5 !rounded-3xl">
                        Print Slip
                    </button>
                </div>
            </div>
        </div>
    );
};

