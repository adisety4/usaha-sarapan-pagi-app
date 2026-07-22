import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KirimMakanan from './pages/KirimMakanan';
import SisaMakanan from './pages/SisaMakanan';
import BelanjaHarian from './pages/BelanjaHarian';
import MenuMakanan from './pages/MenuMakanan';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background max-w-md mx-auto shadow-lg overflow-x-hidden relative">
        <header className="bg-primary text-white p-4 sticky top-0 z-10 shadow-md rounded-b-xl">
          <h1 className="text-xl font-bold text-center tracking-tight">Usaha Sarapan Pagi</h1>
        </header>
        <main className="p-4 pb-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kirim" element={<KirimMakanan />} />
            <Route path="/sisa" element={<SisaMakanan />} />
            <Route path="/belanja" element={<BelanjaHarian />} />
            <Route path="/menu" element={<MenuMakanan />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
