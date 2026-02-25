import React from 'react';

export default function SectionWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-[24px] shadow-sm border-2 border-slate-100 mb-10">
      <h2 className="text-2xl font-black text-slate-900 mb-8 pb-5 border-b-4 border-slate-900 uppercase tracking-tighter inline-block">
        {title}
      </h2>
      <div className="w-full">{children}</div>
    </div>
  );
}