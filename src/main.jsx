import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import AdminPage from './pages/AdminPage.jsx';
import MisReservasPage from './pages/MisReservasPage.jsx';
import MisReservasDetail from './pages/MisReservasDetail.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/mis-reservas" element={<MisReservasPage />} />
        <Route path="/mis-reservas/:id" element={<MisReservasDetail />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
