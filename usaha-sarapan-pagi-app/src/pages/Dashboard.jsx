import React from 'react';
import { Link } from 'react-router-dom';
import { Send, UtensilsCrossed, ShoppingCart, ClipboardList, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8 mt-2 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Menu Utama</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Pilih aktivitas hari ini</p>
        </div>
        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl flex items-center shadow-sm">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      <div className="grid gap-5">
        <Link to="/kirim" className="block outline-none">
          <div className="feature-card group">
            <div className="feature-icon-wrapper bg-gradient-to-br from-teal-400 to-emerald-500 text-white">
              <Send className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">Kirim Makanan</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Penitipan awal pagi hari</p>
            </div>
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </Link>

        <Link to="/sisa" className="block outline-none">
          <div className="feature-card group">
            <div className="feature-icon-wrapper bg-gradient-to-br from-orange-400 to-rose-500 text-white">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">Sisa Makanan</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Laporan sisa akhir lapak</p>
            </div>
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </Link>

        <Link to="/belanja" className="block outline-none">
          <div className="feature-card group">
            <div className="feature-icon-wrapper bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
              <ShoppingCart className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">Belanja Harian</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Catat pengeluaran bahan</p>
            </div>
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </Link>

        <Link to="/menu" className="block outline-none mt-2">
          <div className="feature-card group">
            <div className="feature-icon-wrapper bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">Daftar Menu</h3>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Atur harga & stok default</p>
            </div>
            <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-slate-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
