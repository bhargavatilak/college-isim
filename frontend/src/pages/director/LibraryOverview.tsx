import React, { useState, useEffect } from 'react';
import { BookOpen, Users, BookMarked, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface LibraryStats {
    totalBooks: number;
    activeMembers: number;
    booksIssued: number;
    overdueBooks: number;
}

export const LibraryOverview: React.FC = () => {
    const [stats, setStats] = useState<LibraryStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const response = await axios.get('/api/director/library-overview');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching library overview:', error);
                // Fallback for development
                setStats({
                    totalBooks: 45000,
                    activeMembers: 1200,
                    booksIssued: 3500,
                    overdueBooks: 150
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, []);

    if (loading) {
        return <div className="p-6 text-gray-500">Loading library data...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Library Overview</h1>
                <p className="text-gray-500">Monitor library inventory and operations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <BookOpen className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Books</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.totalBooks}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="text-green-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Active Members</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.activeMembers}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <BookMarked className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Books Issued</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.booksIssued}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertCircle className="text-red-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Overdue Books</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.overdueBooks}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Arrivals</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">Introduction to Algorithms</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Thomas H. Cormen</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Oct 12, 2026</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Available</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">Clean Code</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Robert C. Martin</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Oct 13, 2026</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Issued</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
