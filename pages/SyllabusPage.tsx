import React, { useState } from 'react';
import Icon from '../components/common/Icon';
import { useApp } from '../hooks/useApp';
import SyllabusCard from '../components/syllabus/SyllabusCard';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Modal from '../components/common/Modal';
import { Syllabus } from '../types';

// --- PDF Viewer Modal Component ---
interface PdfViewerModalProps {
    pdfUrl: string;
    title: string;
    onClose: () => void;
}

const PdfViewerModal: React.FC<PdfViewerModalProps> = ({ pdfUrl, title, onClose }) => {
    const footer = (
        <div className="flex justify-between items-center w-full">
            <a
                href={pdfUrl}
                download={`${title}.pdf`}
                className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center"
            >
                <Icon name="download" className="mr-2" />
                Download PDF
            </a>
            <button onClick={onClose} className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500">
                Close
            </button>
        </div>
    );

    return (
        <Modal title={title} onClose={onClose} footer={footer} size="5xl">
            <div className="w-full h-[80vh] bg-gray-500">
                <iframe
                    src={pdfUrl}
                    title={title}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                />
            </div>
        </Modal>
    );
};


const SyllabusPage: React.FC = () => {
    useScrollAnimation();
    const { siteData } = useApp();
    const { syllabuses = [] } = siteData;
    const [pdfToView, setPdfToView] = useState<{ url: string; title: string } | null>(null);

    const handleViewPdf = (syllabus: Syllabus, pdfUrl: string) => {
        setPdfToView({ url: pdfUrl, title: syllabus.title });
    };

    return (
        <>
            <div className="p-4 md:p-8 bg-gray-900 text-white min-h-full">
                <header className="mb-8 animate-on-scroll">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Syllabus Library</h1>
                    <p className="text-lg text-gray-400 max-w-3xl">Find the detailed syllabus for our courses and various exams to streamline your studies.</p>
                </header>

                {syllabuses.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                         {syllabuses.map((syllabus, index) => (
                            <div key={syllabus.id} className="animate-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
                                <SyllabusCard syllabus={syllabus} onViewPdf={handleViewPdf} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500 bg-gray-800 rounded-lg border border-gray-700 animate-on-scroll">
                        <Icon name="box-open" className="fa-3x mb-4 text-gray-600" />
                        <h2 className="text-2xl font-semibold">No Syllabus Available Yet</h2>
                        <p className="mt-2">Syllabus documents will be uploaded soon. Please check back later.</p>
                    </div>
                )}
            </div>

            {pdfToView && (
                <PdfViewerModal
                    pdfUrl={pdfToView.url}
                    title={pdfToView.title}
                    onClose={() => setPdfToView(null)}
                />
            )}
        </>
    );
};

export default SyllabusPage;