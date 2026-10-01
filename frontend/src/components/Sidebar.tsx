import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    FileText, 
    Users, 
    UserCheck, 
    List, 
    ClipboardList,
    BookOpen,
    GraduationCap,
    MessageSquare,
    UsersRound,
    CheckSquare,
    AlertCircle,
    BarChart3
} from 'lucide-react';
import classNames from 'classnames';

const navItems = [
    { name: 'Department Cockpit', path: '/hod/dashboard', icon: LayoutDashboard },
    { name: 'Semester Registration', path: '/hod/registrations', icon: FileText, badge: 'Workflow', active: true },
    { name: 'Section Management', path: '/hod/sections', icon: Users, badge: 'Exclusive', badgeColor: 'bg-yellow-100 text-yellow-700' },
    { name: 'Class Coordinators', path: '/hod/coordinators', icon: UserCheck, badge: 'New', badgeColor: 'bg-yellow-100 text-yellow-700' },
    { name: 'Student Roster', path: '/hod/students', icon: List },
    { name: 'Student Leave App...', path: '/hod/leaves', icon: ClipboardList, badge: 'Leave', badgeColor: 'bg-yellow-100 text-yellow-700' },
    { name: 'Subject Allocation', path: '/hod/subjects', icon: BookOpen },
    { name: 'Exam Management', path: '/hod/exams', icon: GraduationCap },
    { name: 'Faculty Feedback', path: '/hod/feedback', icon: MessageSquare },
    { name: 'Department Faculty', path: '/hod/faculty', icon: UsersRound },
    { name: 'Attendance Oversight', path: '/hod/attendance', icon: CheckSquare },
    { name: 'Department Com...', path: '/hod/complaints', icon: AlertCircle, badge: 'Review', badgeColor: 'bg-yellow-100 text-yellow-700' },
    { name: 'Department Reports', path: '/hod/reports', icon: BarChart3 }
];

export const Sidebar: React.FC = () => {
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
                                        item.active || isActive ? 'bg-blue-600 text-white rounded-r-full mr-4 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
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
                                        item.active ? 'bg-blue-500 text-white' : (item.badgeColor || 'bg-blue-100 text-blue-700')
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
                <button className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full font-medium text-sm transition-colors shadow-sm">
                    <span className="text-yellow-300">✨</span> Ask ERP AI
                </button>
            </div>
        </aside>
    );
};
