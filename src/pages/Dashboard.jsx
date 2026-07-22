import React from 'react';
import { Link } from 'react-router-dom';
import { Send, UtensilsCrossed, ShoppingCart, ClipboardList } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8 mt-4">
        <h2 className="text-2xl font-bold text-slate-800">Menu Operasional</h2>
        <p className="text-sm text-slate-500 mt-1">Pilih form pencatatan di bawah ini</p>
      </div>

      <div className="grid gap-4">
        <Link to="/kirim" className="block">
          <div className="card hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex items-center gap-4">
            <div className="bg-teal-100 p-4 rounded-xl group-hover:bg-teal-200 transition-colors">
              <Send className="w-8 h-8 text-primaryDark" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Kirim Makanan</h3>
              <p className="text-sm text-slate-500">Input penitipan awal pagi hari</p>
            </div>
          </div>
        </Link>

        <Link to="/sisa" className="block">
          <div className="card hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex items-center gap-4">
            <div className="bg-orange-100 p-4 rounded-xl group-hover:bg-orange-200 transition-colors">
              <UtensilsCrossed className="w-8 h-8 text-orange-700" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Sisa Makanan</h3>
              <p className="text-sm text-slate-500">Input sisa akhir di lapak</p>
            </div>
          </div>
        </Link>

        <Link to="/belanja" className="block">
          <div className="card hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-xl group-hover:bg-blue-200 transition-colors">
              <ShoppingCart className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Belanja Harian</h3>
              <p className="text-sm text-slate-500">Input pengeluaran operasional</p>
            </div>
          </div>
        </Link>

        <Link to="/menu" className="block">
          <div className="card hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group flex items-center gap-4">
            <div className="bg-purple-100 p-4 rounded-xl group-hover:bg-purple-200 transition-colors">
              <ClipboardList className="w-8 h-8 text-purple-700" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">Daftar Menu</h3>
              <p className="text-sm text-slate-500">Kelola daftar menu & harga</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
