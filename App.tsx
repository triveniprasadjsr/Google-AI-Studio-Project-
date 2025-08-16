import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/shared/Sidebar';
import Header from './components/shared/Header';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import { useApp } from './hooks/useApp';
import DownloadsPage from './pages/DownloadsPage';
import Icon from './components/common/Icon';
import SyllabusPage from './pages/SyllabusPage';
import PyqPage from './pages/PyqPage';
import TeacherDashboard from './pages/TeacherDashboard';

const PageContent: React.FC = () => {
    const location = useLocation();
    const { isAdmin, isApprovedTeacher, isLoading } = useApp();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const isAdminPage = location.pathname.startsWith('/admin');
    const isTeacherDashboardPage = location.pathname.startsWith('/teacher/dashboard');

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        setIsSidebarOpen(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsSidebarOpen(e.matches);
        mediaQuery.addEventListener('change', handler);
        
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const contentArea = document.getElementById('main-content');
        if (contentArea) {
            contentArea.scrollTop = 0;
        }
    }, [location.pathname]);

    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
                <Icon name="spinner" className="fa-3x fa-spin" />
                <span className="ml-4 text-2xl font-semibold">Loading App...</span>
            </div>
        );
    }
    
    if (isAdminPage) {
         return (
             <Routes>
                <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
             </Routes>
         )
    }

    if (isTeacherDashboardPage) {
        return (
            <Routes>
               <Route path="/teacher/dashboard" element={isApprovedTeacher ? <TeacherDashboard /> : <Navigate to="/" />} />
            </Routes>
        )
   }

    return (
        <div className="flex h-screen bg-gray-900">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
                
                <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/course/:id" element={<CourseDetailPage />} />
                        <Route path="/syllabus" element={<SyllabusPage />} />
                        <Route path="/pyq" element={<PyqPage />} />
                        <Route path="/downloads" element={<DownloadsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <HashRouter>
                <PageContent />
            </HashRouter>
        </AppProvider>
    );
};

export default App;