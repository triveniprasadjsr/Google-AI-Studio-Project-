import React from 'react';
import { Course, Lecture } from '../../types';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import { useFileUrl } from '../../hooks/useFileUrl';

const LectureRow: React.FC<{ lecture: Lecture }> = ({ lecture }) => {
    const videoBlobUrl = useFileUrl(lecture.videoKey);
    const pdfBlobUrl = useFileUrl(lecture.pdfKey);
    
    const videoLink = lecture.videoUrl || videoBlobUrl;

    return (
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors shadow-sm">
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg text-white">{lecture.title}</p>
                <p className="text-sm text-gray-400 mt-1">{lecture.description}</p>
            </div>
            <div className="flex items-center space-x-4 ml-4">
                {videoLink ? (
                    <a href={videoLink} target="_blank" rel="noopener noreferrer" title="Watch Video" className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"><Icon name="video" /><span>Video</span></a>
                ) : (
                    <span className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-600 text-gray-400 cursor-not-allowed" title="No Video Available"><Icon name="video-slash" /><span>No Video</span></span>
                )}
                {pdfBlobUrl ? (
                    <a href={pdfBlobUrl} download={lecture.pdfFileName || 'notes.pdf'} title="Download PDF" className="flex items-center space-x-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"><Icon name="file-pdf" /><span>PDF</span></a>
                ) : lecture.pdfKey ? (
                     <span className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-600 text-gray-400 cursor-not-allowed" title="Loading PDF..."><Icon name="spinner" className="fa-spin"/><span>PDF</span></span>
                ) : (
                    <span className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-600 text-gray-400 cursor-not-allowed" title="No PDF Available"><Icon name="file-pdf" /><span>No PDF</span></span>
                )}
            </div>
        </div>
    );
};

const ViewCourseModal: React.FC<{ course: Course, onClose: () => void }> = ({ course, onClose }) => {
    const footer = (
        <button onClick={onClose} className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500">
            Close
        </button>
    );

    return (
        <Modal title={`Course Content: ${course.name}`} onClose={onClose} footer={footer} size="5xl">
             <div className="space-y-4">
                {course.lectures.length > 0 ? course.lectures.map(lecture => (
                    <LectureRow key={lecture.id} lecture={lecture} />
                )) : (
                     <div className="text-center py-12 text-gray-500 bg-gray-800 rounded-lg border border-gray-700">
                        <Icon name="box-open" className="fa-3x mb-4 text-gray-600" />
                        <p className="text-lg">No lectures have been added to this course yet.</p>
                        <p>Please check back later.</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ViewCourseModal;