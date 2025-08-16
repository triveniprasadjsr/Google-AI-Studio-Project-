import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useApp } from '../../hooks/useApp';
import { Syllabus } from '../../types';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import FileInput from '../common/FileInput';
import { useFileUrl } from '../../hooks/useFileUrl';

interface SyllabusModalProps {
    syllabus: Syllabus | null;
    onClose: () => void;
}

const SyllabusModal: React.FC<SyllabusModalProps> = ({ syllabus, onClose }) => {
    const { addSyllabus, updateSyllabus } = useApp();
    const [formData, setFormData] = useState({
        title: syllabus?.title || '',
        description: syllabus?.description || '',
        externalUrl: syllabus?.externalUrl || '',
    });
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
    const existingImageUrl = useFileUrl(syllabus?.imageKey);
    const [isLoading, setIsLoading] = useState(false);

    const imagePreview = localImagePreview || existingImageUrl;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };
    
    const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setLocalImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dataToSave = {
                ...formData,
                pdfFileName: pdfFile ? pdfFile.name : syllabus?.pdfFileName || null,
            };

            if (syllabus) {
                await updateSyllabus({ ...syllabus, ...dataToSave }, pdfFile, imageFile);
            } else {
                await addSyllabus(dataToSave, pdfFile, imageFile);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save syllabus:", error);
            alert("Failed to save syllabus.");
        } finally {
            setIsLoading(false);
        }
    };

    const footer = (
        <>
            <button type="button" onClick={onClose} className="cancel-btn bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500 mr-2">Cancel</button>
            <button type="submit" form="syllabus-form" disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                Save Syllabus
            </button>
        </>
    );

    return (
        <Modal title={syllabus ? 'Edit Syllabus' : 'Add Syllabus'} onClose={onClose} footer={footer}>
            <form id="syllabus-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">Syllabus Title</label>
                    <input type="text" id="title" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea id="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                </div>
                <div>
                    <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-300">External URL (Optional)</label>
                    <input type="url" id="externalUrl" placeholder="https://example.com/syllabus.html" value={formData.externalUrl} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                </div>
                
                <div className="pt-4 border-t border-gray-600">
                    <p className="text-sm text-gray-400">Provide either an external URL (above) or upload a PDF file (below).</p>
                    <FileInput id="syllabus-pdf-file" label="Upload PDF" accept=".pdf" onChange={setPdfFile} buttonText={syllabus?.pdfKey ? "Change PDF" : "Choose PDF"} />
                </div>

                <div className="pt-4 border-t border-gray-600">
                    <label htmlFor="syllabus-image" className="block text-sm font-medium text-gray-300">Thumbnail Image</label>
                    <input type="file" id="syllabus-image" accept="image/*" onChange={handleImageFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-300 hover:file:bg-indigo-500/20" />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 rounded-md max-h-40 border border-gray-700" />}
                </div>
            </form>
        </Modal>
    );
};

export default SyllabusModal;