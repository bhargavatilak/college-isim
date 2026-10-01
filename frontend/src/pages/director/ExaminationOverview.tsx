import React, { useState, useEffect } from 'react';
import { FileText, Award, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';

interface ExamStats {
    totalExams: number;
    upcomingExams: number;
    overallPassPercentage: number;
    topPerformers: number;
}

export const ExaminationOverview: React.FC = () => {
    const [stats, setStats] = useState<ExamStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('/api/director/examination-overview');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching exam overview:', error);
                // Fallback for development
                setStats({
                    totalExams: 45,
                    upcomingExams: 12,
                    overallPassPercentage: 78.5,
                    topPerformers: 150
                });
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    if (loading) {
        return <div className="p-6 text-gray-500">Loading exam data...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Examination Overview</h1>
                <p className="text-gray-500">Monitor academic performance and schedules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Exams Conducted</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.totalExams}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <Calendar className="text-orange-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Upcoming Exams</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.upcomingExams}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Overall Pass Rate</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.overallPassPercentage}%</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Award className="text-yellow-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Top Performers</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.topPerformers}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Schedule</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Name</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">CS101 Midterm</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Computer Science</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Oct 15, 2026</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Scheduled</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">MATH201 Final</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Mathematics</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Oct 20, 2026</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Scheduled</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
