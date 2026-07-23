import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Download, Store, Utensils, User } from 'lucide-react';
import html2canvas from 'html2canvas';

const MITRA_OPTIONS = [
  "Mia",
  "Sunarsih",
  "Lainnya..."
];

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
  "Lapak Uti Pasmod",
  "other"
];

export default function RencanaProduksi() {
  const navigate = useNavigate();
  const hiddenPrintRef = useRef(null);

  // Set default besok
  const besok = new Date();
  besok.setDate(besok.getDate() + 1);
  const defaultTanggal = besok.toISOString().split('T')[0];

  const [tanggal, setTanggal] = useState(defaultTanggal);
  const [lapaks, setLapaks] = useState([
    { id: Date.now(), mitra: MITRA_OPTIONS[0], mitraLainnya: '', namaLapak: LAPAK_OPTIONS[0], lapakLainnya: '', menus: [{ id: Date.now() + 1, namaMenu: '', qty: '' }] }
  ]);
  const [isSaved, setIsSaved] = useState(false);

  // Load draft saat pertama buka
  useEffect(() => {
    const draft = localStorage.getItem('rencanaDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.lapaks && parsed.lapaks.length > 0) {
          setLapaks(parsed.lapaks);
          if (parsed.tanggal) setTanggal(parsed.tanggal);
        }
      } catch (e) {
        console.error("Gagal load draft", e);
      }
    }
  }, []);

  const addLapak = () => {
    setLapaks([...lapaks, { id: Date.now(), mitra: MITRA_OPTIONS[0], mitraLainnya: '', namaLapak: LAPAK_OPTIONS[0], lapakLainnya: '', menus: [{ id: Date.now() + 1, namaMenu: '', qty: '' }] }]);
  };

  const removeLapak = (id) => {
    if (lapaks.length > 1) {
      if (window.confirm("Hapus rencana untuk lapak ini?")) {
        setLapaks(lapaks.filter(l => l.id !== id));
      }
    }
  };

  const handleLapakField = (id, field, val) => {
    setLapaks(lapaks.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  const addMenu = (lapakId) => {
    setLapaks(lapaks.map(l => {
      if (l.id === lapakId) {
        return { ...l, menus: [...l.menus, { id: Date.now(), namaMenu: '', qty: '' }] };
      }
      return l;
    }));
  };

  const removeMenu = (lapakId, menuId) => {
    setLapaks(lapaks.map(l => {
      if (l.id === lapakId) {
        return { ...l, menus: l.menus.filter(m => m.id !== menuId) };
      }
      return l;
    }));
  };

  const handleMenuChange = (lapakId, menuId, field, val) => {
    setLapaks(lapaks.map(l => {
      if (l.id === lapakId) {
        const newMenus = l.menus.map(m => m.id === menuId ? { ...m, [field]: val } : m);
        return { ...l, menus: newMenus };
      }
      return l;
    }));
  };

  const simpanDraft = () => {
    const dataToSave = { tanggal, lapaks };
    localStorage.setItem('rencanaDraft', JSON.stringify(dataToSave));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getGrandTotal = () => {
    const totals = {};
    lapaks.forEach(lapak => {
      lapak.menus.forEach(menu => {
        if (menu.namaMenu.trim() !== '' && menu.qty) {
          const name = menu.namaMenu.trim();
          const qty = parseInt(menu.qty) || 0;
          if (totals[name]) {
            totals[name] += qty;
          } else {
            totals[name] = qty;
          }
        }
      });
    });
    return totals;
  };

  const downloadGambar = async () => {
    if (hiddenPrintRef.current) {
      // Tampilkan sementara div yang disembunyikan untuk difoto
      const printElement = hiddenPrintRef.current;
      printElement.style.display = 'block';

      try {
        const canvas = await html2canvas(printElement, { 
          scale: 2, // Kualitas HD tapi teks tidak kepotong
          backgroundColor: '#ffffff', 
          useCORS: true,
          windowWidth: 600 // Kunci lebar canvas agar tidak terlalu besar
        });
        
        const image = canvas.toDataURL("image/jpeg", 0.9);
        const link = document.createElement('a');
        link.href = image;
        link.download = `Rencana_Menu_${tanggal}.jpg`;
        link.click();
      } catch (err) {
        alert("Gagal membuat gambar: " + err);
      } finally {
        // Sembunyikan kembali
        printElement.style.display = 'none';
      }
    }
  };

  return (
    <div className="animate-fade-in pb-24">
      <button onClick={() => navigate(-1)} className="flex items-center text-primary font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-1" /> Kembali
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Rencana Produksi</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Buat daftar alokasi menu ke lapak</p>
      </div>

      <div className="card mb-6">
        <label className="label-text">Tanggal Rencana</label>
        <input 
          type="date" 
          required 
          className="input-field" 
          value={tanggal} 
          onChange={(e) => setTanggal(e.target.value)} 
        />
      </div>

      {/* Area Input (Tidak akan difoto) */}
      <div className="space-y-4 p-4 -mx-2 bg-slate-50 rounded-xl">

        {lapaks.map((lapak, index) => (
          <div key={lapak.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100 relative">
              <div className="flex flex-col flex-1 mr-3 space-y-3">
                {/* Field Mitra / Owner */}
                <div className="flex items-center">
                  <User className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" />
                  <div className="w-full">
                    <select 
                      className="font-bold text-slate-800 bg-indigo-50 outline-none w-full border border-indigo-100 rounded-lg p-2 focus:border-indigo-500 text-sm"
                      value={lapak.mitra}
                      onChange={(e) => handleLapakField(lapak.id, 'mitra', e.target.value)}
                    >
                      {MITRA_OPTIONS.map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                      ))}
                    </select>
                    {lapak.mitra === 'Lainnya...' && (
                      <input 
                        type="text" 
                        placeholder="Ketik Nama Mitra..." 
                        className="mt-2 text-sm font-semibold text-slate-700 bg-transparent outline-none w-full border-b border-dashed border-slate-300 focus:border-indigo-500"
                        value={lapak.mitraLainnya}
                        onChange={(e) => handleLapakField(lapak.id, 'mitraLainnya', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                {/* Field Nama Lapak */}
                <div className="flex items-center">
                  <Store className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" />
                  <div className="w-full">
                    <select 
                      className="font-bold text-slate-800 bg-emerald-50 outline-none w-full border border-emerald-100 rounded-lg p-2 focus:border-emerald-500 text-sm"
                      value={lapak.namaLapak}
                      onChange={(e) => handleLapakField(lapak.id, 'namaLapak', e.target.value)}
                    >
                      {LAPAK_OPTIONS.map((opt, i) => (
                        <option key={i} value={opt}>{opt === 'other' ? 'Lainnya (Ketik Manual)...' : opt}</option>
                      ))}
                    </select>
                    {lapak.namaLapak === 'other' && (
                      <input 
                        type="text" 
                        placeholder="Ketik Nama Lapak..." 
                        className="mt-2 text-sm font-semibold text-slate-700 bg-transparent outline-none w-full border-b border-dashed border-slate-300 focus:border-emerald-500"
                        value={lapak.lapakLainnya}
                        onChange={(e) => handleLapakField(lapak.id, 'lapakLainnya', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => removeLapak(lapak.id)} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg no-print flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              {lapak.menus.map((menu, idx) => (
                <div key={menu.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Ketik Menu (mis: Nasi Kuning)" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold outline-none focus:border-primary text-slate-700"
                      value={menu.namaMenu}
                      onChange={(e) => handleMenuChange(lapak.id, menu.id, 'namaMenu', e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <input 
                      type="number" 
                      placeholder="Qty" 
                      className="w-full bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2.5 text-sm text-center font-bold text-indigo-700 outline-none focus:border-indigo-500"
                      value={menu.qty}
                      onChange={(e) => handleMenuChange(lapak.id, menu.id, 'qty', e.target.value)}
                    />
                  </div>
                  <button onClick={() => removeMenu(lapak.id, menu.id)} className="text-slate-400 hover:text-red-500 p-1 no-print">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => addMenu(lapak.id)} className="w-full py-2.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-lg text-sm font-bold flex items-center justify-center hover:bg-indigo-50 transition-colors no-print">
              <Plus className="w-5 h-5 mr-1" /> Tambah Baris Menu
            </button>
          </div>
        ))}
      </div>

      <button onClick={addLapak} className="w-full mt-6 py-4 bg-indigo-50 text-indigo-700 rounded-xl font-extrabold flex items-center justify-center hover:bg-indigo-100 shadow-sm transition-colors border border-indigo-100 text-lg">
        <Store className="w-6 h-6 mr-2" /> Tambah Blok Lapak Baru
      </button>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 flex gap-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
        <button 
          onClick={simpanDraft} 
          className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all shadow-md"
        >
          <Save className="w-5 h-5 mr-2" /> 
          {isSaved ? "Tersimpan!" : "Simpan Draft"}
        </button>
        <button 
          onClick={downloadGambar} 
          className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold flex items-center justify-center hover:shadow-lg active:scale-95 transition-all shadow-md text-lg"
        >
          <Download className="w-6 h-6 mr-2" /> Download JPG
        </button>
      </div>

      {/* HIDDEN PRINT VIEW: Format khusus agar teks tidak terpotong & tampilan nota bersih */}
      <div 
        ref={hiddenPrintRef} 
        style={{ display: 'none', width: '600px', padding: '30px', color: '#1e293b' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px dashed #cbd5e1' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 5px 0' }}>Rencana Distribusi Menu</h2>
          <p style={{ fontSize: '16px', color: '#475569', margin: 0 }}>Tanggal: {tanggal}</p>
        </div>

        {lapaks.map((lapak, index) => {
          const finalMitra = lapak.mitra === 'Lainnya...' ? lapak.mitraLainnya : lapak.mitra;
          const finalLapak = lapak.namaLapak === 'other' ? lapak.lapakLainnya : lapak.namaLapak;
          // Hanya render lapak jika ada namanya
          if (!finalLapak) return null;

          return (
            <div key={lapak.id} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#64748b' }}>Mitra: <strong>{finalMitra || '-'}</strong></p>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{finalLapak}</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {lapak.menus.map((menu, idx) => {
                  if (!menu.namaMenu) return null;
                  return (
                    <div key={menu.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', padding: '4px 0' }}>
                      <span>{menu.namaMenu}</span>
                      <strong style={{ fontSize: '18px' }}>{menu.qty || 0}</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* GRAND TOTAL SECTION */}
        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '3px solid #0f172a' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '15px', textAlign: 'center', color: '#0f172a' }}>
            REKAPITULASI TOTAL (GRAND TOTAL)
          </h3>
          <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px' }}>
            {Object.keys(getGrandTotal()).length > 0 ? (
              Object.entries(getGrandTotal()).map(([menuName, totalQty], idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontSize: '18px' }}>
                  <span style={{ fontWeight: '600' }}>{menuName}</span>
                  <span style={{ fontWeight: '900', color: '#0f172a' }}>{totalQty} porsi</span>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', margin: 0, color: '#64748b' }}>Belum ada menu yang diinput.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
