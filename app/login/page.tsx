
// "use client";

// import { useState } from "react";
// import { HeartPulse, Eye, EyeOff, ArrowRight } from "lucide-react";
// import Link from "next/link";
// import Header from "@/components/Header";
// import { useRouter } from "next/navigation";
// import { authService } from "@/lib/api"; // ✅ correct import

// export default function LoginPage() {
//   const router = useRouter();

//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   // 🔥 ONLY THIS PART CHANGED
//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//     const formData = new FormData();
//     formData.append("contact_no", form.email);
//     formData.append("password", form.password);

//     const res = await authService.adminLogin(formData);

//     console.log("API Response:", res);

//     if (res.status === 200) {
//       const token = res.data?.token;

//       // ✅ IMPORTANT FIX
//       if (token) {
//         document.cookie = `adminToken=${token}; path=/`;
        
//       }

//       router.push("/admin");
//     }
//   } catch (err: any) {
//   console.log("Login Error:", err);

//   // 🔥 backend ka real message show karo
//   if (err?.message) {
//     setError(err.message);
//   } else {
//     setError("Invalid credentials");
//   }
// }
// };

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 p-4">
//       <Header />

//       <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
//         {/* Logo */}
//         <div className="flex items-center justify-center gap-2 mb-4">
//           <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
//             <HeartPulse className="text-white w-5 h-5" />
//           </div>
//           <span className="text-xl font-bold text-slate-900">Dr. CRM</span>
//         </div>

//         <h1 className="text-xl font-bold text-slate-900 text-center mb-1">
//           Admin Login
//         </h1>
//         <p className="text-slate-400 text-xs text-center mb-6">
//           Sign in to your account
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* CONTACT */}
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">
//               Contact Number
//             </label>
//             <input
//               type="text"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Enter contact number"
//               required
//               className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
//             />
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <div className="flex justify-between items-center mb-1">
//               <label className="text-xs font-medium text-slate-600">
//                 Password
//               </label>
//             </div>

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter password"
//                 className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 pr-10"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-4 h-4" />
//                 ) : (
//                   <Eye className="w-4 h-4" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* ERROR */}
//           {error && (
//             <p className="text-red-500 text-xs text-center">{error}</p>
//           )}

//           {/* SUBMIT */}
//           <button
//             type="submit"
//             className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
//           >
//             Login <ArrowRight className="w-4 h-4" />
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState,useEffect } from "react";
import { HeartPulse, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [contactError, setContactError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
  // const token = document.cookie.includes("adminToken");
  const token = document.cookie
  .split("; ")
  .find(row => row.startsWith("adminToken="));

  if (token) {
    router.replace("/admin");
  }
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 🔥 ONLY NUMBER VALIDATION
    if (name === "email") {
      if (!/^\d*$/.test(value)) {
        setContactError("Only numbers are allowed");
        return;
      } else {
        setContactError("");
      }
    }

    setForm({ ...form, [name]: value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 10 digit validation
    if (!/^\d{10}$/.test(form.email)) {
      setContactError("Enter valid 10-digit number");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("contact_no", form.email);
      formData.append("password", form.password);

      const res = await authService.adminLogin(formData);

      if (res.status === 200) {
        const token = res.data?.token;

        if (token) {
          document.cookie = `adminToken=${token}; path=/`;
        }

        router.push("/admin");
      }
    } catch (err: any) {
      if (err?.message) {
        setError(err.message);
      } else {
        setError("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 p-4">
      <Header />

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center">
            <img src="/dr-mahesh-clinic-logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <div className="flex flex-col justify-center text-left">
            <span className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Elixa</span>
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Homeopathic Healing Handsand House of Hopes</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-slate-900 text-center mb-1">
          Admin Login
        </h1>
        <p className="text-slate-400 text-xs text-center mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CONTACT */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
              maxLength={10}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                contactError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-200 focus:ring-teal-500/50 focus:border-teal-500"
              }`}
            />
            {contactError && (
              <p className="text-red-500 text-xs mt-1">{contactError}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-600">
                Password
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </>
            ) : (
              <>
                Login <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}