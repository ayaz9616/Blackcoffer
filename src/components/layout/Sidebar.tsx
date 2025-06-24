"use client";
import React, { useEffect, useState } from 'react';

const Sidebar = () => {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return (
    <aside className="bg-gradient-to-b from-[var(--primary)] via-[var(--secondary)] to-[var(--background)] text-white w-64 min-h-screen flex flex-col p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-white/20 rounded-full p-2">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2xIu3KWcbq-qKhz9cgIWMWHKzEtaUq8CH0g&s" alt="Logo" width={40} height={40} className="rounded-full object-cover" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight drop-shadow-lg">Blackcoffer</span>
      </div>
      <nav className="flex flex-col gap-4 text-lg font-medium">
        <a href="#" className="hover:bg-white/10 rounded px-3 py-2 transition">Dashboard</a>
        <a href="#charts" className="hover:bg-white/10 rounded px-3 py-2 transition">Charts</a>
        <a href="#filters" className="hover:bg-white/10 rounded px-3 py-2 transition">Filters</a>
      </nav>
      <div className="mt-auto text-xs text-white/70 pt-8">© {year ?? ""} Blackcoffer</div>
      <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)'}}></div>
    </aside>
  );
};

export default Sidebar; 