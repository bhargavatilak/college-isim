import React, { useState } from 'react';
import { UserPlus, Upload, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const Admissions: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        department: '',
        course: '',
        dob: '',
    });
    
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        // Simulate API delay
        setTimeout(() => {
            // Rule #1 Enforcement: Do NOT assign section during admission.
            if ('section' in formData) {
                setStatus({ type: 'error', message: 'CRITICAL ERROR: Rule #1 Violation. Sections cannot be assigned during admission.' });
                setLoading(false);
                return;
            }

            const generatedStudentId = `STU${Math.floor(Math.random() * 90000) + 10000}`;
            const generatedEnrollment = `ENR${new Date().getFullYear()}${Math.floor(Math.random() * 9000) + 1000}`;
            
            setStatus({ 
                type: 'success', 
                message: `Successfully onboarded ${formData.firstName} ${formData.lastName}! Generated Student ID: ${generatedStudentId} | Enrollment No: ${generatedEnrollment}. The HOD must now assign their section.` 
            });
            setLoading(false);
            setFormData({ firstName: '', lastName: '', email: '', mobile: '', department: '', course: '', dob: '' });
        }, 1200);
    };

    return (
        <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus className="text-indigo-600" /> Student Admission Vault
                </h1>
                <p className="text-sm text-gray-500 mt-1">Officially register new students into the college ERP system.</p>
            </div>

            {status.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border ${status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                    {status.type === 'error' ? <AlertCircle className="mt-0.5" size={20} /> : <CheckCircle2 className="mt-0.5" size={20} />}
                    <p className="text-sm font-medium">{status.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                            <ShieldCheck className="text-indigo-600" size={20} />
                            <h2 className="font-semibold text-gray-800">New Student Registration Form</h2>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                                    <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                                    <select required name="course" value={formData.course} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 outline-none bg-white">
                                        <option value="">Select Course</option>
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="MBA">MBA</option>
                                        <option value="MCA">MCA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                    <select required name="department" value={formData.department} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-100 outline-none bg-white">
                                        <option value="">Select Department</option>
                                        <option value="CSE">Computer Science</option>
                                        <option value="IT">Information Technology</option>
                                        <option value="ECE">Electronics</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={18} />
                                <div>
                                    <h4 className="text-sm font-bold text-amber-800">Rule #1 Enforcement Active</h4>
                                    <p className="text-xs text-amber-700 mt-1">
                                        Section assignment is strictly disabled during student registration. Sections will be assigned by the respective HOD later in the workflow.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2">
                                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <UserPlus size={18} />}
                                    Onboard Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border p-6 h-full">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                            <Upload size={18} className="text-indigo-600" /> Document Uploads
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">Upload required onboarding documents for verification.</p>
                        
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                                    <Upload className="text-indigo-600" size={24} />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">Passport Photo</p>
                                <p className="text-xs text-gray-400 mt-1">JPEG, PNG up to 2MB</p>
                            </div>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                                    <Upload className="text-indigo-600" size={24} />
                                </div>
                                <p className="text-sm font-semibold text-gray-700">Aadhar / ID Proof</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPEG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
