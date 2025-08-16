import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import AuthModal from '../modals/AuthModal';
import Icon from '../common/Icon';
import { useNavigate } from 'react-router-dom';
import TeacherRegistrationModal from '../modals/TeacherRegistrationModal';

interface HeaderProps {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {
    const { isLoggedIn, isAdmin, currentUser, logout, isApprovedTeacher } = useApp();
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isTeacherRegisterModalOpen, setIsTeacherRegisterModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin');

    const handleSignOut = () => {
        logout();
        navigate('/');
    };
    
    const openAuthModal = (view: 'signin' | 'signup') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    };

    const handleOpenTeacherRegistration = () => {
        setIsAuthModalOpen(false);
        setIsTeacherRegisterModalOpen(true);
    };

    return (
        <>
            <header id="main-header" className="bg-gray-800 border-b border-gray-700">
                <div className="flex items-center justify-between px-6 py-3">
                     <div className="flex items-center">
                        <button id="menu-toggle" className="text-gray-300 focus:outline-none" onClick={onMenuClick} aria-label="Toggle sidebar">
                            <Icon name={isSidebarOpen ? 'times' : 'bars'} className="text-2xl" />
                        </button>
                    </div>
                    <div className="relative flex-1 max-w-xs hidden sm:block ml-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Icon name="search" className="text-gray-400" /></span>
                        <input type="text" className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Search" />
                    </div>
                    <div id="auth-buttons" className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <span className="text-gray-300 hidden sm:block">
                                  Welcome, {currentUser?.name}
                                  {currentUser?.role === 'teacher' && currentUser.status === 'approved' && <span className="text-xs font-semibold bg-green-500 text-white px-2 py-0.5 rounded-full ml-2">Teacher</span>}
                                  {currentUser?.role === 'teacher' && currentUser.status === 'pending' && <span className="text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full ml-2">Pending</span>}
                                  {currentUser?.role === 'admin' && <span className="text-xs font-semibold bg-purple-600 text-white px-2 py-0.5 rounded-full ml-2">Admin</span>}
                                </span>
                                {isAdmin && (
                                    <button onClick={() => navigate('/admin')} className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition">Admin Panel</button>
                                )}
                                {isApprovedTeacher && (
                                    <button onClick={() => navigate('/teacher/dashboard')} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition">My Dashboard</button>
                                )}
                                <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">Sign Out</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => openAuthModal('signin')} className="text-gray-300 hover:text-indigo-400 font-medium">Sign In</button>
                                <button onClick={() => openAuthModal('signup')} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition ml-4">Sign Up</button>
                            </>
                        )}
                    </div>
                </div>
            </header>
            {isAuthModalOpen && (
                <AuthModal
                    initialView={authModalView}
                    onClose={() => setIsAuthModalOpen(false)}
                    onOpenTeacherRegistration={handleOpenTeacherRegistration}
                />
            )}
            {isTeacherRegisterModalOpen && <TeacherRegistrationModal onClose={() => setIsTeacherRegisterModalOpen(false)} />}
        </>
    );
};

export default Header;