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
    Pencil
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
    
    const [selectedClinicId, setSelectedClinicId] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [newSlotTime, setNewSlotTime] = useState("");
    const [consultationMode, setConsultationMode] = useState("all");
    const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
    
    const [loading, setLoading] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        
        // Fetch doctor details and all clinics
        Promise.all([
            doctorService.getById(id),
            clinicService.getAll({ page_no: 1, limit: 100 })
        ])
        .then(([docRes, clinicRes]: any) => {
            setDoctor(docRes?.data || null);
            setClinics(clinicRes?.data || []);
        })
        .catch((err) => {
            console.error("Failed to load initial data", err);
            window.alert("Failed to load doctor details");
        })
        .finally(() => setLoading(false));
    }, [id]);

    const fetchSlots = () => {
        if (!selectedClinicId || !selectedDate) return;
        setLoadingSlots(true);
        doctorService.getSlots(id, selectedClinicId, selectedDate)
            .then((res: any) => {
                const fetchedSlots = res.data || [];
                const filtered = fetchedSlots.filter((s: any) => s.slot_date === selectedDate);
                setSlots(filtered);
            })
            .catch((err) => {
                console.error("Failed to fetch slots", err);
            })
            .finally(() => setLoadingSlots(false));
    };

    useEffect(() => {
        fetchSlots();
    }, [selectedClinicId, selectedDate]);

    const handleSaveSlot = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClinicId || !selectedDate || !newSlotTime) {
            window.alert("Please select clinic, date, and time");
            return;
        }

        setIsAdding(true);
        // Format time to 12-hour AM/PM if it's 24-hour from input type="time"
        const [h, m] = newSlotTime.split(":");
        let hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12;
        const formattedTime = `${hour.toString().padStart(2, '0')}:${m} ${ampm}`;

        const payload = {
            doctor_id: id,
            clinic_id: selectedClinicId,
            slot_date: selectedDate,
            slot_time: formattedTime,
            consultation_mode: consultationMode
        };

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
            doctorService.addSlot(payload)
            .then(() => {
                window.alert("Slot added successfully");
                setNewSlotTime("");
                fetchSlots();
            })
            .catch((err: any) => {
                window.alert(err?.message || "Failed to add slot");
            })
            .finally(() => setIsAdding(false));
        }
    };

    const handleEditClick = (slot: any) => {
        setEditingSlotId(slot.id);
        setConsultationMode(slot.consultation_mode || "all");
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
        setIsDeleting(slotId);
        doctorService.deleteSlot(slotId)
        .then(() => {
            window.alert("Slot removed");
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
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/doctors" className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage Slots</h1>
                            <p className="text-slate-500 text-sm mt-1">
                                {doctor.full_name} • {doctor.specialization}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-800 text-lg">Slot Configuration</h3>
                            
                            <form onSubmit={handleSaveSlot} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Select Clinic</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors">
                                            <Hospital className="w-4 h-4" />
                                        </div>
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium text-slate-700 appearance-none"
                                            value={selectedClinicId}
                                            onChange={(e) => setSelectedClinicId(e.target.value)}
                                            required
                                        >
                                            <option value="">Choose a clinic...</option>
                                            {clinics.map((c) => (
                                                <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Select Date</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <input 
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium text-slate-700"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Add Time Slot</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medical-teal transition-colors">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <input 
                                            type="time"
                                            className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium text-slate-700"
                                            value={newSlotTime}
                                            onChange={(e) => setNewSlotTime(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Consultation Mode</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-100 p-4 rounded-[24px] focus:ring-2 focus:ring-medical-teal outline-none transition-all text-sm font-medium text-slate-700 appearance-none"
                                        value={consultationMode}
                                        onChange={(e) => setConsultationMode(e.target.value)}
                                    >
                                        <option value="all">All Modes</option>
                                        <option value="video">Online Video</option>
                                        <option value="clinic">Offline Clinic</option>
                                        <option value="phone">Phone Call</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        type="submit" 
                                        disabled={!selectedClinicId || !selectedDate || !newSlotTime || isAdding}
                                        className="flex-1 p-4 rounded-[24px] bg-medical-teal text-white font-bold tracking-wide hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        {editingSlotId ? "Update Slot" : "Add Slot"}
                                    </button>
                                    {editingSlotId && (
                                        <button 
                                            type="button" 
                                            onClick={handleCancelEdit}
                                            className="px-6 p-4 rounded-[24px] bg-slate-100 text-slate-600 font-bold tracking-wide hover:bg-slate-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Slots List Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm min-h-[400px]">
                            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-medical-teal" /> 
                                Slots for {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'medium' }) : "Selected Date"}
                            </h3>
                            
                            {!selectedClinicId || !selectedDate ? (
                                <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <Hospital className="w-8 h-8 opacity-20" />
                                    <p className="text-sm">Select a clinic and date to view slots.</p>
                                </div>
                            ) : loadingSlots ? (
                                <div className="h-48 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-medical-teal" />
                                </div>
                            ) : slots.length === 0 ? (
                                <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-3 border-2 border-dashed border-slate-100 rounded-3xl">
                                    <AlertCircle className="w-8 h-8 opacity-20" />
                                    <p className="text-sm">No slots found for this date. Add one from the left panel.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {slots.map((slot) => (
                                        <div 
                                            key={slot.id} 
                                            className={`relative group p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all
                                                ${slot.status === 'booked' 
                                                    ? 'bg-slate-50 border-slate-200 opacity-70' 
                                                    : 'bg-teal-50/30 border-teal-100 hover:border-medical-teal hover:shadow-md'
                                                }`}
                                        >
                                            <span className={`text-xs font-bold uppercase tracking-widest ${slot.status === 'booked' ? 'text-slate-400' : 'text-medical-teal'}`}>
                                                {slot.slot_time}
                                            </span>
                                            
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                                slot.status === 'booked' 
                                                    ? 'bg-amber-50 text-amber-600 border-amber-200' 
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                }`}
                                            >
                                                {slot.status}
                                            </span>

                                            <span className="text-[9px] px-2 py-0.5 mt-1 rounded-full border bg-slate-50 text-slate-500 border-slate-200 capitalize">
                                                {slot.consultation_mode || 'all'}
                                            </span>

                                            {slot.status === 'available' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleEditClick(slot)}
                                                        className="absolute -top-2 -right-8 w-6 h-6 bg-white border border-blue-100 text-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                                        title="Edit slot"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteSlot(slot.id)}
                                                        disabled={isDeleting === slot.id}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm disabled:opacity-50"
                                                        title="Remove slot"
                                                    >
                                                        {isDeleting === slot.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
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
