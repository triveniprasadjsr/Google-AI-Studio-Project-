import React, { useState, FormEvent, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { Course, Lecture } from '../../types';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import FileInput from '../common/FileInput';
import ConfirmModal from './ConfirmModal';
import { useFileUrl } from '../../hooks/useFileUrl';

interface LectureModalProps {
    course: Course;
    onClose: () => void;
}

const LectureForm: React.FC<{ course: Course, editingLecture: Lecture | null, onFinish: () => void }> = ({ course, editingLecture, onFinish }) => {
    const { addLecture, updateLecture } = useApp();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState(''); // For external links
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (editingLecture) {
            setTitle(editingLecture.title);
            setDescription(editingLecture.description);
            setVideoUrl(editingLecture.videoUrl || '');
        } else {
            setTitle('');
            setDescription('');
            setVideoUrl('');
        }
        setVideoFile(null);
        setPdfFile(null);
    }, [editingLecture]);
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title) {
            alert('Lecture title is required.');
            return;
        }
        setIsLoading(true);
        try {
            if (editingLecture) {
                await updateLecture(course.id, { ...editingLecture, title, description, videoUrl }, videoFile, pdfFile);
            } else {
                await addLecture(course.id, { title, description, videoUrl }, videoFile, pdfFile);
            }
            onFinish();
        } catch (error) {
            console.error("Failed to save lecture", error);
            alert("Error saving lecture.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">{editingLecture ? `Edit Lecture: ${editingLecture.title}` : 'Add New Lecture'}</h3>
            <form onSubmit={handleSubmit} id="lecture-form" className="p-6 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
                <div>
                    <label htmlFor="lecture-title" className="block text-sm font-medium text-gray-300 mb-1">Lecture Title</label>
                    <input type="text" id="lecture-title" value={title} onChange={e => setTitle(e.target.value)} required className="block w-full border-gray-600 bg-gray-700 text-white rounded-md shadow-sm p-2" />
                </div>
                <div>
                    <label htmlFor="lecture-desc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea id="lecture-desc" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="block w-full border-gray-600 bg-gray-700 text-white rounded-md shadow-sm p-2"></textarea>
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-700">
                    <p className="text-base font-medium text-gray-300">Video Content <span className="text-xs font-normal text-gray-500">(Provide external URL or upload file)</span></p>
                     <div>
                        <label htmlFor="lecture-video-url-input" className="block text-sm font-medium text-gray-400 mb-1">Video URL (e.g., YouTube, Vimeo)</label>
                        <input type="url" id="lecture-video-url-input" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Paste video link here" className="block w-full border-gray-600 bg-gray-700 text-white rounded-md shadow-sm p-2 placeholder-gray-500"/>
                    </div>
                    <div className="text-center text-gray-500 text-sm font-semibold">OR</div>
                    <FileInput id="lecture-video-file" label="Upload Video File" accept="video/*" onChange={setVideoFile} buttonText="Choose Video" />
                </div>
                <div className="space-y-4 pt-4 border-t border-slate-700">
                    <FileInput id="lecture-pdf-file" label="PDF Document" accept=".pdf" onChange={setPdfFile} buttonText="Choose PDF" />
                </div>
                <div className="text-right pt-2 flex justify-end space-x-3">
                    {editingLecture && <button type="button" onClick={onFinish} className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500">Cancel Edit</button>}
                    <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                        {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                        {editingLecture ? 'Save Changes' : 'Add Lecture'}
                    </button>
                </div>
            </form>
        </div>
    );
}

const LectureItem: React.FC<{ lecture: Lecture, onEdit: (l: Lecture) => void, onDelete: (l: Lecture) => void }> = ({ lecture, onEdit, onDelete }) => {
    const videoBlobUrl = useFileUrl(lecture.videoKey);
    const pdfBlobUrl = useFileUrl(lecture.pdfKey);
    const videoLink = lecture.videoUrl || videoBlobUrl;

    return (
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-700">
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{lecture.title}</p>
                <p className="text-sm text-gray-400 truncate">{lecture.description}</p>
            </div>
            <div className="flex items-center space-x-3 ml-4">
                {videoLink ? <a href={videoLink} target="_blank" rel="noopener noreferrer" title="Watch Video" className="text-blue-400 hover:text-blue-300"><Icon name="video" /></a> : <span className="text-gray-600" title="No Video"><Icon name="video-slash" /></span>}
                {pdfBlobUrl ? <a href={pdfBlobUrl} download={lecture.pdfFileName || 'notes.pdf'} title={`Download PDF: ${lecture.pdfFileName || ''}`} className="text-green-400 hover:text-green-300"><Icon name="file-pdf" /></a> : <span className="text-gray-600" title="No PDF"><Icon name="file-pdf" /></span>}
                <button onClick={() => onEdit(lecture)} className="text-blue-400 hover:text-blue-300" title="Edit"><Icon name="edit" /></button>
                <button onClick={() => onDelete(lecture)} className="text-red-400 hover:text-red-300" title="Delete"><Icon name="trash" /></button>
            </div>
        </div>
    );
};

const LectureModal: React.FC<LectureModalProps> = ({ course: initialCourse, onClose }) => {
    const { siteData, deleteLecture } = useApp();
    const course = siteData.courses.find(c => c.id === initialCourse.id)!; // Get the latest course data
    const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<Lecture | null>(null);

    const handleDelete = (lecture: Lecture) => {
        setConfirmDelete(lecture);
    };

    const confirmDeletion = () => {
        if (confirmDelete) {
            deleteLecture(course.id, confirmDelete.id);
            setConfirmDelete(null);
        }
    };
    
    return (
        <>
            <Modal title={`Manage Lectures: ${course.name}`} onClose={onClose} size="5xl">
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-200">Existing Lectures</h3>
                    <div className="space-y-3">
                        {course.lectures.length > 0 ? course.lectures.map(lecture => (
                            <LectureItem key={lecture.id} lecture={lecture} onEdit={setEditingLecture} onDelete={handleDelete} />
                        )) : (
                             <div className="text-center py-8 text-gray-500 bg-gray-900/50 rounded-md">No lectures found for this course.</div>
                        )}
                    </div>
                </div>
                <LectureForm course={course} editingLecture={editingLecture} onFinish={() => setEditingLecture(null)} />
            </Modal>
            {confirmDelete && (
                <ConfirmModal 
                    message={`Are you sure you want to delete the lecture "${confirmDelete.title}"? This will also delete any attached files.`}
                    onConfirm={confirmDeletion}
                    onClose={() => setConfirmDelete(null)}
                />
            )}
        </>
    );
};

export default LectureModal;