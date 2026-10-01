import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, BookOpen, Calendar, Award, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const ApplicationDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                if (!id) return;
                const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
                if (error) throw error;
                
                // Map the DB record to match what the UI expects
                setApplication({
                    id: data.id,
                    applicantName: `${data.first_name} ${data.last_name}`,
                    course: data.program_code || 'Not Selected',
                    submissionDate: new Date(data.created_at).toISOString().split('T')[0],
                    status: data.status || 'Pending',
                    score: 0,
                    email: data.email || 'N/A',
                    phone: data.phone || 'N/A',
                    previousEducation: 'N/A',
                    documentsVerified: true
                });
            } catch (err) {
                console.error('Error fetching student:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 bg-slate-50 min-h-screen flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="p-6 bg-slate-50 min-h-screen flex justify-center items-center">
                <p className="text-gray-500">Student Application Not Found.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="mb-6 flex items-center gap-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Application Details</h1>
                    <p className="text-sm text-slate-500 mt-1">Application ID: {id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Applicant Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <User className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Full Name</p>
                                    <p className="text-slate-900">{application.applicantName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <BookOpen className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Applied Course</p>
                                    <p className="text-slate-900">{application.course}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Submission Date</p>
                                    <p className="text-slate-900">{application.submissionDate}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Award className="text-slate-400 mt-1" size={18} />
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Entrance Score</p>
                                    <p className="text-slate-900">{application.score}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Contact Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Email Address</p>
                                <p className="text-slate-900">{application.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Phone Number</p>
                                <p className="text-slate-900">{application.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 border-b border-slate-100 pb-2">Status overview</h2>
                        <div className="mb-4">
                            <p className="text-sm font-medium text-slate-500 mb-1">Current Status</p>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium inline-block">
                                {application.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Documents</p>
                            <div className="flex items-center gap-2 text-amber-600">
                                <CheckCircle size={16} />
                                <span className="text-sm font-medium">Pending Verification</span>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                Approve Application
                            </button>
                            <button className="w-full py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                                Request More Info
                            </button>
                            <button className="w-full py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                                Reject Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
