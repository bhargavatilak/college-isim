import React, { useState, useEffect } from 'react';
import { FileText, Lock, AlertTriangle, CheckCircle, Download, Printer } from 'lucide-react';
import api from '../../services/api';

export const AdmitCard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [eligibility, setEligibility] = useState<any>(null);

    useEffect(() => {
        // Simulate API call to check eligibility
        setTimeout(() => {
            // Change these values to test different states (Rule #7)
            setEligibility({
                attendance: 72.5, // Needs >= 75%
                feedbackCompleted: true,
                isEligible: false
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="text-blue-600" /> Examination Admit Card
                </h1>
                <p className="text-sm text-gray-500 mt-1">Download and print your hall ticket for the upcoming semester examinations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Eligibility Status Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border p-5">
                        <h3 className="font-semibold text-gray-800 border-b pb-3 mb-4">Eligibility Requirements</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                {eligibility.attendance >= 75 ? (
                                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                ) : (
                                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Minimum 75% Attendance</p>
                                    <p className="text-xs text-gray-500">Current: <span className={eligibility.attendance >= 75 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{eligibility.attendance}%</span></p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                {eligibility.feedbackCompleted ? (
                                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                                ) : (
                                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Faculty Feedback</p>
                                    <p className="text-xs text-gray-500">Must be submitted for all subjects.</p>
                                </div>
                            </div>
                        </div>

                        {!eligibility.isEligible && (
                            <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-3">
                                <p className="text-xs text-red-700 font-medium flex items-center gap-2">
                                    <Lock size={14} /> Admit Card Locked
                                </p>
                                <p className="text-[10px] text-red-600 mt-1">
                                    You have not met the minimum requirements to sit for the examination. Please contact your HOD.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Admit Card Preview */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden relative">
                        {/* Blur Overlay if not eligible */}
                        {!eligibility.isEligible && (
                            <div className="absolute inset-0 z-10 backdrop-blur-sm bg-white/50 flex flex-col items-center justify-center">
                                <div className="bg-white p-6 rounded-2xl shadow-xl border text-center max-w-sm">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="text-red-600" size={32} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Admit Card Locked</h2>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Your admit card cannot be generated because you have an attendance shortage ({eligibility.attendance}%).
                                    </p>
                                    <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                        <Download size={16} /> Download PDF
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mock Admit Card Document */}
                        <div className="p-8 pb-12 select-none">
                            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
                                <h1 className="text-2xl font-serif font-bold text-gray-900 uppercase">GL Bajaj Group of Institutions</h1>
                                <p className="text-sm font-semibold mt-1">B.Tech End Semester Examination 2023-24</p>
                                <h2 className="text-lg font-bold mt-4 underline">PROVISIONAL ADMIT CARD</h2>
                            </div>
                            
                            <div className="flex gap-8 mb-8">
                                <div className="flex-1 space-y-3 text-sm">
                                    <div className="flex"><span className="font-bold w-32">Roll Number:</span> <span>2100320100045</span></div>
                                    <div className="flex"><span className="font-bold w-32">Student Name:</span> <span>Test Student</span></div>
                                    <div className="flex"><span className="font-bold w-32">Course:</span> <span>B.Tech CSE</span></div>
                                    <div className="flex"><span className="font-bold w-32">Semester:</span> <span>5th Semester</span></div>
                                </div>
                                <div className="w-24 h-32 border-2 border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400 text-xs text-center">
                                    Passport<br/>Photo
                                </div>
                            </div>

                            <table className="w-full text-sm border-collapse border border-gray-400 mb-12">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-400 px-3 py-2 text-left">Date</th>
                                        <th className="border border-gray-400 px-3 py-2 text-left">Subject Code</th>
                                        <th className="border border-gray-400 px-3 py-2 text-left">Subject Name</th>
                                        <th className="border border-gray-400 px-3 py-2 text-left">Timing</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-400 px-3 py-2">15-Nov-2023</td>
                                        <td className="border border-gray-400 px-3 py-2">KCS501</td>
                                        <td className="border border-gray-400 px-3 py-2">Database Management System</td>
                                        <td className="border border-gray-400 px-3 py-2">09:30 AM - 12:30 PM</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-400 px-3 py-2">17-Nov-2023</td>
                                        <td className="border border-gray-400 px-3 py-2">KCS502</td>
                                        <td className="border border-gray-400 px-3 py-2">Compiler Design</td>
                                        <td className="border border-gray-400 px-3 py-2">09:30 AM - 12:30 PM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {eligibility.isEligible && (
                            <div className="bg-gray-50 border-t p-4 flex justify-end gap-3">
                                <button className="bg-white border text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                                    <Printer size={16} /> Print
                                </button>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                                    <Download size={16} /> Download PDF
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
