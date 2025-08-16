import React, { useEffect } from 'react';
import Icon from './Icon';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '5xl';
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '5xl': 'max-w-5xl'
};

const Modal: React.FC<ModalProps> = ({ title, onClose, children, footer, size = 'xl' }) => {
    
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`bg-gray-800 rounded-lg shadow-2xl w-full ${sizeClasses[size]} max-h-[95vh] flex flex-col m-4`}
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none" aria-label="Close modal">
                        &times;
                    </button>
                </header>
                <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
                    {children}
                </div>
                {footer && (
                    <footer className="p-4 border-t border-gray-700 bg-gray-800 text-right flex-shrink-0">
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    );
};

export default Modal;