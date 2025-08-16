import React, { useState } from 'react';
import { useApp } from '../hooks/useApp';
import CourseCard from '../components/course/CourseCard';
import ViewCourseModal from '../components/modals/ViewCourseModal';
import { Course } from '../types';

const CoursesPage: React.FC = () => {
    const { siteData } = useApp();
    
    const [modalState, setModalState] = useState<{ type: 'view' | null, course?: Course }>({ type: null });

    const handleViewCourseClick = (course: Course) => {
        setModalState({ type: 'view', course });
    };

    const closeModal = () => {
        setModalState({ type: null });
    };

    return (
        <>
            <div className="p-4 md:p-8">
                <h2 className="text-3xl font-bold mb-6 text-white">Available Courses</h2>
                <div id="courses-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {siteData.courses.map(course => (
                        <CourseCard 
                            key={course.id} 
                            course={course}
                            onViewCourseClick={handleViewCourseClick}
                        />
                    ))}
                </div>
            </div>
            
            {modalState.type === 'view' && modalState.course && (
                <ViewCourseModal course={modalState.course} onClose={closeModal} />
            )}
        </>
    );
};

export default CoursesPage;