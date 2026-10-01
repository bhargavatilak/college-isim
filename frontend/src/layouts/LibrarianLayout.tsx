import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
    Library, 
    PlusCircle, 
    ArrowUpRight, 
    ArrowDownLeft,
    Users,
    IndianRupee,
    ScanLine,
    BarChart3,
    Bell,
    LogOut
} from 'lucide-react';
import classNames from 'classnames';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { name: 'Book Management', path: '/librarian/books', icon: Library },
    { name: 'Add Book', path: '/librarian/add-book', icon: PlusCircle },
    { name: 'Book Issue', path: '/librarian/issue', icon: ArrowUpRight },
    { name: 'Book Return', path: '/librarian/return', icon: ArrowDownLeft },
    { name: 'Members', path: '/librarian/members', icon: Users },
    { name: 'Fine Management', path: '/librarian/fines', icon: IndianRupee },
    { name: 'ISBN Scanner', path: '/librarian/scanner', icon: ScanLine },
    { name: 'Reports', path: '/librarian/reports', icon: BarChart3 }
];

export const LibrarianSidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-white border-r h-screen overflow-y-auto flex flex-col justify-between hidden md:flex shrink-0">
            <div className="py-4">
                <div className="px-4 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        GL
                    </div>
                    <div>
                        <h2 className="font-bold text-sm text-gray-900 leading-tight">Librarian Portal</h2>
                    </div>
                </div>
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    classNames(
                                        'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                                        isActive ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                                    )
                                }
                            >
                                <Icon size={18} />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t sticky bottom-0 bg-white">
                <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2 rounded-lg font-medium text-sm transition-colors shadow-sm">
                    🤖 AI Assistant
                </button>
            </div>
        </aside>
    );
};

export const LibrarianLayout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <LibrarianSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0">
                    <h1 className="font-semibold text-lg text-gray-800">Librarian Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                LB
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
