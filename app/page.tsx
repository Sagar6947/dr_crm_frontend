import Header from "@/components/Header";
import { Activity, Brain, ShieldCheck, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-teal-50 to-white opacity-60" />
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-teal-100 text-medical-teal text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
            <Star className="w-3 h-3 fill-medical-teal" /> Trusted by 500+ Healthcare Providers
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-8">
            The Intelligent Heart <br />
            <span className="text-medical-teal italic">of Modern Healthcare.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Dr. CRM combines advanced patient management with intuitive clinical tools.
            Streamline your practice, empower your staff, and deliver exceptional patient care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/appointment" className="btn-primary !px-10 !py-4 text-base">
              Get Started Now <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="btn-secondary !px-10 !py-4 text-base">
              View Live Demo
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Designed for Clinical Excellence
            </h2>
            <p className="text-slate-500">
              Everything you need to manage a high-performance medical facility in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="medical-card">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal mb-8">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Patient Intelligence</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Smart health tracking and historical data analysis for personalized care delivery and better outcomes.
              </p>
            </div>

            <div className="medical-card">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal mb-8">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">AI Diagnostics</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Integrated AI-assisted screening tools that help clinicians identify patterns and potential risks faster.
              </p>
            </div>

            <div className="medical-card">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-medical-teal mb-8">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Secure & Compliant</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Military-grade encryption and HIPAA compliance ensure your patient data remains private and protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-slate-400 font-medium">
            &copy; 2025 DR. CRM MEDICAL GROUP. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
