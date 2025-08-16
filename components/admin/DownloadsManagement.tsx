import React, { useState, FormEvent } from 'react';
import { useApp } from '../../hooks/useApp';
import Icon from '../common/Icon';
import FileInput from '../common/FileInput';
import { GeneralDownload } from '../../types';

interface DownloadFormProps {
    editingDownload: GeneralDownload | null;
    onFinish: () => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ editingDownload, onFinish }) => {
    const { addGeneralDownload, updateGeneralDownload } = useApp();
    const [title, setTitle] = useState(editingDownload?.title || '');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!title) {
            setError('Title is required.');
            return;
        }
        if (!editingDownload && !pdfFile) {
            setError('A PDF file is required when adding a new download.');
            return;
        }

        setIsLoading(true);
        try {
            if (editingDownload) {
                await updateGeneralDownload(editingDownload.id, title, pdfFile);
            } else if (pdfFile) { // Check pdfFile again to satisfy typescript
                await addGeneralDownload(title, pdfFile);
            }
            onFinish();
        } catch (err) {
            console.error(err);
            setError('An error occurred while saving.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border-t border-gray-700 pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">
                {editingDownload ? 'Edit E-Book/Note' : 'Add New E-Book/Note'}
            </h3>
            <form onSubmit={handleSubmit} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4">
                <div>
                    <label htmlFor="download-title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input
                        type="text"
                        id="download-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="block w-full border-gray-600 bg-gray-700 text-white rounded-md shadow-sm p-2"
                        placeholder="e.g., Physics Chapter 1 Notes"
                    />
                </div>
                <FileInput
                    id="download-pdf-file"
                    label="PDF Document"
                    accept=".pdf"
                    onChange={setPdfFile}
                    buttonText={editingDownload ? 'Change PDF (Optional)' : 'Choose PDF'}
                />
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={onFinish} className="bg-gray-600 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-500">
                        Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                        {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                        {editingDownload ? 'Save Changes' : 'Add Item'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const DownloadItem: React.FC<{ download: GeneralDownload, onEdit: (d: GeneralDownload) => void, onDelete: (id: number) => void }> = ({ download, onEdit, onDelete }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md border border-gray-600">
            <div className="flex-1 min-w-0 pr-4">
                <p className="font-semibold text-white truncate" title={download.title}>{download.title}</p>
                <p className="text-sm text-gray-400 italic truncate" title={download.pdfFileName}>
                    {download.pdfFileName}
                </p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                    onClick={() => onEdit(download)}
                    className="text-sm bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                    title="Edit Item"
                >
                    <Icon name="edit" />
                </button>
                <button
                    onClick={() => onDelete(download.id)}
                    className="text-sm bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
                    title="Delete Item"
                >
                    <Icon name="trash" />
                </button>
            </div>
        </div>
    );
}

const DownloadsManagement: React.FC = () => {
    const { siteData, deleteGeneralDownload } = useApp();
    const { generalDownloads = [] } = siteData;
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingDownload, setEditingDownload] = useState<GeneralDownload | null>(null);

    const handleEdit = (download: GeneralDownload) => {
        setEditingDownload(download);
        setIsFormVisible(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this item? This cannot be undone.')) {
            deleteGeneralDownload(id).catch(err => {
                console.error(err);
                alert('Failed to delete item.');
            });
        }
    };
    
    const handleAddNew = () => {
        setEditingDownload(null);
        setIsFormVisible(true);
    };

    const handleFormFinish = () => {
        setEditingDownload(null);
        setIsFormVisible(false);
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-gray-200">E-Book & Notes Management</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                        <Icon name="plus" className="mr-2" /> Add New Item
                    </button>
                )}
            </div>
           
            <div className="space-y-3">
                {generalDownloads.length > 0 ? (
                    generalDownloads.map(download => (
                        <DownloadItem key={download.id} download={download} onEdit={handleEdit} onDelete={handleDelete} />
                    ))
                ) : (
                    !isFormVisible && <p className="text-gray-500 text-sm text-center py-4">No e-books or notes have been added yet.</p>
                )}
            </div>

             {isFormVisible && (
                <DownloadForm editingDownload={editingDownload} onFinish={handleFormFinish} />
            )}
        </div>
    );
};

export default DownloadsManagement;
