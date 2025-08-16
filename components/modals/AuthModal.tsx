import React, { useState, FormEvent } from 'react';
import { useApp } from '../../hooks/useApp';
import Icon from '../common/Icon';
import TeacherRegistrationModal from './TeacherRegistrationModal';
import { ADMIN_EMAIL } from '../../constants';

interface AuthModalProps {
    initialView: 'signin' | 'signup';
    onClose: () => void;
    onOpenTeacherRegistration: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onClose, onOpenTeacherRegistration }) => {
    const { login, signup } = useApp();
    const [view, setView] = useState(initialView);
    const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'admin'>('student');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            if (view === 'signin') {
                await login(email, password, activeTab);
                setSuccess('Login successful! Redirecting...');
                setTimeout(onClose, 1000);
            } else { // Student signup
                const name = formData.get('name') as string;
                const confirmPassword = formData.get('confirmPassword') as string;
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match.');
                }
                await signup(name, email, password);
                setSuccess('Account created! Please sign in.');
                setTimeout(() => setView('signin'), 1500);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const switchView = (newView: 'signin' | 'signup') => {
        setView(newView);
        setError('');
        setSuccess('');
    }

    const renderFormContent = () => {
        // Admin Sign In Form
        if (activeTab === 'admin') {
             return (
                 <>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white">Admin Sign In</h1>
                        <p className="mt-2 text-sm text-gray-400">Access the site management panel.</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                         <div className="space-y-4">
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon name="at" className="h-5 w-5 text-gray-400" /></span>
                                <input name="email" type="email" placeholder="Email address" required className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg" defaultValue={ADMIN_EMAIL} />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon name="lock" className="h-5 w-5 text-gray-400" /></span>
                                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required className="w-full pl-11 pr-12 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white">
                                    <Icon name={showPassword ? 'eye-slash' : 'eye'} />
                                </button>
                            </div>
                        </div>
                        <div className="h-5 text-center text-sm">
                            {error && <p className="text-red-400">{error}</p>}
                            {success && <p className="text-green-400">{success}</p>}
                        </div>
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold shadow-sm bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60">
                                {isLoading && <Icon name="spinner" className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                                Sign In
                            </button>
                        </div>
                    </form>
                </>
            );
        }
        
        // Teacher Sign In Form
        if (activeTab === 'teacher' && view === 'signin') {
            return (
                <>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white">Teacher Sign In</h1>
                        <p className="mt-2 text-sm text-gray-400">Access your instructor dashboard.</p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                         <div className="space-y-4">
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon name="at" className="h-5 w-5 text-gray-400" /></span>
                                <input name="email" type="email" placeholder="Email address" required className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg" />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon name="lock" className="h-5 w-5 text-gray-400" /></span>
                                <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required className="w-full pl-11 pr-12 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white">
                                    <Icon name={showPassword ? 'eye-slash' : 'eye'} />
                                </button>
                            </div>
                        </div>
                        <div className="h-5 text-center text-sm">
                            {error && <p className="text-red-400">{error}</p>}
                            {success && <p className="text-green-400">{success}</p>}
                        </div>
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold shadow-sm bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60">
                                {isLoading && <Icon name="spinner" className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                                Sign In
                            </button>
                        </div>
                    </form>
                    <div>
                        <p className="mt-6 text-center text-sm text-gray-400">
                           Want to become a teacher?
                           <button onClick={onOpenTeacherRegistration} className="font-medium text-indigo-400 hover:text-indigo-300 ml-1">
                               Register Here
                           </button>
                        </p>
                    </div>
                </>
            );
        }

        // Student Sign In/Sign Up Form
        return (
            <>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">{view === 'signin' ? 'Welcome Back' : 'Create an Account'}</h1>
                    <p className="mt-2 text-sm text-gray-400">{view === 'signin' ? 'Sign in to continue.' : 'Get started with your free account.'}</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {view === 'signup' && (
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon name="user" className="h-5 w-5 text-gray-400" /></span>
                                <input name="name" type="text" placeholder="Full Name" required className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg" />
                            </div>
                        )}
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon name="at" className="h-5 w-5 text-gray-400" /></span>
                            <input name="email" type="email" placeholder="Email address" required className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg" />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon name="lock" className="h-5 w-5 text-gray-400" /></span>
                            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required className="w-full pl-11 pr-12 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white">
                                <Icon name={showPassword ? 'eye-slash' : 'eye'} />
                            </button>
                        </div>
                         {view === 'signup' && (
                            <div className="relative">
                                 <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none"><Icon name="lock" className="h-5 w-5 text-gray-400" /></span>
                                 <input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" required className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg" />
                            </div>
                        )}
                    </div>
                    <div className="h-5 text-center text-sm">
                        {error && <p className="text-red-400">{error}</p>}
                        {success && <p className="text-green-400">{success}</p>}
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold shadow-sm bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60">
                            {isLoading && <Icon name="spinner" className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
                            {view === 'signin' ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                 <div>
                    <p className="mt-6 text-center text-sm text-gray-400">
                       {view === 'signin' ? "Not a member? " : "Already have an account? "}
                       <button onClick={() => switchView(view === 'signin' ? 'signup' : 'signin')} className="font-medium text-indigo-400 hover:text-indigo-300">
                           {view === 'signin' ? 'Sign Up' : 'Sign In'}
                       </button>
                    </p>
                </div>
            </>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
            <div className="relative w-full max-w-md">
                <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500 to-rose-500 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative z-10 w-full bg-gray-900 rounded-2xl shadow-2xl border border-white/10">
                    <button onClick={onClose} className="close-modal-btn absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-20">&times;</button>
                    
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700">
                        <button onClick={() => { setActiveTab('student'); setView('signin'); setError('')}} className={`flex-1 p-4 font-semibold text-sm transition-colors ${activeTab === 'student' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}>
                            Student
                        </button>
                         <button onClick={() => { setActiveTab('teacher'); setView('signin'); setError('')}} className={`flex-1 p-4 font-semibold text-sm transition-colors ${activeTab === 'teacher' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}>
                            Teacher
                        </button>
                         <button onClick={() => { setActiveTab('admin'); setView('signin'); setError('')}} className={`flex-1 p-4 font-semibold text-sm transition-colors ${activeTab === 'admin' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}>
                            Admin
                        </button>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        {renderFormContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;