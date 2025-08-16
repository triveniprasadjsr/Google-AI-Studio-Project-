import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import Icon from '../common/Icon';
import { NavItem } from '../../types';

const SidebarManagement: React.FC = () => {
    const { siteData, updateNavItemsOrder } = useApp();
    const [items, setItems] = useState<NavItem[]>([]);
    const [hasChanged, setHasChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    useEffect(() => {
        // Initialize and sort items when component mounts or siteData changes
        const sortedItems = [...(siteData.navItems || [])].sort((a, b) => a.order - b.order);
        setItems(sortedItems);
        setHasChanged(false); // Reset changed status when data is reloaded
    }, [siteData.navItems]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        dragOverItem.current = index;
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // This is necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
            return;
        }

        const newItems = [...items];
        const draggedItemContent = newItems.splice(dragItem.current, 1)[0];
        newItems.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = null;
        dragOverItem.current = null;
        
        setItems(newItems);
        setHasChanged(true);
        setFeedback(null);
    };
    
    const handleSaveChanges = () => {
        setIsLoading(true);
        setFeedback(null);
        try {
            updateNavItemsOrder(items);
            setHasChanged(false);
            setFeedback({ message: "Order saved! Changes are now live on the site.", type: 'success' });
            setTimeout(() => setFeedback(null), 5000);
        } catch (error) {
            console.error("Failed to save order", error);
            setFeedback({ message: "Error saving order. Please try again.", type: 'error' });
            setTimeout(() => setFeedback(null), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
             <h2 className="text-2xl font-bold text-gray-200 mb-6 border-b border-gray-700 pb-4">Sidebar Menu Arrangement</h2>
            <div className="space-y-4">
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-sm">
                        <Icon name="info-circle" className="mr-2" />
                        Drag and drop the items below to reorder them in the main sidebar menu. Click 'Save Order' to apply your changes.
                    </p>
                </div>

                <div className="space-y-2" onDragOver={handleDragOver}>
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="flex items-center p-3 bg-gray-700 rounded-md border-2 border-transparent cursor-grab active:cursor-grabbing hover:bg-gray-600 transition-colors"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDrop={handleDrop}
                        >
                            <Icon name="grip-vertical" className="mr-4 text-gray-500" />
                            <Icon name={item.icon} className="mr-3 text-indigo-400 w-5" />
                            <span className="font-semibold text-white">{item.name}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end items-center border-t border-gray-700 pt-4 mt-6 min-h-[40px]">
                    {feedback && (
                        <div className={`text-sm mr-auto transition-opacity duration-300 ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            <Icon name={feedback.type === 'success' ? 'check-circle' : 'exclamation-triangle'} className="mr-2" />
                            {feedback.message}
                        </div>
                    )}
                    <button
                        onClick={handleSaveChanges}
                        disabled={!hasChanged || isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center"
                    >
                         {isLoading && <Icon name="spinner" className="animate-spin mr-2" />}
                        {hasChanged ? 'Save Order' : 'Order Saved'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarManagement;
