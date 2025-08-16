import React from 'react';
import { Course } from '../../types';
import Modal from '../common/Modal';

interface CourseDetailsConfirmModalProps {
    course: Course;
    onConfirm: () => void;
    onClose: () => void;
}

const DetailRow: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-700/50 last:border-b-0">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-white font-semibold text-right">{value || 'N/A'}</span>
    </div>
);

const CourseDetailsConfirmModal: React.FC<CourseDetailsConfirmModalProps> = ({ course, onConfirm, onClose }) => {
    
    const footer = (
        <div className="flex justify-center items-center space-x-4">
            <button onClick={onClose} className="px-8 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition-colors flex items-center font-semibold">
                <span className="mr-2" role="img" aria-label="cross mark">❌</span> Cancel
            </button>
            <button onClick={onConfirm} className="px-8 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center font-bold">
                 <span className="mr-2" role="img" aria-label="check mark">✅</span> Yes, Confirm
            </button>
        </div>
    );

    const numVideos = course.lectures.filter(l => l.videoKey || l.videoUrl).length;
    const numNotes = course.lectures.filter(l => l.pdfKey).length;
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            // Browsers might interpret YYYY-MM-DD as UTC, so ensure it's treated as local time.
            const date = new Date(dateString + 'T00:00:00');
            return date.toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };
    
    return (
        <Modal title="📢 Course Details — Please Review" onClose={onClose} footer={footer} size="lg">
             <div className="p-4 border border-gray-700 rounded-lg bg-gray-900/50 space-y-1">
                <DetailRow label="Course Title" value={course.name} />
                <DetailRow label="Registration Start Date" value={formatDate(course.registrationStartDate)} />
                <DetailRow label="Registration End Date" value={formatDate(course.registrationEndDate)} />
                <DetailRow label="Class Start Date" value={formatDate(course.classStartDate)} />
                <DetailRow label="Validity End Date" value={formatDate(course.validityEndDate)} />
                <DetailRow label="Duration" value={course.duration} />
                <DetailRow label="Language" value={course.language} />
                <DetailRow label="Course Type" value={course.courseType} />
                <DetailRow label="Downloadable Content" value={course.hasDownloadableContent ? 'Yes' : 'No'} />
                <DetailRow label="Number of Videos" value={numVideos} />
                <DetailRow label="Number of Notes" value={numNotes} />
                <DetailRow label="Teacher Name" value={course.instructor} />
                <DetailRow 
                    label="Registration Fee" 
                    value={
                        <span className="text-white font-semibold">
                            ₹{course.fee}
                            {course.originalFee && course.originalFee > course.fee && (
                                <span className="ml-2 text-sm text-red-400 font-normal">(Offer Price, <span className="line-through">₹{course.originalFee}</span>)</span>
                            )}
                        </span>
                    }
                />
            </div>
            <div className="text-center p-4 mt-6 bg-indigo-900/40 border border-indigo-700 rounded-lg">
                <p className="text-indigo-200 font-semibold">💡 Please confirm that you have read the course details before enrolling.</p>
            </div>
        </Modal>
    );
};

export default CourseDetailsConfirmModal;