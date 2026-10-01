import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Save, UserPlus, Building, Mail, Phone, Calendar } from 'lucide-react';

export const FacultyRegistration: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        date_of_joining: '',
        qualification: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [departments, setDepartments] = useState<any[]>([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            const { data } = await supabase.from('departments').select('*');
            if (data) setDepartments(data);
        };
        fetchDepartments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Generate a simple Faculty ID for prototype
        const faculty_id = `FAC-${Math.floor(1000 + Math.random() * 9000)}`;

        try {
            const { error } = await supabase
                .from('faculty')
                .insert([
                    {
                        ...formData,
                        faculty_id,
                        status: 'ACTIVE'
                    }
                ]);

            if (error) throw error;

            setMessage(`Successfully registered faculty with ID: ${faculty_id}`);
            setFormData({
                name: '',
                email: '',
                phone: '',
                department: '',
                date_of_joining: '',
                qualification: '',
            });
        } catch (err: any) {
            console.error(err);
            setMessage(`Error: ${err.message || 'Failed to register'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Faculty Registration</h1>
                <p className="text-gray-500">Register a new faculty member into the system.</p>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <UserPlus size={20} className="text-purple-600" />
                        Personal Information
                    </h2>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            placeholder="e.g. Dr. Jane Smith"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                placeholder="jane.smith@isim.edu"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                required
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
                        <input
                            required
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            placeholder="e.g. Ph.D. in Computer Science"
                        />
                    </div>
                </div>

                <div className="p-6 border-y border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <Building size={20} className="text-purple-600" />
                        Academic Assignment
                    </h2>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                            required
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-white"
                        >
                            <option value="">Select Department...</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.name || d.department_name}>{d.name || d.department_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                required
                                type="date"
                                name="date_of_joining"
                                value={formData.date_of_joining}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button type="button" className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        <Save size={18} />
                        {loading ? 'Registering...' : 'Register Faculty'}
                    </button>
                </div>
            </form>
        </div>
    );
};
