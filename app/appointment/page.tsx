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
    AlertCircle
} from "lucide-react";

// --- MOCK DATA ---
const CITIES = ["New York", "San Francisco", "Los Angeles", "Chicago"];
const CLINICS: Record<string, string[]> = {
    "New York": ["Manhattan Medical Hub", "Brooklyn Health Center", "Queens Specialty Clinic"],
    "San Francisco": ["Bay Area Health", "Mission District Clinic"],
    "Los Angeles": ["Beverly Hills Medical", "Santa Monica Wellness"],
    "Chicago": ["Downtown Chicago Care", "NorthSide Clinic"]
};
const DOCTORS = [
    { id: "1", name: "Dr. Sarah Mitchell", specialty: "Cardiologist", bio: "15+ years experience in heart health.", clinics: ["Manhattan Medical Hub", "Bay Area Health"] },
    { id: "2", name: "Dr. James Wilson", specialty: "Neurologist", bio: "Leading researcher in neuro-sciences.", clinics: ["Brooklyn Health Center", "Beverly Hills Medical"] },
    { id: "3", name: "Dr. Michael Chen", specialty: "Internal Medicine", bio: "Expert in comprehensive wellness.", clinics: ["Manhattan Medical Hub", "Downtown Chicago Care"] },
    { id: "4", name: "Dr. Emily Blunt", specialty: "Pediatrician", bio: "Dedicated to child health and development.", clinics: ["Queens Specialty Clinic", "Mission District Clinic"] },
];

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
    city: string;
    clinic: string;
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
    city: "",
    clinic: "",
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
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return <SuccessCard formData={formData} />;
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
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Portal</h1>
                        <p className="text-slate-500 text-sm">Precision care starts with a simple choice.</p>
                    </div>
                    <Stepper currentStep={currentStep} />
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
                        {currentStep === 1 && <Step1 formData={formData} updateFields={updateFields} />}
                        {currentStep === 2 && <Step2 formData={formData} updateFields={updateFields} />}
                        {currentStep === 3 && <Step3 formData={formData} updateFields={updateFields} />}
                        {currentStep === 4 && <Step4 formData={formData} updateFields={updateFields} />}
                        {currentStep === 5 && <Step5 formData={formData} updateFields={updateFields} />}
                        {currentStep === 6 && <Step6 formData={formData} setCurrentStep={setCurrentStep} />}

                        <div className="flex justify-between items-center pt-10 border-t border-slate-100">
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
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = [
        { id: 0, icon: User },
        { id: 1, icon: SearchIcon },
        { id: 2, icon: MapPin },
        { id: 3, icon: Clock },
        { id: 4, icon: HeartPulse },
        { id: 5, icon: CreditCard },
        { id: 6, icon: CheckCircle2 },
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
}

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

const Step1 = ({ formData, updateFields }: StepProps) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 1: Patient Identity</h2>
            <p className="text-slate-500 text-sm">
                {formData.patientType === "new" ? "Creating your unique medical profile." : "Locate your historical records."}
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
                    <Input label="Mobile Number" type="tel" placeholder="+1 (000) 000-0000" value={formData.phone} onChange={(val) => updateFields({ phone: val })} required />
                    <Input label="Date of Birth" type="date" value={formData.dob} onChange={(val) => updateFields({ dob: val })} required />
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors"><SearchIcon className="w-5 h-5" /></div>
                    <input
                        type="text"
                        placeholder="Enter Patient ID (e.g. CRM-2025-XXXX) or Phone Number"
                        className="w-full bg-slate-50 border-slate-100 border p-5 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal outline-none transition-all text-sm font-medium"
                        value={formData.patientId}
                        onChange={(e) => updateFields({ patientId: e.target.value })}
                        required
                    />
                </div>
                <div className="p-10 border border-dashed border-slate-200 rounded-[32px] text-center space-y-2">
                    <p className="text-sm font-medium text-slate-400">Search results will appear here after verification.</p>
                </div>
            </div>
        )}
    </div>
);

const Step2 = ({ formData, updateFields }: StepProps) => {
    const filteredDoctors = useMemo(() => {
        return DOCTORS.filter(d => d.clinics.includes(formData.clinic));
    }, [formData.clinic]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 2: Clinic & Professional Selection</h2>
                <p className="text-slate-500 text-sm">Find the right workspace and specialist for your needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Target City</label>
                        <Select
                            value={formData.city}
                            onChange={(val) => updateFields({ city: val, clinic: "", doctorId: "" })}
                            options={CITIES}
                            placeholder="Select Location"
                        />
                    </div>
                    {formData.city && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Clinic</label>
                            <div className="grid grid-cols-1 gap-3">
                                {CLINICS[formData.city].map(clinic => (
                                    <button
                                        key={clinic}
                                        type="button"
                                        onClick={() => updateFields({ clinic, doctorId: "" })}
                                        className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${formData.clinic === clinic ? "border-medical-teal bg-teal-50/50 ring-1 ring-medical-teal" : "border-slate-100 hover:border-teal-100"}`}
                                    >
                                        <Hospital className={`w-5 h-5 ${formData.clinic === clinic ? "text-medical-teal" : "text-slate-400"}`} />
                                        <span className={`text-sm font-semibold ${formData.clinic === clinic ? "text-slate-900" : "text-slate-600"}`}>{clinic}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Available Specialists</label>
                    {formData.clinic ? (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredDoctors.map(doc => (
                                <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => updateFields({ doctorId: doc.id })}
                                    className={`w-full p-5 rounded-[28px] border text-left transition-all flex items-start gap-4 ${formData.doctorId === doc.id ? "border-medical-teal bg-teal-50/50 ring-1 ring-medical-teal" : "border-slate-100 hover:border-teal-100 bg-white"}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${formData.doctorId === doc.id ? "bg-medical-teal text-white" : "bg-slate-50 text-slate-400"}`}>
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">{doc.name}</h5>
                                        <p className="text-[10px] font-bold text-medical-teal uppercase tracking-widest mb-2">{doc.specialty}</p>
                                        <p className="text-xs text-slate-500 leading-relaxed italic">&quot;{doc.bio}&quot;</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="h-[200px] bg-slate-50 border border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Hospital className="w-8 h-8 opacity-20" />
                            <p className="text-xs font-medium">Please select a clinic first.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Step3 = ({ formData, updateFields }: StepProps) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 3: Schedule Details</h2>
            <p className="text-slate-500 text-sm">Select how and when you want to consult the doctor.</p>
        </div>

        <div className="space-y-10">
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Consultation Mode *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ModeCard
                        id="video"
                        title="Online Video"
                        desc="Consult from home"
                        icon={Video}
                        active={formData.consultationMode === "video"}
                        onClick={() => updateFields({ consultationMode: "video" })}
                    />
                    <ModeCard
                        id="clinic"
                        title="Offline Clinic"
                        desc="Visit the hospital"
                        icon={Hospital}
                        active={formData.consultationMode === "clinic"}
                        onClick={() => updateFields({ consultationMode: "clinic" })}
                    />
                    <ModeCard
                        id="phone"
                        title="Phone Call"
                        desc="Direct doctor call"
                        icon={Phone}
                        active={formData.consultationMode === "phone"}
                        onClick={() => updateFields({ consultationMode: "phone" })}
                    />
                </div>
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
    </div>
);

const Step4 = ({ formData, updateFields }: StepProps) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 4: Medical Environment</h2>
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

const Step5 = ({ formData, updateFields }: StepProps) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 5: Payment Portal</h2>
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
    </div>
);

const Step6 = ({ formData, setCurrentStep }: { formData: FormData; setCurrentStep: (step: number) => void }) => {
    const doctor = DOCTORS.find(d => d.id === formData.doctorId);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 6: Institutional Review</h2>
                <p className="text-slate-500 text-sm">Confirm your clinical parameters for unified record entry.</p>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Info */}
                    <SummaryCard
                        title="Patient Protocol"
                        icon={User}
                        onEdit={() => setCurrentStep(1)}
                        rows={[
                            { label: "Patient ID", value: formData.patientId },
                            { label: "Appt ID", value: formData.appointmentId },
                            { label: "Profile", value: formData.fullName || "Existing Record" },
                            { label: "Contact", value: formData.phone }
                        ]}
                    />
                    {/* Clinic Info */}
                    <SummaryCard
                        title="Clinical Node"
                        icon={Hospital}
                        onEdit={() => setCurrentStep(2)}
                        rows={[
                            { label: "Facility", value: formData.clinic },
                            { label: "Specialist", value: doctor?.name || "Pending" },
                            { label: "Location", value: formData.city }
                        ]}
                    />
                </div>

                {/* Schedule */}
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-medical-teal shadow-sm"><Clock className="w-6 h-6" /></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Session Timeline</p>
                            <h4 className="text-xl font-bold text-slate-900">{formData.date} at {formData.time}</h4>
                            <p className="text-xs text-medical-teal font-bold tracking-widest uppercase mt-1 flex items-center gap-1">
                                <div className="w-1 h-1 bg-medical-teal rounded-full animate-pulse" /> {formData.consultationMode} CONSULTATION
                            </p>
                        </div>
                    </div>
                    <button type="button" onClick={() => setCurrentStep(3)} className="text-[10px] font-bold text-medical-teal uppercase hover:underline">Change Schedule</button>
                </div>

                {/* Notification Alert */}
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
        </div>
    );
};

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

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
}

const Select = ({ value, onChange, options, placeholder }: SelectProps) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border-slate-100 border p-4 rounded-xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium appearance-none"
    >
        <option value="">{placeholder}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
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
        className={`p-5 rounded-[24px] border-2 text-left transition-all flex flex-col gap-4 ${active ? "border-medical-teal bg-teal-50/50" : "border-slate-50 bg-white hover:border-teal-100"}`}
    >
        <Icon className={`w-8 h-8 ${active ? "text-medical-teal" : "text-slate-300"}`} />
        <div>
            <h5 className="font-bold text-slate-900 text-sm">{title}</h5>
            <p className="text-[10px] text-slate-500">{desc}</p>
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
        <button type="button" onClick={onEdit} className="absolute top-4 right-4 text-[9px] font-bold text-medical-teal uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
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
    const doctor = DOCTORS.find(d => d.id === formData.doctorId);

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
                        <Detail label="Clinic" value={formData.clinic} />
                        <Detail label="Doctor" value={doctor?.name || "Lumina General"} />
                        <Detail label="Date" value={formData.date} />
                        <Detail label="Slot" value={formData.time} />
                        <Detail label="ID Verify" value="Internal-0k" />
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
