import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import axios from 'axios';

interface FinanceStats {
    totalRevenue: string;
    pendingDues: string;
    expenses: string;
    scholarshipGiven: string;
}

export const FinanceOverview: React.FC = () => {
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFinance = async () => {
            try {
                const response = await axios.get('/api/director/finance-overview');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching finance overview:', error);
                // Fallback for development
                setStats({
                    totalRevenue: "$1.2M",
                    pendingDues: "$150K",
                    expenses: "$400K",
                    scholarshipGiven: "$50K"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchFinance();
    }, []);

    if (loading) {
        return <div className="p-6 text-gray-500">Loading finance data...</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Finance Overview</h1>
                <p className="text-gray-500">Monitor financial performance and metrics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.totalRevenue}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <CreditCard className="text-orange-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Pending Dues</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.pendingDues}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                            <TrendingUp className="text-red-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Expenses</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.expenses}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Wallet className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Scholarships Given</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats?.scholarshipGiven}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">TXN-00123</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Tuition Fee</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Oct 10, 2026</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">TXN-00124</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Library Fine</td>
                                <td className="py-3 px-4 text-sm text-gray-700">Oct 11, 2026</td>
                                <td className="py-3 px-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
