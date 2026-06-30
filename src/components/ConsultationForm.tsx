"use client";

import { useState } from "react";
import { UploadCloud, ChevronDown } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function ConsultationForm() {
  const [projectType, setProjectType] = useState("");

  const projectTypes = [
    "مسکونی",
    "اداری",
    "تجاری",
    "ویلا",
    "فروشگاه",
    "هتل",
    "بازسازی"
  ];

  return (
    <section id="consultation" className="relative w-full py-24 md:py-32 px-4 md:px-8 bg-[#0a0a0a]">
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[800px] mx-auto bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 lg:p-16 backdrop-blur-xl shadow-2xl relative z-10">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">درخواست مشاوره</h2>
          <p className="text-white/60 font-light leading-relaxed">
            برای بررسی اولیه پروژه و دریافت مشاوره تخصصی، اطلاعات خود را ثبت کنید تا در کوتاه‌ترین زمان با شما تماس بگیریم.
          </p>
        </Reveal>

        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm text-white/70 px-1">نام و نام خانوادگی</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="مثال: علی محمدی"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm text-white/70 px-1">شماره تماس</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors text-right"
                placeholder="09120000000"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="projectType" className="text-sm text-white/70 px-1">نوع پروژه</label>
              <div className="relative">
                <select
                  id="projectType"
                  name="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                >
                  <option value="" disabled className="bg-[#111] text-white/50">انتخاب کنید...</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type} className="bg-[#111] text-white">{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="city" className="text-sm text-white/70 px-1">شهر / محل پروژه</label>
              <input
                id="city"
                name="city"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="تهران، زعفرانیه"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="area" className="text-sm text-white/70 px-1">متراژ تقریبی (متر مربع)</label>
            <input
              id="area"
              name="area"
              type="number"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors text-right"
              placeholder="مثال: 500"
              dir="ltr"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm text-white/70 px-1">توضیحات بیشتر</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
              placeholder="توضیح مختصری درباره نیازها و چشم‌انداز شما از پروژه..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-white/70 px-1">آپلود فایل نقشه (اختیاری)</span>
            <label htmlFor="planFile" className="w-full border border-dashed border-white/20 rounded-xl px-4 py-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 transition-colors group">
              <UploadCloud className="w-8 h-8 text-white/40 group-hover:text-primary transition-colors" />
              <span className="text-white/60 text-sm">برای انتخاب فایل کلیک کنید یا فایل را اینجا رها کنید</span>
              <span className="text-white/30 text-xs">PDF, JPG, PNG (حداکثر 10 مگابایت)</span>
              <input id="planFile" name="planFile" type="file" className="hidden" />
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full mt-6 bg-primary text-black font-medium text-lg py-4 rounded-xl hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(226,232,240,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            ثبت درخواست مشاوره
          </button>
        </form>
      </div>
    </section>
  );
}
