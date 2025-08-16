import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Course } from '../../types';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import { useFileUrl } from '../../hooks/useFileUrl';

interface CourseModalProps {
    course: Course | null;
    onClose: () => void;
}

const CourseModal: React.FC<CourseModalProps> = ({ course, onClose }) => {
    const { addCourse, updateCourse } = useApp();
    const [formData, setFormData] = useState({
        name: course?.name || '',
        description: course?.description || '',
        instructor: course?.instructor || '',
        duration: course?.duration || '',
        validityPeriod: course?.validityPeriod || '',
        fee: course?.fee || 0,
        originalFee: course?.originalFee || '',
        registrationStartDate: course?.registrationStartDate?.split('T')[0] || '',
        registrationEndDate: course?.registrationEndDate?.split('T')[0] || '',
        classStartDate: course?.classStartDate?.split('T')[0] || '',
        validityEndDate: course?.validityEndDate?.split('T')[0] || '',
        language: course?.language || '',
        courseType: course?.courseType || '',
        hasDownloadableContent: course?.hasDownloadableContent || false,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
    const existingImageUrl = useFileUrl(course?.imageKey);
    const [isLoading, setIsLoading] = useState(false);

    const imagePreview = localImagePreview || existingImageUrl;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;
        if (target.type === 'checkbox') {
            const { id, checked } = target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [id]: checked }));
        } else {
            const { id, value } = target;
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const dataToSave = {
                ...formData,
                fee: Number(formData.fee),
                originalFee: formData.originalFee ? Number(formData.originalFee) : null,
            };

            if (course) {
                await updateCourse({ ...course, ...dataToSave }, imageFile);
            } else {
                await addCourse(dataToSave, imageFile);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save course:", error);
            alert("Failed to save course.");
        } finally {
            setIsLoading(false);
        }
    };

    const footer = (
        <>
            <button type="button" onClick={onClose} className="cancel-btn bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500 mr-2">Cancel</button>
            <button type="submit" form="course-form" disabled={isLoading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                Save Course
            </button>
        </>
    );

    return (
        <Modal title={course ? 'Edit Course' : 'Add Course'} onClose={onClose} footer={footer}>
            <form id="course-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Course Name</label>
                    <input type="text" id="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                    <textarea id="description" required value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                </div>
                <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-300">Teacher’s Name</label>
                    <input type="text" id="instructor" required value={formData.instructor} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-300">Duration (e.g., 20 Tests)</label>
                        <input type="text" id="duration" placeholder="e.g., 60 Classes" required value={formData.duration} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                    <div>
                         <label htmlFor="validityPeriod" className="block text-sm font-medium text-gray-300">Validity Period</label>
                        <input type="text" id="validityPeriod" placeholder="e.g., 1 Month" value={formData.validityPeriod} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-300">Language</label>
                        <input type="text" id="language" placeholder="e.g., English" value={formData.language} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                    <div>
                        <label htmlFor="courseType" className="block text-sm font-medium text-gray-300">Type (e.g., Live + Recorded)</label>
                        <input type="text" id="courseType" placeholder="e.g., Test Series" value={formData.courseType} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                </div>
                <div>
                    <div className="flex items-center mt-2">
                       <input type="checkbox" id="hasDownloadableContent" checked={formData.hasDownloadableContent} onChange={handleInputChange} className="h-5 w-5 rounded border-gray-500 bg-gray-800 text-indigo-600 focus:ring-indigo-500" />
                       <label htmlFor="hasDownloadableContent" className="ml-3 block text-sm font-medium text-gray-300">Downloadable Content</label>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fee" className="block text-sm font-medium text-gray-300">Registration Fee (Offer Price)</label>
                        <input type="number" id="fee" required value={formData.fee} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                    <div>
                        <label htmlFor="originalFee" className="block text-sm font-medium text-gray-300">Original Price <span className="text-gray-500">(Optional)</span></label>
                        <input type="number" id="originalFee" value={formData.originalFee} onChange={handleInputChange} placeholder="e.g., 299" className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                </div>
                 <div className="border-t border-gray-700 pt-4">
                     <p className="text-md font-semibold text-gray-300 mb-2">Dates</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="registrationStartDate" className="block text-sm font-medium text-gray-300">Registration Start Date</label>
                            <input type="date" id="registrationStartDate" value={formData.registrationStartDate} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                        </div>
                        <div>
                            <label htmlFor="registrationEndDate" className="block text-sm font-medium text-gray-300">Registration End Date</label>
                            <input type="date" id="registrationEndDate" value={formData.registrationEndDate} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                        </div>
                        <div>
                            <label htmlFor="classStartDate" className="block text-sm font-medium text-gray-300">Class Start Date</label>
                            <input type="date" id="classStartDate" value={formData.classStartDate} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                        </div>
                        <div>
                            <label htmlFor="validityEndDate" className="block text-sm font-medium text-gray-300">Validity End Date</label>
                            <input type="date" id="validityEndDate" value={formData.validityEndDate} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="course-image" className="block text-sm font-medium text-gray-300">Course Image</label>
                    <input type="file" id="course-image" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-300 hover:file:bg-indigo-500/20" />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 rounded-md max-h-40 border border-gray-700" />}
                </div>
            </form>
        </Modal>
    );
};

export default CourseModal;