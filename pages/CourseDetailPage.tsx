import React from 'react';
import { useParams, NavLink, Navigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { Course, Tutor } from '../types';
import { useFileUrl } from '../hooks/useFileUrl';
import Icon from '../components/common/Icon';
import Collapsible from '../components/common/Collapsible';
import AuthModal from '../components/modals/AuthModal';
import PaymentModal from '../components/modals/PaymentModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import TeacherRegistrationModal from '../components/modals/TeacherRegistrationModal';

const DetailItem: React.FC<{ icon: string; label: string; value?: string | number | null; }> = ({ icon, label, value }) => (
    <div className="flex items-start text-gray-300">
        <Icon name={icon} className="text-indigo-400 w-6 mt-1 mr-3" />
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-gray-400">{value || 'N/A'}</p>
        </div>
    </div>
);

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
};

const TutorCard: React.FC<{tutor: Tutor}> = ({ tutor }) => {
    const photoUrl = useFileUrl(tutor.photoKey);
    const tutorPhoto = photoUrl || `https://i.pravatar.cc/300?u=${tutor.id}`;

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 flex items-center space-x-6">
            <img src={tutorPhoto} alt={`Photo of ${tutor.name}`} className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/50 shadow-md" />
            <div>
                <h3 className="text-2xl font-bold text-white">{tutor.name}</h3>
                <p className="text-indigo-400 font-semibold text-lg">{tutor.designation}</p>
                <div className="text-gray-400 text-sm space-y-2 mt-3">
                    <p><Icon name="graduation-cap" className="w-5 mr-2 text-gray-500" />{tutor.qualifications}</p>
                    <p><Icon name="briefcase" className="w-5 mr-2 text-gray-500" />{tutor.experience}</p>
                </div>
            </div>
        </div>
    );
};

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { siteData, isLoggedIn, currentUser } = useApp();
    const [modalState, setModalState] = React.useState<{ type: 'payment' | 'auth' | 'confirm-enroll' | null, course?: Course }>({ type: null });
    const [isTeacherRegisterModalOpen, setIsTeacherRegisterModalOpen] = React.useState(false);

    const course = siteData.courses.find(c => c.id === Number(id));
    const courseImage = useFileUrl(course?.imageKey);
    
    if (!course) {
        return <Navigate to="/courses" replace />;
    }

    const instructor = siteData.tutors.find(t => t.name === course.instructor);
    const numVideos = course.lectures.filter(l => l.videoKey || l.videoUrl).length;
    const numNotes = course.lectures.filter(l => l.pdfKey).length;
    const enrollment = currentUser?.enrollments.find(e => e.courseId === course.id);

    const getRegistrationStatus = (): 'open' | 'upcoming' | 'closed' => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate date comparison

        if (!course.registrationStartDate && !course.registrationEndDate) {
            return 'open'; // If no dates are set, enrollment is always open
        }

        if (course.registrationStartDate) {
            const startDate = new Date(course.registrationStartDate + 'T00:00:00');
            if (today < startDate) {
                return 'upcoming';
            }
        }
        
        if (course.registrationEndDate) {
            const endDate = new Date(course.registrationEndDate + 'T00:00:00');
            endDate.setHours(23, 59, 59, 999); // Registration is valid for the whole end day
            if (today > endDate) {
                return 'closed';
            }
        }

        return 'open';
    };

    const registrationStatus = getRegistrationStatus();

    const handleBuyNowClick = () => {
        if (!isLoggedIn) {
            setModalState({ type: 'auth' });
        } else {
            setModalState({ type: 'confirm-enroll', course });
        }
    };
    
    const closeModal = () => {
        setModalState({ type: null });
    };

    const handleConfirmEnrollment = () => {
        setModalState({ type: 'payment', course });
    };
    
    const handleOpenTeacherRegistration = () => {
        closeModal(); // This closes the AuthModal
        setIsTeacherRegisterModalOpen(true);
    };

    const renderBuyNowButton = () => {
        if (enrollment) {
            if (enrollment.status === 'enrolled') {
                return (
                     <button className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md cursor-default">
                        <Icon name="check-circle" className="mr-2" /> Enrolled
                    </button>
                );
            }
            if (enrollment.status === 'pending') {
                return (
                    <button className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-md cursor-not-allowed" disabled>
                        <Icon name="clock" className="mr-2" /> Verification Pending
                    </button>
                );
            }
        }

        switch (registrationStatus) {
            case 'upcoming':
                return (
                    <button className="w-full bg-gray-500 text-white font-bold py-3 px-4 rounded-md cursor-not-allowed" disabled>
                        <Icon name="calendar-alt" className="mr-2" />
                        Registration starts {formatDate(course.registrationStartDate)}
                    </button>
                );
            case 'closed':
                return (
                    <button className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-md cursor-not-allowed" disabled>
                        <Icon name="calendar-times" className="mr-2" />
                        Registration Closed
                    </button>
                );
            case 'open':
                return (
                    <button onClick={handleBuyNowClick} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition-transform transform hover:scale-105">
                        Buy Now
                    </button>
                );
            default:
                return null;
        }
    }
    
    return (
        <>
            <div className="bg-gray-900 text-white">
                {/* Header Section */}
                <div className="bg-gray-800 shadow-md">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="text-sm text-gray-400 mb-2">
                            <NavLink to="/" className="hover:text-indigo-400">Home</NavLink>
                            <span className="mx-2">&gt;</span>
                            <NavLink to="/courses" className="hover:text-indigo-400">Courses</NavLink>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">{course.name}</h1>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-10">
                            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-bold mb-4">What's included</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-700 pt-4">
                                    <DetailItem icon="calendar-alt" label="Registration Start Date" value={formatDate(course.registrationStartDate)} />
                                    <DetailItem icon="calendar-check" label="Registration End Date" value={formatDate(course.registrationEndDate)} />
                                    <DetailItem icon="play-circle" label="Class Start Date" value={formatDate(course.classStartDate)} />
                                    <DetailItem icon="calendar-times" label="Validity End Date" value={formatDate(course.validityEndDate)} />
                                    <DetailItem icon="stopwatch" label="Duration" value={course.duration} />
                                    <DetailItem icon="layer-group" label="Type" value={course.courseType} />
                                    <DetailItem icon="language" label="Language" value={course.language} />
                                    <DetailItem icon="download" label="Downloadable" value={course.hasDownloadableContent ? 'Yes' : 'No'} />
                                </div>
                            </div>
                            
                            <div id="curriculum">
                                <h2 className="text-2xl font-bold mb-4">Course Curriculum & Syllabus</h2>
                                <Collapsible title={`${course.name} by ${course.instructor}`} startOpen={true}>
                                    <div className="p-4 bg-gray-700/50 rounded-b-lg flex items-center space-x-6 text-lg">
                                        <div className="flex items-center text-white"><Icon name="video" className="mr-2 text-indigo-400"/> {numVideos} Videos</div>
                                        <div className="flex items-center text-white"><Icon name="file-alt" className="mr-2 text-indigo-400"/> {numNotes} Notes</div>
                                    </div>
                                </Collapsible>
                            </div>

                            {instructor && (
                                <div id="teachers">
                                    <h2 className="text-2xl font-bold mb-4">Teachers</h2>
                                    <TutorCard tutor={instructor} />
                                </div>
                            )}
                        </div>

                        {/* Right Column (Sticky) */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky top-8">
                                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                    <img src={courseImage || 'https://placehold.co/600x400/1e293b/94a3b8?text=Loading...'} alt={course.name} className="w-full h-56 object-cover bg-gray-700" />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-4">{course.name}</h3>
                                        <div className="space-y-3 mb-6">
                                            <p className="flex items-center text-gray-300"><Icon name="tag" className="w-5 mr-3 text-indigo-400" /> Registration Fee: <strong className="ml-auto text-white">₹{course.fee}</strong> {course.originalFee && <span className="line-through text-red-400 ml-2">₹{course.originalFee}</span>}</p>
                                            <p className="flex items-center text-gray-300"><Icon name="check-circle" className="w-5 mr-3 text-indigo-400" /> Validity: <strong className="ml-auto text-white">{course.validityPeriod}</strong></p>
                                            <p className="flex items-center text-gray-300"><Icon name="play" className="w-5 mr-3 text-indigo-400" /> Type: <strong className="ml-auto text-white">{course.courseType}</strong></p>
                                            <p className="flex items-center text-gray-300"><Icon name="stopwatch" className="w-5 mr-3 text-indigo-400" /> Duration: <strong className="ml-auto text-white">{course.duration}</strong></p>
                                            <p className="flex items-center text-gray-300"><Icon name="comments" className="w-5 mr-3 text-indigo-400" /> Language: <strong className="ml-auto text-white">{course.language}</strong></p>
                                        </div>
                                        {renderBuyNowButton()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalState.type === 'confirm-enroll' && modalState.course && (
                <ConfirmModal
                    message={`Are you sure you want to proceed with enrollment for "${modalState.course.name}"?`}
                    onConfirm={handleConfirmEnrollment}
                    onClose={closeModal}
                    confirmText="Yes, Proceed"
                    cancelText="Cancel"
                    isDestructive={false}
                />
            )}
            {modalState.type === 'payment' && modalState.course && (
                <PaymentModal course={modalState.course} onClose={closeModal} />
            )}
            {modalState.type === 'auth' && (
                <AuthModal
                    initialView="signin"
                    onClose={closeModal}
                    onOpenTeacherRegistration={handleOpenTeacherRegistration}
                />
            )}
            {isTeacherRegisterModalOpen && <TeacherRegistrationModal onClose={() => setIsTeacherRegisterModalOpen(false)} />}
        </>
    );
};

export default CourseDetailPage;