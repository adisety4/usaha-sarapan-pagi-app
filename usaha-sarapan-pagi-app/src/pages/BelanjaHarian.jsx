import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Spinner from '../components/Spinner';

export default function BelanjaHarian() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    namaBarang: '',
    kategori: 'Bahan Baku',
    metodeBayar: 'Cash',
    keterangan: '',
    qty: '',
    hargaSatuan: '',
    total: 0
  });

  // Kalkulasi total otomatis
  useEffect(() => {
    const qty = parseFloat(formData.qty) || 0;
    const harga = parseFloat(formData.hargaSatuan) || 0;
    setFormData(prev => ({ ...prev, total: qty * harga }));
  }, [formData.qty, formData.hargaSatuan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        action: 'belanja',
        tanggal: formData.tanggal,
        keterangan: formData.namaBarang,
        jenisBelanja: formData.kategori,
        nominal: formData.total
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card">
          <label className="label-text">Tanggal</label>
          <input type="date" required className="input-field mb-4" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} />
          
          <label className="label-text">Nama Barang / Bahan Baku</label>
          <input type="text" required placeholder="Contoh: Telur, Gas LPG" className="input-field mb-4" value={formData.namaBarang} onChange={(e) => setFormData({...formData, namaBarang: e.target.value})} />
          
          <label className="label-text">Kategori Belanja</label>
          <select className="input-field mb-4 bg-white" value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})}>
            <option>Bahan Baku</option>
            <option>Kemasan</option>
            <option>Operasional</option>
          </select>
        </div>

        <div className="card bg-blue-50/50 border-blue-100">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="label-text text-blue-900">Qty / Satuan</label>
              <input type="number" required min="0.1" step="any" placeholder="10" className="input-field border-blue-200" value={formData.qty} onChange={(e) => setFormData({...formData, qty: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="label-text text-blue-900">Harga Satuan</label>
              <input type="number" required min="0" placeholder="5000" className="input-field border-blue-200" value={formData.hargaSatuan} onChange={(e) => setFormData({...formData, hargaSatuan: e.target.value})} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-blue-100 flex justify-between items-center shadow-sm">
            <span className="font-semibold text-slate-600">Total Harga:</span>
            <span className="text-xl font-bold text-blue-700">{formatRupiah(formData.total)}</span>
          </div>
        </div>

        <div className="card">
          <label className="label-text">Metode Pembayaran</label>
          <select className="input-field mb-4 bg-white" value={formData.metodeBayar} onChange={(e) => setFormData({...formData, metodeBayar: e.target.value})}>
            <option>Cash</option>
            <option>Transfer Bank</option>
          </select>
          
          <label className="label-text">No. Rekening / Keterangan</label>
          <input type="text" placeholder="BCA A/N Budi (Jika transfer)" className="input-field" value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-6">
          {loading ? <Spinner /> : <><UploadCloud className="w-5 h-5"/> Simpan Pengeluaran</>}
        </button>
      </form>
    </div>
  );
}
