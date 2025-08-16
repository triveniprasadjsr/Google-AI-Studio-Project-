import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useApp } from '../../hooks/useApp';
import { Tutor } from '../../types';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import { useFileUrl } from '../../hooks/useFileUrl';

interface TutorModalProps {
    tutor: Tutor | null;
    onClose: () => void;
}

const TutorModal: React.FC<TutorModalProps> = ({ tutor, onClose }) => {
    const { addTutor, updateTutor } = useApp();
    const [formData, setFormData] = useState({
        name: tutor?.name || '',
        designation: tutor?.designation || '',
        qualifications: tutor?.qualifications || '',
        experience: tutor?.experience || '',
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);
    const existingPhotoUrl = useFileUrl(tutor?.photoKey);
    const [isLoading, setIsLoading] = useState(false);
    
    const photoPreview = localPhotoPreview || existingPhotoUrl;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (tutor) {
                await updateTutor({ ...tutor, ...formData }, photoFile);
            } else {
                await addTutor(formData, photoFile);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save tutor:", error);
            alert("Failed to save tutor.");
        } finally {
            setIsLoading(false);
        }
    };

    const footer = (
        <>
            <button type="button" onClick={onClose} className="cancel-btn bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500 mr-2">Cancel</button>
            <button type="submit" form="tutor-form" disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                Save Tutor
            </button>
        </>
    );

    return (
        <Modal title={tutor ? 'Edit Tutor' : 'Add Tutor'} onClose={onClose} footer={footer}>
            <form id="tutor-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Tutor Name</label>
                    <input type="text" id="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md p-2" />
                </div>
                 <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-gray-300">Designation</label>
                    <input type="text" id="designation" required value={formData.designation} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md p-2" />
                </div>
                 <div>
                    <label htmlFor="qualifications" className="block text-sm font-medium text-gray-300">Qualifications</label>
                    <input type="text" id="qualifications" required value={formData.qualifications} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-300">Experience</label>
                    <input type="text" id="experience" required value={formData.experience} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="tutor-photo" className="block text-sm font-medium text-gray-300">Photo</label>
                    <input type="file" id="tutor-photo" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-500/10 file:text-indigo-300 hover:file:bg-indigo-500/20" />
                    {photoPreview && <img src={photoPreview} alt="Preview" className="mt-4 rounded-md max-h-40 border border-gray-700" />}
                </div>
            </form>
        </Modal>
    );
};

export default TutorModal;