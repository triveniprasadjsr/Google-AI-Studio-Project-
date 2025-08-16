import React, { useState, FormEvent } from 'react';
import { useApp } from '../../hooks/useApp';
import { Course } from '../../types';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import FileInput from '../common/FileInput';
import ConfirmModal from './ConfirmModal';

interface PaymentModalProps {
    course: Course;
    onClose: () => void;
}

const DetailRow: React.FC<{label: string, value: React.ReactNode}> = ({label, value}) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0 text-sm">
        <span className="text-gray-400 font-medium">{label}</span>
        <span className="text-white font-semibold text-right">{value || 'N/A'}</span>
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


const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose }) => {
    const { siteData, addVerificationRequest, currentUser } = useApp();
    const [transactionId, setTransactionId] = useState('');
    const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!transactionId.trim() || !screenshotFile) {
            setError('Transaction ID and screenshot are required.');
            return;
        }
        if (!currentUser) {
             setError('You must be logged in to enroll.');
             return;
        }
        
        setError('');
        setIsLoading(true);

        try {
            await addVerificationRequest({
                userEmail: currentUser.email,
                userName: currentUser.name,
                courseId: course.id,
                courseName: course.name,
                transactionId,
            }, screenshotFile);
            
            setIsLoading(false);
            setShowSuccess(true);

        } catch(err) {
            console.error(err);
            setError('An error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <ConfirmModal 
                message="Submission Received! Your enrollment is pending verification. You will be notified once it's approved."
                onConfirm={onClose}
                onClose={onClose}
                confirmText="OK"
                cancelText=""
                isDestructive={false}
            />
        );
    }
    
    const numVideos = course.lectures.filter(l => l.videoKey || l.videoUrl).length;
    const numNotes = course.lectures.filter(l => l.pdfKey).length;

    const footer = (
        <div className="flex justify-end w-full">
            <button type="button" onClick={onClose} className="bg-gray-600 text-gray-200 px-6 py-2 rounded-md hover:bg-gray-500 mr-3">Cancel</button>
            <button type="submit" form="payment-form" disabled={isLoading} className="bg-green-600 text-white font-bold px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center">
                 {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                Submit Enrollment
            </button>
        </div>
    );
    
    return (
        <Modal title={`Enrollment for: ${course.name}`} onClose={onClose} footer={footer} size="lg">
            <div className="space-y-6">

                <div className="border border-indigo-800 bg-gray-800 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-200 mb-2 text-lg">Subject Details</h3>
                    <div className="space-y-1">
                        <DetailRow label="Registration Start" value={formatDate(course.registrationStartDate)} />
                        <DetailRow label="Registration End" value={formatDate(course.registrationEndDate)} />
                        <DetailRow label="Class Start" value={formatDate(course.classStartDate)} />
                        <DetailRow label="Validity End" value={formatDate(course.validityEndDate)} />
                        <DetailRow label="Duration" value={course.duration} />
                        <DetailRow label="Language" value={course.language} />
                        <DetailRow label="Course Type" value={course.courseType} />
                        <DetailRow label="Downloadable Content" value={course.hasDownloadableContent ? 'Yes' : 'No'} />
                        <DetailRow label="Videos / Notes" value={`${numVideos} / ${numNotes}`} />
                        <DetailRow label="Teacher" value={course.instructor} />
                        <DetailRow 
                            label="Registration Fee" 
                            value={
                                <span className="text-white font-semibold">
                                    ₹{course.fee}
                                    {course.originalFee && course.originalFee > course.fee && (
                                        <span className="ml-2 text-xs text-red-400 font-normal">(Offer Price, <span className="line-through">₹{course.originalFee}</span>)</span>
                                    )}
                                </span>
                            }
                        />
                    </div>
                </div>

                <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-gray-200 mb-3 text-lg">Payment Instructions:</h3>
                        <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 space-y-3">
                            <p className="text-gray-300">1. Open any UPI payment app (Google Pay, PhonePe, etc.).</p>
                            <p className="text-gray-300">2. Pay the registration fee of <strong className="text-indigo-300 text-lg">₹{course.fee}</strong> to the following UPI ID or Phone Number:</p>
                            <div className="pl-4 py-2 bg-gray-900/50 rounded-md">
                               <p className="text-gray-300">UPI Number: <strong className="text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded select-all">{siteData.paymentDetails.upiNumber}</strong></p>
                               <p className="text-gray-300 mt-2">UPI ID: <strong className="text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded select-all">{siteData.paymentDetails.upiId}</strong></p>
                            </div>
                            <p className="text-gray-300">3. After payment, copy the <strong>Transaction ID</strong> and take a <strong>screenshot</strong>.</p>
                            <p className="text-gray-300">4. Enter the details below to complete your enrollment request.</p>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="transaction-id" className="block text-sm font-medium text-gray-300">UPI Transaction ID</label>
                        <input type="text" id="transaction-id" value={transactionId} onChange={e => setTransactionId(e.target.value)} required placeholder="Enter the transaction ID from your payment app" className="mt-1 block w-full border border-gray-600 rounded-md py-2 px-3 bg-gray-700 text-white placeholder:text-gray-500" />
                    </div>
                    <div>
                        <FileInput id="payment-screenshot" label="Payment Screenshot" accept="image/*" onChange={setScreenshotFile} buttonText="Choose Screenshot" />
                    </div>
                    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                </form>
            </div>
        </Modal>
    );
};

export default PaymentModal;