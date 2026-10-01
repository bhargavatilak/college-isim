import React from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, User, BookOpen, FileText, 
    MessageSquare, Award, CreditCard, Settings, 
    Shield, Bell, Activity, ClipboardList,
    ArrowLeft
} from 'lucide-react';

export const WebManageLayout: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const menuItems = [
        { path: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { path: 'personal', icon: User, label: 'Personal Info' },
        { path: 'academic', icon: BookOpen, label: 'Academic Record' },
        { path: 'documents', icon: FileText, label: 'Documents' },
        { path: 'requests', icon: MessageSquare, label: 'Requests' },
        { path: 'certificates', icon: Award, label: 'Certificates' },
        { path: 'id-card', icon: CreditCard, label: 'ID Card' },
        { path: 'portal-mgmt', icon: Settings, label: 'Portal Mgmt' },
        { path: 'permissions', icon: Shield, label: 'Permissions' },
        { path: 'notifications', icon: Bell, label: 'Notifications' },
        { path: 'activity', icon: Activity, label: 'Activity Log' },
        { path: 'audit', icon: ClipboardList, label: 'Audit Trail' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(`/registrar/students/profile/${id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Student Portal Management</h1>
                        <p className="text-sm text-gray-500">Managing portal access and data for student ID: {id}</p>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
                    <nav className="p-4 space-y-1">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={`/registrar/students/web-manage/${id}/${item.path}`}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
