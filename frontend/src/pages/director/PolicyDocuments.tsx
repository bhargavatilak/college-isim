import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, X, Download } from 'lucide-react';
import api from '../../services/api';

export const PolicyDocuments: React.FC = () => {
    const [policies, setPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: '',
        link: ''
    });

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const response = await api.get('/director/policies');
            setPolicies(response.data);
        } catch (error) {
            console.error('Error fetching policies:', error);
            // Fallback mock data if API fails
            setPolicies([
                { id: 1, title: 'Academic Regulations 2026', type: 'ACADEMIC', description: 'Updated academic rules and regulations.', link: '#', date: '2026-09-01' },
                { id: 2, title: 'HR Policy Handbook', type: 'HR', description: 'Guidelines for faculty and staff.', link: '#', date: '2026-08-15' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/director/policies', formData);
            setIsModalOpen(false);
            setFormData({ title: '', type: '', description: '', link: '' });
            fetchPolicies();
        } catch (error) {
            console.error('Error creating policy:', error);
            // Mock success
            setIsModalOpen(false);
            setPolicies([...policies, { id: Date.now(), ...formData, date: new Date().toISOString().split('T')[0] }]);
            setFormData({ title: '', type: '', description: '', link: '' });
        }
    };

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FileText className="text-blue-600" /> Policy Documents
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and distribute institution-wide policies.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors"
                >
                    <Plus size={18} /> Upload Policy
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search policies..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map((policy, idx) => (
                                <tr key={policy.id || idx} className="border-t hover:bg-gray-50">
                                    <td className="px-6 py-4 font-semibold text-gray-900">{policy.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                            {policy.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{policy.description}</td>
                                    <td className="px-6 py-4 text-gray-500">{policy.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 justify-end w-full">
                                            <Download size={16} /> Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {policies.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No policies found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Upload Policy</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        required
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="">Select type...</option>
                                        <option value="HR">HR</option>
                                        <option value="ACADEMIC">Academic</option>
                                        <option value="ADMINISTRATIVE">Administrative</option>
                                        <option value="STUDENT">Student</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Document Link / URL</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={formData.link}
                                        onChange={(e) => setFormData({...formData, link: e.target.value})}
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
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                                >
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
