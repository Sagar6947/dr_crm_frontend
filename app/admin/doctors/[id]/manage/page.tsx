"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
    Calendar,
    Clock,
    Plus,
    Trash2,
    Hospital,
    ChevronLeft,
    Loader2,
    AlertCircle,
    Pencil,
    Repeat,
    CalendarDays,
    CheckCircle2,
    XCircle,
    ShieldAlert,
    ToggleLeft,
    ToggleRight,
    Info,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doctorService, clinicService } from "@/lib/api";

export default function DoctorManageSlotsPage() {
    const params = useParams();
    const id = params?.id as string;
    
    const [doctor, setDoctor] = useState<any>(null);
    const [clinics, setClinics] = useState<any[]>([]);
    const [slots, setSlots] = useState<any[]>([]);
    const [recurringSlots, setRecurringSlots] = useState<any[]>([]);
    
    const [activeTab, setActiveTab] = useState<"recurring" | "datewise">("recurring");
    const [selectedClinicId, setSelectedClinicId] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("all");
    const [newSlotTime, setNewSlotTime] = useState("");
    const [consultationMode, setConsultationMode] = useState("all");
    const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
    
    const [isOnLeave, setIsOnLeave] = useState(false);
    const [togglingLeave, setTogglingLeave] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        
        Promise.all([
            doctorService.getById(id),
            clinicService.getAll({ page_no: 1, limit: 100 })
        ])
        .then(([docRes, clinicRes]: any) => {
            setDoctor(docRes?.data || null);
            const loadedClinics = clinicRes?.data || [];
            setClinics(loadedClinics);
            if (loadedClinics.length > 0 && !selectedClinicId) {
                setSelectedClinicId(String(loadedClinics[0].id));
            }
        })
        .catch((err) => {
            console.error("Failed to load initial data", err);
            window.alert("Failed to load doctor details");
        })
        .finally(() => setLoading(false));
    }, [id]);

    const fetchSlots = () => {
        if (!selectedClinicId) return;
        
        // Fetch recurring template slots
        doctorService.getSlots(id, selectedClinicId, undefined, '1')
            .then((res: any) => {
                setRecurringSlots(res?.data || []);
            })
            .catch((err) => console.error("Failed to fetch recurring slots", err));

        // If datewise tab or selectedDate is set, fetch materialized slots & leave status
        if (selectedDate) {
            setLoadingSlots(true);
            doctorService.getSlots(id, selectedClinicId, selectedDate, '0')
                .then((res: any) => {
                    setSlots(res?.data || []);
                    setIsOnLeave(Boolean(res?.is_on_leave));
                })
                .catch((err) => console.error("Failed to fetch slots", err))
                .finally(() => setLoadingSlots(false));
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [selectedClinicId, selectedDate, activeTab]);

    const handleSaveSlot = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClinicId || !newSlotTime) {
            window.alert("Please select clinic and time");
            return;
        }
        if (activeTab === "datewise" && !selectedDate) {
            window.alert("Please select a date");
            return;
        }

        setIsAdding(true);
        const [h, m] = newSlotTime.split(":");
        let hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        const formattedTime = `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;

        if (editingSlotId) {
            doctorService.editSlot({ slot_id: editingSlotId, slot_time: formattedTime, consultation_mode: consultationMode })
            .then(() => {
                window.alert("Slot updated successfully");
                setNewSlotTime("");
                setConsultationMode("all");
                setEditingSlotId(null);
                fetchSlots();
            })
            .catch((err: any) => {
                window.alert(err?.message || "Failed to update slot");
            })
            .finally(() => setIsAdding(false));
        } else {
            const payload: any = {
                doctor_id: id,
                clinic_id: selectedClinicId,
                slot_time: formattedTime,
                consultation_mode: consultationMode
            };

            if (activeTab === "recurring") {
                payload.is_recurring = 1;
                payload.day_of_week = selectedDayOfWeek;
                payload.slot_date = new Date().toISOString().split("T")[0];
            } else {
                payload.is_recurring = 0;
                payload.slot_date = selectedDate;
            }

            doctorService.addSlot(payload)
            .then(() => {
                window.alert(activeTab === "recurring" ? "Recurring schedule slot added successfully" : "Date slot added successfully");
                setNewSlotTime("");
                fetchSlots();
            })
            .catch((err: any) => {
                window.alert(err?.message || "Failed to add slot");
            })
            .finally(() => setIsAdding(false));
        }
    };

    const handleToggleLeave = () => {
        if (!selectedClinicId || !selectedDate) {
            window.alert("Please select a clinic and date first");
            return;
        }
        const newStatus = !isOnLeave;
        setTogglingLeave(true);
        doctorService.toggleLeave({
            doctor_id: id,
            clinic_id: selectedClinicId,
            leave_date: selectedDate,
            status: newStatus ? 1 : 0,
            reason: newStatus ? "Doctor on leave" : ""
        })
        .then((res: any) => {
            setIsOnLeave(Boolean(res?.data?.is_leave));
            fetchSlots();
        })
        .catch((err: any) => {
            window.alert(err?.message || "Failed to toggle leave status");
        })
        .finally(() => setTogglingLeave(false));
    };

    const handleEditClick = (slot: any) => {
        setEditingSlotId(slot.id);
        setConsultationMode(slot.consultation_mode || "all");
        if (slot.day_of_week) {
            setSelectedDayOfWeek(slot.day_of_week);
        }
        if (slot.slot_time) {
            try {
                const [time, modifier] = slot.slot_time.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') hours = '00';
                if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
                setNewSlotTime(`${hours.toString().padStart(2, '0')}:${minutes}`);
            } catch (e) {
                setNewSlotTime("");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingSlotId(null);
        setNewSlotTime("");
        setConsultationMode("all");
    };

    const handleDeleteSlot = (slotId: string) => {
        if (!window.confirm("Are you sure you want to delete this slot?")) return;
        setIsDeleting(slotId);
        doctorService.deleteSlot(slotId)
        .then(() => {
            fetchSlots();
        })
        .catch((err: any) => {
            window.alert(err?.message || "Failed to delete slot");
        })
        .finally(() => setIsDeleting(null));
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-medical-teal" />
                </div>
            </AdminLayout>
        );
    }

    if (!doctor) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64 text-slate-400">
                    Doctor not found
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/doctors" className="p-2.5 border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-colors bg-white shadow-sm">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Availability</h1>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-medical-teal border border-teal-100">
                                    <Sparkles className="w-3.5 h-3.5" /> Comprehensive Scheduler
                                </span>
                            </div>
                            <p className="text-slate-500 text-sm mt-1 font-medium">
                                {doctor.full_name} • <span className="text-slate-700 font-semibold">{doctor.specialization}</span>
                            </p>
                        </div>
                    </div>

                    {/* Clinic Selector Top Bar */}
                    <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl border border-slate-200 shadow-sm">
                        <Hospital className="w-4 h-4 text-medical-teal shrink-0" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Clinic:</span>
                        <select 
                            className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer pr-4"
                            value={selectedClinicId}
                            onChange={(e) => {
                                setSelectedClinicId(e.target.value);
                                setEditingSlotId(null);
                            }}
                        >
                            <option value="">Choose Clinic...</option>
                            {clinics.map((c) => (
                                <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex rounded-2xl bg-slate-100 p-1.5 gap-2 border border-slate-200/60 max-w-xl">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("recurring");
                            setEditingSlotId(null);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                            activeTab === "recurring"
                                ? "bg-white text-medical-teal shadow-md shadow-slate-200"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        }`}
                    >
                        <Repeat className="w-4 h-4" />
                        Day-Wise Schedule (Recurring)
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("datewise");
                            setEditingSlotId(null);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl font-bold text-sm transition-all ${
                            activeTab === "datewise"
                                ? "bg-white text-medical-teal shadow-md shadow-slate-200"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                        }`}
                    >
                        <CalendarDays className="w-4 h-4" />
                        Date-Wise & Leave Control
                    </button>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 bg-white border border-slate-200/80 rounded-[32px] shadow-sm space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                            
                            <div>
                                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                                    {activeTab === "recurring" ? <Repeat className="w-5 h-5 text-medical-teal" /> : <Clock className="w-5 h-5 text-medical-teal" />}
                                    {activeTab === "recurring" ? "Add Recurring Slot" : "Add Date-Specific Slot"}
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {activeTab === "recurring"
                                        ? "Add once and this time slot will automatically repeat across upcoming dates and WhatsApp messages."
                                        : "Add a one-off time slot for the selected date below."}
                                </p>
                            </div>

                            <form onSubmit={handleSaveSlot} className="space-y-4">
                                {activeTab === "recurring" ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Repeat Day / Schedule</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors">
                                                <Repeat className="w-4 h-4" />
                                            </div>
                                            <select 
                                                className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-bold text-slate-700 appearance-none"
                                                value={selectedDayOfWeek}
                                                onChange={(e) => setSelectedDayOfWeek(e.target.value)}
                                            >
                                                <option value="all">Everyday (All Days of Week)</option>
                                                <option value="Monday">Every Monday</option>
                                                <option value="Tuesday">Every Tuesday</option>
                                                <option value="Wednesday">Every Wednesday</option>
                                                <option value="Thursday">Every Thursday</option>
                                                <option value="Friday">Every Friday</option>
                                                <option value="Saturday">Every Saturday</option>
                                                <option value="Sunday">Every Sunday</option>
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Select Date</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <input 
                                                type="date"
                                                className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-bold text-slate-700"
                                                value={selectedDate}
                                                onChange={(e) => setSelectedDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Time Slot</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <input 
                                            type="time"
                                            className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-bold text-slate-700"
                                            value={newSlotTime}
                                            onChange={(e) => setNewSlotTime(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Consultation Mode</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-bold text-slate-700 appearance-none"
                                        value={consultationMode}
                                        onChange={(e) => setConsultationMode(e.target.value)}
                                    >
                                        <option value="all">All Modes (Online & Offline)</option>
                                        <option value="video">Online Video Call</option>
                                        <option value="clinic">Offline Clinic Visit</option>
                                        <option value="phone">Phone / Proxy Consultation</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={!selectedClinicId || !newSlotTime || isAdding}
                                        className="flex-1 p-4 rounded-[24px] bg-medical-teal text-white font-bold tracking-wide hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        {editingSlotId ? "Update Slot" : activeTab === "recurring" ? "Add Recurring Slot" : "Add Date Slot"}
                                    </button>
                                    {editingSlotId && (
                                        <button 
                                            type="button" 
                                            onClick={handleCancelEdit}
                                            className="px-5 p-4 rounded-[24px] bg-slate-100 text-slate-600 font-bold tracking-wide hover:bg-slate-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Info card */}
                        <div className="p-5 bg-teal-50/60 border border-teal-100 rounded-[28px] flex gap-3.5 items-start">
                            <Info className="w-5 h-5 text-medical-teal shrink-0 mt-0.5" />
                            <div className="space-y-1 text-xs text-slate-600">
                                <p className="font-bold text-slate-800">WhatsApp & Online Sync</p>
                                <p className="leading-relaxed">
                                    Any recurring schedule or leave status configured here automatically updates the WhatsApp chatbot (<code className="bg-white/80 px-1 py-0.5 rounded border border-teal-200/60 text-medical-teal">available-dates</code> &amp; <code className="bg-white/80 px-1 py-0.5 rounded border border-teal-200/60 text-medical-teal">available-slots</code>) in real-time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Slots Display & Leave Management */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === "datewise" && (
                            /* Leave Toggle Card for Selected Date */
                            <div className={`p-6 rounded-[32px] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm ${
                                isOnLeave 
                                    ? "bg-rose-50/80 border-rose-200" 
                                    : "bg-emerald-50/60 border-emerald-200"
                            }`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                        isOnLeave ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
                                    }`}>
                                        {isOnLeave ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-black text-slate-900 text-base">
                                                {isOnLeave ? "Doctor is ON LEAVE on this Date" : "Doctor is Active & Available"}
                                            </h4>
                                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                                                isOnLeave ? "bg-rose-100 text-rose-700 border-rose-300" : "bg-emerald-100 text-emerald-700 border-emerald-300"
                                            }`}>
                                                {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1 font-medium">
                                            {isOnLeave 
                                                ? "All slots are hidden on this day across booking form and WhatsApp bot." 
                                                : "Recurring schedules and date-specific slots are available to patients."}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleToggleLeave}
                                    disabled={togglingLeave || !selectedClinicId || !selectedDate}
                                    className={`px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-md ${
                                        isOnLeave
                                            ? "bg-white text-rose-600 hover:bg-rose-50 border border-rose-200"
                                            : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-900/20"
                                    } disabled:opacity-50`}
                                >
                                    {togglingLeave ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : isOnLeave ? (
                                        <>
                                            <ToggleLeft className="w-5 h-5 text-rose-500" />
                                            Turn Leave OFF
                                        </>
                                    ) : (
                                        <>
                                            <ToggleRight className="w-5 h-5 text-white" />
                                            Mark Day as Leave
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="p-8 bg-white border border-slate-200/80 rounded-[32px] shadow-sm min-h-[440px]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                                <div>
                                    <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
                                        {activeTab === "recurring" ? (
                                            <>
                                                <Repeat className="w-5 h-5 text-medical-teal" />
                                                Recurring Daily / Weekly Templates
                                            </>
                                        ) : (
                                            <>
                                                <Calendar className="w-5 h-5 text-medical-teal" />
                                                Slots for {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : "Selected Date"}
                                            </>
                                        )}
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                        {activeTab === "recurring" 
                                            ? `Showing master schedule slots for ${clinics.find(c => String(c.id) === String(selectedClinicId))?.name || "selected clinic"}` 
                                            : `Showing available and booked time slots for this specific date`}
                                    </p>
                                </div>

                                <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 self-start sm:self-auto">
                                    Total: {activeTab === "recurring" ? recurringSlots.length : slots.length} slots
                                </span>
                            </div>
                            
                            {!selectedClinicId ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <Hospital className="w-10 h-10 opacity-20" />
                                    <p className="text-sm font-medium">Please choose a clinic from the top bar to view slots.</p>
                                </div>
                            ) : activeTab === "datewise" && isOnLeave ? (
                                <div className="h-64 flex flex-col items-center justify-center text-rose-500 gap-3 border-2 border-dashed border-rose-200 bg-rose-50/30 rounded-3xl p-6 text-center">
                                    <ShieldAlert className="w-12 h-12 opacity-60 text-rose-500" />
                                    <div className="space-y-1">
                                        <p className="text-base font-bold text-slate-800">No slots available due to Leave</p>
                                        <p className="text-xs text-slate-500 max-w-md">
                                            The doctor has been marked ON LEAVE for {new Date(selectedDate).toLocaleDateString("en-US", { dateStyle: "medium" })}. Turn OFF leave above if you wish to accept bookings on this day.
                                        </p>
                                    </div>
                                </div>
                            ) : loadingSlots ? (
                                <div className="h-64 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-medical-teal" />
                                </div>
                            ) : (activeTab === "recurring" ? recurringSlots : slots).length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center">
                                    <AlertCircle className="w-10 h-10 opacity-20" />
                                    <p className="text-sm font-bold text-slate-600">
                                        {activeTab === "recurring" ? "No recurring schedule slots found." : "No slots found for this date."}
                                    </p>
                                    <p className="text-xs text-slate-400 max-w-sm">
                                        {activeTab === "recurring"
                                            ? "Use the form on the left to add everyday or day-wise repeating time slots."
                                            : "Slots will automatically appear from the recurring schedule, or you can add a date-specific slot from the left panel."}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {(activeTab === "recurring" ? recurringSlots : slots).map((slot) => (
                                        <div 
                                            key={slot.id} 
                                            className={`relative group p-4.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all shadow-sm
                                                ${slot.status === 'booked' 
                                                    ? 'bg-slate-50 border-slate-200 opacity-70' 
                                                    : 'bg-teal-50/40 border-teal-100 hover:border-medical-teal hover:shadow-md hover:-translate-y-0.5'
                                                }`}
                                        >
                                            {/* Time Label */}
                                            <span className={`text-sm font-black uppercase tracking-wider ${slot.status === 'booked' ? 'text-slate-500' : 'text-slate-800'}`}>
                                                {slot.slot_time}
                                            </span>
                                            
                                            {/* Day or Status Badge */}
                                            {activeTab === "recurring" ? (
                                                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100/80 text-teal-800 border border-teal-200 capitalize">
                                                    {slot.day_of_week === 'all' ? 'Everyday' : slot.day_of_week}
                                                </span>
                                            ) : (
                                                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                                    slot.status === 'booked' 
                                                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                                                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                                    }`}
                                                >
                                                    {slot.status}
                                                </span>
                                            )}

                                            {/* Consultation Mode Badge */}
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-slate-600 border border-slate-200 capitalize">
                                                {slot.consultation_mode || 'all'} mode
                                            </span>

                                            {slot.status === 'available' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleEditClick(slot)}
                                                        className="absolute -top-2.5 -right-9 w-7 h-7 bg-white border border-blue-200 text-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-blue-50 transition-all shadow-sm"
                                                        title="Edit slot"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteSlot(slot.id)}
                                                        disabled={isDeleting === slot.id}
                                                        className="absolute -top-2.5 -right-2 w-7 h-7 bg-white border border-red-200 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm disabled:opacity-50"
                                                        title="Remove slot"
                                                    >
                                                        {isDeleting === slot.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
