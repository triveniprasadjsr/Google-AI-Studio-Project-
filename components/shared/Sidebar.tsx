import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import Icon from '../common/Icon';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { siteData } = useApp();

    const navItems = [...(siteData.navItems || [])].sort((a, b) => a.order - b.order);
    
    const baseClasses = "w-64 bg-gray-800 text-white flex-shrink-0 flex flex-col fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out";
    const openClasses = "translate-x-0";
    const closedClasses = "-translate-x-full";

    return (
        <>
            <aside id="sidebar" className={`${baseClasses} ${isOpen ? openClasses : closedClasses}`}>
                <div className="p-4 text-2xl font-bold border-b border-gray-700">
                    <NavLink to="/" className="text-white" onClick={() => setIsOpen(false)}>{siteData.classroomName}</NavLink>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {navItems.map(item => (
                         <NavLink 
                            key={item.id} 
                            to={item.path} 
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => 
                                `flex items-center px-4 py-2 rounded-md transition-colors ${
                                    isActive 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            <Icon name={item.icon} className="w-6 mr-3" />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default Sidebar;