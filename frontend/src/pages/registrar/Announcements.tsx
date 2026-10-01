import React, { useState, useEffect } from 'react';
import { Megaphone, Search, Plus, X, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const Announcements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        audience: '',
        priority: 'NORMAL'
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data, error: fetchError } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setAnnouncements(data || []);
        } catch (error: any) {
            console.error('Error fetching announcements:', error);
            setError(error.message || 'Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError(null);
            const { data, error: insertError } = await supabase
                .from('announcements')
                .insert([formData])
                .select();

            if (insertError) throw insertError;

            setIsModalOpen(false);
            setFormData({ title: '', content: '', audience: '', priority: 'NORMAL' });
            if (data) {
                setAnnouncements([data[0], ...announcements]);
            } else {
                fetchAnnouncements();
            }
        } catch (error: any) {
            console.error('Error creating announcement:', error);
            setError(error.message || 'Failed to create announcement');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;
        try {
            setError(null);
            const { error: deleteError } = await supabase
                .from('announcements')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            setAnnouncements(announcements.filter(a => a.id !== id));
        } catch (error: any) {
            console.error('Error deleting announcement:', error);
            setError(error.message || 'Failed to delete announcement');
        }
    };

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Megaphone className="text-indigo-600" /> Announcements
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and broadcast academic and administrative announcements.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors"
                >
                    <Plus size={18} /> New Announcement
                </button>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
                    <AlertCircle className="shrink-0 w-5 h-5 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-sm">Error</h3>
                        <p className="text-sm opacity-90">{error}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search announcements..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <div className="divide-y">
                        {announcements.map((item, idx) => (
                            <div key={item.id || idx} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                                        {item.priority === 'HIGH' && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-md">HIGH PRIORITY</span>
                                        )}
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md border">{item.audience}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-400">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : item.date}
                                        </span>
                                        <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mt-2">{item.content}</p>
                            </div>
                        ))}
                        {announcements.length === 0 && (
                            <div className="p-8 text-center text-gray-500">No announcements found.</div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Create Announcement</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        value={formData.audience}
                                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                                    >
                                        <option value="">Select audience...</option>
                                        <option value="ALL">All Users</option>
                                        <option value="STUDENTS">Students</option>
                                        <option value="FACULTY">Faculty</option>
                                        <option value="ADMISSION_CELL">Admission Cell</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                    >
                                        <option value="NORMAL">Normal</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea 
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        rows={4}
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3 justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
                                >
                                    Publish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
