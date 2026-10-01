import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Settings,
    CalendarClock,
    FileEdit,
    UserCheck,
    CreditCard,
    MessageSquare,
    FileText,
    GraduationCap,
    AlertOctagon,
    Award,
    BarChart,
    Bell,
    LogOut
} from 'lucide-react';
import classNames from 'classnames';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { name: 'Dashboard', path: '/examination/dashboard', icon: LayoutDashboard },
    { name: 'Exam Setup', path: '/examination/setup', icon: Settings },
    { name: 'Exam Schedule', path: '/examination/schedule', icon: CalendarClock },
    { name: 'Exam Registration', path: '/examination/registrations', icon: FileEdit },
    { name: 'Exam Eligibility', path: '/examination/eligibility', icon: UserCheck },
    { name: 'Admit Card', path: '/examination/admit-cards', icon: CreditCard },
    { name: 'Faculty Feedback', path: '/examination/feedback', icon: MessageSquare },
    { name: 'Question Paper', path: '/examination/papers', icon: FileText },
    { name: 'Marks', path: '/examination/marks', icon: GraduationCap },
    { name: 'UFM', path: '/examination/ufm', icon: AlertOctagon },
    { name: 'Grade Card', path: '/examination/grade-cards', icon: Award },
    { name: 'Results', path: '/examination/results', icon: BarChart }
];

export const ExaminationSidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-red-900 text-red-50 border-r border-red-800 h-screen overflow-y-auto flex flex-col justify-between hidden md:flex shrink-0">
            <div className="py-4">
                <div className="px-4 mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                        GL
                    </div>
                    <div>
                        <h2 className="font-bold text-sm leading-tight text-white">Examination Cell</h2>
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
                                        isActive ? 'bg-red-800 text-white border-l-4 border-red-400' : 'text-red-200 hover:bg-red-800 hover:text-white'
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
        </aside>
    );
};

export const ExaminationLayout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <ExaminationSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0">
                    <h1 className="font-semibold text-lg text-gray-800">Exam Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold border border-red-200">
                                EX
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold leading-tight text-gray-900">Exam Admin User</p>
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
