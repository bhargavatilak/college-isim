import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, X, Power } from 'lucide-react';
import api from '../../services/api';

export const HODs: React.FC = () => {
    const [hods, setHods] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        hodId: '',
        email: '',
        mobile: '',
        department: '',
        qualification: '',
        experience: '',
        joiningDate: ''
    });

    useEffect(() => {
        fetchHods();
        fetchDepartments();
    }, []);

    const fetchHods = async () => {
        try {
            setLoading(true);
            const response = await api.get('/director/hods');
            setHods(response.data);
        } catch (error) {
            console.error('Error fetching HODs:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/director/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/director/hods', formData);
            setIsModalOpen(false);
            setFormData({
                fullName: '',
                hodId: '',
                email: '',
                mobile: '',
                department: '',
                qualification: '',
                experience: '',
                joiningDate: ''
            });
            fetchHods();
        } catch (error) {
            console.error('Error creating HOD:', error);
        }
    };

    const toggleStatus = async (id: number, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await api.patch(`/director/hods/${id}/status`, { status: newStatus });
            fetchHods();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="text-blue-600" /> HOD Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage Heads of Departments across the institution.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm transition-colors"
                >
                    <Plus size={18} /> Add HOD
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search HODs..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">HOD Info</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Experience</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hods.map((hod, idx) => (
                                <tr key={hod.id || idx} className="border-t hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{hod.fullName}</div>
                                        <div className="text-xs text-gray-500">{hod.hodId}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700">{hod.department}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{hod.email}</div>
                                        <div className="text-xs text-gray-500">{hod.mobile}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{hod.experience} Years</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${hod.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {hod.status || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => toggleStatus(hod.id, hod.status || 'ACTIVE')}
                                            className={`flex items-center gap-1 justify-end w-full text-xs font-medium ${hod.status === 'ACTIVE' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                                        >
                                            <Power size={14} /> {hod.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {hods.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No HODs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden max-h-full flex flex-col">
                        <div className="px-6 py-4 border-b flex items-center justify-between shrink-0">
                            <h2 className="text-lg font-bold text-gray-900">Add New HOD</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6">
                            <form id="add-hod-form" onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">HOD ID</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData.hodId}
                                            onChange={(e) => setFormData({...formData, hodId: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                            value={formData.department}
                                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept, idx) => (
                                                <option key={dept.id || idx} value={dept.name}>{dept.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData.qualification}
                                            onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                                        <input 
                                            type="number" 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
                                        <input 
                                            type="date" 
                                            required
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={formData.joiningDate}
                                            onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="px-6 py-4 border-t bg-gray-50 flex gap-3 justify-end shrink-0">
                            <button 
                                type="button" 
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-200 font-medium text-sm transition-colors bg-white"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                form="add-hod-form"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                            >
                                Create HOD
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
