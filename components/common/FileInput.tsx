import React, { useState, ChangeEvent, useRef } from 'react';
import Icon from './Icon';

interface FileInputProps {
    id: string;
    label: string;
    accept: string;
    onChange: (file: File | null) => void;
    buttonText?: string;
}

const FileInput: React.FC<FileInputProps> = ({ id, label, accept, onChange, buttonText = "Choose File" }) => {
    const [fileName, setFileName] = useState<string>('No file chosen');
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileName(file ? file.name : 'No file chosen');
        onChange(file);
    };

    return (
        <div className="file-input-wrapper">
             <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
             <div className="mt-1 flex items-center">
                <label
                    htmlFor={id}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition cursor-pointer font-medium text-sm flex items-center file-input-label"
                >
                    <Icon name="upload" className="mr-2" />
                    {buttonText}
                </label>
                <input
                    type="file"
                    id={id}
                    ref={inputRef}
                    accept={accept}
                    onChange={handleFileChange}
                    className="custom-file-input"
                />
                 <span className="file-input-filename ml-4 text-sm text-gray-400 italic">{fileName}</span>
            </div>
        </div>
    );
};

export default FileInput;