import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    User, 
    BookOpen, 
    Users,
    Calendar,
    CheckSquare,
    ClipboardList,
    FileText,
    MessageSquare,
    AlertCircle,
    Bell,
    CheckCircle2,
    LogOut
} from 'lucide-react';
import classNames from 'classnames';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { name: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/faculty/profile', icon: User },
    { name: 'My Subjects', path: '/faculty/subjects', icon: BookOpen },
    { name: 'My Classes', path: '/faculty/classes', icon: Users },
    { name: 'Timetable', path: '/faculty/timetable', icon: Calendar },
    { name: 'Attendance', path: '/faculty/attendance', icon: CheckSquare },
    { name: 'Assignments', path: '/faculty/assignments', icon: ClipboardList },
    { name: 'Marks & UFM', path: '/faculty/marks', icon: FileText },
    { name: 'Faculty Feedback', path: '/faculty/feedback', icon: MessageSquare },
    { name: 'Complaints', path: '/faculty/complaints', icon: AlertCircle }
];

export const FacultySidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-slate-900 text-slate-300 h-screen overflow-y-auto flex flex-col justify-between hidden md:flex shrink-0">
            <div className="py-4">
                <div className="px-4 mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        GL
                    </div>
                    <div>
                        <h2 className="font-bold text-sm text-white leading-tight">Faculty Portal</h2>
                    </div>
                </div>
                <nav className="space-y-1 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    classNames(
                                        'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                                        isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
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
            <div className="p-4 border-t border-slate-800 sticky bottom-0 bg-slate-900">
                <NavLink to="/faculty/attendance" className="w-full flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-medium text-sm transition-colors border border-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-400" /> Start Smart Attendance
                </NavLink>
            </div>
        </aside>
    );
};

export const FacultyLayout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <FacultySidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0">
                    <h1 className="font-semibold text-lg text-gray-800">Faculty Workspace</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                FT
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold leading-tight text-gray-900">Faculty Test User</p>
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
