import React, { useState } from 'react';
import { Bell, Send } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const Notifications: React.FC = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [studentId, setStudentId] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setStatus({ type: null, msg: '' });

        const { error } = await supabase
            .from('student_notifications')
            .insert({
                title,
                message,
                student_id: studentId || null, // null for broadcast if your schema supports it
                is_read: false
            });

        setSending(false);
        if (error) {
            setStatus({ type: 'error', msg: error.message });
        } else {
            setStatus({ type: 'success', msg: 'Notification sent successfully!' });
            setTitle('');
            setMessage('');
            setStudentId('');
        }
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900">Send Notification</h2>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <Bell className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">New Notification</h3>
                        <p className="text-sm text-gray-500">Send a targeted or broadcast message to students.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {status.type && (
                        <div className={`p-4 rounded-md text-sm ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                            {status.msg}
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Student ID (Leave blank to broadcast)</label>
                        <input
                            type="text"
                            id="studentId"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="e.g. STU12345"
                        />
                    </div>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            id="title"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Notification Title"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            id="message"
                            required
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Write your message here..."
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={sending}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            {sending ? 'Sending...' : 'Send Notification'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
