import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { User, Mail, Phone, Activity } from 'lucide-react';

export const Overview: React.FC = () => {
    const { id } = useParams();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
                if (error) throw error;
                setStudent(data);
            } catch (error) {
                console.error('Error fetching student:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading overview...</div>;
    if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Portal Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <User size={40} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{student.first_name} {student.last_name}</h3>
                                <p className="text-gray-500">Admission No: {student.admission_number || 'N/A'}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active Portal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-400" />
                            Portal Usage Activity
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Last Login</div>
                                <div className="font-medium text-gray-900 mt-1">Today, 09:41 AM</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-500">Pending Requests</div>
                                <div className="font-medium text-gray-900 mt-1">0</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Contact Info</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-700">{student.email || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span className="text-sm text-gray-700">{student.phone || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
