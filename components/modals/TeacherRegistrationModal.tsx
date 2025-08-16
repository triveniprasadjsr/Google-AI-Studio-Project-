import React, { useState, FormEvent } from 'react';
import { useApp } from '../../hooks/useApp';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import FileInput from '../common/FileInput';

interface TeacherRegistrationModalProps {
    onClose: () => void;
}

const TeacherRegistrationModal: React.FC<TeacherRegistrationModalProps> = ({ onClose }) => {
    const { siteData, teacherSignup } = useApp();
    const [formData, setFormData] = useState({ 
        name: '', email: '', password: '', confirmPassword: '', transactionId: '',
        designation: '', qualifications: '', experience: '' 
    });
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const registrationFee = 1000;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (!formData.transactionId.trim() || !screenshotFile) {
            setError('Transaction ID and a payment screenshot are required.');
            return;
        }
        
        if (!photoFile) {
            setError('A profile photo is required.');
            return;
        }

        setIsLoading(true);

        try {
            await teacherSignup(
                formData.name, 
                formData.email, 
                formData.password, 
                formData.transactionId, 
                screenshotFile,
                formData.designation,
                formData.qualifications,
                formData.experience,
                photoFile
            );
            setShowSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (showSuccess) {
        return (
            <Modal title="Registration Submitted" onClose={onClose}>
                <div className="text-center p-6">
                    <Icon name="check-circle" className="text-green-500 text-5xl mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Thank You for Registering!</h3>
                    <p className="text-gray-300">Your application has been submitted for verification. You will receive an email and be able to log in once the admin has approved your account.</p>
                </div>
                 <div className="p-4 bg-gray-800 text-right">
                    <button onClick={onClose} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                        Close
                    </button>
                </div>
            </Modal>
        );
    }

    const footer = (
        <div className="flex justify-end w-full">
            <button type="button" onClick={onClose} className="bg-gray-600 text-gray-200 px-6 py-2 rounded-md hover:bg-gray-500 mr-3">Cancel</button>
            <button type="submit" form="teacher-reg-form" disabled={isLoading} className="bg-green-600 text-white font-bold px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center">
                {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                Submit Registration
            </button>
        </div>
    );
    
    return (
        <Modal title="Teacher Registration" onClose={onClose} footer={footer} size="5xl">
            <div>
                 <div>
                    <h3 className="font-semibold text-gray-200 mb-3 text-lg">Payment Instructions:</h3>
                    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 space-y-3">
                        <p className="text-gray-300">1. Open any UPI payment app (Google Pay, PhonePe, etc.).</p>
                        <p className="text-gray-300">2. Pay the one-time registration fee of <strong className="text-amber-300 text-lg">₹{registrationFee}</strong> to the following:</p>
                        <div className="pl-4 py-2 bg-gray-900/50 rounded-md">
                           <p className="text-gray-300">UPI Number: <strong className="text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded select-all">{siteData.paymentDetails.upiNumber}</strong></p>
                           <p className="text-gray-300 mt-2">UPI ID: <strong className="text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded select-all">{siteData.paymentDetails.upiId}</strong></p>
                        </div>
                        <p className="text-gray-300">3. After payment, copy the <strong>Transaction ID</strong> and take a <strong>screenshot</strong>.</p>
                        <p className="text-gray-300">4. Fill out the form below to complete your registration request.</p>
                    </div>
                </div>

                <form id="teacher-reg-form" onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" id="name" name="name" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                            <input type="email" id="email" name="email" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white" />
                        </div>
                         <div>
                            <label htmlFor="designation" className="block text-sm font-medium text-gray-300">Designation</label>
                            <input type="text" id="designation" name="designation" placeholder="e.g., Physics Faculty" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white" />
                        </div>
                        <div>
                            <label htmlFor="qualifications" className="block text-sm font-medium text-gray-300">Qualifications</label>
                            <input type="text" id="qualifications" name="qualifications" placeholder="e.g., Ph.D. in Physics" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white" />
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="experience" className="block text-sm font-medium text-gray-300">Experience</label>
                            <input type="text" id="experience" name="experience" placeholder="e.g., 10 Years" onChange={handleInputChange} required className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white" />
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                                 <input id="password" name="password" type={showPassword ? 'text' : 'password'} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white" />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                                 <input id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white" />
                            </div>
                        </div>
                         <div className="mt-2">
                            <label className="flex items-center text-sm text-gray-400">
                               <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="h-4 w-4 rounded border-gray-500 bg-gray-800 text-indigo-600 focus:ring-indigo-500 mr-2"/> Show Passwords
                            </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                         <div>
                            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-300">UPI Transaction ID</label>
                            <input type="text" id="transactionId" name="transactionId" onChange={handleInputChange} required placeholder="Enter the transaction ID" className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white placeholder:text-gray-500" />
                        </div>
                         <div>
                            <FileInput id="tutor-photo" label="Profile Photo" accept="image/*" onChange={setPhotoFile} buttonText="Choose Photo" />
                        </div>
                        <div className="md:col-span-2">
                            <FileInput id="payment-screenshot" label="Payment Screenshot" accept="image/*" onChange={setScreenshotFile} buttonText="Choose Screenshot" />
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-sm pt-2 text-center">{error}</p>}
                </form>
            </div>
        </Modal>
    );
};

export default TeacherRegistrationModal;