import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KirimMakanan from './pages/KirimMakanan';
import SisaMakanan from './pages/SisaMakanan';
import BelanjaHarian from './pages/BelanjaHarian';
import MenuMakanan from './pages/MenuMakanan';
import RencanaProduksi from './pages/RencanaProduksi';
import { Sparkles } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Premium Header */}
        <header className="premium-header flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight">Usaha Sarapan Pagi</h1>
          </div>
          <p className="text-xs text-white/70 font-medium">Sistem Manajemen Cabang</p>
        </header>

        <main className="p-5 pt-6 relative z-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kirim" element={<KirimMakanan />} />
            <Route path="/sisa" element={<SisaMakanan />} />
            <Route path="/belanja" element={<BelanjaHarian />} />
            <Route path="/menu" element={<MenuMakanan />} />
            <Route path="/rencana" element={<RencanaProduksi />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
