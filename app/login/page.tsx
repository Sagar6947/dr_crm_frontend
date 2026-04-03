
// // "use client";

// // import { useState } from "react";
// // import { HeartPulse, Eye, EyeOff, ArrowRight } from "lucide-react";
// // import Link from "next/link";
// // import Header from "@/components/Header";

// // export default function LoginPage() {
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [form, setForm] = useState({ email: "", password: "" });

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     console.log(form);
// //   };
// "use client";

// import { useState } from "react";
// import { HeartPulse, Eye, EyeOff, ArrowRight } from "lucide-react";
// import Link from "next/link";
// import Header from "@/components/Header";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();

//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const staticCredentials = {
//     email: "admin@gmail.com",
//     password: "admin123",
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (
//       form.email === staticCredentials.email &&
//       form.password === staticCredentials.password
//     ) {
//       router.push("/admin");
//     } else {
//       setError("Invalid email or password");
//     }
//   };

//   return (
   
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 p-4">
      
//         <Header />
     
//       {/* Login Card - Small box */}
//       <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        
//         {/* Logo */}
//         <div className="flex items-center justify-center gap-2 mb-4">
//           <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
//             <HeartPulse className="text-white w-5 h-5" />
//           </div>
//           <span className="text-xl font-bold text-slate-900">Dr. CRM</span>
//         </div>

//         <h1 className="text-xl font-bold text-slate-900 text-center mb-1">Welcome Back</h1>
//         <p className="text-slate-400 text-xs text-center mb-6">Sign in to your account</p>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* EMAIL */}
//           <div>
//             <label className="block text-xs font-medium text-slate-600 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="you@clinic.com"
//               required
//               className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
//             />
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <div className="flex justify-between items-center mb-1">
//               <label className="text-xs font-medium text-slate-600">Password</label>
//               <Link href="/forgot-password" className="text-[10px] text-teal-600 hover:underline">
//                 Forgot?
//               </Link>
//             </div>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="••••••••"
//                 className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 pr-10"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600"
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>
//           </div>

//           {/* REMEMBER ME */}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center gap-2">
//               <input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
//               <span className="text-xs text-slate-600">Remember me</span>
//             </label>
//           </div>

//           {/* SUBMIT */}
//           <button
//             type="submit"
//             className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
//           >
//             Sign In <ArrowRight className="w-4 h-4" />
//           </button>

//         </form>

//         {/* Footer */}
//         <p className="text-center text-xs text-slate-400 mt-6">
//           Don't have an account?{" "}
//           <Link href="/appointment" className="text-teal-600 font-medium hover:underline">
//             Book a Demo
//           </Link>
//         </p>

//         {/* Trust badge */}
//         <p className="text-center text-[10px] text-slate-300 mt-4">
//           Secured by enterprise encryption
//         </p>
//       </div>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { HeartPulse, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Static credentials for demo
  const staticCredentials = {
    email: "admin@gmail.com",
    password: "admin123",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      form.email === staticCredentials.email &&
      form.password === staticCredentials.password
    ) {
      // Set login cookie for admin route protection
      document.cookie = "adminAuth=true; path=/";

      // Redirect to admin panel
      router.replace("/admin");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 p-4">
      <Header />

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
            <HeartPulse className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">Dr. CRM</span>
        </div>

        <h1 className="text-xl font-bold text-slate-900 text-center mb-1">
          Welcome Back
        </h1>
        <p className="text-slate-400 text-xs text-center mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@gmail.com"
              required
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-600">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] text-teal-600 hover:underline"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="admin123"
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

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          {/* REMEMBER ME */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-600">Remember me</span>
            </label>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link
            href="/appointment"
            className="text-teal-600 font-medium hover:underline"
          >
            Book a Demo
          </Link>
        </p>

        {/* Trust badge */}
        <p className="text-center text-[10px] text-slate-300 mt-4">
          Secured by enterprise encryption
        </p>
      </div>
    </main>
  );
}