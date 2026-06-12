"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Download, Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import "./invoice.css";

export default function InvoiceBuilderPage() {
    const [apt, setApt] = useState<any>(null);
    const [items, setItems] = useState<any[]>([
        { id: 1, title: "Consultation", note: "Complete homeopathic consultation", qty: 1, rate: 500 }
    ]);
    const [newItem, setNewItem] = useState({ title: "", note: "", qty: 1, rate: 0 });
    const [discount, setDiscount] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);

    useEffect(() => {
        const stored = sessionStorage.getItem("apt_detail");
        if (stored) {
            setApt(JSON.parse(stored));
        }
    }, []);

    const handleAddItem = () => {
        if (!newItem.title || newItem.rate < 0) return;
        setItems([...items, { ...newItem, id: Date.now() }]);
        setNewItem({ title: "", note: "", qty: 1, rate: 0 });
    };

    const handleRemoveItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handlePrint = () => {
        window.print();
    };

    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
    const total = subtotal - discount + tax;

    if (!apt) {
        return (
            <AdminLayout>
                <div className="text-center py-20 text-slate-400">
                    Loading appointment data...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/appointments" className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Invoice Builder</h1>
                        <p className="text-slate-500 text-sm mt-0.5 font-mono">{apt.appointment_code}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                        <Printer className="w-4 h-4" /> Print / Download PDF
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
                {/* BUILDER SIDEBAR */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
                    <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Add Items</h2>
                    
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Service / Item</label>
                            <input type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="e.g. Consultation" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Note (Optional)</label>
                            <input type="text" value={newItem.note} onChange={e => setNewItem({...newItem, note: e.target.value})} placeholder="e.g. Routine checkup" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Quantity</label>
                                <input type="number" min="1" value={newItem.qty} onChange={e => setNewItem({...newItem, qty: parseInt(e.target.value) || 1})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Rate (₹)</label>
                                <input type="number" min="0" value={newItem.rate} onChange={e => setNewItem({...newItem, rate: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                            </div>
                        </div>
                        <button onClick={handleAddItem} disabled={!newItem.title} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50">
                            <Plus className="w-4 h-4" /> Add Item
                        </button>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">Adjustments</h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Discount (₹)</label>
                            <input type="number" min="0" value={discount} onChange={e => setDiscount(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Tax (₹)</label>
                            <input type="number" min="0" value={tax} onChange={e => setTax(parseInt(e.target.value) || 0)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">Current Items</h2>
                    {items.length === 0 ? (
                        <p className="text-xs text-slate-400">No items added yet.</p>
                    ) : (
                        <ul className="space-y-3">
                            {items.map(item => (
                                <li key={item.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                    <div className="overflow-hidden">
                                        <div className="text-sm font-semibold text-slate-800 truncate">{item.title}</div>
                                        <div className="text-xs text-slate-500">{item.qty} x ₹{item.rate} = ₹{item.qty * item.rate}</div>
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-600 p-1">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* INVOICE PREVIEW */}
                <div className="overflow-auto bg-slate-100 p-4 rounded-2xl flex justify-center border border-slate-200">
                    <div id="printable-invoice" className="invoice-wrapper">
                        <main className="sheet">
                            <section className="brand-band">
                                <div className="brand-left">
                                    <div className="brand-logo">
                                        <img src="/dr-mahesh-clinic-logo.png" alt="Elixa logo" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    </div>
                                    <div>
                                        <p className="brand-name">Elixa</p>
                                        <p className="brand-tagline">Homeopathic Healing Hands and House of Hopes</p>
                                    </div>
                                </div>

                                <div className="brand-right">
                                    <div>
                                        <p className="invoice-title">INVOICE</p>
                                    </div>
                                </div>
                            </section>

                            <section className="content">
                                <img className="watermark" src="/dr-mahesh-clinic-logo.png" alt="" onError={(e) => e.currentTarget.style.display = 'none'} />

                                <div className="summary-grid">
                                    <div className="panel">
                                        <div className="panel-heading">Clinic</div>
                                        <div className="panel-body">
                                            <dl className="detail-list clinic-list">
                                                <div className="detail-row">
                                                    <dt>Clinic Name:</dt>
                                                    <dd>{apt.clinic?.name || "Dr. Mahesh Clinic"}</dd>
                                                </div>
                                                <div className="detail-row">
                                                    <dt>Doctor Name:</dt>
                                                    <dd>{apt.doctor?.full_name || apt.doctor?.name || "Dr. Mahesh Chandra Kandpal"}</dd>
                                                </div>
                                                <div className="detail-row">
                                                    <dt>Address:</dt>
                                                    <dd>{[apt.clinic?.address, apt.clinic?.city, apt.clinic?.state].filter(Boolean).join(", ") || "Ground Floor, H5-12, Dr. KN Katju Marg, Pocket 3, Sector 11, Rohini, Delhi, 110085"}</dd>
                                                </div>
                                                <div className="detail-row">
                                                    <dt>Phone:</dt>
                                                    <dd>+91-7669011119, +91-9868545275</dd>
                                                </div>
                                                <div className="detail-row">
                                                    <dt>Email ID:</dt>
                                                    <dd>homeohope@drmaheshchandrakandpal.com</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>

                                    <div className="panel">
                                        <div className="panel-heading">Invoice Details</div>
                                        <div className="panel-body">
                                            <dl className="detail-list">
                                                <div className="detail-row">
                                                    <dt>Invoice No.</dt>
                                                    <dd>{apt.appointment_code?.replace('APT', 'INV') || 'INV-2026-001'}</dd>
                                                </div>
                                                <div className="detail-row">
                                                    <dt>Issue Date</dt>
                                                    <dd>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</dd>
                                                </div>
                                                <div className="detail-row">
                                                    <dt>Visit Type</dt>
                                                    <dd className="capitalize">{apt.consultation_mode || "Clinic Consultation"}</dd>
                                                </div>
                                                <div className="detail-row">
                                                    <dt>Consultant</dt>
                                                    <dd>{(apt.doctor?.full_name || apt.doctor?.name)?.split(' ')[0] || "Dr. Mahesh"}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>

                                <div className="panel bill-panel">
                                    <div className="panel-heading">Bill To</div>
                                    <div className="panel-body bill-body">
                                        <h2 className="patient-name">{apt.patient?.name || apt.booking_name || "Patient"}</h2>
                                        <p className="small-text">
                                            {apt.patient?.patient_id ? `Patient ID: ${apt.patient.patient_id} | ` : ""}
                                            {apt.patient?.age || apt.patient?.gender ? `Age/Sex: ${apt.patient?.age || '--'} / ${apt.patient?.gender || '--'} | ` : ""}
                                            Phone: {apt.patient?.phone || apt.phone || "—"} | 
                                            Address: {apt.patient?.city || "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="meta-row">
                                    <div className="meta-box">
                                        <span className="label">Appointment ID</span>
                                        <span className="value">{apt.appointment_code || "—"}</span>
                                    </div>
                                    <div className="meta-box">
                                        <span className="label">Payment Mode</span>
                                        <span className="value capitalize">{apt.payment?.mode || apt.payment_mode || "Cash / UPI"}</span>
                                    </div>
                                    <div className="meta-box">
                                        <span className="label">Appointment Date</span>
                                        <span className="value">{apt.appointment_date || "—"}</span>
                                    </div>
                                    <div className="meta-box">
                                        <span className="label">Appointment Time</span>
                                        <span className="value">{apt.appointment_time || "—"}</span>
                                    </div>
                                </div>

                                <table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "51%" }}>Service / Item</th>
                                            <th className="right" style={{ width: "12%" }}>Qty</th>
                                            <th className="right" style={{ width: "18%" }}>Rate</th>
                                            <th className="right" style={{ width: "19%" }}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <span className="service-title">{item.title}</span>
                                                    {item.note && <span className="service-note">{item.note}</span>}
                                                </td>
                                                <td className="right">{item.qty}</td>
                                                <td className="right">INR {item.rate.toLocaleString()}</td>
                                                <td className="right">INR {(item.qty * item.rate).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        {items.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-slate-400 text-sm">No items added yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                <div className="totals-area">
                                    <div className="note-box">
                                        <h3>Patient Note</h3>
                                        <p>Please carry this invoice for follow-up visits. Medicines and care instructions are customized for the named patient only.</p>
                                    </div>

                                    <div className="totals-card">
                                        <div className="total-line">
                                            <span>Subtotal</span>
                                            <span>INR {subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="total-line">
                                            <span>Discount</span>
                                            <span>INR {discount.toLocaleString()}</span>
                                        </div>
                                        <div className="total-line">
                                            <span>Tax</span>
                                            <span>INR {tax.toLocaleString()}</span>
                                        </div>
                                        <div className="total-line final">
                                            <span>Total Paid</span>
                                            <span>INR {total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="payment-sign">
                                    <div className="payment-card">
                                        <h3>Payment Details</h3>
                                        <p>
                                            <strong>Received By:</strong> {apt.clinic?.name || "Dr. Mahesh Chandra Clinic"}<br/>
                                            <strong>UPI / Bank:</strong> ______________________________<br/>
                                            <strong>Clinic Address:</strong> {[apt.clinic?.address, apt.clinic?.city, apt.clinic?.state].filter(Boolean).join(", ") || "Ground Floor, H5-12, Dr. KN Katju Marg, Pocket 3, Sector 11, Rohini, Delhi, 110085, India"}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <footer className="footer">
                                <div><strong>Thank you for your visit.</strong> This is a computer-designed invoice template for clinic billing and patient records.</div>
                                <div className="footer-accent"></div>
                            </footer>
                        </main>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
