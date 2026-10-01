import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface IdCardStatus {
    id: string;
    student_id: string;
    status: string;
    issue_date: string;
    valid_until: string;
    barcode: string;
}

export const IdCard: React.FC = () => {
    const [cards, setCards] = useState<IdCardStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCards = async () => {
            const { data, error } = await supabase
                .from('id_cards')
                .select('*')
                .order('issue_date', { ascending: false })
                .limit(50);
            
            if (data) {
                setCards(data);
            }
            setLoading(false);
        };
        fetchCards();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'expired':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'pending':
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">ID Card Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading ID cards...</div>
                ) : cards.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No ID cards found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Valid Until</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Barcode</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {cards.map((card) => (
                                    <tr key={card.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {card.student_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(card.status)}
                                                <span className="capitalize">{card.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {card.issue_date ? new Date(card.issue_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {card.valid_until ? new Date(card.valid_until).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                                            {card.barcode || 'N/A'}
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
