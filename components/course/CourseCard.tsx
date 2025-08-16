import React from 'react';
import { NavLink } from 'react-router-dom';
import { Course } from '../../types';
import { useApp } from '../../hooks/useApp';
import Icon from '../common/Icon';
import { useFileUrl } from '../../hooks/useFileUrl';

interface CourseCardProps {
    course: Course;
    isFeatured?: boolean;
    onViewCourseClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isFeatured = false, onViewCourseClick }) => {
    const { currentUser } = useApp();
    const imageUrl = useFileUrl(course.imageKey);
    
    const enrollment = currentUser?.enrollments.find(e => e.courseId === course.id);

    const renderButton = () => {
        if (enrollment) {
            if (enrollment.status === 'enrolled') {
                return (
                    <button onClick={() => onViewCourseClick(course)} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition">
                        <Icon name="play-circle" className="mr-2" /> View Course
                    </button>
                );
            }
            if (enrollment.status === 'pending') {
                return (
                    <button className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-md cursor-not-allowed" disabled>
                        <Icon name="clock" className="mr-2" /> Verification Pending
                    </button>
                );
            }
        }
        return (
             <NavLink to={`/course/${course.id}`} className="w-full text-center block bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition">
                View Details
            </NavLink>
        );
    };
    
    const containerClasses = isFeatured
        ? "feature-card bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full"
        : "bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full";

    return (
        <div className={containerClasses}>
            <NavLink to={`/course/${course.id}`} className="block">
                <img src={imageUrl || 'https://placehold.co/600x400/1e293b/94a3b8?text=Loading...'} className="w-full h-48 object-cover bg-gray-700" alt={course.name} />
            </NavLink>
            <div className="p-6 flex-grow flex flex-col">
                 <h3 className="text-xl font-bold mb-2 text-white">
                    <NavLink to={`/course/${course.id}`} className="hover:text-indigo-400 transition-colors">{course.name}</NavLink>
                 </h3>
                <p className="text-gray-400 mb-4 flex-grow">{course.description}</p>
                <div className="text-sm text-gray-400 mt-auto pt-4 border-t border-gray-700 space-y-2">
                     <div className="flex items-center"><Icon name="user-tie" className="w-5 mr-2 text-indigo-400" /><span>{course.instructor}</span></div>
                     <div className="flex items-center"><Icon name="clock" className="w-5 mr-2 text-indigo-400" /><span>{course.duration}</span></div>
                     <div className="flex items-center"><Icon name="list-alt" className="w-5 mr-2 text-indigo-400" /><span>{course.lectures.length} {course.lectures.length === 1 ? 'Lecture' : 'Lectures'}</span></div>
                     <div className="mt-4">{renderButton()}</div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;