import React, { useState } from 'react';
import { Search, CreditCard, CheckCircle2, User, Receipt, AlertCircle } from 'lucide-react';
import classNames from 'classnames';

export const PaymentTerminal: React.FC = () => {
    const [searchId, setSearchId] = useState('');
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState<number | string>('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        setStudent(null);
        
        // Simulate API call for fetching student fee details
        setTimeout(() => {
            if (searchId === 'STU123') {
                setStudent({
                    id: 'STU123',
                    name: 'Rajesh Kumar',
                    rollNo: '2100320100045',
                    course: 'B.Tech CSE',
                    department: 'Computer Science',
                    year: 3,
                    section: 'A',
                    feeStructure: 'B.Tech 3rd Year Tuition',
                    totalFee: 120000,
                    paidAmount: 50000,
                    remainingAmount: 70000
                });
            } else {
                setErrorMessage('Student not found. Try STU123.');
            }
            setLoading(false);
        }, 800);
    };

    const handlePayment = () => {
        const amount = Number(paymentAmount);
        if (!amount || amount <= 0) {
            setErrorMessage('Please enter a valid payment amount.');
            return;
        }
        if (amount > student.remainingAmount) {
            setErrorMessage(`Payment amount exceeds remaining fee (₹${student.remainingAmount}).`);
            return;
        }

        // Simulate API payment processing (Rule #10 - Partial Payment)
        setSuccessMessage(`Payment of ₹${amount} successfully processed for ${student.name}. Generating receipt...`);
        setErrorMessage('');
        setStudent({
            ...student,
            paidAmount: student.paidAmount + amount,
            remainingAmount: student.remainingAmount - amount
        });
        setPaymentAmount('');
    };

    return (
        <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <CreditCard className="text-emerald-600" /> Fee Payment Terminal
                </h1>
                <p className="text-sm text-gray-500 mt-1">Process full or partial fee payments and generate receipts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search Bar */}
                <div className="lg:col-span-3 bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-4">
                        <div className="relative flex-1 max-w-lg">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Enter Student ID (e.g. STU123)" 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-100 outline-none transition-shadow"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                        </div>
                        <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search size={18} />}
                            Lookup Student
                        </button>
                    </form>
                </div>

                {/* Error Messages */}
                {errorMessage && (
                    <div className="lg:col-span-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="lg:col-span-3 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center gap-3">
                        <CheckCircle2 className="text-green-500" size={20} />
                        <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                )}

                {/* Student Info & Payment Form */}
                {student && (
                    <>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                                <div className="bg-emerald-50 border-b border-emerald-100 p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center font-bold text-xl shadow-inner">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 cursor-pointer hover:text-emerald-700 underline underline-offset-4">{student.name}</h2>
                                        <p className="text-sm text-gray-600 font-medium">{student.id} | {student.rollNo}</p>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                    <div><span className="text-gray-500 block">Course</span><span className="font-semibold text-gray-900">{student.course}</span></div>
                                    <div><span className="text-gray-500 block">Department</span><span className="font-semibold text-gray-900">{student.department}</span></div>
                                    <div><span className="text-gray-500 block">Year & Section</span><span className="font-semibold text-gray-900">Year {student.year} - Sec {student.section}</span></div>
                                    <div><span className="text-gray-500 block">Fee Structure Applied</span><span className="font-semibold text-gray-900">{student.feeStructure}</span></div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border p-6">
                                <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Process Payment</h3>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Deposit Amount (₹)</label>
                                        <input 
                                            type="number" 
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            placeholder={`Max ₹${student.remainingAmount}`}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-100 outline-none text-lg font-semibold"
                                        />
                                    </div>
                                    <button onClick={handlePayment} className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all flex items-center gap-2">
                                        <CreditCard size={18} /> Charge
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-3">Rule #10 Active: The system supports partial payments.</p>
                            </div>
                        </div>

                        {/* Fee Ledger Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-emerald-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                                <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
                                    <Receipt size={200} />
                                </div>
                                <h3 className="font-bold text-emerald-100 uppercase tracking-wider text-xs mb-4">Fee Ledger Summary</h3>
                                
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <p className="text-emerald-300 text-sm">Total Fee</p>
                                        <p className="text-2xl font-bold">₹{student.totalFee.toLocaleString()}</p>
                                    </div>
                                    
                                    <div className="bg-emerald-800/50 rounded-lg p-3">
                                        <p className="text-emerald-300 text-sm">Amount Paid</p>
                                        <p className="text-xl font-bold text-emerald-100">₹{student.paidAmount.toLocaleString()}</p>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 shadow-inner mt-6">
                                        <p className="text-gray-500 text-sm font-semibold uppercase">Remaining Dues</p>
                                        <p className={classNames("text-3xl font-black mt-1", student.remainingAmount === 0 ? "text-green-500" : "text-red-600")}>
                                            ₹{student.remainingAmount.toLocaleString()}
                                        </p>
                                        {student.remainingAmount === 0 && (
                                            <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">FULLY PAID</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
