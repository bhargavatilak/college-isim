import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b h-16 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-md lg:hidden">
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        GL
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-tight text-gray-900 leading-tight">GL BAJAJ GROUP OF INSTITUTIONS</h1>
                        <p className="text-xs text-gray-500">Mathura</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center text-sm border rounded-full px-3 py-1 shadow-sm">
                    <span className="text-gray-500 mr-2">Academic Year:</span>
                    <span className="font-semibold text-amber-700">2023-24</span>
                </div>
                
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {user ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold leading-tight text-gray-900">{user ? user.email : 'User'}</p>
                        <p className="text-xs text-gray-500 uppercase">{user ? user.roles[0].replace('ROLE_', '') : 'Role'}</p>
                    </div>
                    <button onClick={handleLogout} className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};
