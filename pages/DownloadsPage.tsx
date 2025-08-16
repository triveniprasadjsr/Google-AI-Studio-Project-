import React from 'react';
import { useApp } from '../hooks/useApp';
import Icon from '../components/common/Icon';
import { useFileUrl } from '../hooks/useFileUrl';
import { GeneralDownload } from '../types';

const DownloadRow: React.FC<{ download: GeneralDownload }> = ({ download }) => {
    const pdfUrl = useFileUrl(download.pdfKey);

    return (
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-700/30 transition-colors duration-200">
            <div>
                <h3 className="font-semibold text-lg text-white">{download.title}</h3>
                <p className="text-sm text-gray-400 mt-1 max-w-2xl">{download.pdfFileName}</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                <a
                    href={pdfUrl || '#'}
                    download={download.pdfFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${pdfUrl ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-500 cursor-not-allowed'}`}
                    aria-disabled={!pdfUrl}
                    onClick={(e) => !pdfUrl && e.preventDefault()}
                >
                    <Icon name={pdfUrl ? 'download' : 'spinner'} className={`mr-2 ${!pdfUrl && 'fa-spin'}`} />
                    Download
                </a>
            </div>
        </div>
    );
};


const DownloadsPage: React.FC = () => {
    const { siteData } = useApp();
    const { generalDownloads = [] } = siteData;

    return (
        <div className="p-4 md:p-8 bg-gray-900 text-white min-h-full">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Free E-Book and Notes</h1>
                <p className="text-lg text-gray-400">Download our free collection of e-books and supplementary notes.</p>
            </header>

            {generalDownloads.length > 0 ? (
                 <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                     <div className="divide-y divide-gray-700">
                         {generalDownloads.map(download => (
                            <DownloadRow key={download.id} download={download} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500 bg-gray-800 rounded-lg border border-gray-700">
                    <Icon name="box-open" className="fa-3x mb-4 text-gray-600" />
                    <h2 className="text-2xl font-semibold">No Downloads Available</h2>
                    <p className="mt-2">It looks like no files have been uploaded yet. Please check back later.</p>
                </div>
            )}
        </div>
    );
};

export default DownloadsPage;