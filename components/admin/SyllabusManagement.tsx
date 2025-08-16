import React from 'react';
import { useApp } from '../../hooks/useApp';
import Icon from '../common/Icon';
import { Syllabus } from '../../types';
import { useFileUrl } from '../../hooks/useFileUrl';

const SyllabusItem: React.FC<{ syllabus: Syllabus, onEdit: (s: Syllabus) => void, onDelete: (id: number) => void }> = ({ syllabus, onEdit, onDelete }) => {
    const imageUrl = useFileUrl(syllabus.imageKey);
    return (
        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-md border border-gray-600">
            <div className="flex items-center min-w-0 pr-4">
                 <img src={imageUrl || 'https://placehold.co/100x100/1e293b/94a3b8?text=S'} alt={syllabus.title} className="w-12 h-12 rounded-md object-cover mr-4 flex-shrink-0"/>
                 <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate" title={syllabus.title}>{syllabus.title}</p>
                    <p className="text-sm text-gray-400 italic truncate" title={syllabus.description}>
                        {syllabus.description || 'No description'}
                    </p>
                </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                    onClick={() => onEdit(syllabus)}
                    className="text-sm bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                    title="Edit Item"
                >
                    <Icon name="edit" />
                </button>
                <button
                    onClick={() => onDelete(syllabus.id)}
                    className="text-sm bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors"
                    title="Delete Item"
                >
                    <Icon name="trash" />
                </button>
            </div>
        </div>
    );
}

const SyllabusManagement: React.FC<{ onAdd: () => void; onEdit: (syllabus: Syllabus) => void; }> = ({ onAdd, onEdit }) => {
    const { siteData, deleteSyllabus } = useApp();
    const { syllabuses = [] } = siteData;

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this syllabus? This cannot be undone.')) {
            deleteSyllabus(id).catch(err => {
                console.error(err);
                alert('Failed to delete syllabus.');
            });
        }
    };

    return (
         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-gray-200">Syllabus Management</h2>
                <button onClick={onAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center">
                    <Icon name="plus" className="mr-2" /> Add New Syllabus
                </button>
            </div>
           
            <div className="space-y-3">
                {syllabuses.length > 0 ? (
                    syllabuses.map(syllabus => (
                        <SyllabusItem key={syllabus.id} syllabus={syllabus} onEdit={onEdit} onDelete={handleDelete} />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No syllabuses have been added yet.</p>
                )}
            </div>
        </div>
    );
};

export default SyllabusManagement;
