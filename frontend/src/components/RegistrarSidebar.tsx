import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  UserCheck,
  Folder,
  IdCard,
  BookOpen,
  Calendar,
  Activity,
  FileBadge,
  Building2,
  GraduationCap,
  BarChart3,
  Megaphone,
  Bell,
  KeyRound,
  Settings,
  Bot,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import classNames from 'classnames';

type NavItem = {
    name: string;
    path: string;
    icon: React.ElementType;
    subItems?: { name: string; path: string; }[];
};

const navItems: NavItem[] = [
    { name: 'Registrar Overview', path: '/registrar/dashboard', icon: LayoutDashboard },
    { 
        name: 'Admissions', 
        path: '/registrar/admissions', 
        icon: UserPlus,
        subItems: [
            { name: 'Applications', path: '/registrar/admissions/applications' },
            { name: 'Approval', path: '/registrar/admissions/approval' },
            { name: 'History', path: '/registrar/admissions/history' },
        ]
    },
    { 
        name: 'Student Management', 
        path: '/registrar/students', 
        icon: Users,
        subItems: [
            { name: 'Directory', path: '/registrar/students/directory' },
            { name: 'Profile', path: '/registrar/students/profile' },
            { name: 'Status', path: '/registrar/students/status' },
            { name: 'Transfer', path: '/registrar/students/transfer' },
        ]
    },
    { 
        name: 'Student Verification', 
        path: '/registrar/verification', 
        icon: UserCheck,
        subItems: [
            { name: 'Pending', path: '/registrar/verification/pending' },
            { name: 'Verified', path: '/registrar/verification/verified' },
            { name: 'History', path: '/registrar/verification/history' },
        ]
    },
    { 
        name: 'Document Management', 
        path: '/registrar/documents', 
        icon: Folder,
        subItems: [
            { name: 'Student Documents', path: '/registrar/documents/student' },
            { name: 'Document Verification', path: '/registrar/documents/verification' },
            { name: 'Missing Documents', path: '/registrar/documents/missing' },
        ]
    },
    { 
        name: 'ID & Identity', 
        path: '/registrar/identity', 
        icon: IdCard,
        subItems: [
            { name: 'ID Card', path: '/registrar/identity/card' },
            { name: 'Bulk Generation', path: '/registrar/identity/bulk' },
            { name: 'Replacement', path: '/registrar/identity/replacement' },
            { name: 'History', path: '/registrar/identity/history' },
        ]
    },
    { 
        name: 'Academic Records', 
        path: '/registrar/academic-records', 
        icon: BookOpen,
        subItems: [
            { name: 'Student Record', path: '/registrar/academic-records/student' },
            { name: 'Semester Record', path: '/registrar/academic-records/semester' },
            { name: 'Attendance Record', path: '/registrar/academic-records/attendance' },
            { name: 'Result Record', path: '/registrar/academic-records/result' },
            { name: 'History', path: '/registrar/academic-records/history' },
        ]
    },
    { 
        name: 'Academic Registration', 
        path: '/registrar/academic-registration', 
        icon: Calendar,
        subItems: [
            { name: 'Semester', path: '/registrar/academic-registration/semester' },
            { name: 'Subject', path: '/registrar/academic-registration/subject' },
            { name: 'Section', path: '/registrar/academic-registration/section' },
            { name: 'History', path: '/registrar/academic-registration/history' },
        ]
    },
    { 
        name: 'Certificates', 
        path: '/registrar/certificates', 
        icon: FileBadge,
        subItems: [
            { name: 'Requests', path: '/registrar/certificates/requests' },
            { name: 'Bonafide', path: '/registrar/certificates/bonafide' },
            { name: 'Character', path: '/registrar/certificates/character' },
            { name: 'Transfer', path: '/registrar/certificates/transfer' },
            { name: 'Migration', path: '/registrar/certificates/migration' },
            { name: 'Provisional', path: '/registrar/certificates/provisional' },
            { name: 'Transcript', path: '/registrar/certificates/transcript' },
            { name: 'History', path: '/registrar/certificates/history' },
        ]
    },
    { name: 'University / Affiliation', path: '/registrar/university', icon: Building2 },
    { name: 'Convocation', path: '/registrar/convocation', icon: GraduationCap },
    { name: 'Reports & Analytics', path: '/registrar/reports', icon: BarChart3 },
    { 
        name: 'Institution Management', 
        path: '/registrar/institution', 
        icon: Building2,
        subItems: [
            { name: 'Departments', path: '/registrar/institution/departments' },
            { name: 'Programs', path: '/registrar/institution/programs' },
            { name: 'Subjects', path: '/registrar/institution/subjects' },
            { name: 'Academic Years', path: '/registrar/institution/academic-years' },
            { name: 'Semesters', path: '/registrar/institution/semesters' },
            { name: 'Sections', path: '/registrar/institution/sections' },
            { name: 'Academic Calendar', path: '/registrar/institution/calendar' },
            { name: 'Structure History', path: '/registrar/institution/history' },
        ]
    },
    { 
        name: 'Faculty & HOD', 
        path: '/registrar/faculty-hod', 
        icon: Users,
        subItems: [
            { name: 'Faculty Directory', path: '/registrar/faculty-hod/directory' },
            { name: 'HOD Management', path: '/registrar/faculty-hod/hod-management' },
        ]
    },
    { name: 'Announcements', path: '/registrar/announcements', icon: Megaphone },
    { name: 'Notifications', path: '/registrar/notifications', icon: Bell },
    { name: 'Settings', path: '/registrar/settings', icon: Settings },
];

const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
    const location = useLocation();
    const isSubActive = item.subItems?.some(subItem => location.pathname.startsWith(subItem.path));
    const [isOpen, setIsOpen] = useState(isSubActive || false);
    const Icon = item.icon;

    if (item.subItems) {
        return (
            <div className="flex flex-col">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={classNames(
                        "flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors",
                        isSubActive ? "text-purple-700 bg-purple-50/50" : "text-gray-600 hover:bg-gray-50"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.name}</span>
                    </div>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isOpen && (
                    <div className="flex flex-col bg-gray-50/30 py-1 space-y-0.5">
                        {item.subItems.map((subItem) => (
                            <NavLink
                                key={subItem.path}
                                to={subItem.path}
                                className={({ isActive }) =>
                                    classNames(
                                        'pl-11 pr-4 py-2 text-sm transition-colors',
                                        isActive
                                            ? 'text-purple-700 font-medium bg-purple-50 border-r-2 border-purple-600'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                                    )
                                }
                            >
                                {subItem.name}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                classNames(
                    'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                        ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                )
            }
        >
            <Icon size={18} />
            <span>{item.name}</span>
        </NavLink>
    );
};

export const RegistrarSidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-white border-r h-screen flex flex-col hidden md:flex shrink-0">
            <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                        R
                    </div>
                    <div>
                        <h2 className="font-bold text-sm text-gray-900 leading-tight">Registrar Portal</h2>
                        <p className="text-xs text-gray-500">ISIM University</p>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200">
                <nav className="space-y-0.5">
                    {navItems.map((item) => (
                        <NavItemComponent key={item.path} item={item} />
                    ))}
                </nav>
            </div>

            <div className="p-4 border-t bg-gray-50">
                <NavLink
                    to="/registrar/ai"
                    className={({ isActive }) =>
                        classNames(
                            'w-full flex justify-center items-center gap-2 py-2 rounded-lg font-medium text-sm transition-all shadow-sm',
                            isActive
                                ? 'bg-purple-700 text-white'
                                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        )
                    }
                >
                    <Bot size={18} />
                    AI Assistant
                </NavLink>
            </div>
        </aside>
    );
};
