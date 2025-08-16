import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { Course } from '../types';
import Icon from '../components/common/Icon';
import CourseModal from '../components/modals/CourseModal';
import LectureModal from '../components/modals/LectureModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import { useFileUrl } from '../hooks/useFileUrl';

const TeacherCourseRow: React.FC<{ course: Course, onEdit: (course: Course) => void, onDelete: (courseId: number) => void, onManageLectures: (course: Course) => void }> = ({ course, onEdit, onDelete, onManageLectures }) => {
    const imageUrl = useFileUrl(course.imageKey);
    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="py-3 px-4">
                <div className="flex items-center">
                    <img src={imageUrl || 'https://placehold.co/100x100/1e293b/94a3b8?text=?'} alt={course.name} className="w-10 h-10 rounded-md object-cover mr-4"/>
                    <div className="font-semibold">{course.name}</div>
                </div>
            </td>
            <td className="py-3 px-4 text-center">{course.lectures.length}</td>
            <td className="py-3 px-4 text-center">₹{course.fee}</td>
            <td className="py-3 px-4">
                <div className="flex justify-center items-center space-x-2">
                    <button 
                        onClick={() => onManageLectures(course)} 
                        className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs hover:bg-green-700 transition-colors flex items-center font-semibold" 
                        title="Manage Lectures"
                    >
                        <Icon name="list-alt" className="mr-1.5" /> Lectures
                    </button>
                    <button 
                        onClick={() => onEdit(course)} 
                        className="text-blue-400 hover:text-blue-300 p-2 rounded-md hover:bg-gray-700/50" 
                        title="Edit Course"
                    >
                        <Icon name="edit" />
                    </button>
                    <button 
                        onClick={() => onDelete(course.id)} 
                        className="text-red-400 hover:text-red-300 p-2 rounded-md hover:bg-gray-700/50" 
                        title="Delete Course"
                    >
                        <Icon name="trash" />
                    </button>
                </div>
            </td>
        </tr>
    );
};


const TeacherDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { siteData, currentUser, deleteCourse, logout } = useApp();
    
    const [modalState, setModalState] = useState<{
        type: 'course' | 'lecture' | 'confirm' | null;
        data?: any;
        onConfirm?: () => void;
    }>({ type: null });

    const openModal = (type: typeof modalState.type, data?: any, onConfirm?: () => void) => {
        setModalState({ type, data, onConfirm });
    };
    const closeModal = () => setModalState({ type: null });

    const myCourses = siteData.courses.filter(c => c.teacherEmail === currentUser?.email);

    const handleDeleteCourse = (id: number) => {
        openModal('confirm',
            `Are you sure you want to delete this course? This will also delete all associated lectures and files, and cannot be undone.`,
            () => {
                deleteCourse(id);
                closeModal();
            }
        );
    };

    const handleSignOut = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <div id="teacher-dashboard" className="flex flex-col h-screen bg-slate-900 text-white">
                {/* Header */}
                <header className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700 shadow-lg">
                    <h1 className="text-xl font-bold text-white">Teacher Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/')} className="flex items-center p-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-indigo-600 hover:text-white">
                            <Icon name="arrow-left" className="mr-2" /> Back to Site
                        </button>
                        <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">Sign Out</button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                            <h2 className="text-2xl font-bold text-gray-200">My Courses</h2>
                            <button onClick={() => openModal('course')} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                                <Icon name="plus" className="mr-2" /> Add New Course
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-700 text-gray-300">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Course Name</th>
                                        <th className="py-3 px-4 text-center">Lectures</th>
                                        <th className="py-3 px-4 text-center">Fee</th>
                                        <th className="py-3 px-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    {myCourses.length === 0 && <tr><td colSpan={4} className="text-center text-gray-500 py-6">You have not created any courses yet.</td></tr>}
                                    {myCourses.map(course => (
                                        <TeacherCourseRow 
                                            key={course.id} 
                                            course={course} 
                                            onEdit={(c) => openModal('course', c)} 
                                            onDelete={handleDeleteCourse} 
                                            onManageLectures={(c) => openModal('lecture', c)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            {modalState.type === 'confirm' && (
                <ConfirmModal
                    message={modalState.data}
                    onConfirm={modalState.onConfirm!}
                    onClose={closeModal}
                />
            )}
            {modalState.type === 'course' && (
                <CourseModal course={modalState.data} onClose={closeModal} />
            )}
            {modalState.type === 'lecture' && (
                <LectureModal course={modalState.data} onClose={closeModal} />
            )}
        </>
    );
};

export default TeacherDashboard;