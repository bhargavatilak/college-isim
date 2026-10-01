import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, Clock } from 'lucide-react';
import api from '../../services/api';

export const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/director/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Mock data fallback
            setNotifications([
                { id: 1, title: 'Budget Approval Required', message: 'The CSE department has submitted the Q4 budget for approval.', type: 'WARNING', time: '10 mins ago', read: false },
                { id: 2, title: 'New Faculty Onboarded', message: 'Dr. Smith has successfully completed onboarding for the ECE department.', type: 'SUCCESS', time: '1 hour ago', read: true },
                { id: 3, title: 'System Maintenance', message: 'ERP system will undergo scheduled maintenance this Sunday at 2 AM.', type: 'INFO', time: '2 hours ago', read: true }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await api.patch(`/director/notifications/${id}/read`);
        } catch (error) {
            console.error('Error marking as read:', error);
        } finally {
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.post('/director/notifications/mark-all-read');
        } catch (error) {
            console.error('Error marking all as read:', error);
        } finally {
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="text-green-500" size={20} />;
            case 'WARNING': return <AlertTriangle className="text-amber-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Bell className="text-blue-600" /> Notifications
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Review alerts, updates, and pending actions.</p>
                </div>
                <button 
                    onClick={markAllAsRead}
                    className="bg-white border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                    Mark All as Read
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden max-w-4xl">
                {loading ? (
                    <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notif, idx) => (
                            <div 
                                key={notif.id || idx} 
                                className={`p-4 flex gap-4 transition-colors hover:bg-gray-50 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                            >
                                <div className="mt-1 flex-shrink-0">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-medium ${!notif.read ? 'text-gray-900 font-bold' : 'text-gray-700'}`}>
                                            {notif.title}
                                        </h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap ml-4">
                                            <Clock size={12} /> {notif.time}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{notif.message}</p>
                                    
                                    {!notif.read && (
                                        <div className="mt-2">
                                            <button 
                                                onClick={() => markAsRead(notif.id)}
                                                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                                            >
                                                Mark as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                <Bell className="text-gray-300 mb-2" size={32} />
                                <p>You're all caught up!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
