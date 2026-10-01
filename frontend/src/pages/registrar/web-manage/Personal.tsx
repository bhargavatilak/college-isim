import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { User, Mail, Phone, Calendar, MapPin, Save, Shield } from 'lucide-react';

export const Personal: React.FC = () => {
    const { id } = useParams();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        guardian_name: '',
        guardian_phone: ''
    });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
                if (error) throw error;
                setStudent(data);
                setFormData({
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    guardian_name: data.guardian_name || '',
                    guardian_phone: data.guardian_phone || ''
                });
            } catch (error) {
                console.error('Error fetching student:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchStudent();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            const { error } = await supabase
                .from('students')
                .update({
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    guardian_name: formData.guardian_name,
                    guardian_phone: formData.guardian_phone,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Personal information updated successfully.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update information.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading personal information...</div>;
    if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Read Only Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Sensitive Information (Read-Only)</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">
                                {student.first_name} {student.last_name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Admission Number</label>
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                {student.admission_number || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editable Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <User className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">Contact & Guardian Info</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                <input 
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                            <input 
                                type="text"
                                name="guardian_name"
                                value={formData.guardian_name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
                            <input 
                                type="text"
                                name="guardian_phone"
                                value={formData.guardian_phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="relative">
                                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <textarea 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
