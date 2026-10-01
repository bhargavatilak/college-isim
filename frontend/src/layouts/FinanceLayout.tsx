import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Settings,
    Users,
    UserCheck,
    Clock,
    CreditCard,
    Receipt,
    Undo2,
    BarChart3,
    Bell
} from 'lucide-react';
import classNames from 'classnames';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', path: '/finance/dashboard', icon: LayoutDashboard },
    { name: 'Fee Structure', path: '/finance/structure', icon: Settings },
    { name: 'Student Fees', path: '/finance/student-fees', icon: Users },
    { name: 'Paid Students', path: '/finance/paid', icon: UserCheck },
    { name: 'Pending Fees', path: '/finance/pending', icon: Clock },
    { name: 'Payment', path: '/finance/payment', icon: CreditCard },
    { name: 'Receipts', path: '/finance/receipts', icon: Receipt },
    { name: 'Refunds', path: '/finance/refunds', icon: Undo2 },
    { name: 'Reports', path: '/finance/reports', icon: BarChart3 }
];

export const FinanceSidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-emerald-900 text-emerald-50 h-screen overflow-y-auto flex flex-col justify-between hidden md:flex shrink-0">
            <div className="py-4">
                <div className="px-4 mb-6 flex items-center gap-3 border-b border-emerald-800 pb-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                        GL
                    </div>
                    <div>
                        <h2 className="font-bold text-sm text-white leading-tight">Finance Portal</h2>
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
                                        isActive ? 'bg-emerald-700 text-white shadow-sm' : 'hover:bg-emerald-800 hover:text-white text-emerald-200'
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

export const FinanceLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <FinanceSidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b h-16 flex items-center justify-between px-6 shrink-0">
                    <h1 className="font-semibold text-lg text-gray-800">Finance & Accounts</h1>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                {user ? user.email.charAt(0).toUpperCase() : 'F'}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold leading-tight text-gray-900">{user ? user.email : 'Finance User'}</p>
                                <p className="text-xs text-gray-500 uppercase">{user ? user.roles[0].replace('ROLE_', '') : 'Finance'}</p>
                            </div>
                            <button onClick={handleLogout} className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                <LogOut size={18} />
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
