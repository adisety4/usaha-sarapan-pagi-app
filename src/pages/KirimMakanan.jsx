import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Camera, UploadCloud } from 'lucide-react';
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

const HARGA_OPTIONS = [
  "9000",
  "8500"
];

export default function KirimMakanan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    mitra: '',
    lapak: LAPAK_OPTIONS[0],
    lapakLainnya: '', // Jika lapak 'other'
    fotoBase64: ''
  });

  const [menus, setMenus] = useState([
    { id: Date.now(), namaMenu: '', qty: '', harga: HARGA_OPTIONS[0], hargaLainnya: '' }
  ]);

  const handleMenuChange = (id, field, value) => {
    setMenus(menus.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const addMenu = () => {
    setMenus([...menus, { id: Date.now(), namaMenu: '', qty: '', harga: HARGA_OPTIONS[0], hargaLainnya: '' }]);
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
    
    // Tentukan nilai final yang akan dikirim (apakah dari dropdown atau isian manual 'other')
    const finalLapak = formData.lapak === 'other' ? formData.lapakLainnya : formData.lapak;
    
    // Format menus agar mengambil harga final
    const finalMenus = menus.map(m => ({
      namaMenu: m.namaMenu,
      qty: m.qty,
      harga: m.harga === 'other' ? m.hargaLainnya : m.harga
    }));
    
    try {
      const payload = {
        action: 'kirim',
        tanggal: formData.tanggal,
        mitra: formData.mitra,
        lapak: finalLapak,
        menus: finalMenus
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
        <p className="text-slate-500 mt-2 text-center">Data penitipan makanan berhasil dikirim.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-1" /> Kembali
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Kirim Makanan</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card">
          <label className="label-text">Tanggal</label>
          <input type="date" required className="input-field mb-4" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
          
          <label className="label-text">Nama Mitra / Owner</label>
          <input type="text" required placeholder="Contoh: Budi" className="input-field mb-4" value={formData.mitra} onChange={(e) => setFormData({...formData, mitra: e.target.value})} />
          
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
            <h3 className="font-bold text-slate-700">Daftar Menu</h3>
            <button type="button" onClick={addMenu} className="text-sm bg-teal-50 text-primary px-3 py-1.5 rounded-lg font-semibold flex items-center">
              <Plus className="w-4 h-4 mr-1"/> Tambah
            </button>
          </div>
          
          {menus.map((menu, index) => (
            <div key={menu.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-slate-600 text-sm">Menu #{index + 1}</span>
                {menus.length > 1 && (
                  <button type="button" onClick={() => removeMenu(menu.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="mb-3">
                <label className="label-text text-xs">Nama Menu</label>
                <input type="text" required placeholder="Contoh: Nasi Kuning" className="input-field" value={menu.namaMenu} onChange={(e) => handleMenuChange(menu.id, 'namaMenu', e.target.value)} />
              </div>
              
              <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="label-text text-xs">Qty</label>
                  <input type="number" required min="1" placeholder="10" className="input-field" value={menu.qty} onChange={(e) => handleMenuChange(menu.id, 'qty', e.target.value)} />
                </div>
                <div className="w-2/3">
                  <label className="label-text text-xs">Harga Satuan</label>
                  <select 
                    className="input-field bg-white" 
                    value={menu.harga} 
                    onChange={(e) => handleMenuChange(menu.id, 'harga', e.target.value)}
                  >
                    {HARGA_OPTIONS.map((h, i) => (
                      <option key={i} value={h}>Rp {h}</option>
                    ))}
                    <option value="other">Lainnya...</option>
                  </select>
                </div>
              </div>
              
              {menu.harga === 'other' && (
                <div className="mt-3 animate-fade-in">
                  <label className="label-text text-xs text-orange-600">Ketik Harga Manual (Angka Saja)</label>
                  <input type="number" required placeholder="Contoh: 15000" className="input-field border-orange-200" value={menu.hargaLainnya} onChange={(e) => handleMenuChange(menu.id, 'hargaLainnya', e.target.value)} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="font-bold text-slate-700 mb-2">Foto Catatan (Opsional)</h3>
          <p className="text-xs text-slate-500 mb-4">Upload foto fisik lembar catatan penitipan</p>
          
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {formData.fotoBase64 ? (
                <img src={formData.fotoBase64} alt="Preview" className="h-24 object-contain rounded" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Ambil / Upload Foto</p>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-6">
          {loading ? <Spinner /> : <><UploadCloud className="w-5 h-5"/> Simpan Data</>}
        </button>
      </form>
    </div>
  );
}
