import React, { useEffect, useState } from 'react';
import { Shield, Check, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface PortalAccount {
    id: string;
    student_id: string;
    username: string;
    email: string;
    is_active: boolean;
    last_login: string;
}

export const PortalMgmt: React.FC = () => {
    const [accounts, setAccounts] = useState<PortalAccount[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAccounts = async () => {
        const { data, error } = await supabase
            .from('student_portal_accounts')
            .select('*')
            .order('student_id', { ascending: true });
        
        if (data) {
            setAccounts(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('student_portal_accounts')
            .update({ is_active: !currentStatus })
            .eq('id', id);
            
        if (!error) {
            setAccounts(accounts.map(acc => 
                acc.id === id ? { ...acc, is_active: !currentStatus } : acc
            ));
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Portal Account Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading accounts...</div>
                ) : accounts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No portal accounts found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {accounts.map((account) => (
                                    <tr key={account.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {account.student_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {account.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {account.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {account.last_login ? new Date(account.last_login).toLocaleString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {account.is_active ? 'Active' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button 
                                                onClick={() => toggleStatus(account.id, account.is_active)}
                                                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${account.is_active ? 'text-red-700 bg-red-50 hover:bg-red-100' : 'text-green-700 bg-green-50 hover:bg-green-100'}`}
                                            >
                                                {account.is_active ? (
                                                    <><X className="w-4 h-4" /> <span>Disable</span></>
                                                ) : (
                                                    <><Check className="w-4 h-4" /> <span>Enable</span></>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
