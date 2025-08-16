import React from 'react';
import { Syllabus } from '../../types';
import { useFileUrl } from '../../hooks/useFileUrl';
import Icon from '../common/Icon';

interface SyllabusCardProps {
    syllabus: Syllabus;
    onViewPdf: (syllabus: Syllabus, pdfUrl: string) => void;
}

const SyllabusCard: React.FC<SyllabusCardProps> = ({ syllabus, onViewPdf }) => {
    const imageUrl = useFileUrl(syllabus.imageKey);
    const pdfUrl = useFileUrl(syllabus.pdfKey);

    const hasExternalLink = !!syllabus.externalUrl;
    const hasPdf = !!pdfUrl;

    const renderButton = () => {
        if (hasExternalLink) {
            return (
                <a
                    href={syllabus.externalUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center flex items-center justify-center font-bold py-2 px-4 rounded-md transition bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    <Icon name="external-link-alt" className="mr-2" />
                    View Syllabus
                </a>
            );
        }

        if (hasPdf) {
            return (
                <button
                    onClick={() => onViewPdf(syllabus, pdfUrl!)}
                    className="w-full text-center flex items-center justify-center font-bold py-2 px-4 rounded-md transition bg-indigo-600 text-white hover:bg-indigo-700"
                >
                    <Icon name="eye" className="mr-2" />
                    View Syllabus
                </button>
            );
        }

        return (
            <button
                disabled
                className="w-full text-center flex items-center justify-center font-bold py-2 px-4 rounded-md transition bg-gray-600 text-gray-400 cursor-not-allowed"
            >
                <Icon name="eye-slash" className="mr-2" />
                Not Available
            </button>
        );
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full feature-card">
            <div className="relative">
                <img src={imageUrl || 'https://placehold.co/600x400/2d3748/94a3b8?text=Syllabus'} className="w-full h-48 object-cover bg-gray-700" alt={syllabus.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-white">{syllabus.title}</h3>
                <p className="text-gray-400 mb-4 flex-grow text-sm">{syllabus.description || "Click to view the detailed syllabus."}</p>
                <div className="mt-auto pt-4 border-t border-gray-700">
                    {renderButton()}
                </div>
            </div>
        </div>
    );
};

export default SyllabusCard;