import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Camera, UploadCloud, Image as ImageIcon, Folder } from 'lucide-react';
import Spinner from '../components/Spinner';

const LAPAK_OPTIONS = [
  "Lapak Pak Dwi Citra Garden",
  "Lapak Bang Iwan Merpati/UPJ",
  "Lapak Jamur/ Sotomie",
  "Lapak Rina Tenda Kuning",
  "Lapak Bang Iwan Menjangan",
  "Lapak Bang iwan Lama BXC",
  "Lapak Amel",
  "Lapak Pak Dwi Stasiun Jurang Mangu",
  "Lapak Pak Dwi Pasmod",
  "Lapak pak Dwi Villa Bintaro",
  "Lapak Jombang 2",
  "Lapak Uti Pasmod"
];

export default function SisaMakanan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    lapak: LAPAK_OPTIONS[0],
    lapakLainnya: '', // Jika lapak 'other'
    fotoBase64: ''
  });

  const [menus, setMenus] = useState([{ id: Date.now(), namaMenu: '', sisa: '' }]);

  const handleMenuChange = (id, field, value) => {
    setMenus(menus.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addMenu = () => {
    setMenus([...menus, { id: Date.now(), namaMenu: '', sisa: '' }]);
  };

  const removeMenu = (id) => {
    if (menus.length > 1) {
      setMenus(menus.filter(m => m.id !== id));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, fotoBase64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const finalLapak = formData.lapak === 'other' ? formData.lapakLainnya : formData.lapak;
    
    try {
      const payload = {
        action: 'sisa',
        tanggal: formData.tanggal,
        lapak: finalLapak,
        menus: menus
      };
      
      const response = await fetch("https://script.google.com/macros/s/AKfycbwfjwjifyQNhC8epwW-5HnlleB9dHwHiL-pWbRvtUMBHAoeNSD6KkKHumxWqO764Oif/exec", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (result.status === "success") {
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } else {
        alert("Gagal menyimpan data: " + result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke Google Sheets.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Berhasil Disimpan!</h2>
        <p className="text-slate-500 mt-2 text-center">Data sisa makanan berhasil dikirim.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-1" /> Kembali
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Sisa Makanan</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card">
          <label className="label-text">Tanggal</label>
          <input type="date" required className="input-field mb-4" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
          
          <label className="label-text">Nama Lapak</label>
          <select 
            className="input-field bg-white mb-2" 
            value={formData.lapak} 
            onChange={(e) => setFormData({...formData, lapak: e.target.value})}
          >
            {LAPAK_OPTIONS.map((lapakName, i) => (
              <option key={i} value={lapakName}>{lapakName}</option>
            ))}
            <option value="other">Lainnya (Ketik Manual...)</option>
          </select>
          
          {formData.lapak === 'other' && (
            <div className="mt-2 animate-fade-in">
              <input type="text" required placeholder="Ketik nama lapak baru..." className="input-field border-orange-300 focus:ring-orange-500" value={formData.lapakLainnya} onChange={(e) => setFormData({...formData, lapakLainnya: e.target.value})} />
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-700">Daftar Sisa Menu</h3>
            <button type="button" onClick={addMenu} className="text-sm bg-teal-50 text-primary px-3 py-1.5 rounded-lg font-semibold flex items-center">
              <Plus className="w-4 h-4 mr-1"/> Tambah
            </button>
          </div>
          
          {menus.map((menu, index) => (
            <div key={menu.id} className="flex gap-2 mb-3 items-start">
              <div className="flex-1">
                <input type="text" required placeholder="Nama Menu" className="input-field" value={menu.namaMenu} onChange={(e) => handleMenuChange(menu.id, 'namaMenu', e.target.value)} />
              </div>
              <div className="w-24">
                <input type="number" required min="0" placeholder="Sisa" className="input-field border-orange-200 focus:ring-orange-500" value={menu.sisa} onChange={(e) => handleMenuChange(menu.id, 'sisa', e.target.value)} />
              </div>
              {menus.length > 1 && (
                <button type="button" onClick={() => removeMenu(menu.id)} className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="font-bold text-slate-700 mb-2">Foto Bukti (Opsional)</h3>
          <p className="text-xs text-slate-500 mb-4">Upload foto kondisi sisa makanan di akhir hari</p>
          
          {formData.fotoBase64 ? (
             <div className="relative mb-4">
               <img src={formData.fotoBase64} alt="Preview" className="w-full h-40 object-contain rounded-xl border border-gray-200 bg-gray-50" />
               <button type="button" onClick={() => setFormData({...formData, fotoBase64: ''})} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600">
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-indigo-200 rounded-xl cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <Camera className="w-6 h-6 text-indigo-500 mb-1" />
                <span className="text-[10px] font-semibold text-indigo-700">Kamera</span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
              </label>
              <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-emerald-200 rounded-xl cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
                <ImageIcon className="w-6 h-6 text-emerald-500 mb-1" />
                <span className="text-[10px] font-semibold text-emerald-700">Galeri Foto</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
              <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-amber-200 rounded-xl cursor-pointer bg-amber-50 hover:bg-amber-100 transition-colors">
                <Folder className="w-6 h-6 text-amber-500 mb-1" />
                <span className="text-[10px] font-semibold text-amber-700">File Saya</span>
                <input type="file" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-6">
          {loading ? <Spinner /> : <><UploadCloud className="w-5 h-5"/> Simpan Data</>}
        </button>
      </form>
    </div>
  );
}
