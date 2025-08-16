import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import CourseCard from '../components/course/CourseCard';
import Icon from '../components/common/Icon';
import ViewCourseModal from '../components/modals/ViewCourseModal';
import { Course, Tutor } from '../types';
import { useFileUrl } from '../hooks/useFileUrl';

const Hero: React.FC = () => {
    const { siteData } = useApp();
    return (
        <section className="hero-bg text-white relative overflow-hidden bg-gradient-to-br from-indigo-700 to-purple-800">
            <div className="container mx-auto px-6 py-24 md:py-32 lg:py-40 relative z-10 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-on-scroll">{siteData.home.title}</h1>
                <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto animate-on-scroll" style={{ animationDelay: '0.2s' }}>{siteData.home.subtitle}</p>
                <NavLink to="/courses" className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-transform transform hover:scale-105 inline-block animate-on-scroll" style={{ animationDelay: '0.4s' }}>
                    Explore Courses
                </NavLink>
            </div>
            <div className="hero-shape" style={{ width: '200px', height: '200px', top: '10%', left: '5%' }}></div>
            <div className="hero-shape" style={{ width: '150px', height: '150px', top: '60%', right: '10%' }}></div>
            <div className="hero-shape" style={{ width: '100px', height: '100px', bottom: '15%', left: '20%' }}></div>
            <div className="hero-shape" style={{ width: '50px', height: '50px', top: '20%', right: '30%' }}></div>
        </section>
    );
};

const FeaturedCourses: React.FC<{
    onViewCourseClick: (course: Course) => void;
}> = ({ onViewCourseClick }) => {
    const { siteData } = useApp();
    const featuredCourses = siteData.courses.slice(0, 3);

    if (featuredCourses.length === 0) return null;

    return (
        <section id="featured-courses" className="py-16 md:py-24 bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 animate-on-scroll">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Courses</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Get a glimpse of our most popular courses to kickstart your learning journey.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredCourses.map((course, index) => (
                        <div key={course.id} className="animate-on-scroll" style={{ animationDelay: `${index * 0.15}s` }}>
                            <CourseCard 
                                course={course} 
                                isFeatured={true}
                                onViewCourseClick={onViewCourseClick}
                            />
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12 animate-on-scroll">
                    <NavLink to="/courses" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">
                        View All Courses <Icon name="arrow-right" className="ml-2 inline-block" />
                    </NavLink>
                </div>
            </div>
        </section>
    );
};

const TutorCard: React.FC<{tutor: Tutor}> = ({ tutor }) => {
    const photoUrl = useFileUrl(tutor.photoKey);
    const tutorPhoto = photoUrl || `https://i.pravatar.cc/300?u=${tutor.id}`;

    return (
        <div className="feature-card bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 flex flex-col items-center animate-on-scroll">
            <img src={tutorPhoto} alt={`Photo of ${tutor.name}`} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-500/50 shadow-md" />
            <h3 className="text-xl font-bold mb-1 text-white text-center">{tutor.name}</h3>
            <p className="text-indigo-400 font-semibold mb-3 text-center">{tutor.designation}</p>
            <div className="text-gray-400 text-sm space-y-2 text-left w-full border-t border-gray-700 pt-3 mt-3">
                <p className="flex items-start"><Icon name="graduation-cap" className="w-5 mt-1 mr-2 text-gray-500" /><span><strong>Qualifications:</strong> {tutor.qualifications}</span></p>
                <p className="flex items-start"><Icon name="briefcase" className="w-5 mt-1 mr-2 text-gray-500" /><span><strong>Experience:</strong> {tutor.experience}</span></p>
            </div>
        </div>
    );
};

const TutorsSection: React.FC = () => {
    const { siteData } = useApp();

    if (!siteData.tutors || siteData.tutors.length === 0) return null;
    
    return (
        <section id="tutors-section" className="py-16 md:py-24 bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 animate-on-scroll">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Meet Our Expert Tutors</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Our dedicated team of educators who are experts in their fields and passionate about teaching.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
                    {siteData.tutors.map((tutor, index) => (
                         <div key={tutor.id} style={{ animationDelay: `${index * 0.15}s` }}>
                           <TutorCard tutor={tutor} />
                         </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection: React.FC = () => {
    const studentReviews = [
        { name: "Aarav Sharma", photo: `https://i.pravatar.cc/100?u=user1`, course: "Advanced Physics", review: "The detailed explanations and practical examples in the Advanced Physics course were fantastic. Dr. Sharma made complex topics easy to grasp." },
        { name: "Saanvi Gupta", photo: `https://i.pravatar.cc/100?u=user2`, course: "Organic Chemistry", review: "I finally understand reaction mechanisms! The lectures are engaging and the PDF notes are a great resource for revision. Thank you, XYZ Classes!" },
        { name: "Advik Singh", photo: `https://i.pravatar.cc/100?u=user3`, course: "Calculus I", review: "Mr. Raj Kumar is an amazing teacher. He breaks down calculus into simple steps. My grades have improved significantly since I enrolled." },
    ];
    return (
        <section id="testimonials-section" className="py-16 md:py-24 bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 animate-on-scroll">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">What Our Students Say</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Hear from students who have transformed their learning with our courses.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {studentReviews.map((review, index) => (
                        <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col animate-on-scroll feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="flex-shrink-0 mb-4">
                                <Icon name="quote-left" className="text-indigo-500 text-3xl" />
                            </div>
                            <p className="text-gray-300 flex-grow mb-6">"{review.review}"</p>
                            <div className="flex items-center mt-auto pt-4 border-t border-gray-700">
                                <img className="h-12 w-12 rounded-full object-cover" src={review.photo} alt={`Photo of ${review.name}`} />
                                <div className="ml-4">
                                    <p className="font-semibold text-white leading-tight">{review.name}</p>
                                    <p className="text-sm text-gray-400">Student, {review.course}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const HomePage: React.FC = () => {
    useScrollAnimation();
    const [modalState, setModalState] = React.useState<{ type: 'view' | null, course?: Course }>({ type: null });

    const handleViewCourseClick = (course: Course) => {
        setModalState({ type: 'view', course });
    };

    const closeModal = () => {
        setModalState({ type: null });
    };
    
    return (
        <>
            <Hero />
            <FeaturedCourses 
                onViewCourseClick={handleViewCourseClick}
            />
            <TutorsSection />
            <TestimonialsSection />
            
            {modalState.type === 'view' && modalState.course && (
                <ViewCourseModal course={modalState.course} onClose={closeModal} />
            )}
        </>
    );
};

export default HomePage;