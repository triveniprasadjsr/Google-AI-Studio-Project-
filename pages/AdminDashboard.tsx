import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { Course, Tutor, TeacherVerificationRequest } from '../types';
import Icon from '../components/common/Icon';
import ConfirmModal from '../components/modals/ConfirmModal';
import CourseModal from '../components/modals/CourseModal';
import TutorModal from '../components/modals/TutorModal';
import LectureModal from '../components/modals/LectureModal';
import ScreenshotModal from '../components/modals/ScreenshotModal';
import DownloadsManagement from '../components/admin/DownloadsManagement';
import { useFileUrl } from '../hooks/useFileUrl';
import SyllabusManagement from '../components/admin/SyllabusManagement';
import SyllabusModal from '../components/modals/SyllabusModal';
import SidebarManagement from '../components/admin/SidebarManagement';

type AdminView = 'homepage' | 'sidebar' | 'tutors' | 'courses' | 'syllabus' | 'downloads' | 'payments' | 'teacherVerifications' | 'messages';

// --- Reusable Nav Item for Admin Sidebar ---
const AdminNavItem: React.FC<{
    icon: string;
    label: string;
    view: AdminView;
    activeView: AdminView;
    setActiveView: (view: AdminView) => void;
    badgeCount?: number;
}> = ({ icon, label, view, activeView, setActiveView, badgeCount }) => (
    <button
        onClick={() => setActiveView(view)}
        className={`w-full flex items-center p-3 rounded-lg text-left transition-colors text-sm font-medium ${activeView === view ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700/50'}`}
    >
        <Icon name={icon} className="w-6 mr-3 text-lg" />
        <span className="flex-1">{label}</span>
        {badgeCount !== undefined && badgeCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{badgeCount}</span>}
    </button>
);


// --- Sub-components for Admin Sections (now as standalone views) ---

const HomepageManagement: React.FC = () => {
    const { siteData, updateSiteData } = useApp();
    const [formData, setFormData] = useState({
        classroomName: siteData.classroomName,
        homeTitle: siteData.home.title,
        homeSubtitle: siteData.home.subtitle,
        upiNumber: siteData.paymentDetails.upiNumber,
        upiId: siteData.paymentDetails.upiId
    });
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = () => {
        updateSiteData({
            classroomName: formData.classroomName,
            home: { ...siteData.home, title: formData.homeTitle, subtitle: formData.homeSubtitle },
            paymentDetails: { upiId: formData.upiId, upiNumber: formData.upiNumber }
        });
        alert('Homepage changes saved!');
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-4">Homepage & General Settings</h2>
            <div className="space-y-6">
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="classroomName" className="block text-sm font-medium text-gray-300">Classroom Name</label>
                        <input type="text" id="classroomName" value={formData.classroomName} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                    <div>
                        <label htmlFor="homeTitle" className="block text-sm font-medium text-gray-300">Homepage Title</label>
                        <input type="text" id="homeTitle" value={formData.homeTitle} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                    <div>
                        <label htmlFor="homeSubtitle" className="block text-sm font-medium text-gray-300">Homepage Subtitle</label>
                        <input type="text" id="homeSubtitle" value={formData.homeSubtitle} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                    <div>
                        <label htmlFor="upiNumber" className="block text-sm font-medium text-gray-300">Payment UPI Number</label>
                        <input type="text" id="upiNumber" value={formData.upiNumber} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                     <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-300">Payment UPI ID</label>
                        <input type="text" id="upiId" value={formData.upiId} onChange={handleInputChange} className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-700 text-white" />
                    </div>
                </div>
                <div className="text-right border-t border-gray-700 pt-4">
                    <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const TutorRow: React.FC<{ tutor: Tutor, onEdit: (tutor: Tutor) => void, onDelete: (tutorId: number) => void }> = ({ tutor, onEdit, onDelete }) => {
    const photoUrl = useFileUrl(tutor.photoKey);
    return (
        <div className="p-3 border border-gray-700 rounded-lg bg-gray-700/50 flex items-center justify-between">
            <div className="flex items-center">
                <img src={photoUrl || `https://i.pravatar.cc/100?u=${tutor.id}`} className="w-12 h-12 rounded-full object-cover mr-4" alt={tutor.name}/>
                <div>
                    <p className="font-semibold text-white">{tutor.name}</p>
                    <p className="text-sm text-gray-400">{tutor.designation}</p>
                </div>
            </div>
            <div>
                <button onClick={() => onEdit(tutor)} className="text-blue-400 hover:text-blue-300 mr-2"><Icon name="edit" /></button>
                <button onClick={() => onDelete(tutor.id)} className="text-red-400 hover:text-red-300"><Icon name="trash" /></button>
            </div>
        </div>
    )
}

const TutorManagement: React.FC<{ onAdd: () => void; onEdit: (tutor: Tutor) => void; onDelete: (tutorId: number) => void; }> = ({ onAdd, onEdit, onDelete }) => {
    const { siteData } = useApp();
    return (
         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                 <h2 className="text-2xl font-bold text-gray-200">Tutor Management</h2>
                <button onClick={onAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                    <Icon name="plus" className="mr-2" /> Add New Tutor
                </button>
            </div>
            <div id="admin-tutors-list" className="space-y-4">
                {siteData.tutors.length === 0 && <p className="text-center text-gray-500 py-4">No tutors have been added yet.</p>}
                {siteData.tutors.map(tutor => (
                   <TutorRow key={tutor.id} tutor={tutor} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </div>
        </div>
    );
};

const CourseRow: React.FC<{ course: Course, onEdit: (course: Course) => void, onDelete: (courseId: number) => void, onManageLectures: (course: Course) => void }> = ({ course, onEdit, onDelete, onManageLectures }) => {
    const imageUrl = useFileUrl(course.imageKey);
    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/50">
            <td className="py-3 px-4">
                <div className="flex items-center">
                    <img src={imageUrl || 'https://placehold.co/100x100/1e293b/94a3b8?text=?'} alt={course.name} className="w-10 h-10 rounded-md object-cover mr-4"/>
                    <div className="font-semibold">{course.name}</div>
                </div>
            </td>
            <td className="py-3 px-4">{course.instructor}</td>
            <td className="py-3 px-4 text-center">{course.lectures.length}</td>
            <td className="py-3 px-4 text-center">
                <button onClick={() => onManageLectures(course)} className="bg-green-500 text-white px-3 py-1 rounded-md text-xs hover:bg-green-600" title="Manage Lectures"><Icon name="list-alt" /></button>
                <button onClick={() => onEdit(course)} className="text-blue-400 hover:text-blue-300 mx-2" title="Edit Course"><Icon name="edit" /></button>
                <button onClick={() => onDelete(course.id)} className="text-red-400 hover:text-red-300" title="Delete Course"><Icon name="trash" /></button>
            </td>
        </tr>
    );
};

const CourseManagement: React.FC<{ onAdd: () => void; onEdit: (course: Course) => void; onDelete: (courseId: number) => void; onManageLectures: (course: Course) => void; }> = ({ onAdd, onEdit, onDelete, onManageLectures }) => {
    const { siteData } = useApp();
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                 <h2 className="text-2xl font-bold text-gray-200">Course Management</h2>
                <button onClick={onAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                    <Icon name="plus" className="mr-2" /> Add New Course
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-700 text-gray-300">
                        <tr>
                            <th className="py-3 px-4 text-left">Course Name</th>
                            <th className="py-3 px-4 text-left">Instructor</th>
                            <th className="py-3 px-4 text-center">Lectures</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {siteData.courses.length === 0 && <tr><td colSpan={4} className="text-center text-gray-500 py-6">No courses have been added yet.</td></tr>}
                        {siteData.courses.map(course => (
                            <CourseRow key={course.id} course={course} onEdit={onEdit} onDelete={onDelete} onManageLectures={onManageLectures} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PaymentVerification: React.FC<{ onViewScreenshot: (key: string, title: string) => void; }> = ({ onViewScreenshot }) => {
    const { siteData, approveVerification, rejectVerification } = useApp();
    const verifications = siteData.pendingVerifications || [];

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-4">Student Payment Verification</h2>
            <div className="space-y-4">
                {verifications.length === 0 ? (
                     <div className="text-center py-8 text-gray-500 bg-gray-900/50 rounded-md">No pending payments to verify.</div>
                ) : (
                    verifications.map(v => (
                         <div key={v.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div>
                                    <p className="font-bold text-white">{v.userName}</p>
                                    <p className="text-sm text-gray-400">{v.userEmail}</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-indigo-400">{v.courseName}</p>
                                    <p className="text-sm text-gray-400 font-mono" title="Transaction ID">TID: {v.transactionId}</p>
                                </div>
                                <div className="flex items-center justify-start md:justify-end space-x-2">
                                    <button onClick={() => onViewScreenshot(v.screenshotKey, `Payment for ${v.userName}`)} className="text-sm bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-500"><Icon name="image" className="mr-1" /> Screenshot</button>
                                    <button onClick={() => rejectVerification(v.id)} className="text-sm bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"><Icon name="times" className="mr-1" /> Reject</button>
                                    <button onClick={() => approveVerification(v.id)} className="text-sm bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"><Icon name="check" className="mr-1" /> Approve</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
};

const TeacherVerificationManagement: React.FC<{ 
    onViewScreenshot: (key: string, title: string) => void; 
    onReject: (id: number) => void;
}> = ({ onViewScreenshot, onReject }) => {
    const { siteData, approveTeacherVerification } = useApp();
    const verifications = siteData.teacherVerificationRequests || [];

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-4">Teacher Registration Verification</h2>
            <div className="space-y-4">
                {verifications.length === 0 ? (
                     <div className="text-center py-8 text-gray-500 bg-gray-900/50 rounded-md">No pending teacher registrations to verify.</div>
                ) : (
                    verifications.map(v => (
                         <div key={v.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                {/* Col 1: Applicant */}
                                <div className="md:col-span-1">
                                    <p className="font-bold text-white text-lg">{v.userName}</p>
                                    <p className="text-sm text-gray-400 truncate">{v.userEmail}</p>
                                </div>
                                
                                {/* Col 2: Tutor Profile */}
                                <div className="text-sm md:col-span-1">
                                    <p><strong className="text-gray-400 font-medium">Designation:</strong> {v.designation}</p>
                                    <p className="truncate"><strong className="text-gray-400 font-medium">Qualifications:</strong> {v.qualifications}</p>
                                    <p><strong className="text-gray-400 font-medium">Experience:</strong> {v.experience}</p>
                                    <button onClick={() => onViewScreenshot(v.photoKey, `Profile Photo for ${v.userName}`)} className="text-xs mt-2 bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700"><Icon name="id-badge" className="mr-1" /> View Photo</button>
                                </div>

                                {/* Col 3: Payment */}
                                <div className="text-sm md:col-span-1">
                                     <p className="font-semibold text-amber-400">Reg. Fee: ₹1000</p>
                                    <p className="text-gray-400 font-mono truncate" title="Transaction ID">TID: {v.transactionId}</p>
                                    <button onClick={() => onViewScreenshot(v.screenshotKey, `Payment Screenshot for ${v.userName}`)} className="text-xs mt-2 bg-gray-600 text-white px-2 py-1 rounded-md hover:bg-gray-500"><Icon name="image" className="mr-1" /> Screenshot</button>
                                </div>

                                {/* Col 4: Actions */}
                                <div className="flex items-center justify-start md:justify-end space-x-2 md:col-span-1">
                                    <button onClick={() => onReject(v.id)} className="text-sm bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"><Icon name="times" className="mr-1" /> Reject</button>
                                    <button onClick={() => approveTeacherVerification(v.id)} className="text-sm bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"><Icon name="check" className="mr-1" /> Approve</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
};

const ContactMessages: React.FC<{ onDelete: (messageId: number) => void }> = ({ onDelete }) => {
    const { siteData, updateContactMessageStatus } = useApp();
    const messages = siteData.contactMessages || [];

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-4">Contact Messages</h2>
            <div className="space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-900/50 rounded-md">No contact messages received.</div>
                ) : (
                    messages.map(message => (
                        <div key={message.id} className={`p-4 rounded-lg border ${message.status === 'unread' ? 'bg-indigo-900/50 border-indigo-800' : 'bg-gray-800/50 border-gray-700'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-semibold text-white">{message.name}
                                        <span className="font-normal text-gray-400"> &lt;{message.email}&gt;</span>
                                        {message.status === 'unread' && <span className="ml-2 text-xs text-white bg-red-500 font-bold px-2 py-0.5 rounded-full">NEW</span>}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Received: {new Date(message.receivedAt).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                    {message.status === 'unread' && (
                                        <button onClick={() => updateContactMessageStatus(message.id, 'read')} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"><Icon name="check-double" className="mr-1" /> Mark as Read</button>
                                    )}
                                    <button onClick={() => onDelete(message.id)} className="text-gray-500 hover:text-red-500" title="Delete Message"><Icon name="trash-alt" /></button>
                                </div>
                            </div>
                            <pre className="bg-gray-900 p-3 rounded-md border border-gray-700 text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">{message.message}</pre>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}


// --- Main Admin Dashboard Component ---
const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { siteData, deleteCourse, deleteTutor, deleteContactMessage, rejectTeacherVerification } = useApp();
    const [activeView, setActiveView] = useState<AdminView>('homepage');
    const [modalState, setModalState] = useState<{
        type: 'course' | 'tutor' | 'lecture' | 'confirm' | 'screenshot' | 'syllabus' | null;
        data?: any;
        onConfirm?: () => void;
    }>({ type: null });

    const openModal = (type: typeof modalState.type, data?: any, onConfirm?: () => void) => {
        setModalState({ type, data, onConfirm });
    };
    const closeModal = () => setModalState({ type: null });

    const handleDelete = (type: 'course' | 'tutor' | 'message', id: number) => {
        openModal('confirm',
            `Are you sure you want to delete this ${type}? This will also delete all associated files and cannot be undone.`,
            () => {
                if(type === 'course') deleteCourse(id);
                if(type === 'tutor') deleteTutor(id);
                if(type === 'message') deleteContactMessage(id);
                closeModal();
            }
        );
    };
    
    const handleRejectTeacher = (id: number) => {
         openModal('confirm',
            `Are you sure you want to reject this teacher? This will delete their pending account and cannot be undone.`,
            () => {
                rejectTeacherVerification(id);
                closeModal();
            }
        );
    };

    const renderView = () => {
        switch (activeView) {
            case 'homepage':
                return <HomepageManagement />;
            case 'sidebar':
                return <SidebarManagement />;
            case 'tutors':
                return <TutorManagement
                    onAdd={() => openModal('tutor')}
                    onEdit={(tutor) => openModal('tutor', tutor)}
                    onDelete={(tutorId) => handleDelete('tutor', tutorId)}
                />;
            case 'courses':
                return <CourseManagement
                    onAdd={() => openModal('course')}
                    onEdit={(course) => openModal('course', course)}
                    onDelete={(courseId) => handleDelete('course', courseId)}
                    onManageLectures={(course) => openModal('lecture', course)}
                />;
            case 'syllabus':
                 return <SyllabusManagement 
                        onAdd={() => openModal('syllabus')}
                        onEdit={(syllabus) => openModal('syllabus', syllabus)}
                    />;
            case 'downloads':
                return <DownloadsManagement />;
            case 'payments':
                return <PaymentVerification onViewScreenshot={(key, title) => openModal('screenshot', { key, title })} />;
            case 'teacherVerifications':
                return <TeacherVerificationManagement 
                            onViewScreenshot={(key, title) => openModal('screenshot', { key, title })} 
                            onReject={handleRejectTeacher}
                       />;
            case 'messages':
                return <ContactMessages onDelete={(messageId) => handleDelete('message', messageId)} />;
            default:
                return <HomepageManagement />;
        }
    };

    return (
        <>
            <div id="admin-dashboard" className="flex h-screen bg-slate-900 text-white">
                {/* Admin Sidebar Navigation */}
                <nav className="w-64 bg-gray-800 p-4 flex flex-col space-y-2 border-r border-gray-700 shadow-lg">
                     <h1 className="text-xl font-bold text-center p-4 text-white">Admin Panel</h1>
                     <div className="flex-1 space-y-2">
                        <AdminNavItem icon="cog" label="General Settings" view="homepage" activeView={activeView} setActiveView={setActiveView} />
                        <AdminNavItem icon="list-ol" label="Sidebar Menu" view="sidebar" activeView={activeView} setActiveView={setActiveView} />
                        <AdminNavItem icon="chalkboard-teacher" label="Tutors" view="tutors" activeView={activeView} setActiveView={setActiveView} />
                        <AdminNavItem icon="book" label="Courses" view="courses" activeView={activeView} setActiveView={setActiveView} />
                        <AdminNavItem icon="file-alt" label="Syllabus" view="syllabus" activeView={activeView} setActiveView={setActiveView} />
                        <AdminNavItem icon="download" label="E-Books & Notes" view="downloads" activeView={activeView} setActiveView={setActiveView} />
                        <AdminNavItem 
                            icon="credit-card" 
                            label="Student Payments" 
                            view="payments" 
                            activeView={activeView} 
                            setActiveView={setActiveView} 
                            badgeCount={(siteData.pendingVerifications || []).length}
                        />
                         <AdminNavItem 
                            icon="user-shield" 
                            label="Teacher Verifications" 
                            view="teacherVerifications" 
                            activeView={activeView} 
                            setActiveView={setActiveView} 
                            badgeCount={(siteData.teacherVerificationRequests || []).length}
                        />
                        <AdminNavItem 
                            icon="envelope" 
                            label="Contact Messages" 
                            view="messages" 
                            activeView={activeView} 
                            setActiveView={setActiveView} 
                            badgeCount={(siteData.contactMessages || []).filter(m => m.status === 'unread').length}
                        />
                     </div>
                     <div className="mt-auto">
                        <button onClick={() => navigate('/')} className="w-full flex items-center p-3 rounded-lg text-left transition-colors text-sm font-medium text-gray-300 hover:bg-indigo-600 hover:text-white">
                            <Icon name="arrow-left" className="w-6 mr-3 text-lg" /> Back to Site
                        </button>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>

            {/* --- Modals --- */}
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
            {modalState.type === 'tutor' && (
                <TutorModal tutor={modalState.data} onClose={closeModal} />
            )}
             {modalState.type === 'lecture' && (
                <LectureModal course={modalState.data} onClose={closeModal} />
            )}
            {modalState.type === 'screenshot' && (
                <ScreenshotModal imageKey={modalState.data.key} title={modalState.data.title} onClose={closeModal} />
            )}
            {modalState.type === 'syllabus' && (
                <SyllabusModal syllabus={modalState.data} onClose={closeModal} />
            )}
        </>
    );
};

export default AdminDashboard;