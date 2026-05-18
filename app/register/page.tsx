/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-hot-toast';


export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [show, setShow] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleRegisterUser = async () => {
  try {
    console.log("register user", formData);

    // simple validation
    if (formData.password !== formData.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await axios.post("/api/postRegisterUser", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirm: formData.confirm,
    });

    console.log("response", res.data);

    toast.success("User Registered Successfully ✅");

  } catch (error: any) {
    console.error("error", error);

    if (error.response) {
      toast.error(error.response.data.message || "Registration failed ❌");
    } else {
      toast.error("Server error ❌");
    }
  }
};
  return (
    <div className="min-h-screen bg-[#72f1ed] flex items-center justify-center px-4 font-sans">
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Glow blob */}
      <div className="pointer-events-none fixed top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="relative w-full max-w-md">
        {/* Card — light/white */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl shadow-black/20">

          {/* Logo mark */}
          <div className="mb-8 flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white text-sm font-bold tracking-tight">
                R
              </span>
              <span className="text-gray-900 text-lg font-semibold tracking-tight">Register</span>
            </div>
            <p className="text-gray-400 text-sm">Create your account to get started.</p>
          </div>

          <div className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide uppercase">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handle}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide uppercase">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handle}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  placeholder="········"
                  value={formData.password}
                  onChange={handle}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition text-xs"
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Strength bar */}
              {formData.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        formData.password.length >= i * 3
                          ? i <= 1
                            ? 'bg-red-500'
                            : i <= 2
                            ? 'bg-amber-500'
                            : i <= 3
                            ? 'bg-lime-400'
                            : 'bg-emerald-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide uppercase">
                Confirm Password
              </label>
              <input
                name="confirm"
                type="password"
                placeholder="········"
                value={formData.confirm}
                onChange={handle}
                className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 ${
                  formData.confirm && formData.confirm !== formData.password
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {formData.confirm && formData.confirm !== formData.password && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {/* Submit */}
            <button
              type="button"
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] px-4 py-3 text-sm font-semibold text-white transition-all duration-150 shadow-lg shadow-indigo-600/20 mt-2" onClick={() => handleRegisterUser()}
            >Create Account
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            {['Google', 'GitHub'].map((provider) => (
              <button
                key={provider}
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition"
              >
                <span className="text-base">{provider === 'Google' ? '🌐' : '🐙'}</span>
                {provider}
              </button>
            ))}
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <a href="login" className="text-indigo-600 hover:text-indigo-500 transition">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}