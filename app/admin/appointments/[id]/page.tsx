// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import AdminLayout from "@/components/admin/AdminLayout";
// import {
//     ArrowLeft, CalendarCheck, Clock, User, Stethoscope,
//     Hospital, FileText, CheckCircle2, XCircle, AlertCircle, Edit, Trash2
// } from "lucide-react";

// const appointment = {
//     id: "APT001",
//     patient: "Ravi Kumar",
//     phone: "+91 98765 43210",
//     email: "ravi.kumar@email.com",
//     doctor: "Dr. Rahul Sharma",
//     specialty: "Cardiology",
//     clinic: "City Care Hospital",
//     date: "07 Mar 2026",
//     time: "10:00 AM",
//     type: "General Checkup",
//     status: "Confirmed",
//     notes: "Patient reports mild chest discomfort. Follow-up after ECG.",
//     createdAt: "05 Mar 2026, 3:45 PM",
// };

// const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
//     Confirmed: { color: "text-teal-700", bg: "bg-teal-50", icon: <CheckCircle2 className="w-4 h-4" /> },
//     Pending: { color: "text-yellow-700", bg: "bg-yellow-50", icon: <AlertCircle className="w-4 h-4" /> },
//     Completed: { color: "text-blue-700", bg: "bg-blue-50", icon: <CheckCircle2 className="w-4 h-4" /> },
//     Cancelled: { color: "text-red-600", bg: "bg-red-50", icon: <XCircle className="w-4 h-4" /> },
// };

// export default function AppointmentDetailPage() {
//     const [status, setStatus] = useState(appointment.status);
//     const cfg = statusConfig[status];

//     return (
//         <AdminLayout>
//             <div className="space-y-6 max-w-4xl">

//                 {/* PAGE HEADER */}
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                         <Link href="/admin/appointments"
//                             className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
//                             <ArrowLeft className="w-5 h-5" />
//                         </Link>
//                         <div>
//                             <h1 className="text-2xl font-bold text-slate-900">Appointment Detail</h1>
//                             <p className="text-slate-500 text-sm mt-0.5 font-mono">{appointment.id}</p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <button className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
//                             <Edit className="w-4 h-4" /> Edit
//                         </button>
//                         <button className="flex items-center gap-2 border border-red-100 text-red-500 hover:bg-red-50 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
//                             <Trash2 className="w-4 h-4" /> Cancel
//                         </button>
//                     </div>
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-5">

//                     {/* LEFT */}
//                     <div className="md:col-span-2 space-y-5">

//                         {/* STATUS */}
//                         <div className="bg-white rounded-2xl border border-slate-100 p-6">
//                             <div className="flex items-center justify-between mb-5">
//                                 <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Status</h2>
//                                 <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl ${cfg.bg} ${cfg.color}`}>
//                                     {cfg.icon} {status}
//                                 </span>
//                             </div>
//                             <div className="flex gap-2 flex-wrap">
//                                 {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => (
//                                     <button key={s} onClick={() => setStatus(s)}
//                                         className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${status === s ? "bg-teal-600 text-white border-teal-600" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
//                                         {s}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* PATIENT */}
//                         <div className="bg-white rounded-2xl border border-slate-100 p-6">
//                             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
//                                 <User className="w-4 h-4 text-teal-600" /> Patient
//                             </h2>
//                             <div className="flex items-center gap-4">
//                                 <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-black">
//                                     {appointment.patient.charAt(0)}
//                                 </div>
//                                 <div>
//                                     <div className="font-bold text-slate-900 text-lg">{appointment.patient}</div>
//                                     <div className="text-slate-500 text-sm">{appointment.email}</div>
//                                     <div className="text-slate-500 text-sm">{appointment.phone}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* DETAILS */}
//                         <div className="bg-white rounded-2xl border border-slate-100 p-6">
//                             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
//                                 <CalendarCheck className="w-4 h-4 text-teal-600" /> Appointment Info
//                             </h2>
//                             <div className="grid grid-cols-2 gap-4">
//                                 {[
//                                     { icon: <Clock className="w-4 h-4" />, label: "Date", value: appointment.date },
//                                     { icon: <Clock className="w-4 h-4" />, label: "Time", value: appointment.time },
//                                     { icon: <FileText className="w-4 h-4" />, label: "Type", value: appointment.type },
//                                     { icon: <CalendarCheck className="w-4 h-4" />, label: "Booked On", value: appointment.createdAt },
//                                 ].map((item, i) => (
//                                     <div key={i} className="bg-slate-50 rounded-xl p-4">
//                                         <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">{item.icon} {item.label}</div>
//                                         <div className="font-semibold text-slate-800 text-sm">{item.value}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* NOTES */}
//                         {appointment.notes && (
//                             <div className="bg-white rounded-2xl border border-slate-100 p-6">
//                                 <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
//                                     <FileText className="w-4 h-4 text-teal-600" /> Notes
//                                 </h2>
//                                 <p className="text-slate-600 text-sm leading-relaxed">{appointment.notes}</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* RIGHT */}
//                     <div className="space-y-5">

//                         {/* DOCTOR */}
//                         <div className="bg-white rounded-2xl border border-slate-100 p-6">
//                             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
//                                 <Stethoscope className="w-4 h-4 text-teal-600" /> Doctor
//                             </h2>
//                             <div className="flex items-center gap-3">
//                                 <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg">
//                                     {appointment.doctor.charAt(4)}
//                                 </div>
//                                 <div>
//                                     <div className="font-bold text-slate-900 text-sm">{appointment.doctor}</div>
//                                     <div className="text-teal-600 text-xs font-medium">{appointment.specialty}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* CLINIC */}
//                         <div className="bg-white rounded-2xl border border-slate-100 p-6">
//                             <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
//                                 <Hospital className="w-4 h-4 text-teal-600" /> Clinic
//                             </h2>
//                             <div className="flex items-center gap-3">
//                                 <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
//                                     <Hospital className="w-5 h-5" />
//                                 </div>
//                                 <div className="font-bold text-slate-900 text-sm">{appointment.clinic}</div>
//                             </div>
//                         </div>

//                         {/* QUICK ACTIONS */}
//                         <div className="bg-teal-600 rounded-2xl p-6 text-white">
//                             <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Quick Actions</h2>
//                             <div className="space-y-2">
//                                 <button className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
//                                     Send Reminder
//                                 </button>
//                                 <button className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
//                                     View Patient Record
//                                 </button>
//                                 <button className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
//                                     Generate Invoice
//                                 </button>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </AdminLayout>
//     );
// } 


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    ArrowLeft, CalendarCheck, Clock, User, Stethoscope,
    Hospital, FileText, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";

import { appointmentService } from "@/lib/api";

const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    confirmed:  { color: "text-teal-700",   bg: "bg-teal-50",   icon: <CheckCircle2 className="w-4 h-4" /> },
    scheduled:  { color: "text-teal-700",   bg: "bg-teal-50",   icon: <CheckCircle2 className="w-4 h-4" /> },
    pending:    { color: "text-yellow-700", bg: "bg-yellow-50", icon: <AlertCircle className="w-4 h-4" /> },
    completed:  { color: "text-blue-700",   bg: "bg-blue-50",   icon: <CheckCircle2 className="w-4 h-4" /> },
    cancelled:  { color: "text-red-600",    bg: "bg-red-50",    icon: <XCircle className="w-4 h-4" /> },
};
const formatDateOnly = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr.replace(/-/g, '/'));
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'long' });
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
};

const formatTimeOnly = (timeStr: string) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(':');
    if (!h || !m) return timeStr;
    let hour = parseInt(h, 10);
    if (isNaN(hour)) return timeStr;
    if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
    const minute = parseInt(m, 10).toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour || 12;
    return `${hour}:${minute} ${ampm}`;
};

const formatBookedParts = (dateStr: string) => {
    if (!dateStr) return { date: "—", time: "" };
    const d = new Date(dateStr.replace(/-/g, '/'));
    if (isNaN(d.getTime())) return { date: dateStr, time: "" };
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'long' });
    const year = d.getFullYear();
    let hour = d.getHours();
    const minute = d.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour || 12;
    return {
        date: `${day} ${month}, ${year}`,
        time: `${hour}:${minute} ${ampm}`
    };
};

export default function AppointmentDetailPage() {
    const [apt, setApt] = useState<any>(null);
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem("apt_detail");
        if (stored) setApt(JSON.parse(stored));
    }, []);

    const handleUpdatePaymentStatus = async (newStatus: string) => {
        if (!apt?.id) return;
        setIsUpdatingPayment(true);
        try {
            await appointmentService.updatePaymentStatus(apt.id, newStatus);
            const updatedApt = { ...apt, payment_status: newStatus };
            if (updatedApt.payment) {
                updatedApt.payment.status = newStatus;
            }
            setApt(updatedApt);
            sessionStorage.setItem("apt_detail", JSON.stringify(updatedApt));
        } catch (error) {
            console.error("Failed to update payment status", error);
            alert("Failed to update payment status. Please try again.");
        } finally {
            setIsUpdatingPayment(false);
        }
    };

    if (!apt) {
        return (
            <AdminLayout>
                <div className="text-center py-20 text-slate-400">
                    Appointment data not found.{" "}
                    <Link href="/admin/appointments" className="text-teal-600 underline">Go back</Link>
                </div>
            </AdminLayout>
        );
    }

    const status = apt.status || "";
    const cfg = statusConfig[status?.toLowerCase()] || { color: "text-slate-600", bg: "bg-slate-100", icon: null };

    return (
        <AdminLayout>
            <div className="space-y-6 max-w-4xl">

                {/* PAGE HEADER */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/appointments"
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Appointment Detail</h1>
                        <p className="text-slate-500 text-sm mt-0.5 font-mono">{apt.appointment_code}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">

                    {/* LEFT */}
                    <div className="md:col-span-2 space-y-5">

                        {/* STATUS */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Status</h2>
                                <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-xl capitalize ${cfg.bg} ${cfg.color}`}>
                                    {cfg.icon} {status}
                                </span>
                            </div>
                        </div>

                        {/* PATIENT */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-teal-600" /> Patient
                            </h2>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 text-xl font-black">
                                    {(apt.patient?.name || apt.booking_name || "?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-lg">
                                        {apt.patient?.name || apt.booking_name || "—"}
                                    </div>
                                    <div className="text-slate-500 text-sm">{apt.patient?.phone || "—"}</div>
                                </div>
                            </div>
                        </div>

                        {/* APPOINTMENT INFO */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4 text-teal-600" /> Appointment Info
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { 
                                        icon: <Clock className="w-4 h-4" />,    
                                        label: "Booked Date", 
                                        value: formatBookedParts(apt.booked_appointment_date).date,
                                        subValue: formatBookedParts(apt.booked_appointment_date).time
                                    },
                                    { 
                                        icon: <CalendarCheck className="w-4 h-4" />, 
                                        label: "Booked Slot", 
                                        value: formatDateOnly(apt.appointment_date),
                                        subValue: formatTimeOnly(apt.appointment_time)
                                    },
                                    { icon: <FileText className="w-4 h-4" />, label: "Mode",    value: apt.consultation_mode || "—" },
                                    { icon: <FileText className="w-4 h-4" />, label: "Payment Mode", value: ((apt.payment?.mode || apt.payment_mode) === 'online' ? 'Razorpay' : ((apt.payment?.mode || apt.payment_mode) === 'pay_at_visit' ? 'Clinic' : ((apt.payment?.mode || apt.payment_mode) || "—"))) + ((apt.payment?.amount || apt.payment_amount) ? ` (₹${Number(apt.payment?.amount || apt.payment_amount).toFixed(0)})` : '') },
                                    ...( (apt.razorpay_payment_id || apt.payment?.razorpay_payment_id) ? [{
                                        icon: <FileText className="w-4 h-4" />,
                                        label: "Payment ID",
                                        value: apt.razorpay_payment_id || apt.payment?.razorpay_payment_id
                                    }] : [])
                                ].map((item: any, i) => (
                                    <div key={i} className="bg-slate-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">{item.icon} {item.label}</div>
                                        <div className={`font-semibold text-slate-800 text-sm ${item.label === 'Payment ID' ? '' : 'capitalize'}`}>{item.value}</div>
                                        {item.subValue && <div className="text-xs text-slate-500 mt-1">{item.subValue}</div>}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-4 p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">Payment Status</p>
                                    <p className={`text-sm font-bold capitalize ${(apt.payment?.status || apt.payment_status) === 'completed' ? 'text-green-600' : 'text-orange-500'}`}>
                                        {(apt.payment?.status || apt.payment_status) || 'Pending'}
                                    </p>
                                </div>
                                {(!(apt.payment?.status || apt.payment_status) || (apt.payment?.status || apt.payment_status) === 'pending') && (
                                    <button 
                                        onClick={() => handleUpdatePaymentStatus('completed')}
                                        disabled={isUpdatingPayment}
                                        className="text-xs bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        {isUpdatingPayment ? 'Updating...' : 'Mark as Paid'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* MEDICAL INFO */}
                        {(apt.chronic_condition || apt.regular_medications) && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-6">
                                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-teal-600" /> Medical Info
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {apt.chronic_condition && (
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-xs text-slate-400 mb-1">Chronic Conditions</p>
                                            <p className="text-sm font-semibold text-slate-800">{apt.chronic_condition}</p>
                                        </div>
                                    )}
                                    {apt.regular_medications && (
                                        <div className="bg-slate-50 rounded-xl p-4">
                                            <p className="text-xs text-slate-400 mb-1">Regular Medications</p>
                                            <p className="text-sm font-semibold text-slate-800">{apt.regular_medications}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-5">

                        {/* DOCTOR */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-teal-600" /> Doctor
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black text-lg">
                                    {(apt.doctor?.full_name || apt.doctor?.name || "D").charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">
                                        {apt.doctor?.full_name || apt.doctor?.name || "—"}
                                    </div>
                                    <div className="text-teal-600 text-xs font-medium capitalize">
                                        {apt.doctor?.specialization || apt.doctor?.specialty || "—"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CLINIC */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Hospital className="w-4 h-4 text-teal-600" /> Clinic
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                                    <Hospital className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{apt.clinic?.name || "—"}</div>
                                    <div className="text-xs text-slate-400">
                                        {[apt.city, apt.state].filter(Boolean).join(", ")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="bg-teal-600 rounded-2xl p-6 text-white">
                            <h2 className="text-sm font-bold uppercase tracking-wide mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                                    Send Reminder
                                </button>
                                {apt.patient?.id && (
                                    <Link href={`/admin/patients/${apt.patient.id}`}
                                        className="block w-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors text-center">
                                        View Patient Record
                                    </Link>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}