import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { BookOpen, GraduationCap, Calendar, Award, Building, Activity } from 'lucide-react';

export const Academic: React.FC = () => {
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
        if (id) fetchStudent();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading academic information...</div>;
    if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Academic Record</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Primary Academic Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-blue-50/50 p-6 border-b border-gray-100 flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{student.program || 'Program Not Assigned'}</h3>
                                <div className="flex items-center gap-2 text-gray-600 mt-2">
                                    <Building className="w-4 h-4" />
                                    <span>{student.department || 'Department Not Assigned'}</span>
                                </div>
                            </div>
                            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                {student.status || 'Active'}
                            </div>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Current Semester</p>
                                <p className="font-semibold text-gray-900 text-lg">{student.current_semester || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Admission Year</p>
                                <p className="font-semibold text-gray-900 text-lg">{student.admission_year || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Enrollment Date</p>
                                <p className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Category</p>
                                <p className="font-semibold text-gray-900 text-lg">{student.category || 'General'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-blue-500" />
                            <h3 className="font-semibold text-gray-900">Performance Summary</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                                <span className="text-gray-600 font-medium">CGPA</span>
                                <span className="text-xl font-bold text-gray-900">{student.cgpa || 'N/A'}</span>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
                                <span className="text-gray-600 font-medium">Credits Earned</span>
                                <span className="text-xl font-bold text-gray-900">{student.credits_earned || '0'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Academic Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-gray-400" />
                            <h3 className="font-semibold text-gray-900">Academic Flags</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Registration Complete</p>
                                    <p className="text-xs text-gray-500">Current semester registration is complete.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">No Backlogs</p>
                                    <p className="text-xs text-gray-500">Student has cleared all previous courses.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
