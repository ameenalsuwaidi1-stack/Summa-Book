
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import { Navbar, Footer } from './components/Layout';
import LandingPage from './pages/LandingPage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import ReaderPage from './pages/ReaderPage';
import DashboardPage from './pages/DashboardPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { AdminHome, AdminUpload, AdminManage } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { state } = useApp();

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
            <Route path="/reader/:id" element={<ReaderPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={state.user ? <DashboardPage /> : <Navigate to="/login" />} />
            <Route path="/admin" element={state.user?.role === 'admin' ? <AdminHome /> : <Navigate to="/login" />} />
            <Route path="/admin/upload" element={state.user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/login" />} />
            <Route path="/admin/manage" element={state.user?.role === 'admin' ? <AdminManage /> : <Navigate to="/login" />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
