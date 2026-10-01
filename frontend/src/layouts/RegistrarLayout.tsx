import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { RegistrarSidebar } from '../components/RegistrarSidebar';
import { useAuth } from '../context/AuthContext';

export const RegistrarLayout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <RegistrarSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0">
                    <h1 className="font-semibold text-lg text-gray-800">Registrar Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                RG
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors ml-2"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
