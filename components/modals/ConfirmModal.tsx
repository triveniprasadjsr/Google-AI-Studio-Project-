import React from 'react';
import Icon from '../common/Icon';
import Modal from '../common/Modal';

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    message,
    onConfirm,
    onClose,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = true
}) => {
    
    const confirmButtonClasses = isDestructive
        ? "bg-red-600 hover:bg-red-700"
        : "bg-indigo-600 hover:bg-indigo-700";

    const iconName = isDestructive ? "exclamation-triangle" : "question-circle";
    const iconColor = isDestructive ? "text-red-500" : "text-indigo-400";
        
    const footer = (
        <div className="flex justify-center space-x-3">
            <button onClick={onClose} className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500">
                {cancelText}
            </button>
            <button onClick={onConfirm} className={`text-white px-4 py-2 rounded-md ${confirmButtonClasses}`}>
                {confirmText}
            </button>
        </div>
    );

    return (
        <Modal title="Please Confirm" onClose={onClose} footer={footer} size="sm">
             <div className="text-center p-4">
                <div className={`${iconColor} text-5xl mb-4`}>
                    <Icon name={iconName} />
                </div>
                <p className="text-lg text-gray-200">{message}</p>
            </div>
        </Modal>
    );
};

export default ConfirmModal;