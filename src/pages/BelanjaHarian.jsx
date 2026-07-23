import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, UploadCloud } from 'lucide-react';
import Spinner from '../components/Spinner';

const MITRA_OPTIONS = [
  "Mia",
  "Sunarsih",
  "Lainnya..."
];

export default function BelanjaHarian() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Data utama nota
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    mitra: MITRA_OPTIONS[0],
    mitraLainnya: '',
    metodeBayar: 'Cash',
    keterangan: ''
  });

  // Data inputan sementara untuk ditambahkan ke daftar
  const [currentItem, setCurrentItem] = useState({
    namaBarang: '',
    kategori: 'Bahan Baku',
    qty: '',
    hargaSatuan: '',
    total: 0
  });

  // Daftar belanjaan (Keranjang)
  const [items, setItems] = useState([]);

  // Kalkulasi total otomatis untuk item saat ini
  useEffect(() => {
    const qty = parseFloat(currentItem.qty) || 0;
    const harga = parseFloat(currentItem.hargaSatuan) || 0;
    setCurrentItem(prev => ({ ...prev, total: qty * harga }));
  }, [currentItem.qty, currentItem.hargaSatuan]);

  const handleAddItem = () => {
    if (!currentItem.namaBarang || !currentItem.qty || !currentItem.hargaSatuan) {
      alert("Mohon lengkapi nama barang, qty, dan harga satuan!");
      return;
    }
    
    setItems([...items, { ...currentItem, id: Date.now() }]);
    
    // Reset form input sementara
    setCurrentItem({
      namaBarang: '',
      kategori: 'Bahan Baku',
      qty: '',
      hargaSatuan: '',
      total: 0
    });
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Hitung Grand Total dari semua item di keranjang
  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Daftar belanjaan masih kosong! Mohon tambahkan minimal 1 barang.");
      return;
    }
    
    setLoading(true);
    
    const finalMitra = formData.mitra === 'Lainnya...' ? formData.mitraLainnya : formData.mitra;
    
    try {
      const payload = {
        action: 'belanja_multi', // ACTION BARU UNTUK MULTI ITEM
        tanggal: formData.tanggal,
        mitra: finalMitra,
        metodeBayar: formData.metodeBayar,
        keterangan: formData.keterangan,
        items: items // Kirim array items
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
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
        <p className="text-slate-500 mt-2 text-center">Data belanja berhasil dicatat.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-10">
      <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-1" /> Kembali
      </button>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Belanja Harian</h2>

      <div className="space-y-5">
        {/* BAGIAN 1: DATA UTAMA NOTA */}
        <div className="card">
          <label className="label-text">Tanggal</label>
          <input type="date" className="input-field mb-4" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
          
          <label className="label-text">Nama Mitra / Owner</label>
          <select 
            className="input-field bg-white mb-2" 
            value={formData.mitra} 
            onChange={(e) => setFormData({...formData, mitra: e.target.value})}
          >
            {MITRA_OPTIONS.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
          {formData.mitra === 'Lainnya...' && (
            <div className="mt-2 mb-4 animate-fade-in">
              <input type="text" placeholder="Ketik nama mitra..." className="input-field border-indigo-300 focus:ring-indigo-500" value={formData.mitraLainnya} onChange={(e) => setFormData({...formData, mitraLainnya: e.target.value})} />
            </div>
          )}
        </div>

        {/* BAGIAN 2: FORM INPUT BARANG (KERANJANG) */}
        <div className="card bg-blue-50/50 border-blue-100">
          <h3 className="font-bold text-blue-900 mb-4 flex items-center border-b border-blue-200 pb-2">
            <Plus className="w-5 h-5 mr-2 text-blue-600"/> Tambah Barang
          </h3>
          
          <label className="label-text text-blue-900">Nama Barang / Bahan Baku</label>
          <input type="text" placeholder="Contoh: Telur, Gas LPG" className="input-field border-blue-200 mb-4" value={currentItem.namaBarang} onChange={(e) => setCurrentItem({...currentItem, namaBarang: e.target.value})} />
          
          <label className="label-text text-blue-900">Kategori Belanja</label>
          <select className="input-field border-blue-200 mb-4 bg-white" value={currentItem.kategori} onChange={(e) => setCurrentItem({...currentItem, kategori: e.target.value})}>
            <option>Bahan Baku</option>
            <option>Kemasan</option>
            <option>Operasional</option>
          </select>

          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="label-text text-blue-900">Qty / Satuan</label>
              <input type="number" min="0.1" step="any" placeholder="10" className="input-field border-blue-200" value={currentItem.qty} onChange={(e) => setCurrentItem({...currentItem, qty: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="label-text text-blue-900">Harga Satuan</label>
              <input type="number" min="0" placeholder="5000" className="input-field border-blue-200" value={currentItem.hargaSatuan} onChange={(e) => setCurrentItem({...currentItem, hargaSatuan: e.target.value})} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-blue-100 flex justify-between items-center shadow-sm mb-4">
            <span className="font-semibold text-slate-600">Subtotal:</span>
            <span className="text-lg font-bold text-blue-700">{formatRupiah(currentItem.total)}</span>
          </div>

          <button type="button" onClick={handleAddItem} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center">
            <Plus className="w-5 h-5 mr-1"/> Tambah ke Daftar
          </button>
        </div>

        {/* BAGIAN 3: DAFTAR BELANJA (BILL) */}
        {items.length > 0 && (
          <div className="card animate-fade-in border-emerald-100 bg-emerald-50/20">
            <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">Daftar Belanjaan ({items.length} item)</h3>
            
            <div className="space-y-3 mb-4">
              {items.map((item, index) => (
                <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-start shadow-sm">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{item.namaBarang}</h4>
                    <p className="text-xs text-slate-500 mb-1">{item.kategori}</p>
                    <p className="text-xs text-slate-600 font-medium">
                      {item.qty} x {formatRupiah(item.hargaSatuan)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full">
                    <span className="font-bold text-slate-800 mb-2">{formatRupiah(item.total)}</span>
                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 bg-red-50 p-1.5 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-600 p-4 rounded-xl text-white flex justify-between items-center shadow-lg shadow-emerald-200">
              <span className="font-medium text-emerald-100">Grand Total:</span>
              <span className="text-2xl font-bold">{formatRupiah(grandTotal)}</span>
            </div>
          </div>
        )}

        {/* BAGIAN 4: PEMBAYARAN DAN SUBMIT */}
        <form onSubmit={handleSubmit} className="card bg-slate-50 border-slate-200">
          <label className="label-text">Metode Pembayaran</label>
          <select className="input-field mb-4 bg-white" value={formData.metodeBayar} onChange={(e) => setFormData({...formData, metodeBayar: e.target.value})}>
            <option>Cash</option>
            <option>Transfer Bank</option>
          </select>
          
          <label className="label-text">No. Rekening / Keterangan</label>
          <input type="text" placeholder="BCA A/N Budi (Jika transfer)" className="input-field bg-white" value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})} />
          
          <button type="submit" disabled={loading || items.length === 0} className={`w-full font-bold py-4 rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-center mt-6 ${items.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-orange-500 text-white hover:opacity-90'}`}>
            {loading ? <Spinner /> : <><UploadCloud className="w-5 h-5 mr-2"/> Simpan Pengeluaran</>}
          </button>
        </form>
      </div>
    </div>
  );
}
