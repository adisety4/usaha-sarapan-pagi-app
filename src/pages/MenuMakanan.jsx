import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Utensils, X, Save } from 'lucide-react';

export default function MenuMakanan() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([
    { id: 1, nama: 'Nasi Kuning Spesial', harga: 15000, stokAwal: 50 },
    { id: 2, nama: 'Lontong Sayur', harga: 12000, stokAwal: 30 },
    { id: 3, nama: 'Bubur Ayam', harga: 10000, stokAwal: 40 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    harga: '',
    stokAwal: ''
  });

  const handleOpenModal = (menu = null) => {
    if (menu) {
      setEditingId(menu.id);
      setFormData({
        nama: menu.nama,
        harga: menu.harga,
        stokAwal: menu.stokAwal
      });
    } else {
      setEditingId(null);
      setFormData({ nama: '', harga: '', stokAwal: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nama: '', harga: '', stokAwal: '' });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      setMenus(menus.map(m => m.id === editingId ? { 
        ...m, 
        nama: formData.nama, 
        harga: parseInt(formData.harga), 
        stokAwal: parseInt(formData.stokAwal) 
      } : m));
    } else {
      const newMenu = {
        id: Date.now(),
        nama: formData.nama,
        harga: parseInt(formData.harga),
        stokAwal: parseInt(formData.stokAwal)
      };
      setMenus([...menus, newMenu]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if(window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      setMenus(menus.filter(m => m.id !== id));
    }
  };

  return (
    <div className="animate-fade-in pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-1" /> Kembali
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Daftar Menu</h2>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-primary text-white p-2 rounded-xl hover:bg-primaryDark transition-colors shadow-sm"
        >
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
              <button 
                onClick={() => handleOpenModal(menu)}
                className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(menu.id)}
                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
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

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end sm:items-center animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl transform transition-transform animate-slide-up sm:animate-fade-in">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label-text">Nama Menu</label>
                <input 
                  type="text" 
                  required 
                  className="input-field" 
                  placeholder="Contoh: Nasi Uduk"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label-text">Harga (Rp)</label>
                <input 
                  type="number" 
                  required 
                  className="input-field" 
                  placeholder="Contoh: 15000"
                  value={formData.harga}
                  onChange={(e) => setFormData({...formData, harga: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label-text">Stok Default (Porsi)</label>
                <input 
                  type="number" 
                  required 
                  className="input-field" 
                  placeholder="Contoh: 30"
                  value={formData.stokAwal}
                  onChange={(e) => setFormData({...formData, stokAwal: e.target.value})}
                />
              </div>
              
              <button type="submit" className="btn-primary w-full mt-4 flex justify-center items-center">
                <Save className="w-5 h-5 mr-2" /> Simpan Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
