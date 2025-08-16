export interface Lecture {
  id: number;
  title: string;
  description: string;
  videoUrl: string | null; // For external URLs (e.g. YouTube)
  videoKey: string | null; // For uploaded video files in IndexedDB
  pdfKey: string | null;   // For uploaded PDF files in IndexedDB
  pdfFileName?: string | null;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  instructor: string;
  duration: string;
  fee: number;
  imageKey: string | null; // For uploaded image files in IndexedDB
  lectures: Lecture[];
  // New fields for detailed course information
  registrationStartDate?: string;
  registrationEndDate?: string;
  classStartDate?: string;
  validityEndDate?: string;
  language?: string;
  courseType?: string;
  hasDownloadableContent?: boolean;
  originalFee?: number | null;
  validityPeriod?: string; // e.g., "1 Month"
  teacherEmail?: string;
}

export interface Tutor {
  id: number;
  name: string;
  designation: string;
  qualifications: string;
  experience: string;
  photoKey: string | null; // For uploaded photo files in IndexedDB
}

export interface VerificationRequest {
  id: number;
  userEmail: string;
  userName:string;
  courseId: number;
  courseName: string;
  transactionId: string;
  screenshotKey: string; // For uploaded screenshot files in IndexedDB
}

export interface TeacherVerificationRequest {
  id: number;
  userEmail: string;
  userName: string;
  transactionId: string;
  screenshotKey: string;
  requestedAt: string;
  // New fields for tutor profile
  designation: string;
  qualifications: string;
  experience: string;
  photoKey: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'unread' | 'read';
  receivedAt: string;
}

export interface GeneralDownload {
  id: number;
  title: string;
  pdfKey: string;
  pdfFileName: string;
}

export interface Syllabus {
  id: number;
  title: string;
  description: string;
  imageKey: string | null;
  pdfKey: string | null;
  pdfFileName: string | null;
  externalUrl: string | null;
}

export interface NavItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  order: number;
}

export interface SiteData {
  classroomName: string;
  home: {
    title: string;
    subtitle: string;
    intro: string;
    bannerImage: string;
  };
  paymentDetails: {
    upiId: string;
    upiNumber: string;
  };
  courses: Course[];
  tutors: Tutor[];
  pendingVerifications: VerificationRequest[];
  teacherVerificationRequests: TeacherVerificationRequest[];
  contactMessages: ContactMessage[];
  generalDownloads: GeneralDownload[];
  syllabuses: Syllabus[];
  navItems: NavItem[];
}

export interface Enrollment {
    courseId: number;
    status: 'pending' | 'enrolled';
}

export interface User {
    name: string;
    email: string;
    password?: string; // Password might not always be present
    enrollments: Enrollment[];
    role: 'student' | 'teacher' | 'admin';
    status: 'pending' | 'approved'; // Mainly for teachers
}