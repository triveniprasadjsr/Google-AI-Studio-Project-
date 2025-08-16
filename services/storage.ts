import { SiteData, User, Course, NavItem, TeacherVerificationRequest } from '../types';
import { DATA_KEY_V7, USERS_KEY, LEGACY_DATA_KEY, ADMIN_EMAIL } from '../constants';
import { addFile } from './db';

const defaultNavItems: NavItem[] = [
    { id: 1, name: 'Home', path: '/', icon: 'home', order: 0 },
    { id: 2, name: 'Courses', path: '/courses', icon: 'book', order: 1 },
    { id: 3, name: 'Syllabus', path: '/syllabus', icon: 'file-alt', order: 2 },
    { id: 4, name: 'PYQ', path: '/pyq', icon: 'question-circle', order: 3 },
    { id: 5, name: 'Free E-Book and Notes', path: '/downloads', icon: 'book-open', order: 4 },
    { id: 6, name: 'Contact', path: '/contact', icon: 'envelope', order: 5 },
];

export const defaultData: SiteData = {
    classroomName: "Triveni Classes",
    home: { 
        title: "Welcome to Triveni Classes", 
        subtitle: "Your Path to Success!", 
        intro: "We are a premier coaching institute dedicated to providing top-quality education and guidance to help students achieve their academic and career goals.", 
        bannerImage: "https://picsum.photos/seed/banner/1200/400" 
    },
    paymentDetails: {
        upiId: "triveniprasadjsr-1@okicici",
        upiNumber: "9470392954"
    },
    courses: [
        { 
            id: 1, 
            name: "Advanced Physics", 
            description: "Master the concepts of modern physics.", 
            instructor: "Dr. Anjali Sharma", 
            duration: "60 Classes", 
            fee: 199, 
            imageKey: null, 
            lectures: [ { id: 1, title: "Intro to Quantum Mechanics", description: "A gentle introduction.", videoUrl: null, videoKey: null, pdfKey: null, pdfFileName: null }, { id: 2, title: "Special Relativity", description: "Exploring spacetime.", videoUrl: null, videoKey: null, pdfKey: null, pdfFileName: null }],
            registrationStartDate: "2024-07-01",
            registrationEndDate: "2024-07-31",
            classStartDate: "2024-08-01",
            validityEndDate: "2025-01-31",
            language: "English",
            courseType: "Live + Recorded",
            hasDownloadableContent: true,
            originalFee: 299,
            validityPeriod: "6 Months",
        },
        { 
            id: 2, 
            name: "Organic Chemistry", 
            description: "Dive deep into carbon compounds.", 
            instructor: "Prof. Rohan Verma", 
            duration: "50 Classes", 
            fee: 199, 
            imageKey: null, 
            lectures: [],
            registrationStartDate: "2024-07-01",
            registrationEndDate: "2024-07-31",
            classStartDate: "2024-08-01",
            validityEndDate: "2025-01-31",
            language: "Hindi & English (Hinglish)",
            courseType: "Recorded",
            hasDownloadableContent: true,
            originalFee: 249,
            validityPeriod: "6 Months",
        },
        { 
            id: 3, 
            name: "Calculus I", 
            description: "Build a strong foundation in calculus.", 
            instructor: "Mr. Raj Kumar", 
            duration: "40 Classes", 
            fee: 199, 
            imageKey: null, 
            lectures: [],
            registrationStartDate: "2024-07-01",
            registrationEndDate: "2024-07-31",
            classStartDate: "2024-08-01",
            validityEndDate: "2025-01-31",
            language: "English",
            courseType: "Test Series",
            hasDownloadableContent: false,
            originalFee: null,
            validityPeriod: "1 Month",
        }
    ],
    tutors: [
        { id: 1, name: "Dr. Priya Singh", designation: "Physics Faculty", qualifications: "Ph.D. in Physics", experience: "10 Years", photoKey: null },
        { id: 2, name: "Mr. Raj Kumar", designation: "Maths Faculty", qualifications: "M.Sc. in Mathematics", experience: "8 Years", photoKey: null }
    ],
    pendingVerifications: [],
    teacherVerificationRequests: [],
    contactMessages: [],
    generalDownloads: [],
    syllabuses: [],
    navItems: defaultNavItems,
};


const dataURLToBlob = (dataURL: string): Blob | null => {    
    if (!dataURL || !dataURL.startsWith('data:')) return null;
    try {
        const parts = dataURL.split(',');
        const mimeType = parts[0].match(/:(.*?);/)?.[1];
        const b64 = atob(parts[1]);
        let n = b64.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = b64.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mimeType});
    } catch(e) {
        console.error("Could not convert data URL to Blob", e);
        return null;
    }
};

const runMigration = async (data: any): Promise<SiteData> => {
    console.log("Starting data migration to IndexedDB to fix storage limits.");
    const migratedData = JSON.parse(JSON.stringify(data));

    for (const course of migratedData.courses || []) {
        if (course.image && typeof course.image === 'string') {
            const blob = dataURLToBlob(course.image);
            if(blob) course.imageKey = await addFile(blob);
            else course.imageKey = null;
        }
        delete course.image;

        for (const lecture of course.lectures || []) {
            if (lecture.videoUrl && typeof lecture.videoUrl === 'string') {
                 const blob = dataURLToBlob(lecture.videoUrl);
                 if(blob) lecture.videoKey = await addFile(blob);
                 lecture.videoUrl = null; 
            } else {
                 lecture.videoKey = null;
            }

            if (lecture.pdfUrl && typeof lecture.pdfUrl === 'string') {
                const blob = dataURLToBlob(lecture.pdfUrl);
                if(blob) lecture.pdfKey = await addFile(blob);
            }
            delete lecture.pdfUrl;
        }
    }

    for (const tutor of migratedData.tutors || []) {
        if (tutor.photo && typeof tutor.photo === 'string') {
             const blob = dataURLToBlob(tutor.photo);
             if(blob) tutor.photoKey = await addFile(blob);
             else tutor.photoKey = null;
        }
        delete tutor.photo;
    }

    for (const verification of migratedData.pendingVerifications || []) {
        if (verification.screenshotDataUrl && typeof verification.screenshotDataUrl === 'string') {
             const blob = dataURLToBlob(verification.screenshotDataUrl);
             if(blob) verification.screenshotKey = await addFile(blob);
        }
        delete verification.screenshotDataUrl;
    }

    // Initialize new properties if they don't exist in migrated data
    if (!migratedData.generalDownloads) {
        migratedData.generalDownloads = [];
    }
    if (!migratedData.syllabuses) {
        migratedData.syllabuses = [];
    }
    if (!migratedData.navItems) {
        migratedData.navItems = defaultNavItems;
    }
     if (!migratedData.teacherVerificationRequests) {
        migratedData.teacherVerificationRequests = [];
    }
    
    console.log("Migration to IndexedDB finished successfully.");
    return migratedData;
};

export const getSiteData = async (): Promise<SiteData> => {
    const v7DataStr = localStorage.getItem(DATA_KEY_V7);
    if (v7DataStr) {
        try {
            const data = JSON.parse(v7DataStr);
            // Ensure new properties exist on loaded data
            if (!data.generalDownloads) {
                data.generalDownloads = [];
            }
            if (!data.syllabuses) {
                data.syllabuses = [];
            }
            if (!data.teacherVerificationRequests) {
                data.teacherVerificationRequests = [];
            }
            if (!data.navItems || data.navItems.length === 0) {
                data.navItems = defaultData.navItems;
            }
            // Ensure courses have new properties to avoid crashes
            data.courses = data.courses.map((c: Course) => ({
                ...{
                    registrationStartDate: "",
                    registrationEndDate: "",
                    classStartDate: "",
                    validityEndDate: "",
                    language: "",
                    courseType: "",
                    hasDownloadableContent: false,
                    originalFee: null,
                    validityPeriod: "",
                },
                ...c,
            }));
            return data;
        } catch (e) {
            console.error("Error parsing V7 data, falling back.", e);
        }
    }

    const v6DataStr = localStorage.getItem(LEGACY_DATA_KEY);
    if (v6DataStr) {
        try {
            const v6Data = JSON.parse(v6DataStr);
            const migratedData = await runMigration(v6Data);
            saveSiteData(migratedData);
            localStorage.removeItem(LEGACY_DATA_KEY);
            return migratedData;
        } catch (e) {
            console.error("Failed to migrate V6 data. The data might be corrupted. Falling back to default.", e);
            // If migration fails, it's safer to start with default data than a broken state.
            saveSiteData(defaultData);
            localStorage.removeItem(LEGACY_DATA_KEY);
            return defaultData;
        }
    }
    
    // No existing data, use default
    return JSON.parse(JSON.stringify(defaultData));
};

export const saveSiteData = (data: SiteData): void => {
    try {
        localStorage.setItem(DATA_KEY_V7, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save site data. This could be a sign of a critical error.", e);
        alert("A critical error occurred while trying to save application data. Please backup any important information and refresh the page.");
    }
};

const migrateUserData = (users: any[]): { users: User[], needsSave: boolean } => {
    let needsSave = false;
    const migratedUsers = users.map(user => {
        if (user.enrolledCourses && !user.hasOwnProperty('enrollments')) {
            user.enrollments = user.enrolledCourses.map((courseId: number) => ({
                courseId: courseId,
                status: 'enrolled'
            }));
            delete user.enrolledCourses;
            needsSave = true;
        } else if (!user.hasOwnProperty('enrollments')) {
            user.enrollments = [];
            needsSave = true;
        }
        if (!user.hasOwnProperty('role')) {
            user.role = user.email === ADMIN_EMAIL ? 'admin' : 'student';
            needsSave = true;
        }
        if (!user.hasOwnProperty('status')) {
            user.status = 'approved';
            needsSave = true;
        }
        return user as User;
    });
    return { users: migratedUsers, needsSave };
};

export const getUsers = (): User[] => {
    try {
        const storedUsers = localStorage.getItem(USERS_KEY);
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const { users: migratedUsers, needsSave } = migrateUserData(users);
        if (needsSave) {
            saveUsers(migratedUsers);
        }
        return migratedUsers;
    } catch (error) {
        console.error("Error loading users.", error);
        return [];
    }
};

export const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};