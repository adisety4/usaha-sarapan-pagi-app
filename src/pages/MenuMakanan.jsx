import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Utensils } from 'lucide-react';

export default function MenuMakanan() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([
    { id: 1, nama: 'Nasi Kuning Spesial', harga: 15000, stokAwal: 50 },
    { id: 2, nama: 'Lontong Sayur', harga: 12000, stokAwal: 30 },
    { id: 3, nama: 'Bubur Ayam', harga: 10000, stokAwal: 40 },
  ]);

  return (
    <div className="animate-fade-in pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-1" /> Kembali
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Daftar Menu</h2>
        <button className="bg-primary text-white p-2 rounded-xl hover:bg-primaryDark transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {menus.map((menu) => (
          <div key={menu.id} className="card flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-teal-50 p-3 rounded-lg text-primary">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{menu.nama}</h3>
                <p className="text-sm text-slate-500 font-medium">Rp {menu.harga.toLocaleString('id-ID')}</p>
                <p className="text-xs text-slate-400 mt-0.5">Stok Default: {menu.stokAwal} porsi</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {menus.length === 0 && (
          <div className="text-center py-10">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">Belum ada menu yang ditambahkan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
