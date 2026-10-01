import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, UserPlus } from 'lucide-react';
import axios from 'axios';

interface AdmissionStats {
    totalApplications: number;
    admittedStudents: number;
    pendingReviews: number;
    rejectedApplications: number;
}

export const AdmissionOverview: React.FC = () => {
    const [stats, setStats] = useState<AdmissionStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmissions = async () => {
            try {
                const response = await axios.get('/api/director/admission-overview');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching admission overview:', error);
                // Fallback for development
                setStats({
                    totalApplications: 1250,
                    admittedStudents: 450,
                    pendingReviews: 320,
                    rejectedApplications: 480
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAdmissions();
    }, []);

    if (loading) {
        return <div className="p-6 text-gray-500">Loading admission data...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admission Overview</h1>
                <p className="text-gray-500">Track admission progress and applications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Applications</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.totalApplications}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Admitted Students</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.admittedStudents}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Pending Reviews</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.pendingReviews}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <UserPlus className="text-red-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Rejected</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.rejectedApplications}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">Alice Johnson</td>
                                <td className="py-3 px-4 text-sm text-gray-700">B.Tech Computer Science</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Oct 14, 2026</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">In Review</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">Bob Smith</td>
                                <td className="py-3 px-4 text-sm text-gray-700">MBA Finance</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Oct 14, 2026</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Admitted</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
