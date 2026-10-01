import React from 'react';
import { Outlet } from 'react-router-dom';
import { DirectorSidebar } from '../components/DirectorSidebar';
import { Topbar } from '../components/Topbar';

export const DirectorLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <DirectorSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
