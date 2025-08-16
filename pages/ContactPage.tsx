import React, { useState, FormEvent } from 'react';
import { useApp } from '../hooks/useApp';
import Icon from '../components/common/Icon';

const ContactPage: React.FC = () => {
    const { addContactMessage } = useApp();
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const message = formData.get('message') as string;

        if (!name || !email || !message) {
            setStatus({ message: 'Please fill out all required fields.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setStatus({ message: '', type: '' });
        
        setTimeout(() => {
            try {
                addContactMessage({ name, email, message });
                setStatus({ message: 'Thank you! Your message has been sent.', type: 'success' });
                (e.target as HTMLFormElement).reset();
            } catch (error) {
                setStatus({ message: 'Something went wrong. Please try again.', type: 'error' });
            } finally {
                setIsLoading(false);
                setTimeout(() => setStatus({ message: '', type: '' }), 5000);
            }
        }, 1000);
    };

    return (
        <div className="p-4 md:p-8 bg-gray-900">
            <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left side: Contact Info */}
                    <div className="p-8 md:p-12 bg-indigo-700 text-white">
                        <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Get in Touch</h2>
                        <p className="text-indigo-200 mb-10">
                            We're here to help you on your path to success. Reach out to us with any questions. We typically respond within 24 hours.
                        </p>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <Icon name="map-marker-alt" className="text-2xl text-indigo-300 w-8 pt-1" />
                                <div>
                                    <h3 className="font-bold">Address</h3>
                                    <p className="text-indigo-200">Jamshedpur, Jharkhand</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Icon name="phone-alt" className="text-2xl text-indigo-300 w-8 pt-1" />
                                <div>
                                    <h3 className="font-bold">Phone</h3>
                                    <p className="text-indigo-200">9470392954</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Icon name="envelope" className="text-2xl text-indigo-300 w-8 pt-1" />
                                <div>
                                    <h3 className="font-bold">Email</h3>
                                    <p className="text-indigo-200">triveniprasadjsr@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 pt-8 border-t border-indigo-500/50">
                            <h3 className="font-bold mb-4">Follow Us</h3>
                            <div className="flex space-x-6">
                                <a href="#" aria-label="Facebook" className="text-indigo-200 hover:text-white transition-colors"><Icon name="facebook-f" fab /></a>
                                <a href="#" aria-label="Twitter" className="text-indigo-200 hover:text-white transition-colors"><Icon name="twitter" fab /></a>
                                <a href="#" aria-label="LinkedIn" className="text-indigo-200 hover:text-white transition-colors"><Icon name="linkedin-in" fab /></a>
                                <a href="#" aria-label="Instagram" className="text-indigo-200 hover:text-white transition-colors"><Icon name="instagram" fab /></a>
                            </div>
                        </div>
                    </div>

                    {/* Right side: Form */}
                    <div className="p-8 md:p-12 bg-gray-800">
                        <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                        <form id="contact-form" noValidate onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div className="relative group">
                                    <label htmlFor="contact-name" className="sr-only">Name</label>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors"><Icon name="user" /></span>
                                    <input type="text" id="contact-name" name="name" placeholder="Full Name" className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white placeholder-gray-400 border-2 border-transparent rounded-md focus:bg-gray-600 focus:border-indigo-500 focus:outline-none transition" required />
                                </div>
                                <div className="relative group">
                                    <label htmlFor="contact-email" className="sr-only">Email</label>
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors"><Icon name="at" /></span>
                                    <input type="email" id="contact-email" name="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white placeholder-gray-400 border-2 border-transparent rounded-md focus:bg-gray-600 focus:border-indigo-500 focus:outline-none transition" required />
                                </div>
                                <div className="relative group">
                                    <label htmlFor="contact-message" className="sr-only">Message</label>
                                    <span className="absolute top-4 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors"><Icon name="pencil-alt" /></span>
                                    <textarea id="contact-message" name="message" rows={5} placeholder="Your Message" className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white placeholder-gray-400 border-2 border-transparent rounded-md focus:bg-gray-600 focus:border-indigo-500 focus:outline-none transition" required></textarea>
                                </div>
                            </div>
                            <div className="mt-8">
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Icon name="spinner" className="fa-spin mr-2" /> Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </div>
                            <p className={`mt-4 text-center font-medium h-5 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {status.message}
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;