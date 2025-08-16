import React from 'react';
import Modal from '../common/Modal';
import { useFileUrl } from '../../hooks/useFileUrl';
import Icon from '../common/Icon';

interface ScreenshotModalProps {
    imageKey: string;
    title: string;
    onClose: () => void;
}

const ScreenshotModal: React.FC<ScreenshotModalProps> = ({ imageKey, title, onClose }) => {
    const imageUrl = useFileUrl(imageKey);

    return (
        <Modal title={title} onClose={onClose} size="5xl">
            <div className="flex justify-center items-center bg-black min-h-[75vh]">
                {imageUrl ? (
                    <img src={imageUrl} alt={title} className="max-w-full max-h-[75vh] object-contain" />
                ) : (
                    <div className="text-white text-center">
                        <Icon name="spinner" className="fa-spin fa-2x mb-4" />
                        <p>Loading Screenshot...</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ScreenshotModal;