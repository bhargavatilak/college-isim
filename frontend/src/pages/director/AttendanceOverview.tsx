import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, BarChart2 } from 'lucide-react';
import axios from 'axios';

interface AttendanceStats {
    totalStudents: number;
    presentToday: number;
    absentToday: number;
    averageAttendance: number;
}

export const AttendanceOverview: React.FC = () => {
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get('/api/director/attendance-overview');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching attendance overview:', error);
                // Fallback for development
                setStats({
                    totalStudents: 1200,
                    presentToday: 1050,
                    absentToday: 150,
                    averageAttendance: 88.5
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, []);

    if (loading) {
        return <div className="p-6 text-gray-500">Loading attendance data...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Attendance Overview</h1>
                <p className="text-gray-500">Monitor daily attendance and trends</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.totalStudents}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <UserCheck className="text-green-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Present Today</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.presentToday}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <UserX className="text-red-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Absent Today</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.absentToday}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <BarChart2 className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Average Attendance</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.averageAttendance}%</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Department-wise Breakdown</h2>
                <div className="space-y-4">
                    {/* Simulated breakdown */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">Computer Science</span>
                            <span className="text-gray-500">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">Mathematics</span>
                            <span className="text-gray-500">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">Physics</span>
                            <span className="text-gray-500">88%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
