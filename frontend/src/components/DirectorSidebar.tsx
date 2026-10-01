import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Building2,
    Users, 
    GraduationCap, 
    Briefcase,
    BarChart3,
    Settings,
    FileText,
    Calendar,
    ClipboardCheck,
    CreditCard,
    Library,
    UserPlus,
    Megaphone,
    Bell
} from 'lucide-react';
import classNames from 'classnames';

const navItems = [
    { name: 'Institution Overview', path: '/director/dashboard', icon: LayoutDashboard },
    { name: 'Departments', path: '/director/departments', icon: Building2 },
    { name: 'HOD Management', path: '/director/hods', icon: Briefcase, badge: 'Admin', badgeColor: 'bg-red-100 text-red-700' },
    { name: 'Faculty Overview', path: '/director/faculty', icon: Users },
    { name: 'Student Overview', path: '/director/students', icon: GraduationCap },
    { name: 'Academic Management', path: '/director/academics', icon: Calendar },
    { name: 'Attendance Overview', path: '/director/attendance', icon: ClipboardCheck },
    { name: 'Examination Overview', path: '/director/examinations', icon: FileText },
    { name: 'Finance Overview', path: '/director/finance', icon: CreditCard },
    { name: 'Library Overview', path: '/director/library', icon: Library },
    { name: 'Admission Overview', path: '/director/admission', icon: UserPlus },
    { name: 'Reports & Analytics', path: '/director/reports', icon: BarChart3 },
    { name: 'Policy Documents', path: '/director/policies', icon: FileText },
    { name: 'Announcements', path: '/director/announcements', icon: Megaphone },
    { name: 'Notifications', path: '/director/notifications', icon: Bell },
    { name: 'Settings', path: '/director/settings', icon: Settings }
];

export const DirectorSidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-white border-r h-screen overflow-y-auto flex flex-col justify-between hidden md:flex shrink-0">
            <div className="py-4">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    classNames(
                                        'flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors',
                                        isActive ? 'bg-blue-600 text-white rounded-r-full mr-4 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                                    )
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className={classNames(
                                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                                        'bg-blue-100 text-blue-700'
                                    )}>
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
            <div className="p-4 border-t sticky bottom-0 bg-white">
                <NavLink
                    to="/director/ai"
                    className={({ isActive }) => classNames(
                        "w-full flex justify-center items-center gap-2 py-2 rounded-full font-medium text-sm transition-colors shadow-sm",
                        isActive ? "bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    )}
                >
                    <span className="text-yellow-300">✨</span> Ask ERP AI
                </NavLink>
            </div>
        </aside>
    );
};
