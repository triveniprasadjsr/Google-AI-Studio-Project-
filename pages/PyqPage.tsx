import React from 'react';
import Icon from '../components/common/Icon';

const PyqPage: React.FC = () => {
    // Placeholder content - In a real app, this would be fetched from state or an API
    const pyqs: any[] = []; 

    return (
        <div className="p-4 md:p-8 bg-gray-900 text-white min-h-full">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Previous Year Questions (PYQ)</h1>
                <p className="text-lg text-gray-400">Enhance your preparation by practicing with our collection of previous year question papers.</p>
            </header>

            {pyqs.length > 0 ? (
                 <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                     <div className="divide-y divide-gray-700">
                         {/* Example of how items would be rendered */}
                         {/* {pyqs.map(pyq => <PyqRow key={pyq.id} pyq={pyq} />)} */}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 text-gray-500 bg-gray-800 rounded-lg border border-gray-700">
                    <Icon name="box-open" className="fa-3x mb-4 text-gray-600" />
                    <h2 className="text-2xl font-semibold">No PYQs Available Yet</h2>
                    <p className="mt-2">Previous year question papers will be uploaded soon. Please check back later.</p>
                </div>
            )}
        </div>
    );
};

export default PyqPage;