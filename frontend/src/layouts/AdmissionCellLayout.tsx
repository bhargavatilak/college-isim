import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    UserPlus, 
    History,
    LogOut, 
    Menu, 
    X,
    Bell,
    Settings,
    ChevronDown,
    Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/glb-logo.png';

export const AdmissionCellLayout: React.FC = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admission-cell/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admission-cell/new-registration', icon: <UserPlus size={20} />, label: 'New Registration' },
        { path: '/admission-cell/resume', icon: <History size={20} />, label: 'Resume Registration' },
        { path: '/admission-cell/merit-selection', icon: <Award size={20} />, label: 'Merit / Selection' },
    ];

    return (
        <div className="h-screen overflow-hidden bg-gray-50 flex font-sans print:h-auto print:overflow-visible">
            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col print:hidden ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 lg:static`}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-4 bg-slate-950/50 border-b border-slate-800">
                    <div className="w-8 h-8 bg-white rounded p-1 mr-3 flex-shrink-0">
                        <img src={logoImage} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="font-bold text-lg truncate tracking-tight text-white">GL Bajaj</h1>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Admission Cell</p>
                    </div>
                    {/* Mobile close button */}
                    <button 
                        className="ml-auto lg:hidden text-slate-400 hover:text-white"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2.5 rounded-lg transition-colors group text-sm font-medium ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible print:block">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 print:hidden">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden mr-4"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
                            Admission Cell Portal
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="text-gray-400 hover:text-gray-600 relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center space-x-2 focus:outline-none pl-2 border-l border-gray-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                    AC
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-700 leading-tight">Admissions</p>
                                    <p className="text-xs text-gray-500">Admission Cell</p>
                                </div>
                                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                                        <p className="text-sm font-medium text-gray-900">Admissions</p>
                                        <p className="text-xs text-gray-500 truncate">admissions@glb.edu</p>
                                    </div>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                    <button 
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content scrollable area */}
                <main className="flex-1 overflow-auto print:overflow-visible bg-slate-50/50 p-4 sm:p-6 lg:p-8 print:p-0 print:bg-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
