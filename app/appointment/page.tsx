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
} from "lucide-react";
// import { clinicService, geoService } from "@/lib/api";
import { clinicService, geoService, appointmentService } from "@/lib/api";

// --- MOCK DATA (only TIME_SLOTS remain) ---
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

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (currentStep < 6) {
    //         if (currentStep === 5 && !formData.appointmentId) {
    //             updateFields({ appointmentId: generateAppointmentId() });
    //         }
    //         next();
    //     } else {
    //         setIsSubmitted(true);
    //     }
    // }; 

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
                // optional: toast.error(err.message || "Booking failed");
            });
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

// const Step1 = ({ formData, updateFields }: StepProps) => (
//     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
//         <div>
//             <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 1: Patient Identity</h2>
//             <p className="text-slate-500 text-sm">
//                 {formData.patientType === "new" ? "Creating your unique medical profile." : "Locate your historical records."}
//             </p>
//         </div>

//         {formData.patientType === "new" ? (
//             <div className="space-y-8">
//                 <div className="p-6 bg-teal-50 rounded-[28px] border border-teal-100 flex items-center justify-between">
//                     <div>
//                         <p className="text-[10px] font-bold text-medical-teal tracking-widest uppercase mb-1">Generated ID</p>
//                         <p className="text-2xl font-bold text-medical-teal-dark tracking-tighter">{formData.patientId}</p>
//                     </div>
//                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-medical-teal shadow-sm"><Check className="w-6 h-6" /></div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <Input label="Full Medical Name" placeholder="John Doe" value={formData.fullName} onChange={(val) => updateFields({ fullName: val })} required />
//                     <Input label="Email Address" type="email" placeholder="name@active.com" value={formData.email} onChange={(val) => updateFields({ email: val })} required />
//                     <Input label="Mobile Number" type="tel" placeholder="+1 (000) 000-0000" value={formData.phone} onChange={(val) => updateFields({ phone: val })} required />
//                     <Input label="Date of Birth" type="date" value={formData.dob} onChange={(val) => updateFields({ dob: val })} required />
//                 </div>
//             </div>
//         ) : (
//             <div className="space-y-6">
//                 <div className="relative group">
//                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors"><SearchIcon className="w-5 h-5" /></div>
//                     <input
//                         type="text"
//                         placeholder="Enter Patient ID (e.g. CRM-2025-XXXX) or Phone Number"
//                         className="w-full bg-slate-50 border-slate-100 border p-5 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal/20 focus:border-medical-teal outline-none transition-all text-sm font-medium"
//                         value={formData.patientId}
//                         onChange={(e) => updateFields({ patientId: e.target.value })}
//                         required
//                     />
//                 </div>
//                 <div className="p-10 border border-dashed border-slate-200 rounded-[32px] text-center space-y-2">
//                     <p className="text-sm font-medium text-slate-400">Search results will appear here after verification.</p>
//                 </div>
//             </div>
//         )}
//     </div>
// );

const Step1 = ({ formData, updateFields }: StepProps) => {
    const [phoneError, setPhoneError] = useState("");
 
    const handlePhone = (val: string) => {
        const digits = val.replace(/\D/g, "").slice(0, 10);
        updateFields({ phone: digits });
        if (digits.length > 0 && digits.length < 10) {
            setPhoneError("Phone number must be exactly 10 digits");
        } else {
            setPhoneError("");
        }
    };
 
    return (
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
                        {/* Phone with validation */}
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
};

// --- STEP 2: Real API Integration ---
// const Step2 = ({ formData, updateFields }: StepProps) => {
//     const [states, setStates] = useState<{ id: number; state_name: string }[]>([]);
//     const [cities, setCities] = useState<{ city_id: number; city_name: string }[]>([]);
//     const [clinics, setClinicList] = useState<any[]>([]);
//     const [doctors, setDoctors] = useState<any[]>([]);
//     const [loadingStates, setLoadingStates] = useState(true);
//     const [loadingCities, setLoadingCities] = useState(false);
//     const [loadingClinics, setLoadingClinics] = useState(false);
//     const [loadingDoctors, setLoadingDoctors] = useState(false);

//     // Fetch states on mount
//     useEffect(() => {
//         geoService.getStates()
//             .then(res => setStates(res.data || []))
//             .catch(() => {})
//             .finally(() => setLoadingStates(false));
//     }, []);

//     // Fetch cities when state changes
//     useEffect(() => {
//         if (!formData.stateId) return;
//         setLoadingCities(true);
//         setCities([]);
//         geoService.getCities(formData.stateId)
//             .then(res => setCities(res.data || []))
//             .catch(() => {})
//             .finally(() => setLoadingCities(false));
//     }, [formData.stateId]);

    

//     useEffect(() => {
//     if (!formData.cityId || !formData.stateName || !formData.city) return;
//     setLoadingClinics(true);
//     setClinicList([]);
//     geoService.getClinicsByLocation(formData.stateName, formData.city)
//         .then(res => setClinicList(res.data || []))
//         .catch(() => {})
//         .finally(() => setLoadingClinics(false));
// }, [formData.cityId]);

    

//     useEffect(() => {
//     if (!formData.clinicId) return;
//     setLoadingDoctors(true);
//     setDoctors([]);
//     geoService.getDoctorsByClinic(formData.clinicId)
//         .then(res => setDoctors(res.data || []))
//         .catch(() => {})
//         .finally(() => setLoadingDoctors(false));
// }, [formData.clinicId]);

//     return (
//         <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div>
//                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 2: Clinic & Professional Selection</h2>
//                 <p className="text-slate-500 text-sm">Find the right workspace and specialist for your needs.</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Left: State → City → Clinic */}
//                 <div className="space-y-6">
//                     {/* State */}
//                     <div className="space-y-2">
//                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">State</label>
//                         {loadingStates ? (
//                             <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl text-slate-400 text-sm">
//                                 <Loader2 className="w-4 h-4 animate-spin" /> Loading states...
//                             </div>
//                         ) : (
//                             <select
//                                 value={formData.stateId || ""}
//                                 onChange={(e) => {
//                                     const selected = states.find(s => s.id === Number(e.target.value));
//                                     updateFields({
//                                         stateId: e.target.value,
//                                         stateName: selected?.state_name || "",
//                                         cityId: "",
//                                         city: "",
//                                         clinic: "",
//                                         clinicId: "",
//                                         doctorId: "",
//                                     });
//                                     setCities([]);
//                                     setClinicList([]);
//                                     setDoctors([]);
//                                 }}
//                                 className="w-full bg-slate-50 border-slate-100 border p-4 rounded-xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium appearance-none"
//                             >
//                                 <option value="">Select State</option>
//                                 {states.map(s => (
//                                     <option key={s.id} value={s.id}>{s.state_name}</option>
//                                 ))}
//                             </select>
//                         )}
//                     </div>

//                     {/* City */}
//                     {formData.stateId && (
//                         <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
//                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">City</label>
//                             {loadingCities ? (
//                                 <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl text-slate-400 text-sm">
//                                     <Loader2 className="w-4 h-4 animate-spin" /> Loading cities...
//                                 </div>
//                             ) : (
//                                 <select
//                                     value={formData.cityId || ""}
//                                     onChange={(e) => {
//                                         const selected = cities.find(c => c.city_id === Number(e.target.value));
//                                         updateFields({
//                                             cityId: e.target.value,
//                                             city: selected?.city_name || "",
//                                             clinic: "",
//                                             clinicId: "",
//                                             doctorId: "",
//                                         });
//                                         setClinicList([]);
//                                         setDoctors([]);
//                                     }}
//                                     className="w-full bg-slate-50 border-slate-100 border p-4 rounded-xl focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium appearance-none"
//                                 >
//                                     <option value="">Select City</option>
//                                     {cities.map(c => (
//                                         <option key={c.city_id} value={c.city_id}>{c.city_name}</option>
//                                     ))}
//                                 </select>
//                             )}
//                         </div>
//                     )}

//                     {/* Clinics */}
//                     {formData.cityId && (
//                         <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
//                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Clinic</label>
//                             {loadingClinics ? (
//                                 <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-xl text-slate-400 text-sm">
//                                     <Loader2 className="w-4 h-4 animate-spin" /> Loading clinics...
//                                 </div>
//                             ) : clinics.length === 0 ? (
//                                 <div className="p-4 bg-slate-50 rounded-xl text-slate-400 text-sm text-center border border-dashed border-slate-200">
//                                     No clinics found in this city.
//                                 </div>
//                             ) : (
//                                 <div className="grid grid-cols-1 gap-3 max-h-[280px] overflow-y-auto pr-1">
//                                     {clinics.map(clinic => (
//                                         <button
//                                             key={clinic.id}
//                                             type="button"
//                                             onClick={() => {
//                                                 updateFields({
//                                                     clinic: clinic.name,
//                                                     clinicId: String(clinic.id),
//                                                     doctorId: "",
//                                                 });
//                                                 setDoctors([]);
//                                             }}
//                                             className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${formData.clinicId === String(clinic.id) ? "border-medical-teal bg-teal-50/50 ring-1 ring-medical-teal" : "border-slate-100 hover:border-teal-100"}`}
//                                         >
//                                             <Hospital className={`w-5 h-5 shrink-0 ${formData.clinicId === String(clinic.id) ? "text-medical-teal" : "text-slate-400"}`} />
//                                             <div>
//                                                 <span className={`text-sm font-semibold block ${formData.clinicId === String(clinic.id) ? "text-slate-900" : "text-slate-600"}`}>{clinic.name}</span>
//                                                 <span className="text-[10px] text-slate-400">{clinic.city}, {clinic.state}</span>
//                                             </div>
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {/* Right: Doctors */}
//                 <div className="space-y-4">
//                     <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Available Specialists</label>
//                     {!formData.clinicId ? (
//                         <div className="h-[200px] bg-slate-50 border border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-3 text-slate-400">
//                             <Hospital className="w-8 h-8 opacity-20" />
//                             <p className="text-xs font-medium">Please select a clinic first.</p>
//                         </div>
//                     ) : loadingDoctors ? (
//                         <div className="h-[200px] bg-slate-50 rounded-[28px] flex items-center justify-center gap-2 text-slate-400 text-sm">
//                             <Loader2 className="w-4 h-4 animate-spin" /> Loading doctors...
//                         </div>
//                     ) : doctors.length === 0 ? (
//                         <div className="h-[200px] bg-slate-50 border border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-3 text-slate-400">
//                             <User className="w-8 h-8 opacity-20" />
//                             <p className="text-xs font-medium">No doctors assigned to this clinic.</p>
//                         </div>
//                     ) : (
//                         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
//                             {doctors.map((doc: any) => (
//                                 <button
//                                     key={doc.id}
//                                     type="button"
//                                     onClick={() => updateFields({ doctorId: String(doc.id) })}
//                                     className={`w-full p-5 rounded-[28px] border text-left transition-all flex items-start gap-4 ${formData.doctorId === String(doc.id) ? "border-medical-teal bg-teal-50/50 ring-1 ring-medical-teal" : "border-slate-100 hover:border-teal-100 bg-white"}`}
//                                 >
//                                     <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${formData.doctorId === String(doc.id) ? "bg-medical-teal text-white" : "bg-slate-50 text-slate-400"}`}>
//                                         <User className="w-6 h-6" />
//                                     </div>
//                                     <div>
//                                         <h5 className="font-bold text-slate-900">{doc.full_name}</h5>
//                                         <p className="text-[10px] font-bold text-medical-teal uppercase tracking-widest mb-1">{doc.specialty || doc.specialization}</p>
//                                         {doc.bio && <p className="text-xs text-slate-500 leading-relaxed italic">&quot;{doc.bio}&quot;</p>}
//                                     </div>
//                                 </button>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

const Step2 = ({ formData, updateFields }: StepProps) => {
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
            .then(res => setDoctors(res.data || []))
            .catch(() => {})
            .finally(() => setLoadingDoctors(false));
    }, [formData.clinicId]);
 
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 2: Clinic & Professional Selection</h2>
                <p className="text-slate-500 text-sm">Find the right workspace and specialist for your needs.</p>
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
                                {/* Selected display */}
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
 
                {/* Right: Doctors */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Available Specialists</label>
                    {!formData.clinicId ? (
                        <div className="h-[200px] bg-slate-50 border border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Hospital className="w-8 h-8 opacity-20" />
                            <p className="text-xs font-medium">Please select a clinic first.</p>
                        </div>
                    ) : loadingDoctors ? (
                        <div className="h-[200px] bg-slate-50 rounded-[28px] flex items-center justify-center gap-2 text-slate-400 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading doctors...
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="h-[200px] bg-slate-50 border border-dashed border-slate-200 rounded-[28px] flex flex-col items-center justify-center gap-3 text-slate-400">
                            <User className="w-8 h-8 opacity-20" />
                            <p className="text-xs font-medium">No doctors assigned to this clinic.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {doctors.map((doc: any) => (
                                <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => updateFields({ doctorId: String(doc.id) })}
                                    className={`w-full p-5 rounded-[28px] border text-left transition-all flex items-start gap-4 ${formData.doctorId === String(doc.id) ? "border-medical-teal bg-teal-50/50 ring-1 ring-medical-teal" : "border-slate-100 hover:border-teal-100 bg-white"}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center ${formData.doctorId === String(doc.id) ? "bg-medical-teal text-white" : "bg-slate-50 text-slate-400"}`}>
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900">{doc.full_name}</h5>
                                        <p className="text-[10px] font-bold text-medical-teal uppercase tracking-widest mb-1">{doc.specialization}</p>
                                        {doc.bio && <p className="text-xs text-slate-500 leading-relaxed italic">&quot;{doc.bio}&quot;</p>}
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
                    <ModeCard id="video" title="Online Video" desc="Consult from home" icon={Video} active={formData.consultationMode === "video"} onClick={() => updateFields({ consultationMode: "video" })} />
                    <ModeCard id="clinic" title="Offline Clinic" desc="Visit the hospital" icon={Hospital} active={formData.consultationMode === "clinic"} onClick={() => updateFields({ consultationMode: "clinic" })} />
                    <ModeCard id="phone" title="Phone Call" desc="Direct doctor call" icon={Phone} active={formData.consultationMode === "phone"} onClick={() => updateFields({ consultationMode: "phone" })} />
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
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Step 6: Institutional Review</h2>
                <p className="text-slate-500 text-sm">Confirm your clinical parameters for unified record entry.</p>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <SummaryCard
                        title="Clinical Node"
                        icon={Hospital}
                        onEdit={() => setCurrentStep(2)}
                        rows={[
                            { label: "State", value: formData.stateName },
                            { label: "City", value: formData.city },
                            { label: "Facility", value: formData.clinic },
                        ]}
                    />
                </div>

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